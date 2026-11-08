import { and, count, eq, lte } from "drizzle-orm";
import { database } from "../db/client";
import { forecasts, lessons, memories, questions, scoreboard } from "../db/schema";
import {
  type ByVoice,
  type Category,
  namespaces,
  type Outcome,
  type Voice,
  voices,
} from "../domain";
import { disagreementLesson, LESSON_EVERY, type ScoredWindow } from "../engine/lessons";
import { RESOLVE_AFTER_MS, settlingVoices, verdict } from "../engine/lifecycle";
import { resolve } from "../engine/resolve";
import { scoreCall } from "../engine/scoring";
import { type Window, windowEndingAt } from "../engine/windows";
import { log } from "../log";
import { encode, recordOf } from "../memory/codec";
import { singleton } from "../singleton";
import { deepbookResult } from "../voices/deepbook";
import { kalshiResult } from "../voices/kalshi";
import { polymarketResult } from "../voices/polymarket";
import { grudgesIn } from "./grudges";

type Question = typeof questions.$inferSelect;
type Transaction = Parameters<Parameters<ReturnType<typeof database>["transaction"]>[0]>[0];

/**
 * Every LESSON_EVERY scored windows in a category, counts how the voices fared when they
 * disagreed and queues the sentence as a lesson memory.
 * ponytail: counts the windows still in the database, which after an amnesia restore is at most
 * the last 100, so a category can write the same lesson number twice. Fine until it shows.
 */
export async function queueLesson(tx: Transaction, category: Category): Promise<void> {
  const scoredWhere = and(eq(questions.category, category), eq(questions.state, "resolved"));
  const [row] = await tx.select({ n: count() }).from(questions).where(scoredWhere);
  const scored = row?.n ?? 0;
  if (scored === 0 || scored % LESSON_EVERY !== 0) return;

  const calls = await tx
    .select({
      question: forecasts.questionId,
      voice: forecasts.voice,
      p: forecasts.p,
      outcome: questions.outcome,
    })
    .from(forecasts)
    .innerJoin(questions, eq(questions.id, forecasts.questionId))
    .where(scoredWhere);
  const byQuestion = new Map<string, ScoredWindow>();
  for (const { question, voice, p, outcome } of calls) {
    if (outcome === null) continue;
    const window = byQuestion.get(question) ?? { calls: {}, outcome };
    window.calls[voice] = p;
    byQuestion.set(question, window);
  }
  const text = disagreementLesson(category, [...byQuestion.values()]);
  if (text === null) return;

  const [memory] = await tx
    .insert(memories)
    .values({
      namespace: namespaces.lesson,
      kind: "lesson",
      ref: `lesson-${category}-${scored}`,
      body: encode({ kind: "lesson", category, text }),
    })
    .returning({ id: memories.id });
  await tx.insert(lessons).values({ category, text, memoryId: memory?.id });
  log.info("worker.lesson", { category, scored, text });
}

/** Venues are asked again this often until they answer. */
const RETRY_EVERY_MS = 20_000;

const lastAsked = () => singleton("settle-last-asked", () => new Map<string, number>());

/** Settles every locked window that has ended: asks the venues, then scores and remembers it. */
export async function settleDue(nowMs: number): Promise<void> {
  const ended = await database()
    .select()
    .from(questions)
    .where(
      and(eq(questions.state, "locked"), lte(questions.expiry, new Date(nowMs - RESOLVE_AFTER_MS))),
    );

  for (const question of ended) {
    if (nowMs - (lastAsked().get(question.id) ?? 0) < RETRY_EVERY_MS) continue;
    lastAsked().set(question.id, nowMs);
    try {
      await settleOne(question, nowMs);
    } catch (err) {
      log.error("worker.settle.failed", { question: question.id, err });
    }
  }
}

function resultOf(voice: Voice, window: Window, strike: number | null): Promise<Outcome | null> {
  switch (voice) {
    case "deepbook":
      return strike === null ? Promise.resolve(null) : deepbookResult(window, strike);
    case "polymarket":
      return polymarketResult(window);
    case "kalshi":
      return kalshiResult(window);
    case "crowd":
      return Promise.resolve(null);
  }
}

async function settleOne(question: Question, nowMs: number): Promise<void> {
  const window = windowEndingAt(question.category, question.expiry.getTime());
  const settling = settlingVoices(question.category, question.strike !== null);
  const results: ByVoice<Outcome> = { ...question.venueResults };

  const missing = settling.filter((voice) => results[voice] === undefined);
  const answers = await Promise.all(
    missing.map(async (voice) => [voice, await resultOf(voice, window, question.strike)] as const),
  );
  let learned = false;
  for (const [voice, result] of answers) {
    if (result === null) continue;
    results[voice] = result;
    learned = true;
  }

  if (verdict(settling, results, window.endMs, nowMs) === "waiting") {
    if (learned) {
      await database()
        .update(questions)
        .set({ venueResults: results })
        .where(eq(questions.id, question.id));
    }
    return;
  }
  await finalize(question, results);
  lastAsked().delete(question.id);
}

async function finalize(question: Question, results: ByVoice<Outcome>): Promise<void> {
  // Taken here, not at tick start: restoring orders windows by this instant, so each needs its own.
  const resolvedMs = Date.now();
  const resolution = resolve(results);

  await database().transaction(async (tx) => {
    // Only the first caller wins, so a window is never scored twice.
    const [claimed] = await tx
      .update(questions)
      .set({
        state: resolution.state,
        outcome: resolution.outcome,
        split: resolution.split,
        venueResults: results,
        resolvedAt: new Date(resolvedMs),
      })
      .where(and(eq(questions.id, question.id), eq(questions.state, "locked")))
      .returning({ id: questions.id });
    if (!claimed) return;

    const called = await tx.select().from(forecasts).where(eq(forecasts.questionId, question.id));
    if (called.length === 0) return;

    if (resolution.outcome !== null) {
      const board = await grudgesIn(tx, question.category);
      for (const call of called) {
        const next = scoreCall(board[call.voice], call.p, resolution.outcome);
        await tx
          .insert(scoreboard)
          .values({ category: question.category, voice: call.voice, ...next })
          .onConflictDoUpdate({
            target: [scoreboard.category, scoreboard.voice],
            set: { ...next, updatedAt: new Date(resolvedMs) },
          });
      }
    }

    const calls: ByVoice<number> = {};
    for (const voice of voices) {
      const call = called.find((entry) => entry.voice === voice);
      if (call) calls[voice] = call.p;
    }
    await tx.insert(memories).values({
      namespace: namespaces.record,
      kind: "record",
      ref: question.id,
      body: encode(
        recordOf({
          id: question.id,
          category: question.category,
          endMs: question.expiry.getTime(),
          strike: question.strike,
          state: resolution.state,
          outcome: resolution.outcome,
          split: resolution.split,
          resolvedMs,
          calls,
          results,
          line: question.line,
        }),
      ),
    });
    if (resolution.outcome !== null) {
      // A savepoint: if the lesson fails, the window is still scored and remembered.
      try {
        await tx.transaction((inner) => queueLesson(inner, question.category));
      } catch (err) {
        log.error("worker.lesson.failed", { category: question.category, err });
      }
    }
  });
  log.info("worker.settled", {
    question: question.id,
    state: resolution.state,
    outcome: resolution.outcome,
    split: resolution.split,
    results,
  });
}

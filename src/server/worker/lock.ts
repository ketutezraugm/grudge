import { and, eq, lte } from "drizzle-orm";
import { database } from "../db/client";
import { forecasts, picks, questions } from "../db/schema";
import { type ByVoice, voices } from "../domain";
import { crowdCall, missedLock } from "../engine/lifecycle";
import { grudgeLine, trustWeights } from "../engine/scoring";
import { windowEndingAt } from "../engine/windows";
import { log } from "../log";
import { deepbookCall, deepbookStrike } from "../voices/deepbook";
import { kalshiReading } from "../voices/kalshi";
import { polymarketCall } from "../voices/polymarket";
import type { Call } from "../voices/types";
import { grudgesIn } from "./grudges";

type Question = typeof questions.$inferSelect;

/** A window needs at least two voices, or there is nothing to compare. */
const MIN_VOICES = 2;

/** Freezes every window whose lock instant has passed: each voice's call is written down. */
export async function lockDue(nowMs: number): Promise<void> {
  const due = await database()
    .select()
    .from(questions)
    .where(and(eq(questions.state, "open"), lte(questions.lockAt, new Date(nowMs))));

  // One at a time: DeepBook reads share the Tatum request budget.
  for (const question of due) {
    try {
      await lockOne(question, nowMs);
    } catch (err) {
      log.error("worker.lock.failed", { question: question.id, err });
    }
  }
}

async function giveUp(question: Question, reason: string): Promise<void> {
  await database()
    .update(questions)
    .set({ state: "void" })
    .where(and(eq(questions.id, question.id), eq(questions.state, "open")));
  log.warn("worker.lock.void", { question: question.id, reason });
}

async function lockOne(question: Question, nowMs: number): Promise<void> {
  const window = windowEndingAt(question.category, question.expiry.getTime());
  if (missedLock(window.lockMs, nowMs)) return giveUp(question, "lock instant missed");

  const kalshi = await kalshiReading(window, nowMs);
  const strike = (await deepbookStrike(window)) ?? kalshi?.strike ?? null;
  const [deepbook, polymarket, visitorPicks] = await Promise.all([
    strike === null ? null : deepbookCall(window, strike, nowMs),
    polymarketCall(window, nowMs),
    database().select({ p: picks.p }).from(picks).where(eq(picks.questionId, question.id)),
  ]);

  const taken: ByVoice<Call> = {};
  if (deepbook) taken.deepbook = deepbook;
  if (polymarket) taken.polymarket = polymarket;
  if (kalshi) taken.kalshi = kalshi.call;
  const crowd = crowdCall(visitorPicks.map((pick) => pick.p));
  if (crowd !== null) taken.crowd = { p: crowd, capturedAtMs: nowMs };

  const calls: ByVoice<number> = {};
  for (const voice of voices) {
    const call = taken[voice];
    if (call) calls[voice] = call.p;
  }
  const present = voices.filter((voice) => calls[voice] !== undefined);
  if (present.length < MIN_VOICES) return giveUp(question, `only ${present.length} voice(s)`);

  const board = await grudgesIn(database(), question.category);
  const line = grudgeLine(calls, trustWeights(board, present));

  await database().transaction(async (tx) => {
    await tx
      .insert(forecasts)
      .values(
        present.flatMap((voice) => {
          const call = taken[voice];
          return call
            ? [
                {
                  questionId: question.id,
                  voice,
                  p: call.p,
                  capturedAt: new Date(call.capturedAtMs),
                },
              ]
            : [];
        }),
      )
      .onConflictDoNothing();
    await tx
      .update(questions)
      .set({ state: "locked", strike, line })
      .where(and(eq(questions.id, question.id), eq(questions.state, "open")));
  });
  log.info("worker.locked", { question: question.id, strike, voices: present, line });
}

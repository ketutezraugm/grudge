import "server-only";
import { and, asc, count, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { database } from "./db/client";
import { forecasts, lessons, memories, picks, questions } from "./db/schema";
import {
  type ByVoice,
  type Category,
  categories,
  type Outcome,
  type Voice,
  voiceNames,
  voices,
} from "./domain";
import { lastMarks, markOf } from "./engine/ledger";
import {
  confidence,
  DISAGREEMENT_GAP,
  disagreement,
  priceAtomic,
  trustWeights,
} from "./engine/scoring";
import { singleton } from "./singleton";
import { cachedBitcoinUsd } from "./tatum/rate";
import { grudgesIn } from "./worker/grudges";
import { workerState } from "./worker/status";

const LEDGER_ROWS = 20;
const TALLY_MARKS = 10;

/** Pollers share one set of queries; this is how stale a snapshot may be. */
const SNAPSHOT_TTL_MS = 3_000;

const iso = (ms: number | Date) => new Date(ms).toISOString();

async function categoryBoard(category: Category) {
  const db = database();
  const inCategory = eq(questions.category, category);

  const [open] = await db
    .select()
    .from(questions)
    .where(and(inCategory, eq(questions.state, "open")))
    .orderBy(asc(questions.expiry))
    .limit(1);
  const [locked] = await db
    .select()
    .from(questions)
    .where(and(inCategory, eq(questions.state, "locked")))
    .orderBy(desc(questions.expiry))
    .limit(1);
  // Windows given up at lock have no resolution time and nothing on Walrus, so the ledger omits them.
  const settled = await db
    .select()
    .from(questions)
    .where(
      and(
        inCategory,
        inArray(questions.state, ["resolved", "void"]),
        isNotNull(questions.resolvedAt),
      ),
    )
    .orderBy(desc(questions.expiry))
    .limit(LEDGER_ROWS);

  const shown = [...(locked ? [locked] : []), ...settled].map((question) => question.id);
  const called = shown.length
    ? await db.select().from(forecasts).where(inArray(forecasts.questionId, shown))
    : [];
  const callsOf = (id: string): ByVoice<number> => {
    const calls: ByVoice<number> = {};
    for (const row of called) if (row.questionId === id) calls[row.voice] = row.p;
    return calls;
  };
  const blobs = settled.length
    ? await db
        .select({ ref: memories.ref, blobId: memories.blobId })
        .from(memories)
        .where(
          and(
            eq(memories.kind, "record"),
            inArray(
              memories.ref,
              settled.map((question) => question.id),
            ),
          ),
        )
    : [];

  const grudges = await grudgesIn(db, category);
  const [scored] = await db
    .select({ n: count() })
    .from(questions)
    .where(and(inCategory, eq(questions.state, "resolved")));
  const [lesson] = await db
    .select({ text: lessons.text, at: lessons.createdAt, blobId: memories.blobId })
    .from(lessons)
    .leftJoin(memories, eq(memories.id, lessons.memoryId))
    .where(eq(lessons.category, category))
    .orderBy(desc(lessons.createdAt))
    .limit(1);

  const lockedCalls = locked ? callsOf(locked.id) : {};
  const present = voices.filter((voice) => lockedCalls[voice] !== undefined);
  // Before any window has locked, show trust for every voice that has a record.
  const weights = trustWeights(
    grudges,
    present.length > 0 ? present : voices.filter((voice) => grudges[voice] !== undefined),
  );
  const resolvedCount = scored?.n ?? 0;
  const history = settled.map((question) => ({
    calls: callsOf(question.id),
    outcome: question.outcome,
  }));
  const gap = disagreement(lockedCalls);

  return {
    open: open
      ? {
          id: open.id,
          startsAt: iso(open.windowStart),
          endsAt: iso(open.expiry),
          lockAt: iso(open.lockAt),
        }
      : null,
    locked: locked
      ? {
          id: locked.id,
          startsAt: iso(locked.windowStart),
          endsAt: iso(locked.expiry),
          strike: locked.strike,
          line: locked.line,
          calls: lockedCalls,
          disagreement: gap,
          disagrees: gap >= DISAGREEMENT_GAP,
          confidence: confidence(weights, resolvedCount),
          // Strings: JSON has no bigint, and the amount is in USDC's six decimals.
          priceAtomic: priceAtomic(confidence(weights, resolvedCount)).toString(),
        }
      : null,
    voices: voices.flatMap((voice) => {
      const grudge = grudges[voice];
      const call = lockedCalls[voice];
      if (!grudge && call === undefined) return [];
      return [
        {
          voice,
          name: voiceNames[voice],
          call: call ?? null,
          weight: weights[voice] ?? null,
          loss: grudge?.loss ?? null,
          samples: grudge?.count ?? 0,
          marks: lastMarks(history, voice, TALLY_MARKS),
        },
      ];
    }),
    resolved: resolvedCount,
    lesson: lesson
      ? { text: lesson.text, at: iso(lesson.at), blobId: lesson.blobId ?? null }
      : null,
    ledger: settled.map((question) => {
      const calls = callsOf(question.id);
      return {
        id: question.id,
        endsAt: iso(question.expiry),
        state: question.state,
        outcome: question.outcome,
        split: question.split,
        line: question.line,
        calls: Object.fromEntries(
          voices.flatMap((voice) => {
            const p = calls[voice];
            if (p === undefined) return [];
            const mark = question.outcome === null ? null : markOf(p, question.outcome as Outcome);
            return [[voice, { p, mark }]];
          }),
        ) as Partial<Record<Voice, { p: number; mark: "right" | "wrong" | null }>>,
        blobId: blobs.find((blob) => blob.ref === question.id)?.blobId ?? null,
      };
    }),
  };
}

async function buildSnapshot() {
  const entries = await Promise.all(
    categories.map(async (category) => [category, await categoryBoard(category)] as const),
  );
  const { lastTickMs } = workerState();
  return {
    asOf: iso(Date.now()),
    workerAgeMs: lastTickMs === null ? null : Date.now() - lastTickMs,
    bitcoinUsd: await cachedBitcoinUsd(),
    categories: Object.fromEntries(entries) as Record<
      Category,
      Awaited<ReturnType<typeof categoryBoard>>
    >,
  };
}

type Snapshot = Awaited<ReturnType<typeof buildSnapshot>>;

const latest = () =>
  singleton<{ builtMs: number; snapshot: Promise<Snapshot> | null }>("board", () => ({
    builtMs: 0,
    snapshot: null,
  }));

/** Everything the board shows, shared between visitors for a few seconds. */
export function boardSnapshot(): Promise<Snapshot> {
  const held = latest();
  if (!held.snapshot || Date.now() - held.builtMs > SNAPSHOT_TTL_MS) {
    held.builtMs = Date.now();
    held.snapshot = buildSnapshot();
    held.snapshot.catch(() => {
      held.snapshot = null;
    });
  }
  return held.snapshot;
}

/** The visitor's own pick on a window, as a probability of up, or null. */
export async function pickOf(questionId: string, visitorId: string): Promise<number | null> {
  const [row] = await database()
    .select({ p: picks.p })
    .from(picks)
    .where(and(eq(picks.questionId, questionId), eq(picks.visitorId, visitorId)));
  return row?.p ?? null;
}

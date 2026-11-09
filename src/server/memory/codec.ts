import { z } from "zod";
import {
  type ByVoice,
  type Category,
  categories,
  type Outcome,
  type Voice,
  voiceNames,
  voices,
} from "../domain";

const outcome = z.union([z.literal(0), z.literal(1)]);
const byVoice = <T extends z.ZodType>(value: T) => z.partialRecord(z.enum(voices), value);
const byCategory = <T extends z.ZodType>(value: T) => z.partialRecord(z.enum(categories), value);

const record = z.object({
  kind: z.literal("record"),
  question: z.string(),
  category: z.enum(categories),
  endsAt: z.iso.datetime(),
  strike: z.number().nullable(),
  state: z.enum(["resolved", "void"]),
  outcome: outcome.nullable(),
  split: z.boolean(),
  resolvedAt: z.iso.datetime(),
  calls: byVoice(z.number()),
  results: byVoice(outcome),
  line: z.number().nullable(),
});

const scoreboard = z.object({
  kind: z.literal("scoreboard"),
  seq: z.number().int().nonnegative(),
  at: z.iso.datetime(),
  /** Resolution time of the newest window this snapshot already counts; later records are not in it. */
  through: z.iso.datetime().nullable(),
  grudges: byCategory(byVoice(z.object({ loss: z.number(), count: z.number() }))),
  resolved: byCategory(z.number().int().nonnegative()),
});

const lesson = z.object({
  kind: z.literal("lesson"),
  category: z.enum(categories),
  text: z.string(),
});

const payload = z.discriminatedUnion("kind", [record, scoreboard, lesson]);

export type MemoryPayload = z.infer<typeof payload>;
export type RecordPayload = z.infer<typeof record>;
export type ScoreboardPayload = z.infer<typeof scoreboard>;

const TAIL = "#grudge ";

const minute = (iso: string) => `${iso.slice(0, 16)}Z`;

function describeRecord(entry: RecordPayload): string {
  const window = `BTC ${entry.category === "btc-5m" ? "5m" : "15m"} window ending ${minute(entry.endsAt)}`;
  if (entry.state === "void") {
    const why = entry.split ? ": the venues disagreed about what happened" : "";
    return `${window} ended void${why}.`;
  }
  const calls = voices.flatMap((voice) => {
    const p = entry.calls[voice];
    if (p === undefined) return [];
    const leansUp = p >= 0.5;
    const right = leansUp === (entry.outcome === 1);
    return [
      `${voiceNames[voice]} ${Math.round(p * 100)}% ${leansUp ? "▲" : "▼"} (${right ? "right" : "wrong"})`,
    ];
  });
  const line = entry.line === null ? "" : ` Grudge line ${Math.round(entry.line * 100)}%.`;
  return `${window} went ${entry.outcome === 1 ? "UP" : "DOWN"}. ${calls.join(", ")}.${line}`;
}

function sentence(entry: MemoryPayload): string {
  switch (entry.kind) {
    case "record":
      return describeRecord(entry);
    case "scoreboard":
      return `Grudge scoreboard #${entry.seq} at ${minute(entry.at)}.`;
    case "lesson":
      return entry.text;
  }
}

/** A sentence for semantic recall, then the exact data on a last line for rebuilding state. */
export function encode(entry: MemoryPayload): string {
  return `${sentence(entry)}\n${TAIL}${JSON.stringify(entry)}`;
}

/** The structured data from a memory's last line, or null if the tail is missing or damaged. */
export function decode(text: string): MemoryPayload | null {
  const tail = text.split("\n").findLast((line) => line.startsWith(TAIL));
  if (tail === undefined) return null;
  try {
    const parsed = payload.safeParse(JSON.parse(tail.slice(TAIL.length)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export interface RecordInput {
  id: string;
  category: Category;
  endMs: number;
  strike: number | null;
  state: "resolved" | "void";
  outcome: Outcome | null;
  split: boolean;
  resolvedMs: number;
  calls: ByVoice<number>;
  results: ByVoice<Outcome>;
  line: number | null;
}

/** What Grudge writes to Walrus about one window once it has settled, or been given up on. */
export function recordOf(input: RecordInput): RecordPayload {
  return {
    kind: "record",
    question: input.id,
    category: input.category,
    endsAt: new Date(input.endMs).toISOString(),
    strike: input.strike,
    state: input.state,
    outcome: input.outcome,
    split: input.split,
    resolvedAt: new Date(input.resolvedMs).toISOString(),
    calls: input.calls,
    results: input.results,
    line: input.line,
  };
}

export interface ScoreboardInput {
  seq: number;
  nowMs: number;
  /** Resolution time of the newest window counted in `grudges`, or null when none is. */
  throughMs: number | null;
  grudges: readonly { category: Category; voice: Voice; loss: number; count: number }[];
  resolved: readonly { category: Category; count: number }[];
}

/** A snapshot of everything Grudge holds against each voice, enough to rebuild the weights. */
export function scoreboardOf(input: ScoreboardInput): ScoreboardPayload {
  const grudges: ScoreboardPayload["grudges"] = {};
  for (const { category, voice, loss, count } of input.grudges) {
    const held = grudges[category] ?? {};
    held[voice] = { loss, count };
    grudges[category] = held;
  }
  const resolved: ScoreboardPayload["resolved"] = {};
  for (const { category, count } of input.resolved) resolved[category] = count;
  return {
    kind: "scoreboard",
    seq: input.seq,
    at: new Date(input.nowMs).toISOString(),
    through: input.throughMs === null ? null : new Date(input.throughMs).toISOString(),
    grudges,
    resolved,
  };
}

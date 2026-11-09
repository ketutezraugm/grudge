import { type Voice, voiceNames } from "@/server/domain";
import { DISAGREEMENT_GAP, disagreement } from "@/server/engine/scoring";
import type { Clock } from "./clock";
import type { BoardResponse, Category, CategoryBoard, LedgerRow } from "./schema";

/** A source's call in one window, as the record row draws it. */
export type Mark = "right" | "wrong" | "split" | "none";
export type Result = "up" | "down" | "split" | "void";

/** The order the design draws the sources in. */
const STATION_ORDER = [
  "deepbook",
  "kalshi",
  "polymarket",
  "crowd",
] as const satisfies readonly Voice[];

export const WINDOW_MS: Record<Category, number> = { "btc-5m": 5 * 60_000, "btc-15m": 15 * 60_000 };
export const RECORD_LENGTH = 10;

/** The drum band has 22 slots: up to 20 settled windows, the locked one, then the open one. */
export const BAND_SLOTS = 22;

const WALRUSCAN = "https://walruscan.com/mainnet/blob/";
export const walruscan = (blobId: string) => WALRUSCAN + blobId;

export const percent = (p: number) => Math.round(p * 100);

type Calls = Partial<Record<Voice, number>>;

/** The window the page is about: the locked one, or else the newest one that has settled. */
export interface Focus {
  id: string;
  startsAt: number;
  endsAt: number;
  calls: Calls;
  line: number | null;
  strike: number | null;
  /** null while the result is pending */
  result: Result | null;
  marks: Partial<Record<Voice, Mark>>;
}

export interface Station {
  voice: Voice;
  name: string;
  call: number | null;
  /** What the circle shows: the outcome once the window has resolved, else the call. */
  fill: number | null;
  trust: number | null;
  brier: number | null;
  record: Mark[];
  status: "called" | "missing" | "silent";
}

export interface Front {
  high: Voice;
  low: Voice;
  gap: number;
  disagrees: boolean;
  /** Both ends are next to each other in the station order, so a front can be drawn between them. */
  adjacent: boolean;
}

export interface BandColumn {
  endsAt: number;
  result: Result | "pending";
  calls: Calls;
}

export interface Cell {
  p: number;
  mark: Mark;
}

export interface Row {
  window: string;
  start: string;
  result: Result;
  line: number | null;
  cells: Partial<Record<Voice, Cell>>;
  blobId: string | null;
}

export const resultOf = (row: LedgerRow): Result =>
  row.split
    ? "split"
    : row.state === "void" || row.outcome === null
      ? "void"
      : row.outcome
        ? "up"
        : "down";

function markIn(row: LedgerRow, voice: Voice): Mark {
  const call = row.calls[voice];
  if (call === undefined) return "none";
  return row.split ? "split" : (call.mark ?? "none");
}

const callsIn = (row: LedgerRow): Calls =>
  Object.fromEntries(Object.entries(row.calls).map(([voice, call]) => [voice, call.p]));

export function focusOf(category: Category, board: CategoryBoard): Focus | null {
  const { locked } = board;
  if (locked) {
    return {
      id: locked.id,
      startsAt: Date.parse(locked.startsAt),
      endsAt: Date.parse(locked.endsAt),
      calls: locked.calls,
      line: locked.line,
      strike: locked.strike,
      result: null,
      marks: {},
    };
  }
  const row = board.ledger[0];
  if (!row) return null;
  const endsAt = Date.parse(row.endsAt);
  return {
    id: row.id,
    startsAt: endsAt - WINDOW_MS[category],
    endsAt,
    calls: callsIn(row),
    line: row.line,
    strike: null,
    result: resultOf(row),
    marks: Object.fromEntries(
      Object.keys(row.calls).map((voice) => [voice, markIn(row, voice as Voice)]),
    ),
  };
}

const brierOf = (loss: number | null, samples: number) =>
  loss === null || samples <= 0 ? null : loss / samples;

const fillFor = (focus: Focus, call: number | null) => {
  if (focus.result === "up") return 1;
  if (focus.result === "down") return 0;
  if (focus.result === "split") return 0.5;
  return call;
};

/** The sources this category has a market for, in the design's order, then the Crowd. */
export function stationsOf(board: CategoryBoard, focus: Focus | null): Station[] {
  const known = new Map(board.voices.map((entry) => [entry.voice, entry]));
  const shown = STATION_ORDER.filter((voice) => voice === "crowd" || known.has(voice));
  return shown.map((voice) => {
    const entry = known.get(voice);
    const call = focus?.calls[voice] ?? null;
    const status = call !== null ? "called" : voice === "crowd" ? "silent" : "missing";
    return {
      voice,
      name: voice === "crowd" ? "The Crowd" : voiceNames[voice],
      call,
      fill: focus ? fillFor(focus, call) : call,
      trust: entry?.weight ?? null,
      brier: entry ? brierOf(entry.loss, entry.samples) : null,
      record: board.ledger
        .slice(0, RECORD_LENGTH)
        .reverse()
        .map((row) => markIn(row, voice)),
      status,
    };
  });
}

export function frontOf(focus: Focus | null): Front | null {
  const called = STATION_ORDER.flatMap((voice) => {
    const p = focus?.calls[voice];
    return p === undefined ? [] : [{ voice, p }];
  });
  if (!focus || called.length < 2) return null;
  const sorted = called.toSorted((a, b) => a.p - b.p);
  const low = sorted[0];
  const high = sorted[sorted.length - 1];
  if (!low || !high) return null;
  const gap = disagreement(focus.calls);
  const order = (voice: Voice) => STATION_ORDER.indexOf(voice);
  return {
    high: high.voice,
    low: low.voice,
    gap,
    disagrees: gap >= DISAGREEMENT_GAP,
    adjacent: Math.abs(order(high.voice) - order(low.voice)) === 1,
  };
}

const POINTS = (gap: number) => Math.round(gap * 100);

export function frontText(focus: Focus | null, front: Front | null): string {
  if (!focus) return "";
  if (!front) return "One source this window. No front.";
  if (!front.disagrees) return `Spread now ${POINTS(front.gap)} pts. No front.`;
  const name = (voice: Voice) => (voice === "crowd" ? "The Crowd" : voiceNames[voice]);
  return `${name(front.high)} and ${name(front.low)} disagree by ${POINTS(front.gap)} pts.`;
}

/** "In btc-15m disagreements of 7+ pts (n=22), Kalshi was closer 45% of the time; DeepBook was closer 36%." */
const LESSON_SHAPE = /\(n=(\d+)\), (.+?) was closer (\d+)% of the time; (.+?) was closer (\d+)%\./;

export interface Lesson {
  text: string;
  link: { label: string; href: string } | null;
}

export function lessonOf(lesson: CategoryBoard["lesson"], disagrees: boolean): Lesson {
  if (!lesson) return { text: "No lesson yet. Grudge writes one every 25 windows.", link: null };
  const parts = LESSON_SHAPE.exec(lesson.text);
  const short = parts
    ? `Over ${parts[1]} disagreements, ${parts[2]} was closer ${parts[3]}% of the time; ${parts[4]}, ${parts[5]}%.`
    : lesson.text;
  return {
    text: disagrees ? short : `Latest lesson: ${lesson.text}`,
    link: lesson.blobId
      ? {
          label: lesson.recalled ? "Recalled from Walrus ↗" : "On Walrus ↗",
          href: walruscan(lesson.blobId),
        }
      : null,
  };
}

const COUNT_WORD: Record<number, string> = { 2: "both", 3: "all three", 4: "all four" };

export interface Last {
  window: string;
  result: string;
  note: string;
}

/** The newest settled window: what happened and who was wrong. */
export function lastOf(category: Category, board: CategoryBoard, clock: Clock): Last | null {
  const row = board.ledger[0];
  if (!row) return null;
  const end = Date.parse(row.endsAt);
  const window = `${clock.hm(end - WINDOW_MS[category])}–${clock.hm(end)}`;
  const result = resultOf(row);
  if (result === "split") {
    return {
      window,
      result: "split · nobody scored.",
      note: "Split. The venues disagreed about what happened, so nobody is scored.",
    };
  }
  if (result === "void") return { window, result: "void · nobody scored.", note: "" };

  const calls = Object.entries(row.calls) as [Voice, { p: number; mark: Mark | null }][];
  const right = calls.filter(([, call]) => call.mark === "right").length;
  const verdict =
    right === calls.length
      ? `${COUNT_WORD[calls.length] ?? `all ${calls.length}`} right.`
      : right === 0
        ? `${COUNT_WORD[calls.length] ?? `all ${calls.length}`} wrong.`
        : `${right} of ${calls.length} right.`;
  const worst = calls
    .filter(([, call]) => call.mark === "wrong")
    .toSorted(([, a], [, b]) => Math.abs(b.p - 0.5) - Math.abs(a.p - 0.5))[0];
  const went = result === "up" ? "▲" : "▼";
  return {
    window,
    result: `${went} ${result} · ${verdict}`,
    note: worst
      ? `${worst[0] === "crowd" ? "The Crowd" : voiceNames[worst[0]]} said ${percent(worst[1].p)}% ▲. It went ${went}. Noted.`
      : "",
  };
}

/** Oldest first: the settled windows, then the locked one, whose result is still pending. */
export function bandOf(board: CategoryBoard): BandColumn[] {
  const settled = board.ledger.toReversed().map(
    (row): BandColumn => ({
      endsAt: Date.parse(row.endsAt),
      result: resultOf(row),
      calls: callsIn(row),
    }),
  );
  const { locked } = board;
  return locked
    ? [...settled, { endsAt: Date.parse(locked.endsAt), result: "pending", calls: locked.calls }]
    : settled;
}

export function rowsOf(category: Category, board: CategoryBoard, clock: Clock): Row[] {
  return board.ledger.map((row) => {
    const end = Date.parse(row.endsAt);
    const start = clock.hm(end - WINDOW_MS[category]);
    return {
      window: `${start}–${clock.hm(end)}`,
      start,
      result: resultOf(row),
      line: row.line,
      cells: Object.fromEntries(
        Object.entries(row.calls).map(([voice, call]) => [
          voice,
          { p: call.p, mark: markIn(row, voice as Voice) },
        ]),
      ),
      blobId: row.blobId,
    };
  });
}

/** What the visitor already picked on the open window, as a direction and a confidence. */
export function pickOf(data: BoardResponse, category: Category) {
  const p = data.yourPicks[category];
  if (p === null || p === undefined) return null;
  return {
    direction: p >= 0.5 ? ("up" as const) : ("down" as const),
    confidence: percent(Math.max(p, 1 - p)),
  };
}

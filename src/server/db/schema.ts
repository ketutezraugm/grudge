import { type SQL, sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  bigint,
  boolean,
  check,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  categories,
  memoryKinds,
  memoryStatuses,
  type Outcome,
  paymentStatuses,
  questionStates,
  type Voice,
  voices,
} from "../domain";

const at = () => timestamp({ withTimezone: true });

/** The values come from our own constants, so inlining them into DDL is safe. */
function oneOf(column: AnyPgColumn, values: readonly string[]): SQL {
  const list = values.map((value) => `'${value}'`).join(", ");
  return sql`${column} in (${sql.raw(list)})`;
}

export const questions = pgTable(
  "questions",
  {
    id: text().primaryKey(),
    category: text({ enum: categories }).notNull(),
    windowStart: at().notNull(),
    expiry: at().notNull(),
    lockAt: at().notNull(),
    strike: doublePrecision(),
    state: text({ enum: questionStates }).notNull().default("open"),
    outcome: smallint().$type<Outcome>(),
    split: boolean().notNull().default(false),
    venueResults: jsonb().$type<Partial<Record<Voice, Outcome>>>().notNull().default({}),
    resolvedAt: at(),
  },
  (t) => [
    index("questions_state_lock_idx").on(t.state, t.lockAt),
    index("questions_state_expiry_idx").on(t.state, t.expiry),
    check("questions_category_check", oneOf(t.category, categories)),
    check("questions_state_check", oneOf(t.state, questionStates)),
  ],
);

export const forecasts = pgTable(
  "forecasts",
  {
    questionId: text()
      .notNull()
      .references(() => questions.id),
    voice: text({ enum: voices }).notNull(),
    p: doublePrecision().notNull(),
    capturedAt: at().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.questionId, t.voice] }),
    check("forecasts_voice_check", oneOf(t.voice, voices)),
    check("forecasts_p_check", sql`${t.p} > 0 and ${t.p} < 1`),
  ],
);

export const picks = pgTable(
  "picks",
  {
    questionId: text()
      .notNull()
      .references(() => questions.id),
    visitorId: text().notNull(),
    p: doublePrecision().notNull(),
    createdAt: at().notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.questionId, t.visitorId] }),
    check("picks_p_check", sql`${t.p} > 0 and ${t.p} < 1`),
  ],
);

/** Discounted Brier loss and effective sample count per (category, voice). */
export const scoreboard = pgTable(
  "scoreboard",
  {
    category: text({ enum: categories }).notNull(),
    voice: text({ enum: voices }).notNull(),
    loss: doublePrecision().notNull(),
    count: doublePrecision().notNull(),
    updatedAt: at().notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.category, t.voice] })],
);

/** Outbox: every memory is written here first and flushed to Walrus in batches. */
export const memories = pgTable(
  "memories",
  {
    id: uuid().primaryKey().defaultRandom(),
    namespace: text().notNull(),
    kind: text({ enum: memoryKinds }).notNull(),
    ref: text().notNull(),
    body: text().notNull(),
    status: text({ enum: memoryStatuses }).notNull().default("pending"),
    attempts: integer().notNull().default(0),
    blobId: text(),
    createdAt: at().notNull().defaultNow(),
    writtenAt: at(),
  },
  (t) => [
    index("memories_status_created_idx").on(t.status, t.createdAt),
    check("memories_kind_check", oneOf(t.kind, memoryKinds)),
    check("memories_status_check", oneOf(t.status, memoryStatuses)),
  ],
);

export const payments = pgTable(
  "payments",
  {
    digest: text().primaryKey(),
    payer: text().notNull(),
    amount: bigint({ mode: "bigint" }).notNull(),
    category: text({ enum: categories }).notNull(),
    status: text({ enum: paymentStatuses }).notNull().default("settling"),
    createdAt: at().notNull().defaultNow(),
    settledAt: at(),
  },
  (t) => [check("payments_status_check", oneOf(t.status, paymentStatuses))],
);

export const lessons = pgTable("lessons", {
  id: uuid().primaryKey().defaultRandom(),
  category: text({ enum: categories }).notNull(),
  text: text().notNull(),
  memoryId: uuid().references(() => memories.id),
  createdAt: at().notNull().defaultNow(),
});

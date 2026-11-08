export const categories = ["btc-5m", "btc-15m"] as const;
export type Category = (typeof categories)[number];

export const voices = ["deepbook", "polymarket", "kalshi", "crowd"] as const;
export type Voice = (typeof voices)[number];

export type ByVoice<T> = Partial<Record<Voice, T>>;

export const questionStates = ["open", "locked", "resolved", "void"] as const;
export type QuestionState = (typeof questionStates)[number];

/** 1 means the window finished at or above where it started. */
export type Outcome = 0 | 1;

export const memoryKinds = ["record", "scoreboard", "lesson"] as const;
export type MemoryKind = (typeof memoryKinds)[number];

/** One Walrus Memory namespace per kind of memory, so recall can be aimed at one of them. */
export const namespaces = {
  record: "grudge:v1:records",
  scoreboard: "grudge:v1:scoreboard",
  lesson: "grudge:v1:lessons",
} as const satisfies Record<MemoryKind, string>;

export const memoryStatuses = ["pending", "done", "failed"] as const;
export type MemoryStatus = (typeof memoryStatuses)[number];

export const paymentStatuses = ["settling", "settled", "failed"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

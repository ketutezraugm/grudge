export interface Clock {
  /** 17:45 */
  hm(ms: number): string;
  /** 17:45:08 */
  hms(ms: number): string;
}

/** Times arrive in UTC and are shown in the visitor's zone; tests pass a zone to stay deterministic. */
export function makeClock(timeZone?: string): Clock {
  const options = { hourCycle: "h23", timeZone } as const;
  const hm = new Intl.DateTimeFormat("en-GB", { ...options, hour: "2-digit", minute: "2-digit" });
  const hms = new Intl.DateTimeFormat("en-GB", {
    ...options,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return { hm: (ms) => hm.format(ms), hms: (ms) => hms.format(ms) };
}

/** 09:04 */
export function countdown(ms: number): string {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

import { log } from "../log";

/** GET a JSON body, or null (after logging why) when the venue cannot answer. */
export async function fetchJson(url: string, event: string): Promise<unknown> {
  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      log.warn(`${event}.rejected`, { status: response.status });
      return null;
    }
    return await response.json();
  } catch (err) {
    log.warn(`${event}.unreachable`, { err });
    return null;
  }
}

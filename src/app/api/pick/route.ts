import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { database } from "@/server/db/client";
import { picks, questions } from "@/server/db/schema";
import { log } from "@/server/log";
import { singleton } from "@/server/singleton";

export const dynamic = "force-dynamic";

const body = z.object({
  question: z.string(),
  direction: z.enum(["up", "down"]),
  confidence: z.union([z.literal(55), z.literal(65), z.literal(80), z.literal(95)]),
});

const COOKIE = "grudge_visitor";
const YEAR_SECONDS = 365 * 24 * 3600;

/** A visitor who clears cookies can pick again, so each address may only add this many per window. */
const PICKS_PER_ADDRESS = 3;

/** Pick counts per window and address. In memory: one instance, and a restart only forgives. */
const counted = () => singleton("pick-counts", () => new Map<string, Map<string, number>>());

/** Windows kept in the count; older ones are long locked. */
const WINDOWS_COUNTED = 40;

/** Render's proxy appends the address it saw, so the last entry is the one a visitor cannot set. */
const addressOf = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "unknown";

/**
 * One pick per visitor per window, kept until the window locks. The Crowd voice is the mean of
 * these, so picks are also capped per address; the weights learn the Crowd's record, which limits
 * what stuffing can do to the line.
 */
export async function POST(request: Request): Promise<Response> {
  log.info("pick.debug_forwarded", { xff: request.headers.get("x-forwarded-for") });
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad pick" }, { status: 400 });
  const { question, direction, confidence } = parsed.data;

  const [window] = await database()
    .select({ state: questions.state, lockAt: questions.lockAt })
    .from(questions)
    .where(eq(questions.id, question));
  if (window?.state !== "open" || window.lockAt.getTime() <= Date.now()) {
    return Response.json({ error: "this window is locked" }, { status: 409 });
  }

  const visitor = /(?:^|;\s*)grudge_visitor=([\w-]+)/.exec(
    request.headers.get("cookie") ?? "",
  )?.[1];
  const visitorId = visitor ?? randomUUID();
  const p = direction === "up" ? confidence / 100 : 1 - confidence / 100;

  const address = addressOf(request);
  const forWindow = counted().get(question) ?? new Map<string, number>();
  if ((forWindow.get(address) ?? 0) >= PICKS_PER_ADDRESS) {
    return Response.json({ error: "too many picks from this address" }, { status: 429 });
  }

  const stored = await database()
    .insert(picks)
    .values({ questionId: question, visitorId, p })
    .onConflictDoNothing()
    .returning({ questionId: picks.questionId });
  if (stored.length === 0) {
    return Response.json({ error: "you already picked this window" }, { status: 409 });
  }

  forWindow.set(address, (forWindow.get(address) ?? 0) + 1);
  counted().set(question, forWindow);
  for (const old of [...counted().keys()].slice(0, -WINDOWS_COUNTED)) counted().delete(old);

  const response = Response.json({ question, p });
  if (!visitor) {
    response.headers.append(
      "set-cookie",
      `${COOKIE}=${visitorId}; Path=/; Max-Age=${YEAR_SECONDS}; HttpOnly; SameSite=Lax; Secure`,
    );
  }
  return response;
}

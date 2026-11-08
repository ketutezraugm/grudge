import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { database } from "@/server/db/client";
import { picks, questions } from "@/server/db/schema";

export const dynamic = "force-dynamic";

const body = z.object({
  question: z.string(),
  direction: z.enum(["up", "down"]),
  confidence: z.union([z.literal(55), z.literal(65), z.literal(80), z.literal(95)]),
});

const COOKIE = "grudge_visitor";
const YEAR_SECONDS = 365 * 24 * 3600;

/**
 * One pick per visitor per window, kept until the window locks. The Crowd voice is the mean of
 * these, so a visitor who clears cookies can pick again.
 * ponytail: cookie identity only; add an IP-based cap if the Crowd gets stuffed.
 */
export async function POST(request: Request): Promise<Response> {
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

  const stored = await database()
    .insert(picks)
    .values({ questionId: question, visitorId, p })
    .onConflictDoNothing()
    .returning({ questionId: picks.questionId });
  if (stored.length === 0) {
    return Response.json({ error: "you already picked this window" }, { status: 409 });
  }

  const response = Response.json({ question, p });
  if (!visitor) {
    response.headers.append(
      "set-cookie",
      `${COOKIE}=${visitorId}; Path=/; Max-Age=${YEAR_SECONDS}; HttpOnly; SameSite=Lax; Secure`,
    );
  }
  return response;
}

import { createHash, timingSafeEqual } from "node:crypto";
import { adminEnv } from "@/server/env";
import { AmnesiaRefused, forget } from "@/server/memory/amnesia";

export const dynamic = "force-dynamic";

/** Hashing first makes both sides the same length, which `timingSafeEqual` requires. */
function isAdmin(request: Request): boolean {
  const sent = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(sent), digest(adminEnv().ADMIN_TOKEN));
}

export async function POST(request: Request): Promise<Response> {
  if (!isAdmin(request)) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    return Response.json(await forget());
  } catch (err) {
    if (err instanceof AmnesiaRefused) {
      return Response.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}

import { boardSnapshot, pickOf } from "@/server/board";
import { categories } from "@/server/domain";

export const dynamic = "force-dynamic";

/** What the board shows. Visitors poll it every few seconds; the work behind it is shared. */
export async function GET(request: Request): Promise<Response> {
  const snapshot = await boardSnapshot();
  const visitor = /(?:^|;\s*)grudge_visitor=([\w-]+)/.exec(
    request.headers.get("cookie") ?? "",
  )?.[1];

  // The visitor's own pick on each open window is the only part that is not shared.
  const yours = Object.fromEntries(
    await Promise.all(
      categories.map(async (category) => {
        const open = snapshot.categories[category].open;
        return [category, open && visitor ? await pickOf(open.id, visitor) : null] as const;
      }),
    ),
  );
  return Response.json({ ...snapshot, yourPicks: yours });
}

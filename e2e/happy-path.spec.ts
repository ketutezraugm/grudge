import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { boardResponse } from "@/app/board/schema";

const fixture = (path: string): unknown => JSON.parse(readFileSync(path, "utf8"));

const PICKED_QUESTION = "btc-15m:9999999999";

/** The recorded board, with an open window that is still taking picks and a quoted price. */
function liveBoard(now: number) {
  const board = boardResponse.parse(fixture("src/app/board/board.fixture.json"));
  const fifteen = board.categories["btc-15m"];
  return {
    ...board,
    categories: {
      ...board.categories,
      "btc-15m": {
        ...fifteen,
        open: {
          id: PICKED_QUESTION,
          startsAt: new Date(now - 60_000).toISOString(),
          endsAt: new Date(now + 840_000).toISOString(),
          lockAt: new Date(now + 360_000).toISOString(),
        },
        locked: fifteen.locked && { ...fifteen.locked, priceAtomic: "26000" },
      },
    },
  };
}

test("a visitor reads the board, makes a pick, checks the memory and sees the price", async ({
  page,
}) => {
  let picked: unknown = null;
  await page.route("**/api/board", (route) => route.fulfill({ json: liveBoard(Date.now()) }));
  await page.route("**/api/pick", (route) => {
    picked = route.request().postDataJSON();
    return route.fulfill({ json: { question: PICKED_QUESTION, p: 0.8 } });
  });
  await page.route("**/api/receipts", (route) =>
    route.fulfill({ json: fixture("src/app/receipts/receipts.fixture.json") }),
  );
  await page.route("**/api/verify-memory", (route) =>
    route.fulfill({ json: fixture("src/app/receipts/check.fixture.json") }),
  );

  // The Board: the motto, the sources and a live status.
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Markets forget. Grudge doesn't.",
  );
  await expect(page.getByRole("status").first()).toContainText("Live.");
  await expect(page.getByText("DeepBook").first()).toBeVisible();

  // A pick: direction, confidence, and the body the server receives.
  await page.getByRole("button", { name: /Up/ }).click();
  await page.getByRole("group", { name: "Confidence" }).getByText("80%").click();
  await page.getByRole("button", { name: "Log my call" }).click();
  await expect(page.getByText(/You said 80%/)).toBeVisible();
  expect(picked).toEqual({ question: PICKED_QUESTION, direction: "up", confidence: 80 });

  // Receipts: the memory check rebuilds from Walrus and reports the gap.
  await page.getByRole("navigation").getByRole("link", { name: "Receipts" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Receipts");
  await page.getByRole("button", { name: "Rebuild from Walrus and compare" }).click();
  await expect(page.getByText(/Rebuilt from snapshot #\d+/)).toBeVisible();
  await expect(page.getByText(/Largest gap against the live weights: 0\.000/)).toBeVisible();

  // Agents: today's price comes from the board.
  await page.getByRole("navigation").getByRole("link", { name: "Agents" }).click();
  await expect(page.getByText("0.026", { exact: true })).toBeVisible();
  await expect(page.getByText("26000 atomic units")).toBeVisible();

  // An unknown page is a real 404 with the designed page.
  const response = await page.goto("/leaderboard");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Grudge doesn't remember this page. Unusual.",
  );
});

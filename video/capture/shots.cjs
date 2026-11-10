// One entry per F/H shot in docs/video/SCRIPT.md. Each gets the `cam` helper from take.cjs.
// Pans and push-ins are done later by the composition's virtual camera, so takes stay still and long.

const board = async (cam) => (await cam.page.request.get(`${cam.base}/api/board`)).json();

async function openBoard(cam, tab) {
  await cam.page.goto(`${cam.base}/`, { waitUntil: "networkidle" });
  await cam.page.getByText(new RegExp(`^${tab} min`)).first().click();
  await cam.wait(2500);
}

// Rolls from shortly before the open window ends until its result lands on the Board, then 6 s more.
async function filmResolve(cam, category, tab) {
  await openBoard(cam, tab);
  const before = await board(cam);
  const cat = before.categories[category];
  const target = cat.locked?.id ?? cat.open.id;
  const endsAt = Date.parse((cat.locked ?? cat.open).endsAt);
  const waitMs = endsAt - Date.now() - 15_000;
  if (waitMs > 0) {
    console.log(`waiting ${Math.round(waitMs / 1000)} s for ${target} to end`);
    await cam.wait(waitMs);
  }
  await cam.roll();
  cam.mark(`window-end ${target}`);
  const deadline = Date.now() + 8 * 60_000;
  for (;;) {
    const now = await board(cam);
    const row = now.categories[category].ledger.find((r) => r.id === target);
    if (row && row.state !== "open" && row.state !== "locked") {
      cam.mark(`resolved ${target} ${row.state} outcome=${row.outcome}`);
      console.log(JSON.stringify(row.calls));
      break;
    }
    if (Date.now() > deadline) throw new Error(`${target} did not resolve in 8 minutes`);
    await cam.wait(2000);
  }
  await cam.wait(6000);
}

module.exports = {
  // 0:00 hook and 0:38 resolve: a window resolving on the Board (5m), with every record row taking its mark.
  "s01-resolve-5m": (cam) => filmResolve(cam, "btc-5m", "5"),
  "s07-resolve-15m": (cam) => filmResolve(cam, "btc-15m", "15"),
  "s01b-resolve-5m": (cam) => filmResolve(cam, "btc-5m", "5"),
  "s01c-resolve-5m": (cam) => filmResolve(cam, "btc-5m", "5"),

  // 0:28 four voices: the 15m stations and the countdown, held still for the camera to pan.
  "s06-voices-15m": async (cam) => {
    await openBoard(cam, "15");
    await cam.roll();
    await cam.wait(14000);
  },

  // 0:38 the lock: rolls across a 15m window's lock moment.
  "s07-lock-15m": async (cam) => {
    await openBoard(cam, "15");
    const cat = (await board(cam)).categories["btc-15m"];
    const waitMs = Date.parse(cat.open.lockAt) - Date.now() - 6000;
    if (waitMs > 0) {
      console.log(`waiting ${Math.round(waitMs / 1000)} s for the lock`);
      await cam.wait(waitMs);
    }
    await cam.roll();
    await cam.wait(14000);
  },

  // 0:50 Receipts counts, then the pointer settles on the newest blob link and clicks it (the blob-click cut).
  "s08-receipts": async (cam) => {
    await cam.page.goto(`${cam.base}/receipts`, { waitUntil: "networkidle" });
    await cam.wait(2500);
    await cam.roll();
    cam.mark("ready");
    await cam.wait(3000);
    const link = cam.page.locator("table a").first();
    await cam.moveTo(link);
    await cam.wait(800);
    const box = await link.boundingBox();
    cam.mark("click");
    console.log(`blob link: ${await link.getAttribute("href")} at ${Math.round(box.x)},${Math.round(box.y)}`);
    await cam.wait(1500);
  },

  // 1:05 Walruscan: the newest blob's page, held still.
  "s09-walruscan": async (cam) => {
    const r = await (await cam.page.request.get(`${cam.base}/api/receipts`)).json();
    const blob = r.memories.latest[0];
    console.log(`blob ${blob.kind} ${blob.ref} ${blob.url}`);
    await cam.page.goto(blob.url, { waitUntil: "networkidle", timeout: 60000 });
    await cam.wait(4000);
    await cam.roll();
    await cam.wait(9000);
  },

  // 1:12 memory check: press "Rebuild from Walrus and compare" (a read-only POST) and hold on the result.
  "s10-gap0": async (cam) => {
    await cam.page.goto(`${cam.base}/receipts`, { waitUntil: "networkidle" });
    await cam.wait(2500);
    await cam.roll();
    await cam.wait(1500);
    await cam.clickOn(cam.page.getByRole("button", { name: /Rebuild from Walrus/ }));
    cam.mark("pressed");
    await cam.page.getByText(/gap|difference/i).first().waitFor({ timeout: 60000 }).catch(() => {});
    cam.mark("result");
    await cam.wait(6000);
  },

  // 1:30 the learning figure, held still.
  "s11-learning": async (cam) => {
    await cam.page.goto(`${cam.base}/receipts`, { waitUntil: "networkidle" });
    await cam.page.getByText(/Is Grudge learning/i).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
    await cam.page.evaluate(() => window.scrollBy(0, -48));
    await cam.wait(2000);
    await cam.roll();
    await cam.wait(12000);
  },

  // 0:06-0:28 the wipe, FILMED LAST (it trims the database's records to the latest snapshot):
  // the Board rolls, the real amnesia call goes out, the Board clears and refills from Walrus.
  // The call and its response are logged for the designed terminal panel; the token never reaches the screen.
  "s03-wipe": async (cam) => {
    const env = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "..", ".env"), "utf8");
    const token = /^ADMIN_TOKEN=(.*)$/m.exec(env)?.[1]?.trim().replace(/^["']|["']$/g, "");
    if (!token) throw new Error("ADMIN_TOKEN not set in .env");
    await openBoard(cam, "5");
    await cam.roll();
    await cam.wait(3000);
    cam.mark("wipe-sent");
    const res = await cam.page.request.post(`${cam.base}/api/admin/amnesia`, {
      headers: { authorization: `Bearer ${token}` },
      timeout: 120000,
    });
    const body = await res.text();
    cam.mark(`wipe-response ${res.status()} ${body}`);
    console.log(`amnesia ${res.status()} ${body}`);
    await cam.wait(15000);
  },

  // 2:08 Suiscan: the payment the agent just made (pass the digest URL as SUISCAN_URL), held still.
  "s13-suiscan": async (cam) => {
    const url = process.env.SUISCAN_URL;
    if (!url) throw new Error("set SUISCAN_URL to the settled transaction's page");
    await cam.page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await cam.wait(5000);
    await cam.roll();
    await cam.wait(9000);
  },

  // Agent flow beat: the Agents page (how an agent pays for the consensus), held still.
  "s12b-agents": async (cam) => {
    await cam.page.goto(`${cam.base}/agents`, { waitUntil: "networkidle" });
    await cam.wait(2000);
    await cam.roll();
    await cam.wait(10000);
  },

  // 2:15 the Tatum block on Receipts, held still.
  "s14-tatum": async (cam) => {
    await cam.page.goto(`${cam.base}/receipts`, { waitUntil: "networkidle" });
    await cam.page.getByRole("region", { name: "Tatum" }).scrollIntoViewIfNeeded();
    await cam.page.evaluate(() => window.scrollBy(0, -200));
    await cam.wait(2000);
    await cam.roll();
    await cam.wait(8000);
  },
};

// Records one shot of the live app: `node video/capture/take.cjs <shot>` (NODE_PATH=node_modules).
// Writes video/capture/out/<shot>.mp4 (3840x2160, 2x device pixels, H.264, 30 fps CFR, a keyframe per second)
// and <shot>.actions.json (t in ms from the first frame, x and y in CSS px of the 1920x1080 viewport, event),
// which drive the designed cursor, zooms and click marks in the composition.
// Playwright's own recorder only captures CSS pixels at 25 fps, too soft for 1.6x push-ins, so this uses
// Chrome's screencast: one JPEG per paint at device resolution, stamped, then laid on a 30 fps grid by ffmpeg.
// Read-only against production: never POST /api/pick from here.
const { chromium } = require("@playwright/test");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const BASE = "https://grudge-l19c.onrender.com";
const OUT = path.join(__dirname, "out");
const shots = require("./shots.cjs");

async function main() {
  const name = process.argv[2];
  const shot = shots[name];
  if (!shot) throw new Error(`unknown shot "${name}"; known: ${Object.keys(shots).join(", ")}`);
  const framesDir = path.join(OUT, `${name}.frames`);
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  const actions = [];
  const frames = []; // { file, ms }
  let t0 = 0;
  let at = { x: 960, y: 540 };
  const now = () => Date.now() - t0;

  const cam = {
    page,
    base: BASE,
    recording: false,
    // Starts the screencast; everything before it (navigation, loading) stays off the take.
    async roll() {
      const cdp = await context.newCDPSession(page);
      cdp.on("Page.screencastFrame", async ({ data, sessionId }) => {
        const ms = Date.now();
        if (!t0) t0 = ms;
        const file = `f${String(frames.length).padStart(5, "0")}.jpg`;
        fs.writeFileSync(path.join(framesDir, file), Buffer.from(data, "base64"));
        frames.push({ file, ms: ms - t0 });
        await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
      });
      await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 3840, maxHeight: 2160, everyNthFrame: 1 });
      this.cdp = cdp;
      // A repaint so the first frame arrives at once even on a still page.
      await page.evaluate(() => window.scrollBy(0, 0));
      while (!t0) await page.waitForTimeout(20);
    },
    // Human-paced pointer: eased path at about 600 px/s, logged at each step.
    async move(x, y) {
      const dist = Math.hypot(x - at.x, y - at.y);
      const steps = Math.max(8, Math.round(dist / 20));
      for (let i = 1; i <= steps; i++) {
        const k = i / steps;
        const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        const px = at.x + (x - at.x) * e;
        const py = at.y + (y - at.y) * e;
        await page.mouse.move(px, py);
        actions.push({ t: now(), x: Math.round(px), y: Math.round(py), event: "move" });
        await page.waitForTimeout(((dist / 600) * 1000) / steps);
      }
      at = { x, y };
    },
    async click(x, y) {
      await this.move(x, y);
      actions.push({ t: now(), x, y, event: "click" });
      await page.mouse.click(x, y);
    },
    async moveTo(locator) {
      const box = await locator.boundingBox();
      if (!box) throw new Error("target not visible");
      await this.move(box.x + box.width / 2, box.y + box.height / 2);
      return box;
    },
    async clickOn(locator) {
      const box = await this.moveTo(locator);
      await this.click(box.x + box.width / 2, box.y + box.height / 2);
    },
    mark(event) {
      actions.push({ t: now(), x: at.x, y: at.y, event });
    },
    wait: (ms) => page.waitForTimeout(ms),
  };

  try {
    await shot(cam);
  } finally {
    const end = now();
    if (cam.cdp) await cam.cdp.send("Page.stopScreencast").catch(() => {});
    await context.close();
    await browser.close();
    fs.writeFileSync(path.join(OUT, `${name}.actions.json`), JSON.stringify(actions, null, 1));
    if (frames.length) encode(name, framesDir, frames, end);
  }
}

// Each frame holds until the next paint; ffmpeg resamples that to a constant 30 fps.
function encode(name, framesDir, frames, end) {
  const lines = ["ffconcat version 1.0"];
  frames.forEach((frame, i) => {
    const next = i + 1 < frames.length ? frames[i + 1].ms : end;
    lines.push(`file ${frame.file}`, `duration ${Math.max(0.001, (next - frame.ms) / 1000).toFixed(3)}`);
  });
  lines.push(`file ${frames[frames.length - 1].file}`);
  const list = path.join(framesDir, "list.ffconcat");
  fs.writeFileSync(list, lines.join("\n"));
  execFileSync("ffmpeg", [
    "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", list,
    "-vf", "scale=3840:2160:flags=lanczos,fps=30", "-c:v", "libx264", "-preset", "slow", "-crf", "14",
    "-pix_fmt", "yuv420p", "-g", "30", "-keyint_min", "30", "-movflags", "+faststart",
    "-t", (end / 1000).toFixed(3),
    path.join(OUT, `${name}.mp4`),
  ]);
  console.log(`${name}: ${frames.length} paints over ${(end / 1000).toFixed(2)} s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

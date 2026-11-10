// Builds video/comp/index.html, the 2:16 demo composition, from the timeline below: `node video/comp/build.cjs`.
// Every visual here is placed from Claude Design's approved storyboard (canvas 4DBC3oQD38AVTBU8ivs1Yh: scene
// boards S01-S15, the sheet, reveal A) over the real takes in assets/footage; nothing is drawn that it did not draw.
// Times are composition seconds. Footage framing: a window (x, y, w, h) shows the page scaled by k, offset (ox, oy),
// in CSS px of the 1920x1080 page the take was captured at.
const fs = require("node:fs");
const path = require("node:path");

const FOOT = path.join(__dirname, "..", "capture", "out");
const vo = (id) => {
  const f = path.join(__dirname, "assets", "vo", `${id}.wav`);
  const b = fs.readFileSync(f);
  return b.readUInt32LE(40) / b.readUInt32LE(28); // data bytes / byte rate (16-bit PCM wav)
};

// Window rects from the storyboard
const H = { x: 328, y: 160, w: 1536, h: 864, line: true }; // S04-S07, S10, S12, S14
const H8 = { x: 328, y: 240, w: 1536, h: 864, line: true }; // S08 (two-line text beat)
const FULL = { x: 0, y: 0, w: 1920, h: 1080 };
const PROOF = { x: 56, y: 216, w: 1808, h: 808 }; // S09, S13 (on chart paper)

// [id, take, start, dur, mediaStart, win, k, ox, oy, extra]
const clips = [
  ["hook", "s01b-resolve-5m", 0, 4.6, 345.3, FULL, 1, 0, 0, { push: { at: 2.6, dur: 0.9, k: 1.6, ox: -274.4, oy: -437.2 } }],
  ["what", "s01b-resolve-5m", 8.1, 10.1, 150, FULL, 1, 0, 0],
  ["wipeA", "s03-wipe", 18.2, 4.6, 0, { x: 328, y: 160, w: 668, h: 864, line: true }, 0.8, -236.8, 0],
  ["wipeB", "s03-wipe", 22.8, 5.0, 8.6, H, 0.8, 0, 0],
  ["wipeC", "s03-wipe", 27.8, 5.2, 29.0, H, 1.2, -300, -360],
  ["lesson", "s03-wipe", 33.0, 8.0, 33.4, H, 1.2, -300, -360, { push: { at: 33.2, dur: 0.8, k: 1.6, ox: -192, oy: -208 } }],
  ["voices", "s06-voices-15m", 41.0, 6.6, 0, H, 1.1497, -333.41, -378.25],
  ["crowd", "s06-voices-15m", 47.6, 6.0, 6.6, H, 1.6, -1308.8, -302.4],
  ["lock", "s07-lock-15m", 53.6, 4.0, 4.0, H, 1.1566, -342.36, -115.66],
  ["resolve", "s07-resolve-15m", 57.6, 4.8, 271.0, H, 1.1566, -342.36, -115.66],
  ["receipts", "s08-receipts", 62.4, 5.8, 0, H8, 0.8, 0, 0],
  ["walruscan", "s09-walruscan", 68.2, 6.8, 1.5, PROOF, 0.9417, 0, 0],
  ["gap", "s10-gap0", 75.0, 11.2, 0, H, 1.14627, -664.84, -45.85],
  ["learning", "s11-learning", 86.2, 14.8, 0, { x: 896, y: 132, w: 968, h: 692, line: true }, 1.34, -1255.3, -578.6, { rate: 0.8 }],
  ["agents", "s12b-agents", 101.0, 7.6, 0, H, 0.8, 0, 0],
  ["suiscan", "s13-suiscan", 115.6, 7.0, 2.0, PROOF, 0.9417, 0, 0],
  ["tatum", "s14-tatum", 122.6, 6.0, 1.0, H, 1.8, -1415, -743.6],
];
const TOTAL = 136.0;

// Chart-paper grounds (S09, S13)
const grounds = [
  [68.2, 6.8],
  [115.6, 7.0],
];

// Text beats: [text lines, start, end, style] (SCRIPT.md column; S-board positions)
const beats = [
  [["Wipe the server"], 18.35, 22.8, "top"],
  [["Rebuilt from Walrus"], 28.3, 33.0, "top"],
  [["Four voices, one question"], 41.15, 47.6, "top"],
  [["Trust moves"], 60.5, 62.4, "top"],
  [["Every grudge is", "a Walrus blob"], 62.55, 68.2, "top2"],
  [["Walrus mainnet"], 68.35, 75.0, "box"],
  [["Gap 0"], 83.9, 86.2, "top"],
  [["Brier score,", "lower is", "better"], 86.35, 101.0, "col"],
  [["Paid over x402"], 108.75, 115.6, "top"],
  [["Settled on Sui"], 115.75, 122.6, "box"],
  [["Read through Tatum"], 122.75, 128.6, "top"],
];

// Voiceover: [wav id, start, caption text]
const voice = [
  ["01-hook", 0.2, "Polymarket said 51% up. Bitcoin went down. Noted."],
  ["02-what", 8.3, "Grudge grades prediction markets the way weather forecasts are graded. Every five and fifteen minutes, it scores each voice's call, and trusts the ones that verify."],
  ["03-wipe", 18.35, "Every wrong call goes into Grudge's memory on Walrus. So let's wipe the server."],
  ["05-refill", 28.4, "It reads Walrus and comes back. Same trust. Same lesson. Nothing forgiven."],
  ["05b-lesson", 33.3, "Lessons come back too. When DeepBook and Polymarket disagree, DeepBook has been closer 84% of the time."],
  ["06-voices", 41.2, "Four voices call the same Bitcoin move: DeepBook on Sui, Polymarket, Kalshi, and the Crowd."],
  ["06b-crowd", 47.8, "You can call it too. Pick up or down before the lock, and the Crowd is graded like everyone else."],
  ["07-resolve", 53.8, "At the lock, the calls freeze. When the window ends, every call is marked right or wrong against its voice, and trust moves."],
  ["08-receipts", 62.6, "Every grudge is a Walrus blob on mainnet. Over a thousand memories so far: records, scoreboards, lessons."],
  ["10-button", 75.2, "This button rebuilds trust from Walrus alone, and compares it with the live numbers."],
  ["10-gap", 84.6, "Gap: zero."],
  ["11-learning", 86.4, "Is it learning? Over the last 100 five-minute windows, Grudge scored 0.140, against 0.157 for a plain average. DeepBook alone scores 0.139, so it hasn't beaten its best voice yet."],
  ["12b-flow", 101.2, "An agent asks for the line, gets a 402 with the price, pays in USDC, and asks again with the payment."],
  ["12-agent", 109.0, "Here is a real one. About five cents of USDC, settled on Sui. The agent needs no SUI."],
  ["14-tatum", 122.8, "DeepBook's odds, and every payment, are read from Sui through Tatum."],
  ["15-close", 130.0, "Markets forget. Grudge doesn't."],
];

// Terminal panels: [start, end, rect, lines [[t, text]]]
const term = JSON.parse(fs.readFileSync(path.join(FOOT, "s12-agent.term.json"), "utf8"));
const terminals = [
  [18.2, 22.8, { x: 1020, y: 160, w: 844, h: 864 }, [[3.0, "$ curl -X POST \\"], [3.0, "    https://grudge-l19c.onrender.com/api/admin/amnesia"]]],
  [108.6, 115.6, { x: 328, y: 160, w: 1536, h: 864 }, [[0.15, `$ ${term.display}`], ...term.lines.map((l) => [0.15 + l.t / 1000, l.text])]],
];

// Designed cursor driven by the take's action log: [take, clipId]
const cursors = [
  ["s08-receipts", "receipts"],
  ["s10-gap0", "gap"],
];
// Click mark at a logged click: [take, clipId, event]
const clicks = [["s10-gap0", "gap", "pressed"]];

// Ticks (sound map): times in composition seconds
const R = 4.6; // reveal start
const ticks = [3.9, ...[12, 15, 18, 21, 24, 27].map((f) => R + f / 30), ...[42, 46, 50].map((f) => R + f / 30), 21.2, 60.5, 77.88, 108.75];

// ---------------------------------------------------------------- build
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const px = (n) => `${+n.toFixed(2)}px`;
let html = "";
let js = "";
let z = 1;

for (const [a, d] of grounds) {
  const id = `g${z}`;
  html += `<div id="${id}" class="clip ground" data-start="${a}" data-duration="${d}" data-track-index="0" style="z-index:${z++}"></div>\n`;
}

const byId = {};
for (const [id, take, start, dur, ms, win, k, ox, oy, extra = {}] of clips) {
  byId[id] = { start, ms, win, k, ox, oy, rate: extra.rate ?? 1, push: extra.push };
  const line = win.line ? "outline:2px solid #FFFFFF;" : "";
  html += `<div id="w-${id}" class="win" style="left:${px(win.x)};top:${px(win.y)};width:${px(win.w)};height:${px(win.h)};${line}z-index:${z++}">`;
  html += `<video id="v-${id}" class="clip" src="assets/footage/${take}.mp4" muted playsinline data-start="${start}" data-duration="${dur}" data-media-start="${ms}"${extra.rate ? ` data-playback-rate="${extra.rate}"` : ""} data-track-index="1" style="left:${px(ox)};top:${px(oy)};width:${px(1920 * k)};height:${px(1080 * k)}"></video></div>\n`;
  js += `tl.set("#w-${id}",{autoAlpha:1},${start});tl.set("#w-${id}",{autoAlpha:0},${+(start + dur).toFixed(3)});\n`;
  if (extra.push) {
    const p = extra.push;
    const s = p.k / k;
    js += `tl.to("#v-${id}",{x:${+(p.ox - ox).toFixed(2)},y:${+(p.oy - oy).toFixed(2)},scale:${+s.toFixed(4)},transformOrigin:"0 0",duration:${p.dur},ease:"standard"},${p.at});\n`;
  }
}

// Reveal A (Claude Design, project/hf/reveal-a), placed at R, held until 8.1
const ref = fs.readFileSync(path.join(__dirname, "src", "reveal-a.ref.txt"), "utf8");
const markSvg = /<div id="mark" class="mark">([\s\S]*?)<\/div>\s*<div id="word"/.exec(ref)[1];
html += `<div id="reveal" class="clip" data-start="${R}" data-duration="${+(8.1 - R).toFixed(2)}" data-track-index="8" style="z-index:${z++}"><div id="mark" class="mark">${markSvg}</div><div id="word" class="wordmark">Grudge</div><div id="motto" class="motto">Markets forget. Grudge doesn&#39;t.</div></div>\n`;
const revealJs = /\/\/ f0-12:[\s\S]*?(?=\/\/ Hold to 4 s)/.exec(ref)[0].replace(/F\((\d+)\)/g, (_, n) => `${+(R + n / 30).toFixed(4)}`);
js += revealJs;

// Close (S15)
// The close's mark is the finished mark: ids dropped so the reveal's start states (by id) do not apply.
html += `<div id="close" class="clip" data-start="128.6" data-duration="${+(TOTAL - 128.6).toFixed(2)}" data-track-index="8" style="z-index:${z++}"><div style="position:absolute;left:155px;top:292px;width:204.8px;height:204.8px">${markSvg.replace(/ id="[^"]*"/g, "")}</div><div class="url">grudge-l19c.onrender.com</div></div>\n`;

// Text beats
beats.forEach(([lines, a, b, style], i) => {
  const id = `b${i}`;
  html += `<div id="${id}" class="clip beat beat-${style}" data-start="${a}" data-duration="${+(b - a).toFixed(2)}" data-track-index="3" style="z-index:${z++}">${lines.map((l) => `<div>${esc(l)}</div>`).join("")}</div>\n`;
  js += `tl.fromTo("#${id}",{"--wdth":75,"--wght":200,opacity:0},{"--wdth":112.5,"--wght":800,opacity:1,duration:0.4,ease:"enter"},${a});\n`;
});

// Captions: each VO line split into phrases of at most two 42-character lines, timed by length
let ci = 0;
const srt = [];
for (const [id, a, text] of voice) {
  const dur = vo(id);
  html += `<audio id="a-${id}" class="clip" src="assets/vo/${id}.wav" data-start="${a}" data-duration="${+dur.toFixed(3)}" data-volume="1" data-track-index="10"></audio>\n`;
  const words = text.split(" ");
  const chunks = [];
  let cur = [];
  const lines = (ws) => {
    const out = [""];
    for (const w of ws) {
      const last = out[out.length - 1];
      if ((last + " " + w).trim().length > 42) out.push(w);
      else out[out.length - 1] = (last + " " + w).trim();
    }
    return out;
  };
  for (const w of words) {
    const next = [...cur, w];
    if (lines(next).length > 2) {
      chunks.push(cur);
      cur = [w];
    } else cur = next;
    if (/[.:?]$/.test(w) && lines(cur).length === 2) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  const total = chunks.reduce((n, c) => n + c.join(" ").length, 0);
  let t = a;
  for (const c of chunks) {
    const d = (dur * c.join(" ").length) / total;
    const capId = `c${ci++}`;
    const band = a >= 68.2 && a < 75 ? "" : " band";
    html += `<div id="${capId}" class="clip cap${band}" data-start="${+t.toFixed(3)}" data-duration="${+d.toFixed(3)}" data-track-index="4" style="z-index:900">${lines(c).map((l) => `<div>${esc(l)}</div>`).join("")}</div>\n`;
    srt.push([t, t + d, lines(c).join("\n")]);
    t += d;
  }
}

// Terminal panels
terminals.forEach(([a, b, r, lines], i) => {
  const id = `t${i}`;
  html += `<div id="${id}" class="clip term" data-start="${a}" data-duration="${+(b - a).toFixed(2)}" data-track-index="5" style="left:${px(r.x)};top:${px(r.y)};width:${px(r.w)};height:${px(r.h)};z-index:${z++}">`;
  lines.forEach(([t, text], j) => {
    html += `<div id="${id}l${j}" class="tl">${esc(text)}</div>`;
    js += `tl.set("#${id}l${j}",{opacity:1},${+(a + t).toFixed(3)});\n`;
  });
  html += "</div>\n";
});

// Cursor and click marks, mapped from page CSS px through each clip's framing
const map = (c, x, y) => [c.win.x + c.ox + x * c.k - 6, c.win.y + c.oy + y * c.k - 6]; // hot spot at the tip (3,3)*2
const cursorSvg = `<svg viewBox="0 0 20 20" width="40" height="40" style="overflow:visible"><g fill="none" stroke="#0F1B44" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10 L3 3 L10 3"/><path d="M3 3 L12.9 12.9"/><circle cx="15" cy="15" r="3"/></g><g fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10 L3 3 L10 3"/><path d="M3 3 L12.9 12.9"/><circle cx="15" cy="15" r="3"/></g></svg>`;
cursors.forEach(([take, clipId], i) => {
  const c = byId[clipId];
  const clip = clips.find((x) => x[0] === clipId);
  const acts = JSON.parse(fs.readFileSync(path.join(FOOT, `${take}.actions.json`), "utf8")).filter((a) => a.event === "move" || a.event === "click");
  const id = `k${i}`;
  const first = map(c, 960, 540);
  html += `<div id="${id}" class="clip cursor" data-start="${c.start}" data-duration="${clip[3]}" data-track-index="6" style="left:0;top:0;z-index:950">${cursorSvg}</div>\n`;
  js += `tl.set("#${id}",{x:${first[0].toFixed(1)},y:${first[1].toFixed(1)}},${c.start});\n`;
  let last = c.start;
  for (const a of acts) {
    const at = c.start + (a.t / 1000 - c.ms) / c.rate;
    if (at < c.start || at > c.start + clip[3]) continue;
    const [x, y] = map(c, a.x, a.y);
    js += `tl.to("#${id}",{x:${x.toFixed(1)},y:${y.toFixed(1)},duration:${Math.max(0.01, at - last).toFixed(3)},ease:"none"},${last.toFixed(3)});\n`;
    last = at;
  }
});
clicks.forEach(([take, clipId, ev], i) => {
  const c = byId[clipId];
  const a = JSON.parse(fs.readFileSync(path.join(FOOT, `${take}.actions.json`), "utf8")).find((x) => x.event === ev);
  const at = c.start + (a.t / 1000 - c.ms) / c.rate;
  const [x, y] = map(c, a.x, a.y);
  const id = `m${i}`;
  html += `<div id="${id}" class="clip clickmark" data-start="${at.toFixed(3)}" data-duration="0.8" data-track-index="7" style="left:${px(x - 14)};top:${px(y - 14)};z-index:940"><svg viewBox="0 0 20 20" width="40" height="40" style="overflow:visible"><circle cx="10" cy="10" r="7" fill="none" stroke="#0F1B44" stroke-width="4"/><path id="${id}w" d="M10 10 L10 3 A7 7 0 0 1 14.95 5.05 Z" fill="#FFFFFF" stroke="#0F1B44" stroke-width="1" stroke-linejoin="round" paint-order="stroke" opacity="0"/><circle cx="10" cy="10" r="7" fill="none" stroke="#FFFFFF" stroke-width="2"/></svg></div>\n`;
  js += `tl.to("#${id}w",{opacity:1,duration:0.2,ease:"enter"},${at.toFixed(3)});tl.to("#${id}",{opacity:0,duration:0.6,ease:"exit"},${(at + 0.2).toFixed(3)});\n`;
});

// Ticks
ticks.forEach((t, i) => {
  html += `<audio id="tick${i}" class="clip" src="assets/sfx/tick.wav" data-start="${t.toFixed(3)}" data-duration="0.06" data-volume="0.5" data-track-index="${11 + (i % 2)}"></audio>\n`;
});

const page = fs
  .readFileSync(path.join(__dirname, "src", "template.txt"), "utf8")
  .replace("/*TOTAL*/", String(TOTAL))
  .replace("<!--CLIPS-->", html)
  .replace("/*TIMELINE*/", js)
  .replace("TOTAL_END", String(TOTAL));
fs.writeFileSync(path.join(__dirname, "index.html"), page);
const stamp = (s) => new Date(s * 1000).toISOString().slice(11, 23).replace(".", ",");
fs.writeFileSync(path.join(__dirname, "grudge-demo.srt"), srt.map(([a, b, text], i) => `${i + 1}
${stamp(a)} --> ${stamp(b)}
${text}
`).join("\n"));
console.log(`index.html: ${clips.length} footage clips, ${beats.length} text beats, ${ci} captions, ${voice.length} VO lines, ${TOTAL} s`);

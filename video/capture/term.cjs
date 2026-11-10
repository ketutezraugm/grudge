// Records a real terminal run for a designed terminal panel: `node video/capture/term.cjs <shot> <display> -- <cmd> [args]`.
// Writes video/capture/out/<shot>.term.json: { display, startedAt, lines: [{ t, text }] }, t in ms from the start.
// `display` is the command line the panel shows (never a secret); the run itself is real and unedited.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const [shot, display, sep, cmd, ...args] = process.argv.slice(2);
if (!shot || !display || sep !== "--" || !cmd) throw new Error("usage: term.cjs <shot> <display> -- <cmd> [args]");

const t0 = Date.now();
const lines = [];
const child = spawn(cmd, args, { cwd: path.join(__dirname, "..", ".."), shell: process.platform === "win32" });
const take = (chunk) => {
  for (const text of chunk.toString().split(/\r?\n/)) {
    if (text.trim()) {
      lines.push({ t: Date.now() - t0, text });
      console.log(text);
    }
  }
};
child.stdout.on("data", take);
child.stderr.on("data", take);
child.on("close", (code) => {
  const out = path.join(__dirname, "out", `${shot}.term.json`);
  fs.writeFileSync(out, JSON.stringify({ display, startedAt: new Date(t0).toISOString(), exit: code, lines }, null, 1));
  process.exit(code ?? 1);
});

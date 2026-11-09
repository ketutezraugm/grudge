import { type Mark, RECORD_LENGTH } from "./model";

/** The pie of a circle filled to probability p, centred at (c, c). The one mark the page is built from. */
export function piePath(c: number, r: number, p: number): string {
  if (p <= 0) return "";
  if (p >= 1) return `M${c - r},${c}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;
  const angle = p * 2 * Math.PI;
  const x = c + r * Math.sin(angle);
  const y = c - r * Math.cos(angle);
  return `M${c},${c}L${c},${c - r}A${r},${r} 0 ${p > 0.5 ? 1 : 0},1 ${x.toFixed(2)},${y.toFixed(2)}Z`;
}

type Tone = "ink" | "white";
const color = (tone: Tone) => (tone === "ink" ? "var(--ink)" : "var(--white)");

interface PieProps {
  /** Rendered size in px. */
  px: number;
  /** Size of the drawing's own coordinate box. */
  vb: number;
  r: number;
  /** The probability to fill, or null for an empty dashed circle. */
  p: number | null;
  tone: Tone;
  /** A white disc behind the pie, for circles that sit on the chart paper. */
  plate?: boolean;
  stroke?: number;
  dash?: string;
  label: string;
}

export function Pie({
  px,
  vb,
  r,
  p,
  tone,
  plate = false,
  stroke = 1.5,
  dash = "3 3",
  label,
}: PieProps) {
  const c = vb / 2;
  return (
    <svg
      className="pie"
      width={px}
      height={px}
      viewBox={`0 0 ${vb} ${vb}`}
      role="img"
      aria-label={label}
    >
      <circle
        cx={c}
        cy={c}
        r={r}
        fill={plate ? "var(--white)" : "none"}
        stroke={color(tone)}
        strokeWidth={stroke}
        strokeDasharray={p === null ? dash : undefined}
      />
      {p === null ? null : <path d={piePath(c, r, p)} fill={color(tone)} />}
    </svg>
  );
}

/**
 * A drawn triangle. The ▲ glyph is not in Martian Mono, so it falls back to a different font on
 * every system, and at display sizes that shows; small text can keep the glyph.
 */
export function Arrow({ direction = "up" }: { direction?: "up" | "down" }) {
  return (
    <svg className="arrow" viewBox="0 0 10 9" aria-hidden="true">
      <path d={direction === "up" ? "M0,9L5,0L10,9Z" : "M0,0L10,0L5,9Z"} fill="currentColor" />
    </svg>
  );
}

const DOT = 4.75;

/** One window's mark: filled for right (or up), empty for wrong (or down), half for split, dashed for none. */
export function Dot({ mark, cx, cy, tone }: { mark: Mark; cx: number; cy: number; tone: Tone }) {
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={DOT}
        fill={mark === "right" ? color(tone) : "none"}
        stroke={color(tone)}
        strokeWidth={1.5}
        strokeDasharray={mark === "none" ? "2 2" : undefined}
      />
      {mark === "split" ? (
        <path d={`M${cx},${cy - DOT}A${DOT},${DOT} 0 0,0 ${cx},${cy + DOT}Z`} fill={color(tone)} />
      ) : null}
    </>
  );
}

const WORD: Record<Mark, string> = {
  right: "right",
  wrong: "wrong",
  split: "split, not scored",
  none: "no call",
};

/** A source's last ten windows, oldest first. A source with fewer is padded on the old side. */
export function Record({
  marks,
  tone,
  className,
}: {
  marks: Mark[];
  tone: Tone;
  className?: string;
}) {
  const padded: Mark[] = [
    ...Array.from<Mark>({ length: Math.max(0, RECORD_LENGTH - marks.length) }).fill("none"),
    ...marks,
  ];
  const quiet = marks.length === 0;
  return (
    <svg
      className={className}
      width={156}
      height={12}
      viewBox="0 0 156 12"
      role="img"
      aria-label={
        quiet
          ? "No calls in the last ten windows"
          : `Last ten windows, oldest first: ${padded.map((mark) => WORD[mark]).join(", ")}`
      }
    >
      {padded.map((mark, k) => (
        // The window's position in the row is its identity: marks repeat, and the row never reorders.
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length positional row
        <Dot key={k} mark={mark} cx={6 + k * 16} cy={6} tone={tone} />
      ))}
    </svg>
  );
}

export { WORD as markWord };

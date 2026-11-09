import type { Clock } from "./clock";
import { Dot } from "./marks";
import { BAND_SLOTS, type BandColumn, type Mark } from "./model";
import type { Voice } from "./schema";

const PAD_LEFT = 48;
const PAD_RIGHT = 24;
const PAD_TOP = 22;
const PAD_BOTTOM = 24;
const FRONT_GAP = 6;
const TOOTH_PITCH = 14;

/** Polymarket first, so DeepBook, the one onchain source, is drawn on top. */
const TRACES: { voice: Voice; stroke: string; width: number; dash?: string }[] = [
  { voice: "polymarket", stroke: "var(--cobalt)", width: 1.5 },
  { voice: "kalshi", stroke: "var(--ink)", width: 1.5, dash: "5 3" },
  { voice: "deepbook", stroke: "var(--ink)", width: 3 },
];

const MARK_OF: Record<BandColumn["result"], Mark> = {
  up: "right",
  down: "wrong",
  split: "split",
  void: "none",
  pending: "none",
};

const AXIS = [
  [1, "100"],
  [0.5, "50"],
  [0, "0"],
] as const;

const round = (value: number) => Math.round(value * 10) / 10;

interface DrumBandProps {
  columns: BandColumn[];
  /** Set while a disagreement of 7+ points is open on the locked window: the highest and lowest call. */
  front: { high: number; low: number } | null;
  width: number;
  height: number;
  clock: Clock;
}

/** The last windows left to right: each source's call at lock, and what the window did. */
export function DrumBand({ columns, front, width, height, clock }: DrumBandProps) {
  const cell = (width - PAD_LEFT - PAD_RIGHT) / BAND_SLOTS;
  const plot = height - PAD_TOP - PAD_BOTTOM;
  const slotX = (slot: number) => round(PAD_LEFT + cell * (slot + 0.5));
  const yOf = (p: number) => round(PAD_TOP + (1 - p) * plot);
  const markY = round(PAD_TOP / 2);
  // The newest window sits next to the open slot, so the columns are packed to the right.
  const first = BAND_SLOTS - 1 - columns.length;
  const latestSlot = BAND_SLOTS - 2;
  const lastColumn = columns.at(-1);

  const hours = columns.flatMap((column, k) =>
    clock.hm(column.endsAt).endsWith(":00")
      ? [{ x: round(PAD_LEFT + cell * (first + k + 1)), label: clock.hm(column.endsAt) }]
      : [],
  );

  const trace = (voice: Voice) => {
    // A source that sat a window out breaks its line instead of bridging the gap.
    const runs: string[][] = [[]];
    columns.forEach((column, k) => {
      const p = column.calls[voice];
      if (p === undefined) runs.push([]);
      else runs[runs.length - 1]?.push(`${slotX(first + k)},${yOf(p)}`);
    });
    return runs
      .filter((run) => run.length > 1)
      .map((run) => `M${run.join("L")}`)
      .join("");
  };

  const teeth: string[] = [];
  let frontLine = "";
  if (front) {
    const x = slotX(latestSlot);
    const top = yOf(front.high) + FRONT_GAP;
    const bottom = yOf(front.low) - FRONT_GAP;
    frontLine = `M${x},${top}L${x},${bottom}`;
    for (let y = top + 4; y + 9 <= bottom; y += TOOTH_PITCH) {
      teeth.push(`M${x},${round(y)}L${round(x + 6)},${round(y + 4.5)}L${x},${round(y + 9)}Z`);
    }
  }

  return (
    <svg
      className="band"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Calls at lock for the last 20 windows"
    >
      {columns.length > 0 ? (
        <rect
          x={round(PAD_LEFT + cell * latestSlot)}
          y={PAD_TOP}
          width={round(cell)}
          height={plot}
          fill="var(--ink)"
          fillOpacity={0.07}
        />
      ) : null}
      <rect
        x={round(PAD_LEFT + cell * (BAND_SLOTS - 1))}
        y={0}
        width={round(cell)}
        height={height}
        fill="var(--orange)"
      />

      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <line
          key={p}
          x1={PAD_LEFT}
          x2={round(width - PAD_RIGHT)}
          y1={yOf(p)}
          y2={yOf(p)}
          stroke="var(--ink)"
          strokeOpacity={p === 0.5 ? 0.4 : 0.18}
        />
      ))}
      {hours.map((hour) => (
        <line
          key={hour.label}
          x1={hour.x}
          x2={hour.x}
          y1={PAD_TOP}
          y2={PAD_TOP + plot}
          stroke="var(--ink)"
          strokeOpacity={0.18}
        />
      ))}

      {TRACES.map(({ voice, stroke, width: strokeWidth, dash }) => (
        <path
          key={voice}
          d={trace(voice)}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={dash}
          strokeLinejoin="round"
        />
      ))}

      {lastColumn
        ? TRACES.map(({ voice }) => {
            const p = lastColumn.calls[voice];
            return p === undefined ? null : (
              <circle key={voice} cx={slotX(latestSlot)} cy={yOf(p)} r={3.5} fill="var(--ink)" />
            );
          })
        : null}
      {frontLine ? (
        <>
          <path
            d={frontLine}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <path
            d={teeth.join("")}
            fill="var(--orange)"
            stroke="var(--ink)"
            strokeWidth={1}
            strokeLinejoin="round"
          />
        </>
      ) : null}

      {columns.map((column, k) => (
        <Dot
          key={column.endsAt}
          mark={MARK_OF[column.result]}
          cx={slotX(first + k)}
          cy={markY}
          tone="ink"
        />
      ))}

      <g className="band__axis" textAnchor="end">
        {AXIS.map(([p, label]) => (
          <text key={label} x={PAD_LEFT - 8} y={yOf(p) + 4}>
            {label}
          </text>
        ))}
      </g>
      <g className="band__axis" textAnchor="middle">
        {hours.map((hour) => (
          <text key={hour.label} x={hour.x} y={height - 6}>
            {hour.label}
          </text>
        ))}
      </g>
      <text className="band__axis band__open" x={slotX(BAND_SLOTS - 1)} y={15} textAnchor="middle">
        open
      </text>
    </svg>
  );
}

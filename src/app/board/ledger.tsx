import type { Layout } from "./breakpoint";
import { Dot, markWord } from "./marks";
import { percent, type Row } from "./model";
import type { Voice } from "./schema";

const HEAD: Record<Voice, string> = {
  deepbook: "DeepBook",
  kalshi: "Kalshi",
  polymarket: "Polymarket",
  crowd: "The Crowd",
};
const SHORT_HEAD: Record<Voice, string> = {
  deepbook: "DB",
  kalshi: "Kalshi",
  polymarket: "Poly",
  crowd: "Crowd",
};

const WORD_OF_RESULT = { up: "▲ up", down: "▼ down", split: "split", void: "void" } as const;
const SHORT_OF_RESULT = { up: "▲", down: "▼", split: "split", void: "void" } as const;
const SKELETON_ROWS = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Window, result and line, then the blob. The call columns share what is left. On tablet and phone
 * the design puts an 8px gap between its columns, outside their widths; a table cell keeps its
 * padding inside the width, so those columns are the design's width plus the 8px.
 */
const FIXED_WIDTHS: Record<Layout, { window: number; result: number; line: number; blob: number }> =
  {
    desk: { window: 120, result: 88, line: 88, blob: 200 },
    tab: { window: 120, result: 72, line: 64, blob: 44 },
    phone: { window: 48, result: 44, line: 40, blob: 44 },
  };

interface LedgerProps {
  rows: Row[];
  /** The sources that have a column. The Crowd is last when it has one. */
  voices: Voice[];
  layout: Layout;
  loading: boolean;
}

function Call({ row, voice }: { row: Row; voice: Voice }) {
  const cell = row.cells[voice];
  const mark = cell?.mark ?? "none";
  return (
    <td>
      <span className="ledger__call">
        <svg width="12" height="12" viewBox="0 0 12 12" role="img" aria-label={markWord[mark]}>
          <Dot mark={mark} cx={6} cy={6} tone="ink" />
        </svg>
        <span className="narrow">{cell ? `${percent(cell.p)}%` : "—"}</span>
      </span>
    </td>
  );
}

function Blob({ blobId, icon }: { blobId: string | null; icon: boolean }) {
  if (!icon) {
    return (
      <td className="ledger__blob">
        {blobId ? (
          <a
            className="narrow"
            href={`https://walruscan.com/mainnet/blob/${blobId}`}
            target="_blank"
            rel="noopener"
          >
            {blobId.slice(0, 6)}…{blobId.slice(-4)} ↗
          </a>
        ) : (
          <span className="narrow ledger__writing">writing</span>
        )}
      </td>
    );
  }
  const glyph = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke={blobId ? "var(--ink)" : "var(--ink-muted)"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8,4H4V16H16V12" />
      <path d="M11,3H17V9M17,3L9,11" />
    </svg>
  );
  return (
    <td className="ledger__blob ledger__blob--icon">
      {blobId ? (
        <a
          href={`https://walruscan.com/mainnet/blob/${blobId}`}
          target="_blank"
          rel="noopener"
          aria-label={`Walrus blob ${blobId.slice(0, 6)}`}
        >
          {glyph}
        </a>
      ) : (
        <span role="img" aria-label="Blob still writing">
          {glyph}
        </span>
      )}
    </td>
  );
}

export function Ledger({ rows, voices, layout, loading }: LedgerProps) {
  const compact = layout !== "desk";
  const phone = layout === "phone";
  const columns = compact ? voices.filter((voice) => voice !== "crowd") : voices;
  const widths = FIXED_WIDTHS[layout];
  const head = compact ? SHORT_HEAD : HEAD;

  return (
    <div className="ledger on-chart">
      <table className="ledger__table">
        <colgroup>
          <col style={{ width: widths.window }} />
          <col style={{ width: widths.result }} />
          <col style={{ width: widths.line }} />
          {columns.map((voice) => (
            <col key={voice} />
          ))}
          <col style={{ width: widths.blob }} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">{phone ? "Start" : "Window"}</th>
            <th scope="col">Result</th>
            <th scope="col">{compact ? "Line" : "Grudge line"}</th>
            {columns.map((voice) => (
              <th scope="col" key={voice}>
                {head[voice]}
              </th>
            ))}
            <th scope="col" className={compact ? "ledger__head-end" : undefined}>
              {compact ? "Blob" : "Walrus blob"}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? SKELETON_ROWS.map((n) => (
                <tr key={n}>
                  <td colSpan={columns.length + 4}>
                    <span className="skeleton skeleton--wide" />
                  </td>
                </tr>
              ))
            : rows.map((row) => (
                <tr key={row.window + row.blobId}>
                  <td className="narrow" aria-label={row.window}>
                    {phone ? row.start : row.window}
                  </td>
                  <td
                    data-quiet={row.result === "split" || row.result === "void"}
                    aria-label={WORD_OF_RESULT[row.result]}
                  >
                    {(compact ? SHORT_OF_RESULT : WORD_OF_RESULT)[row.result]}
                  </td>
                  <td className="narrow">{row.line === null ? "—" : `${percent(row.line)}%`}</td>
                  {columns.map((voice) => (
                    <Call key={voice} row={row} voice={voice} />
                  ))}
                  <Blob blobId={row.blobId} icon={compact} />
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

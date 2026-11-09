"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "../site-header";
import { useLayout } from "./breakpoint";
import { type Clock, countdown, makeClock } from "./clock";
import { DrumBand } from "./drum-band";
import { Ledger } from "./ledger";
import { Arrow, Pie } from "./marks";
import {
  bandOf,
  type Focus,
  focusOf,
  frontOf,
  frontText,
  lastOf,
  lessonOf,
  percent,
  pickOf,
  rowsOf,
  stationsOf,
} from "./model";
import { PickPanel } from "./pick-panel";
import { type BoardResponse, boardResponse, type Category, type Voice } from "./schema";
import { Legend, StationGrid, StationList } from "./stations";

type Health = "loading" | "live" | "stale" | "offline";

const POLL_MS = 5_000;
/** The worker's pass is overdue past this, as the health check also counts it. */
const STALE_MS = 60_000;
/** The drum chart on a phone keeps its width and scrolls inside its own box. */
const PHONE_BAND = 720;

function useNow(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function useBoard() {
  const [state, setState] = useState<{
    data: BoardResponse | null;
    fetchedAt: number;
    failed: boolean;
  }>({
    data: null,
    fetchedAt: 0,
    failed: false,
  });
  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/board", { cache: "no-store" });
      if (!response.ok) throw new Error(`board answered ${response.status}`);
      const data = boardResponse.parse(await response.json());
      setState({ data, fetchedAt: Date.now(), failed: false });
    } catch {
      setState((previous) => ({ ...previous, failed: true }));
    }
  }, []);
  useEffect(() => {
    const whenVisible = () => {
      if (!document.hidden) void load();
    };
    whenVisible();
    const id = setInterval(whenVisible, POLL_MS);
    document.addEventListener("visibilitychange", whenVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", whenVisible);
    };
  }, [load]);
  return { ...state, refresh: load };
}

function useWidth(): [(node: HTMLDivElement | null) => void, number, HTMLDivElement | null] {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!node) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry?.contentRect.width ?? 0)),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return [setNode, width, node];
}

const usd = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Until the first board arrives the table shows its usual columns, empty. */
const LOADING_VOICES: Voice[] = ["deepbook", "kalshi", "polymarket", "crowd"];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "btc-15m", label: "15 min" },
  { id: "btc-5m", label: "5 min" },
];

/** The countdown, its facts and any waiting note for the window in focus; these change every second. */
function lineClock(
  focus: Focus | null,
  data: BoardResponse | null,
  health: Health,
  now: number,
  clock: Clock,
) {
  if (!focus || !data) return { countdown: "", meta: "", note: "" };
  const range = `${clock.hm(focus.startsAt)}–${clock.hm(focus.endsAt)}`;
  const strike = focus.strike === null ? "" : ` · strike ${usd(focus.strike)}`;
  const bitcoin = data.bitcoinUsd === null ? "" : ` · BTC ${usd(data.bitcoinUsd)}`;
  const stale = health === "stale" || health === "offline";
  const asOf = `as of ${clock.hms(Date.parse(data.asOf))}`;

  if (focus.result === null) {
    const waiting = now >= focus.endsAt;
    return {
      countdown: stale
        ? asOf
        : waiting
          ? `ended ${clock.hm(focus.endsAt)}`
          : `ends in ${countdown(focus.endsAt - now)}`,
      meta: `${range}${waiting ? "" : " locked"}${strike}${bitcoin}`,
      note: waiting && !stale ? "Waiting for the venues to settle. This can take minutes." : "",
    };
  }
  const resolved = {
    up: "resolved ▲",
    down: "resolved ▼",
    split: "resolved · split",
    void: "resolved · void",
  }[focus.result];
  const sources = Object.keys(focus.calls).length;
  return {
    countdown: stale ? asOf : resolved,
    meta: range,
    note:
      focus.result === "void"
        ? sources < 2
          ? "Void. Fewer than two sources called this window, so nobody is scored."
          : "Void. Nobody is scored this window."
        : "",
  };
}

export function Board() {
  const layout = useLayout();
  const now = useNow();
  const { data, fetchedAt, failed, refresh } = useBoard();
  const [category, setCategory] = useState<Category>("btc-15m");
  const clock = useMemo(() => makeClock(), []);
  const [measure, measured, scroller] = useWidth();

  // The phone chart is wider than the screen and its point is the newest windows and the open one,
  // which sit at the right edge. Start there, once the data is in; later polls leave the scroll alone.
  const loaded = data !== null;
  const onPhone = layout === "phone";
  useEffect(() => {
    if (onPhone && loaded && scroller) scroller.scrollLeft = scroller.scrollWidth;
  }, [onPhone, loaded, scroller]);

  const board = data?.categories[category] ?? null;
  const view = useMemo(() => {
    if (!board || !data) return null;
    const focus = focusOf(category, board);
    const front = frontOf(focus);
    const stations = stationsOf(board, focus);
    return {
      focus,
      front,
      stations,
      lesson: lessonOf(board.lesson, front?.disagrees ?? false),
      last: lastOf(category, board, clock),
      band: bandOf(board),
      rows: rowsOf(category, board, clock),
      picked: pickOf(data, category),
    };
  }, [board, data, category, clock]);

  if (layout === null) return <div className="board" />;

  const age = data ? data.workerAgeMs + (now - fetchedAt) : 0;
  const health: Health = failed ? "offline" : !data ? "loading" : age > STALE_MS ? "stale" : "live";
  const status = {
    loading: "Loading.",
    live: `Live. Last pass ${Math.floor(age / 1000)} s ago.`,
    stale: "Lost the worker. These numbers are old.",
    offline: data
      ? `You're offline. Showing ${clock.hms(Date.parse(data.asOf))}.`
      : "You're offline.",
  }[health];
  const loading = view === null;
  const compact = layout !== "desk";
  const phone = layout === "phone";

  const { focus, front, stations } = view ?? { focus: null, front: null, stations: [] };
  const line = focus?.line ?? null;
  const lineFill =
    focus?.result === "up"
      ? 1
      : focus?.result === "down"
        ? 0
        : focus?.result === "split"
          ? 0.5
          : line;
  const text = lineClock(focus, data, health, now, clock);
  const open = board?.open ?? null;
  const pause = health === "live" ? null : health;

  const bandWidth = phone ? PHONE_BAND : measured;
  const bandFront =
    focus?.result === null && front?.disagrees
      ? { high: focus.calls[front.high] ?? 0, low: focus.calls[front.low] ?? 0 }
      : null;
  const band = bandWidth > 0 && (
    <DrumBand
      columns={view?.band ?? []}
      front={bandFront}
      width={bandWidth}
      height={compact ? 200 : 180}
      clock={clock}
    />
  );
  const legendVoices = stations.map((station) => station.voice);

  const tabs = (
    <div role="tablist" aria-label="Category" className="tabs">
      {CATEGORIES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={category === id}
          className="tab"
          onClick={() => setCategory(id)}
        >
          {label} <span className="narrow">{data?.categories[id].resolved ?? ""}</span>
        </button>
      ))}
    </div>
  );
  const statusLine = (
    // The status is a live region: a visitor who loses the worker should hear that the numbers are old.
    // While live, only "Live." is announced; the seconds tick every second and are for the eye.
    <span role="status" className="status" data-alert={health === "stale" || health === "offline"}>
      {health === "live" ? (
        <>
          Live.<span aria-hidden="true"> Last pass {Math.floor(age / 1000)} s ago.</span>
        </>
      ) : (
        status
      )}
    </span>
  );

  const lede = (
    <>
      {!loading && (
        <div className="lede">
          {focus ? (
            <>
              <svg
                className="lede__front"
                width="64"
                height="20"
                viewBox="0 0 64 20"
                aria-hidden="true"
              >
                <line x1="0" y1="14" x2="64" y2="14" stroke="var(--white)" strokeWidth="1.5" />
                <path
                  d="M6,14L11,6L16,14ZM26,14L31,6L36,14ZM46,14L51,6L56,14Z"
                  fill={front?.disagrees ? "var(--orange)" : "none"}
                />
              </svg>
              <div className="lede__text">
                <span className="lede__lead">{frontText(focus, front)}</span>
                <span>{view?.lesson.text}</span>
                {view?.lesson.link ? (
                  <a
                    className="lede__link"
                    href={view.lesson.link.href}
                    target="_blank"
                    rel="noopener"
                  >
                    {view.lesson.link.label}
                  </a>
                ) : null}
              </div>
            </>
          ) : (
            <span className="lede__lead">No windows yet. Give it five minutes.</span>
          )}
        </div>
      )}
      {!loading && view?.last ? (
        <div className="last">
          <span>
            <span className="narrow last__window">{view.last.window}</span> · {view.last.result}
          </span>
          {view.last.note ? <span className="last__note">{view.last.note}</span> : null}
        </div>
      ) : null}
    </>
  );

  const lineRow = (
    <div className="line">
      <Pie
        px={phone ? 72 : 120}
        vb={120}
        r={57}
        p={loading ? null : lineFill}
        tone="white"
        stroke={phone ? 2.5 : 1.5}
        dash="4 4"
        label={
          line === null ? "Grudge line, void this window" : `Grudge line, ${percent(line)}% up`
        }
      />
      {loading ? (
        <span className="skeleton skeleton--line" />
      ) : (
        <span className="line__big wide">
          {line === null ? (
            "—"
          ) : (
            <>
              {percent(line)}%<Arrow />
            </>
          )}
        </span>
      )}
    </div>
  );
  const lineFacts = (
    <div className="line__facts">
      {loading ? (
        <>
          <span className="skeleton skeleton--count" />
          <span className="skeleton skeleton--meta" />
        </>
      ) : (
        <>
          <span className="line__count">{text.countdown}</span>
          <span className="line__meta narrow">{text.meta}</span>
        </>
      )}
    </div>
  );
  const pick = (
    <PickPanel
      key={open?.id ?? "none"}
      open={open}
      now={now}
      clock={clock}
      pause={pause}
      picked={view?.picked ?? null}
      compact={phone}
      refresh={refresh}
    />
  );

  const ledger = (
    <section aria-label="Last 20 windows" className="windows">
      <h2 className="windows__title">Last 20 windows</h2>
      <Ledger
        rows={view?.rows ?? []}
        voices={loading ? LOADING_VOICES : legendVoices}
        layout={layout}
        loading={loading}
      />
      {compact && !loading && !view?.rows.some((row) => row.cells.crowd) ? (
        <span className="windows__note">The Crowd hasn&apos;t called in any of these windows.</span>
      ) : null}
    </section>
  );

  return (
    <div className="board" data-layout={layout}>
      <a href="#main" className="skip">
        Skip to content
      </a>

      <SiteHeader active="board" layout={layout} middle={tabs} status={statusLine} />

      {layout === "desk" ? (
        <>
          <main id="main" className="hero">
            <div className="hero__left">
              <h1 className="motto">Markets forget. Grudge doesn&apos;t.</h1>
              <p className="hero__lead">
                Four sources call the same Bitcoin move. Grudge grades each call like a weather
                forecast, keeps the record on Walrus, and trusts the ones that verify.
              </p>
              {lede}
            </div>
            <div className="hero__right">
              <span className="line__label">Grudge line · weighted by record</span>
              {lineRow}
              {lineFacts}
              <span className="line__note">{text.note}</span>
              <div className="hero__pick">{pick}</div>
            </div>
          </main>

          <section aria-label="Stations and drum chart" className="sheet">
            <div className="chart on-chart">
              <StationGrid stations={stations} front={front} loading={loading} />
              <div className="chart__plot" ref={measure}>
                {band}
              </div>
            </div>
          </section>

          {ledger}
        </>
      ) : (
        <>
          <main id="main" className="stack">
            <h1 className="motto">Markets forget. Grudge doesn&apos;t.</h1>
            <span className="line__label">Grudge line · weighted by record</span>
            {lineRow}
            {lineFacts}
            {text.note ? <span className="line__note">{text.note}</span> : null}
            <div className="stack__pick">{pick}</div>

            <h2 className="stack__title">Stations</h2>
            <StationList stations={stations} front={front} loading={loading} />

            <div className="chart chart--compact on-chart">
              <div className="chart__legend">
                <Legend voices={legendVoices} />
              </div>
              <div
                className="chart__scroll"
                ref={measure}
                {...(phone ? { tabIndex: 0, "aria-label": "Drum chart, scrolls sideways" } : {})}
              >
                {band}
              </div>
              {phone ? (
                <span className="chart__hint">Scroll sideways for older windows.</span>
              ) : null}
            </div>

            {lede}
            <p className="hero__lead hero__lead--after">
              Four sources call the same Bitcoin move. Grudge grades each call like a weather
              forecast, keeps the record on Walrus, and trusts the ones that verify.
            </p>
          </main>

          {ledger}
        </>
      )}

      <footer className="foot">
        <Link href="/receipts">Every grudge is a Walrus blob. Receipts ↗</Link>
      </footer>
    </div>
  );
}

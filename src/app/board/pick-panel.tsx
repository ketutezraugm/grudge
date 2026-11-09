"use client";

import { useState } from "react";
import { type Clock, countdown } from "./clock";
import { Pie } from "./marks";
import type { BoardWindow } from "./schema";

export type Direction = "up" | "down";
const CONFIDENCES = [55, 65, 80, 95] as const;
type Confidence = (typeof CONFIDENCES)[number];

type Phase = "rest" | "loading" | "done" | "limit" | "error";

/** Why the controls are not offered: the board is not live, or the window is no longer taking picks. */
export type Pause = null | "loading" | "stale" | "offline";

const PAUSED: Record<Exclude<Pause, null>, { title: string; sub: string }> = {
  loading: { title: "Loading the open window.", sub: "" },
  stale: { title: "Picks are paused.", sub: "They come back with the worker." },
  offline: { title: "Picks need a connection.", sub: "You're offline." },
};

interface PickPanelProps {
  open: BoardWindow | null;
  now: number;
  clock: Clock;
  pause: Pause;
  /** What this visitor already picked on the open window, from the board. */
  picked: { direction: Direction; confidence: number } | null;
  compact: boolean;
  /** Asks the board for a fresh read, for when the server's view of this window differs from ours. */
  refresh: () => void;
}

export function PickPanel({ open, now, clock, pause, picked, compact, refresh }: PickPanelProps) {
  const [direction, setDirection] = useState<Direction | null>(null);
  const [confidence, setConfidence] = useState<Confidence>(65);
  const [phase, setPhase] = useState<Phase>("rest");
  const [loggedAt, setLoggedAt] = useState<number | null>(null);

  const lockAt = open ? Date.parse(open.lockAt) : null;
  const locked = open === null || (lockAt !== null && now >= lockAt);
  const range = open
    ? `${clock.hm(Date.parse(open.startsAt))}–${clock.hm(Date.parse(open.endsAt))}`
    : "";
  const windowLabel = !open
    ? " "
    : locked
      ? `${range} · locked`
      : `${range} · locks in ${countdown((lockAt ?? 0) - now)}`;

  async function log() {
    if (!open || !direction) return;
    setPhase("loading");
    try {
      const response = await fetch("/api/pick", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: open.id, direction, confidence }),
      });
      if (response.ok) {
        setLoggedAt(Date.now());
        setPhase("done");
      } else if (response.status === 429) {
        setPhase("limit");
      } else if (response.status === 409) {
        // Locked, or already picked on another tab: the board knows which.
        setPhase("rest");
        refresh();
      } else {
        setPhase("error");
      }
    } catch {
      setPhase("error");
    }
  }

  let message: { title: string; sub: string; p: number | null } | null = null;
  if (pause) {
    message = { ...PAUSED[pause], p: null };
  } else if (locked) {
    message = {
      title: "Locked. Waiting for the result.",
      sub: open ? `Next window opens at ${clock.hm(Date.parse(open.endsAt))}.` : "",
      p: null,
    };
  } else if (open && (phase === "done" || picked)) {
    const made = phase === "done" && direction ? { direction, confidence } : picked;
    if (made) {
      const arrow = made.direction === "down" ? "▼" : "▲";
      message = {
        title: `You said ${made.confidence}% ${arrow}.${loggedAt && phase === "done" ? ` Logged at ${clock.hm(loggedAt)}.` : ""}`,
        sub: `It locks at ${clock.hm(Date.parse(open.lockAt))}. Grudge scores it at ${clock.hm(Date.parse(open.endsAt))}.`,
        p: made.direction === "down" ? 1 - made.confidence / 100 : made.confidence / 100,
      };
    }
  }

  const busy = phase === "loading" || phase === "limit";
  const canLog = direction !== null && !busy;
  // Logging keeps its orange fill; only "no direction yet" and "limit reached" look unavailable.
  const ready = direction !== null && phase !== "limit";
  const arrow = direction === "down" ? "▼" : "▲";
  const help =
    phase === "limit"
      ? "Three calls from this address this window."
      : phase === "error"
        ? "Couldn't log that. Try again."
        : phase === "loading"
          ? "Logging your call."
          : direction
            ? `${confidence}% ${arrow} on ${range}.`
            : "Pick ▲ or ▼ first.";
  const emphasised = phase === "limit" || phase === "error";

  const pickButtons = (
    <>
      {(["up", "down"] as const).map((which) => (
        <button
          key={which}
          type="button"
          className="pick__direction"
          data-selected={direction === which}
          data-quiet={busy}
          disabled={busy}
          aria-pressed={direction === which}
          onClick={() => setDirection(which)}
        >
          {which === "up" ? "▲ Up" : "▼ Down"}
        </button>
      ))}
    </>
  );
  const confidenceButtons = (
    <fieldset className="pick__confidences" aria-labelledby="confidence-label" disabled={busy}>
      {CONFIDENCES.map((value) => (
        <label
          key={value}
          className="pick__confidence"
          data-selected={confidence === value}
          data-quiet={busy}
        >
          <input
            type="radio"
            name="confidence"
            value={value}
            checked={confidence === value}
            onChange={() => setConfidence(value)}
          />
          {value}%
        </label>
      ))}
    </fieldset>
  );
  const logButton = (
    <button type="button" className="pick__log" data-ready={ready} disabled={!canLog} onClick={log}>
      {phase === "loading" ? "Logging" : phase === "error" ? "Try again" : "Log my call"}
      {phase === "loading" ? <span className="pick__progress" aria-hidden="true" /> : null}
    </button>
  );

  return (
    <div className="pick on-chart" data-compact={compact}>
      <div className="pick__head">
        <h2 className="pick__title">Your call, before the lock.</h2>
        <span className="pick__window narrow">{windowLabel}</span>
      </div>
      {message ? (
        <div className="pick__message">
          <Pie px={48} vb={48} r={22} p={message.p} tone="ink" label="" />
          <div className="pick__message-text">
            <span className="pick__message-title">{message.title}</span>
            {message.sub ? <span className="pick__message-sub">{message.sub}</span> : null}
          </div>
        </div>
      ) : compact ? (
        <>
          <div className="pick__directions">{pickButtons}</div>
          <div className="pick__row">
            <span id="confidence-label" className="pick__label">
              Confidence
            </span>
            {confidenceButtons}
          </div>
          <span
            className="pick__help"
            data-bold={emphasised}
            data-ink={emphasised || direction !== null}
          >
            {help}
          </span>
          {logButton}
        </>
      ) : (
        <>
          <div className="pick__row">
            {pickButtons}
            <span className="pick__spacer" />
            <span id="confidence-label" className="pick__label">
              Confidence
            </span>
            {confidenceButtons}
          </div>
          <div className="pick__row">
            <span
              className="pick__help"
              data-bold={emphasised}
              data-ink={emphasised || direction !== null}
            >
              {help}
            </span>
            {logButton}
          </div>
        </>
      )}
    </div>
  );
}

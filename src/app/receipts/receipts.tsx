"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLayout } from "../board/breakpoint";
import { makeClock } from "../board/clock";
import { SiteHeader } from "../site-header";
import { amnesiaOf, blobsOf, checkOf, learningOf, paymentsOf, totalsOf } from "./model";
import {
  type CheckResponse,
  checkResponse,
  type ReceiptsResponse,
  receiptsResponse,
} from "./schema";

const POLL_MS = 30_000;
const CHECK_FAILED = "Walrus didn't answer. Try again in a minute.";

type Check =
  | { state: "rest"; lastAt: number | null }
  | { state: "running"; since: number; lastAt: number | null }
  | { state: "done"; result: CheckResponse }
  | { state: "error" };

function useReceipts() {
  const [data, setData] = useState<ReceiptsResponse | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const res = await fetch("/api/receipts", { cache: "no-store" });
        const parsed = receiptsResponse.parse(await res.json());
        if (live) {
          setData(parsed);
          setFailed(false);
        }
      } catch {
        if (live) setFailed(true);
      }
    };
    void load();
    const id = setInterval(load, POLL_MS);
    return () => {
      live = false;
      clearInterval(id);
    };
  }, []);

  return { data, failed };
}

function useCheck() {
  const [check, setCheck] = useState<Check>({ state: "rest", lastAt: null });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (check.state !== "running") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [check.state]);

  const run = useCallback(async () => {
    setCheck((was) => ({
      state: "running",
      since: Date.now(),
      lastAt:
        was.state === "done"
          ? Date.parse(was.result.checkedAt)
          : was.state === "rest"
            ? was.lastAt
            : null,
    }));
    setNow(Date.now());
    try {
      const res = await fetch("/api/verify-memory", { method: "POST" });
      if (!res.ok) throw new Error(String(res.status));
      setCheck({ state: "done", result: checkResponse.parse(await res.json()) });
    } catch {
      setCheck({ state: "error" });
    }
  }, []);

  return { check, now, run };
}

const KIND_MARK = {
  record: <circle cx="6" cy="6" r="4.75" fill="var(--ink)" stroke="var(--ink)" strokeWidth="1.5" />,
  scoreboard: (
    <>
      <circle cx="6" cy="6" r="4.75" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <path d="M6,1.25A4.75,4.75 0 0,0 6,10.75Z" fill="var(--ink)" />
    </>
  ),
  lesson: (
    <>
      <circle cx="6" cy="6" r="4.75" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="6" cy="6" r="1.75" fill="var(--ink)" />
    </>
  ),
};

function LinkOut() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8,4H4V16H16V12" />
      <path d="M11,3H17V9M17,3L9,11" />
    </svg>
  );
}

function MemoryCheck({ check, now, run }: ReturnType<typeof useCheck>) {
  const clock = useMemo(() => makeClock(), []);
  const result = check.state === "done" ? checkOf(check.result) : null;
  const lastAt = check.state === "rest" || check.state === "running" ? check.lastAt : null;
  return (
    <section aria-label="Memory check" className="check on-chart">
      <div className="check__head">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16,10A6,6 0 1,1 14,5.5" />
          <path d="M14.5,2V6H10.5" />
        </svg>
        <h2>Memory check</h2>
      </div>
      <p className="check__lead">
        Rebuild the weights from Walrus alone, then compare them with the live ones.
      </p>

      {check.state === "rest" ? (
        <>
          <button type="button" className="button button--solid" onClick={run}>
            Rebuild from Walrus and compare
          </button>
          {lastAt ? <span className="check__note">Last checked {clock.hms(lastAt)}.</span> : null}
        </>
      ) : null}

      {check.state === "running" ? (
        <>
          {/* The endpoint reports no progress, so the bar only says that it is waiting. */}
          <div className="wait" role="progressbar" aria-label="Reading Walrus" />
          <span className="check__strong" role="status">
            Reading Walrus. This takes a few seconds.
          </span>
          <span className="check__note">
            <span className="narrow">{Math.max(0, Math.floor((now - check.since) / 1000))}</span> s
            so far.
          </span>
        </>
      ) : null}

      {result && check.state === "done" ? (
        <>
          <span className="check__strong" role="status">
            {result.summary}
          </span>
          <table className="compare">
            <thead>
              <tr>
                <th scope="col">btc-15m Brier</th>
                <th scope="col">live</th>
                <th scope="col">rebuilt</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  <td className="narrow">{row.live}</td>
                  <td className="narrow">{row.rebuilt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="check__actions">
            {result.snapshotUrl ? (
              <a href={result.snapshotUrl} target="_blank" rel="noopener" className="check__link">
                {result.snapshotLabel}
              </a>
            ) : null}
            <button type="button" className="button button--outline button--small" onClick={run}>
              Run again
            </button>
          </div>
        </>
      ) : null}

      {check.state === "error" ? (
        <>
          <span className="check__strong" role="status">
            {CHECK_FAILED}
          </span>
          <button type="button" className="button button--outline" onClick={run}>
            Try again
          </button>
        </>
      ) : null}
    </section>
  );
}

export function Receipts() {
  const layout = useLayout();
  const { data, failed } = useReceipts();
  const memoryCheck = useCheck();
  const clock = useMemo(() => makeClock("UTC"), []);

  if (layout === null) return <div className="receipts" />;

  const phone = layout === "phone";
  const totals = data ? totalsOf(data.memories.totals) : null;
  const blobs = data ? blobsOf(data.memories.latest, clock, phone ? 8 : 12) : [];
  const payments = data ? paymentsOf(data.payments, clock).slice(0, 3) : [];
  const wipes = data ? amnesiaOf(data.amnesia, clock) : [];
  const learning = data ? learningOf(data.learning) : [];

  return (
    <div className="receipts" data-layout={layout}>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <SiteHeader active="receipts" layout={layout} />

      <main id="main" className="top">
        <div className="top__left">
          <h1 className="receipts__title">Receipts</h1>
          <p className="receipts__lead">
            Everything Grudge remembers is on Walrus. Check it yourself.
          </p>
          {totals ? (
            <>
              <div className="totals">
                {totals.cards.map((card) => (
                  <div key={card.label} className="total">
                    <span className="total__n wide">{card.n}</span>
                    <span className="total__label">{card.label}</span>
                    <span className="total__sub">{card.sub}</span>
                  </div>
                ))}
              </div>
              <span className="receipts__tally">
                <span className="narrow">{totals.all}</span> blobs on Walrus mainnet.{" "}
                <span className="narrow">{totals.waiting}</span> still writing.
              </span>
            </>
          ) : (
            <span className="receipts__tally" role="status">
              {failed ? "Couldn't reach Grudge. Reload to try again." : "Loading."}
            </span>
          )}
        </div>
        <MemoryCheck {...memoryCheck} />
      </main>

      {data ? (
        <>
          <div className="mid">
            <section aria-label="Latest blobs" className="blobs">
              <div className="section-head">
                <h2>Latest blobs</h2>
                <span className="section-head__note">newest first · UTC</span>
              </div>
              <div className="log on-chart">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Written</th>
                      <th scope="col">Kind</th>
                      {phone ? null : <th scope="col">Ref</th>}
                      <th scope="col" className="log__end">
                        Blob
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {blobs.map((blob) => (
                      <tr key={blob.id}>
                        <td className="narrow">{blob.at}</td>
                        <td>
                          <span className="kind">
                            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                              {KIND_MARK[blob.kind]}
                            </svg>
                            {blob.kind}
                          </span>
                        </td>
                        {phone ? null : <td className="narrow log__ref">{blob.ref}</td>}
                        <td className="log__end">
                          <a
                            href={blob.url}
                            target="_blank"
                            rel="noopener"
                            aria-label={`${blob.kind} blob ${blob.id.slice(0, 6)} on Walruscan`}
                            className="blob-link narrow"
                          >
                            {blob.short}
                            <LinkOut />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="side">
              <section aria-label="Payments" className="side__block">
                <h2>Payments</h2>
                <span className="side__note">Agents pay per line in USDC on Sui.</span>
                {payments.length === 0 ? (
                  <div className="empty">
                    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
                      <circle
                        cx="24"
                        cy="24"
                        r="22"
                        fill="none"
                        stroke="var(--white)"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    </svg>
                    <span>No payments yet.</span>
                  </div>
                ) : (
                  payments.map((payment) => (
                    <div key={payment.digest} className="payment on-chart">
                      <div className="payment__top">
                        <span className="payment__amount wide">{payment.amount}</span>
                        <span className="payment__status">{payment.status}</span>
                      </div>
                      <span className="payment__meta">
                        {payment.category} line
                        {payment.at ? (
                          <>
                            {" · "}
                            <span className="narrow">{payment.at}</span>
                          </>
                        ) : null}
                        {" · payer "}
                        <span className="narrow">{payment.payer}</span>
                      </span>
                      <a
                        href={payment.url}
                        target="_blank"
                        rel="noopener"
                        className="payment__link"
                      >
                        {payment.settled
                          ? "Paid. Settled on Sui. Receipt ↗"
                          : "Receipt on Suiscan ↗"}
                      </a>
                    </div>
                  ))
                )}
              </section>

              <section aria-label="Amnesia" className="side__block">
                <h2>Amnesia</h2>
                <span className="side__note">
                  Each time the server is wiped, Grudge rebuilds from Walrus and logs it here.
                </span>
                {wipes.length === 0 ? (
                  <div className="empty">
                    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
                      <circle
                        cx="24"
                        cy="24"
                        r="22"
                        fill="none"
                        stroke="var(--white)"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    </svg>
                    <span>No wipes logged yet.</span>
                  </div>
                ) : (
                  wipes.map((wipe) => (
                    <div key={wipe.id} className="payment on-chart">
                      <span className="payment__status">
                        Wiped at <span className="narrow">{wipe.at}</span> UTC
                      </span>
                      <span className="payment__meta">{wipe.line}</span>
                      <span className="payment__meta">{wipe.result}</span>
                    </div>
                  ))
                )}
              </section>

              <section aria-label="Tatum" className="side__block">
                <h2>Tatum</h2>
                <div className="counts">
                  <div className="count">
                    <span className="count__n wide">{data.tatum.grpc}</span>
                    <span>gRPC calls</span>
                  </div>
                  <div className="count">
                    <span className="count__n wide">{data.tatum.data}</span>
                    <span>Data API calls</span>
                  </div>
                </div>
                <span className="side__note">
                  Counted since the last deploy at{" "}
                  <span className="narrow side__time">
                    {clock.hms(Date.parse(data.tatum.sinceStartedAt))}
                  </span>
                  . They reset on each deploy.
                </span>
              </section>
            </div>
          </div>

          {learning.length > 0 ? (
            <section aria-label="Learning" className="learning">
              <div className="learning__head">
                <h2>Is Grudge learning?</h2>
                <span>Brier score per window. Lower is better.</span>
              </div>
              <div className="learning__grid">
                {learning.map((figure) => (
                  <figure key={figure.category} className="figure on-chart">
                    <div className="figure__head">
                      <span className="figure__title">{figure.title}</span>
                      <span className="figure__sub">
                        Brier score over the last <span className="narrow">{figure.windows}</span>{" "}
                        windows
                      </span>
                    </div>
                    <div>
                      {figure.rows.map((row) => (
                        <div key={row.name} className="plot">
                          <span className="plot__name" data-strong={row.strong}>
                            {row.name}
                          </span>
                          <div className="plot__field">
                            {figure.ticks.map((tick) => (
                              <span
                                key={tick.label}
                                className="tick"
                                style={{ left: `${tick.x}%` }}
                              />
                            ))}
                            <span className="plot__rule" style={{ width: `${row.x}%` }} />
                            <svg
                              className="plot__dot"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              style={{ left: `calc(${row.x}% - 7px)` }}
                              aria-hidden="true"
                            >
                              <circle
                                cx="7"
                                cy="7"
                                r="5.5"
                                fill={row.strong ? "var(--ink)" : "none"}
                                stroke="var(--ink)"
                                strokeWidth="1.5"
                                strokeDasharray={row.dashed ? "2 2" : undefined}
                              />
                            </svg>
                          </div>
                          <span className="plot__value narrow" data-strong={row.strong}>
                            {row.label}
                          </span>
                        </div>
                      ))}
                      <div className="plot plot--axis">
                        <span />
                        <div className="plot__axis">
                          {figure.ticks.map((tick) => (
                            <span
                              key={tick.label}
                              className="plot__tick narrow"
                              style={{ left: `${tick.x}%` }}
                            >
                              {tick.label}
                            </span>
                          ))}
                        </div>
                        <span />
                      </div>
                    </div>
                    {figure.gains.length > 0 ? (
                      <div className="gains">
                        <span className="gains__title">Grudge&apos;s gain, 95% interval</span>
                        {figure.gains.map((gain) => (
                          <div key={gain.name} className="plot">
                            <span className="plot__name">{gain.name}</span>
                            <div className="plot__field">
                              <span className="gain__zero" />
                              <span
                                className="gain__span"
                                style={{ left: `${gain.low}%`, width: `${gain.high - gain.low}%` }}
                              />
                              <span className="gain__cap" style={{ left: `${gain.low}%` }} />
                              <span className="gain__cap" style={{ left: `${gain.high}%` }} />
                              <svg
                                className="gain__dot"
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                style={{ left: `calc(${gain.mean}% - 6px)` }}
                                aria-hidden="true"
                              >
                                <circle cx="6" cy="6" r="4.75" fill="var(--ink)" />
                              </svg>
                            </div>
                            <span className="plot__value narrow">{gain.value}</span>
                          </div>
                        ))}
                        <div className="plot plot--note">
                          <span />
                          <div className="gains__ends">
                            <span>← Grudge worse</span>
                            <span>better →</span>
                          </div>
                          <span />
                        </div>
                      </div>
                    ) : null}
                    <figcaption className="figure__caption">{figure.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      <footer className="receipts__foot">
        <Link href="/">Every grudge is a Walrus blob. Board ↗</Link>
      </footer>
    </div>
  );
}

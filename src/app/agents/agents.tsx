"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLayout } from "../board/breakpoint";
import { makeClock } from "../board/clock";
import { piePath } from "../board/marks";
import { paymentsOf } from "../receipts/model";
import { type ReceiptsResponse, receiptsResponse } from "../receipts/schema";
import { SiteHeader } from "../site-header";
import { CATEGORY, priceOf, STEPS, samplesOf } from "./model";
import { priceResponse } from "./schema";

const POLL_MS = 15_000;
const COPIED_MS = 1_500;

/** The quote and the paid calls, each read now and then; either may fail without the other. */
function useAgentsData() {
  // undefined until the board has answered once; null when it has answered and nothing is locked.
  const [price, setPrice] = useState<string | null | undefined>(undefined);
  const [receipts, setReceipts] = useState<ReceiptsResponse | null>(null);

  useEffect(() => {
    let live = true;
    const load = async () => {
      const [board, proof] = await Promise.allSettled([
        fetch("/api/board", { cache: "no-store" }).then((res) => res.json()),
        fetch("/api/receipts", { cache: "no-store" }).then((res) => res.json()),
      ]);
      if (!live) return;
      if (board.status === "fulfilled") {
        const parsed = priceResponse.safeParse(board.value);
        if (parsed.success) setPrice(parsed.data.categories[CATEGORY].locked?.priceAtomic ?? null);
      }
      if (proof.status === "fulfilled") {
        const parsed = receiptsResponse.safeParse(proof.value);
        if (parsed.success) setReceipts(parsed.data);
      }
    };
    void load();
    const id = setInterval(load, POLL_MS);
    return () => {
      live = false;
      clearInterval(id);
    };
  }, []);

  return { price, receipts };
}

const COPY_ICON = "M7,7V3H17V13H13M3,7H13V17H3Z";
const CHECK_ICON = "M4,10.5L8,14.5L16,5.5";

function Sample({ title, label, text }: { title: string; label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // No clipboard (an insecure origin): the text stays selectable, so nothing is lost.
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <figure className="ag-sample on-chart">
      <figcaption>
        <span>{title}</span>
        <button type="button" aria-label={label} onClick={copy}>
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
            <path d={copied ? CHECK_ICON : COPY_ICON} />
          </svg>
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </figcaption>
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a box that scrolls sideways must be reachable by keyboard */}
      {/* biome-ignore lint/a11y/useSemanticElements: a section cannot take the scroll box's place; the role names it */}
      <div className="ag-sample__scroll" tabIndex={0} role="region" aria-label={`${title}, code`}>
        <pre>{text}</pre>
      </div>
    </figure>
  );
}

export function Agents() {
  const layout = useLayout();
  const { price, receipts } = useAgentsData();
  const clock = useMemo(() => makeClock("UTC"), []);

  if (layout === null) return <div className="agents" />;

  const phone = layout === "phone";
  const quote = priceOf(price ?? null);
  const reading = price === undefined;
  const paid = receipts ? paymentsOf(receipts.payments, clock).filter((row) => row.settled) : null;

  return (
    <div className="agents" data-layout={layout}>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <SiteHeader active="agents" layout={layout} />

      <main id="main" className="ag-top">
        <div className="ag-top__left">
          <h1 className="ag-title">Agents</h1>
          <p className="ag-lead">
            {reading ? "Grudges aren't free." : `${quote.headline} Grudges aren't free.`}
          </p>
        </div>
        <div className="ag-price">
          <span className="ag-price__label">Price now · {CATEGORY} line</span>
          <div className="ag-price__row">
            <span className="ag-price__n wide" data-range={!reading && price === null}>
              {reading ? "–" : quote.amount}
            </span>
            <span className="ag-price__unit wide">USDC</span>
          </div>
          <span className="ag-price__note">
            {reading ? "Reading the price." : `${quote.atomic} · paid on Sui · no SUI needed`}
          </span>
        </div>
      </main>

      <section aria-label="How an agent pays" className="ag-steps">
        <ol>
          {STEPS.map((step, index) => (
            <li key={step}>
              <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="var(--cobalt)"
                  stroke="var(--white)"
                  strokeWidth="1.5"
                />
                <path d={piePath(24, 22, (index + 1) / STEPS.length)} fill="var(--white)" />
              </svg>
              <div className="ag-step__text">
                <span className="ag-step__n narrow">{String(index + 1).padStart(2, "0")}</span>
                <span className="ag-step__title">{step}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Request and response" className="ag-samples">
        {samplesOf(price ?? null).map((sample) => (
          <Sample key={sample.title} {...sample} />
        ))}
      </section>

      <section aria-label="Paid calls" className="ag-paid">
        <div className="ag-paid__head">
          <h2>Paid calls so far</h2>
          <span className="wide">{paid ? paid.length : "–"}</span>
        </div>
        {paid && paid.length === 0 ? (
          <div className="ag-empty">
            <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="var(--white)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <path d="M24,32H40" stroke="var(--white)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div>
              <span className="ag-empty__title">No paid calls yet.</span>
              <span className="ag-empty__note">
                The first agent to pay shows up here with its Sui receipt.
              </span>
            </div>
          </div>
        ) : null}
        {paid && paid.length > 0 && !phone ? (
          <div className="ag-table on-chart">
            <table>
              <thead>
                <tr>
                  <th scope="col">Settled</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Line</th>
                  <th scope="col">Payer</th>
                  <th scope="col">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {paid.map((row) => (
                  <tr key={row.digest}>
                    <td className="narrow">{row.at}</td>
                    <td className="narrow">{row.amount}</td>
                    <td>{row.category}</td>
                    <td className="narrow ag-table__payer">{row.payer}</td>
                    <td>
                      <a href={row.url} target="_blank" rel="noopener">
                        Paid. Settled on Sui. Receipt ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {paid && paid.length > 0 && phone ? (
          <div className="ag-table on-chart">
            {paid.map((row) => (
              <div key={row.digest} className="ag-card">
                <div className="ag-card__top">
                  <span className="ag-card__amount wide">{row.amount}</span>
                  <span className="narrow">{row.at}</span>
                </div>
                <span className="ag-card__meta">
                  {row.category} line · payer <span className="narrow">{row.payer}</span>
                </span>
                <a href={row.url} target="_blank" rel="noopener">
                  Paid. Settled on Sui. Receipt ↗
                </a>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <footer className="ag-foot">
        <Link href="/receipts">Every grudge is a Walrus blob. Receipts ↗</Link>
      </footer>
    </div>
  );
}

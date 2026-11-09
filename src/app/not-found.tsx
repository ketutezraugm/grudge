"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLayout } from "./board/breakpoint";
import { totalsOf } from "./receipts/model";
import { receiptsResponse } from "./receipts/schema";
import { SiteHeader } from "./site-header";
import "./not-found.css";

/** The blob count in the line below the headline; the line reads fine without it while it loads. */
function useBlobCount(): number | null {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/receipts", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        const parsed = receiptsResponse.safeParse(json);
        if (live && parsed.success) setCount(totalsOf(parsed.data.memories.totals).all);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return count;
}

export default function NotFound() {
  const layout = useLayout();
  const path = usePathname();
  const blobs = useBlobCount();

  if (layout === null) return <div className="lost" />;

  return (
    <div className="lost" data-layout={layout}>
      <SiteHeader active={undefined} layout={layout} />
      <main id="main" className="lost__main">
        <div className="lost__mark">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            role="img"
            aria-label="An empty station mark: no record"
          >
            <circle
              cx="60"
              cy="60"
              r="57"
              fill="none"
              stroke="var(--white)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>
          <span className="lost__code wide">404</span>
        </div>
        <div className="lost__text">
          <h1>Grudge doesn&apos;t remember this page. Unusual.</h1>
          <span className="lost__note">
            No record of <span className="narrow lost__path">{path}</span>
            {blobs === null ? "." : ` in ${blobs} blobs.`}
          </span>
        </div>
        <div className="lost__links">
          <Link href="/" className="lost__home">
            Back to the Board
          </Link>
          <Link href="/receipts">Receipts</Link>
          <Link href="/agents">Agents</Link>
        </div>
        <div className="lost__chart" aria-hidden="true">
          {[12, 31, 50, 69, 88].map((top) => (
            <span key={top} className="lost__rule" style={{ top: `${top}%` }} />
          ))}
          <svg width="12" height="12" viewBox="0 0 12 12" className="lost__dot" aria-hidden="true">
            <circle
              cx="6"
              cy="6"
              r="4.75"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          </svg>
        </div>
      </main>
    </div>
  );
}

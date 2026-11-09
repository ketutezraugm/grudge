import Link from "next/link";
import type { ReactNode } from "react";
import type { Layout } from "./board/breakpoint";
import "./site-header.css";

export type Page = "board" | "receipts" | "agents";

const PAGES: { id: Page; href: string; label: string }[] = [
  { id: "board", href: "/", label: "Board" },
  { id: "receipts", href: "/receipts", label: "Receipts" },
  { id: "agents", href: "/agents", label: "Agents" },
];

function Brand() {
  return (
    <Link href="/" aria-label="Grudge, home" className="brand">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <circle cx="10" cy="16" r="7" fill="none" stroke="var(--white)" strokeWidth="1.5" />
        <path d="M10,9A7,7 0 0,0 10,23Z" fill="var(--white)" />
        <path
          d="M15,11L23,3M23,3L19.5,1M20,6L16.5,4"
          fill="none"
          stroke="var(--white)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="brand__name wide">Grudge</span>
    </Link>
  );
}

function Nav({ active }: { active: Page | undefined }) {
  return (
    <nav className="nav">
      {PAGES.map(({ id, href, label }) => (
        <Link key={id} href={href} aria-current={id === active ? "page" : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * The header every page shares. `active` is the page the visitor is on (none on the 404).
 * `middle` sits between the nav and the status; the Board puts its category tabs there.
 */
export function SiteHeader({
  active,
  layout,
  middle,
  status,
}: {
  active?: Page | undefined;
  layout: Layout;
  middle?: ReactNode;
  status?: ReactNode;
}) {
  const judges = (extra = "") => (
    <Link href="/receipts" className={`bar__judges${extra}`}>
      Judges: start here
    </Link>
  );

  if (layout === "desk") {
    return (
      <header className="bar" data-layout={layout}>
        <Brand />
        <Nav active={active} />
        <div className="bar__fill" />
        {middle}
        {status}
        {judges()}
      </header>
    );
  }
  return (
    <header className="bar bar--compact" data-layout={layout}>
      <div className="bar__top">
        <Brand />
        <div className="bar__fill" />
        <Nav active={active} />
      </div>
      <div className="bar__bottom">
        {middle}
        {status}
        {judges(" bar__judges--end")}
      </div>
    </header>
  );
}

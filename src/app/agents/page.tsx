import type { Metadata } from "next";
import { Agents } from "./agents";
import "./agents.css";

export const metadata: Metadata = {
  title: "Agents · Grudge",
  description:
    "Grudge sells its line to agents over x402: ask, get a price, pay in USDC on Sui, get the line.",
};

export default function AgentsPage() {
  return <Agents />;
}

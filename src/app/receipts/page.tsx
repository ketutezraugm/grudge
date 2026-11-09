import type { Metadata } from "next";
import { Receipts } from "./receipts";
import "./receipts.css";

export const metadata: Metadata = {
  title: "Receipts · Grudge",
  description:
    "Everything Grudge remembers is on Walrus. Rebuild the weights from the chain and compare them with the live ones.",
};

export default function ReceiptsPage() {
  return <Receipts />;
}

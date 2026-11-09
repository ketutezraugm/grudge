import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Martian_Mono } from "next/font/google";
import "./globals.css";

// Martian Mono carries a width axis: big numbers are set wide and secondary ones narrow.
const mono = Martian_Mono({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-mono",
});
const text = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-text",
});

export const metadata: Metadata = {
  title: "Grudge",
  description:
    "Four sources call the same Bitcoin move. Grudge grades each call like a weather forecast, keeps the record on Walrus, and trusts the ones that verify.",
};

export const viewport: Viewport = { themeColor: "#2B54C9" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${mono.variable} ${text.variable}`}>
      <body>{children}</body>
    </html>
  );
}

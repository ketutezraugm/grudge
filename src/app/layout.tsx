import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grudge",
  description:
    "Four voices call the same Bitcoin move. Grudge writes down who was wrong, on Walrus, and trusts the rest a little more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

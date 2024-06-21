import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BTC Guessing Game",
  description:
    "A web app that allows users to make guesses on whether the market price of Bitcoin (BTC/USD) will be higher or lower after one minute.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

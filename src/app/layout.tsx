import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cartae — UK Trading Card Marketplace",
  description:
    "Buy and sell trading cards in GBP. Zero seller fees, AI-powered listings, and built-in buyer protection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/qln4coi.css" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

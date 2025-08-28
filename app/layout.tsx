import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin-ext"],
  weight: ["900"],
});

export const metadata: Metadata = {
  title: "Counter X",
  description: "A simple counter application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${playfairDisplay.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

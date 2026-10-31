import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import ReactGrabLoader from "@/components/react-grab-loader";
import "./globals.css";

const geist = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-geist",
  weight: "100 900",
});

const interTight = localFont({
  src: "./fonts/inter-tight-latin.woff2",
  variable: "--font-display",
  weight: "400 700",
});

const newsreader = localFont({
  src: "./fonts/newsreader-latin.woff2",
  variable: "--font-serif",
  weight: "400 600",
});

export const metadata: Metadata = {
  title: "Umoja Baraza · Meet, decide, and act together",
  description:
    "A shared place for community meetings, volunteer sign-ups, attendance, and the hours people give.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${interTight.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <ReactGrabLoader />
      </body>
    </html>
  );
}

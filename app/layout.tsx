import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Schibsted_Grotesk } from "next/font/google";

const ui = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-ui" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waypoint · AI agents you can steer, step by step",
  description:
    "Waypoint turns a task into an editable plan, runs it step by step with live web research, and lets you pause, edit, or re-run any step while it works.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ui.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

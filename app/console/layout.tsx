import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Console · Waypoint",
};

export default function ConsoleLayout({ children }: LayoutProps<"/console">) {
  return children;
}

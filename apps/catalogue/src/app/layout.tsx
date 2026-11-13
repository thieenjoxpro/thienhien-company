import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./fonts.css";
import "./globals.css";
import { site } from "@/lib/site.config";

export const metadata: Metadata = {
  title: site.name,
  description: `Catalogue pano, bản lề, tôn và mâm cầu thang của xưởng ${site.name}.`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-ground font-sans text-body text-ink">{children}</body>
    </html>
  );
}

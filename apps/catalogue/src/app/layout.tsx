import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thiện Hiền",
  description: "Catalogue pano, bản lề, tôn và mâm cầu thang của xưởng Thiện Hiền.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-ground font-sans text-body text-ink">{children}</body>
    </html>
  );
}

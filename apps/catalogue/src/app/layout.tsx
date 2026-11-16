import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { site } from "@/lib/site.config";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: `Catalogue pano, bản lề, tôn và mâm cầu thang của xưởng ${site.name}.`,
};

// Khung site nằm ở (site)/layout.tsx; /admin có khung riêng
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={fontVariables}>
      <body className="bg-ground font-sans text-body text-ink">{children}</body>
    </html>
  );
}

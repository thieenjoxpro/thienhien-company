import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./fonts.css";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PhoneBar } from "@/components/layout/PhoneBar";
import { site } from "@/lib/site.config";

export const metadata: Metadata = {
  title: site.name,
  description: `Catalogue pano, bản lề, tôn và mâm cầu thang của xưởng ${site.name}.`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-ground font-sans text-body text-ink">
        <a href="#noi-dung" className="sr-only focus:not-sr-only focus:block focus:px-4 focus:py-3">
          Tới nội dung chính
        </a>
        <Header />
        <main id="noi-dung">{children}</main>
        <Footer />
        <PhoneBar />
      </body>
    </html>
  );
}

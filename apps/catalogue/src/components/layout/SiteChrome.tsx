import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { businessLd } from "@/lib/seo";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PhoneBar } from "./PhoneBar";

/** Khung của mọi trang công khai: link bỏ qua, header, nội dung, footer, thanh điện thoại, JSON-LD xưởng. */
export function SiteChrome({ children }: { children: ReactNode }) {
  const business = businessLd();
  return (
    <>
      <a href="#noi-dung" className="sr-only focus:not-sr-only focus:block focus:px-4 focus:py-3">
        Tới nội dung chính
      </a>
      <Header />
      <main id="noi-dung">{children}</main>
      <Footer />
      <PhoneBar />
      {business ? <JsonLd data={business} /> : null}
    </>
  );
}

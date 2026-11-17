import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { QuoteDialogHost } from "@/components/quote/QuoteDialogHost";
import { telLink, zaloLink } from "@/lib/contact";
import { businessLd } from "@/lib/seo";
import { site } from "@/lib/site.config";
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
      <PhoneBar phone={site.phone} zaloWholesale={site.zaloWholesale} />
      <QuoteDialogHost contact={{ zalo: zaloLink(site.zaloWholesale), tel: telLink(site.phone), phone: site.phone }} />
      {business ? <JsonLd data={business} /> : null}
    </>
  );
}

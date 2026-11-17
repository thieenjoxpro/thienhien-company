import type { Metadata } from "next";
import { QuotePanel } from "@/components/quote/QuotePanel";
import { PageTitle } from "@/components/ui/PageTitle";
import { Section } from "@/components/ui/Section";
import { telLink, zaloLink } from "@/lib/contact";
import { getQuoteProducts } from "@/lib/quote-products";
import { site } from "@/lib/site.config";

export const metadata: Metadata = {
  title: "Danh sách hỏi giá",
  robots: { index: false, follow: true },
};

// Trang của danh sách hỏi giá: cùng nội dung với popup, cho lúc mở bằng link hoặc JS chưa chạy.
export default async function QuotePage() {
  return (
    <Section>
      <PageTitle>Danh sách hỏi giá</PageTitle>
      <div className="max-w-3xl">
        <QuotePanel products={await getQuoteProducts()} contact={{ zalo: zaloLink(site.zaloWholesale), tel: telLink(site.phone), phone: site.phone }} />
      </div>
    </Section>
  );
}

import type { Metadata } from "next";
import { QuoteList } from "@/components/quote/QuoteList";
import { Section } from "@/components/ui/Section";
import { getProducts } from "@/lib/catalog";
import { zaloLink } from "@/lib/contact";
import { site } from "@/lib/site.config";

export const metadata: Metadata = {
  title: "Danh sách hỏi giá",
  robots: { index: false, follow: true },
};

// Danh sách hỏi giá (mục 5.5). Mua lẻ dùng số Zalo lẻ, chưa có thì dùng chung số sỉ.
export default async function QuotePage() {
  const products = (await getProducts()).map(({ sku, slug, name, images, mainSpec, priceFrom, unit }) => ({
    sku,
    slug,
    name,
    images: images.slice(0, 1),
    mainSpec,
    priceFrom,
    unit,
  }));
  const wholesale = zaloLink(site.zaloWholesale);
  const retail = zaloLink(site.zaloRetail) ?? wholesale;
  return (
    <Section>
      <h1 className="mb-8 text-h2 lg:mb-12">Danh sách hỏi giá</h1>
      <QuoteList products={products} zalo={wholesale && retail ? { wholesale, retail } : null} />
    </Section>
  );
}

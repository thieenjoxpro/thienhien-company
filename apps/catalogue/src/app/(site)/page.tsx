import type { Metadata } from "next";
import { CategoryGrid } from "@/components/catalogue/CategoryGrid";
import { Hero } from "@/components/home/Hero";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { QuoteSteps } from "@/components/home/QuoteSteps";
import { VisitWorkshop } from "@/components/home/VisitWorkshop";
import { PageSlide } from "@/components/layout/PageSlide";
import { getCategoryTree, getProducts, getProductsByCategory } from "@/lib/catalog";
import { site } from "@/lib/site.config";

// Hàm chứ không phải hằng: ở chế độ máy chủ quận sửa được trong /admin, hằng sẽ giữ giá trị lúc nạp module
export const generateMetadata = (): Metadata => ({
  title: { absolute: `Pano, bản lề, tôn, mâm cầu thang giá sỉ${site.district ? ` ở ${site.district}` : ""} | ${site.name}` },
  alternates: { canonical: "/" },
});

// Trang chủ design V2: hero, nhóm hàng, mẫu theo tab nhóm, 3 bước hỏi giá, ghé xưởng.
export default async function HomePage() {
  const [products, tree] = await Promise.all([getProducts(), getCategoryTree()]);
  const groups = await Promise.all(tree.map(async (group) => ({ slug: group.slug, name: group.name, products: await getProductsByCategory(group.slug) })));
  return (
    <PageSlide>
      <Hero productCount={products.length} />
      <CategoryGrid />
      <ProductShowcase groups={groups} />
      <QuoteSteps />
      <VisitWorkshop />
    </PageSlide>
  );
}

import type { Metadata } from "next";
import { CategoryGrid } from "@/components/catalogue/CategoryGrid";
import { HelpBox } from "@/components/catalogue/HelpBox";
import { Hero } from "@/components/home/Hero";
import { ProductShelf } from "@/components/home/ProductShelf";
import { QuoteSteps } from "@/components/home/QuoteSteps";
import { VisitWorkshop } from "@/components/home/VisitWorkshop";
import { getCategoryTree, getFeaturedProducts, getNewProducts, getProducts, getProductsByCategory } from "@/lib/catalog";
import { site } from "@/lib/site.config";

export const metadata: Metadata = {
  title: { absolute: `Pano, bản lề, tôn, mâm cầu thang giá sỉ${site.district ? ` ở ${site.district}` : ""} | ${site.name}` },
  alternates: { canonical: "/" },
};

const SHELF_SIZE = 6;

// Trang chủ design 3: hero, 3 bước hỏi giá, danh mục, kệ hàng mới và kệ từng nhóm, ghé xưởng.
export default async function HomePage() {
  const [products, featured, fresh, groups] = await Promise.all([getProducts(), getFeaturedProducts(2), getNewProducts(SHELF_SIZE), getCategoryTree()]);
  const shelves = await Promise.all(
    groups.map(async (group) => ({ group, items: await getProductsByCategory(group.slug) })),
  );
  const lastShelf = shelves.findLast((shelf) => shelf.items.length > 0)?.group.slug;
  const shelfList = [
    { id: "moi", title: "Hàng mới về", products: fresh, more: { href: "/san-pham?sx=moi", label: "Xem tất cả hàng mới" }, subs: [], extra: null },
    ...shelves.map(({ group, items }) => ({
      id: group.slug,
      title: group.name,
      products: items.slice(0, SHELF_SIZE - (group.slug === lastShelf ? 1 : 0)),
      more: { href: `/danh-muc/${group.slug}`, label: `Xem tất cả ${items.length} mẫu` },
      subs: group.children,
      extra: group.slug === lastShelf ? <HelpBox tone="dashed" /> : null,
    })),
  ];

  return (
    <>
      <Hero productCount={products.length} showcase={featured.length ? featured : products.slice(0, 2)} spotlight={fresh[0] ?? null} />
      <QuoteSteps />
      <CategoryGrid />
      {shelfList.map((shelf) => (
        <ProductShelf key={shelf.id} {...shelf} />
      ))}
      <VisitWorkshop />
    </>
  );
}

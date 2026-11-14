import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/catalog";
import { getPolicies } from "@/lib/policies";
import { absolute } from "@/lib/seo";

// Mọi trang tĩnh công khai (mục 6); không gồm /hoi-gia (của riêng từng khách) và /dev/ui.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, policies] = await Promise.all([getProducts(), getCategories(), getPolicies()]);
  const latest = products.map((p) => p.updatedAt).toSorted().at(-1);
  const newestIn = (slug: string) =>
    products
      .filter((p) => p.categorySlug === slug || categories.find((c) => c.slug === p.categorySlug)?.parentSlug === slug)
      .map((p) => p.updatedAt)
      .toSorted()
      .at(-1);
  return [
    { url: absolute("/"), lastModified: latest },
    { url: absolute("/san-pham"), lastModified: latest },
    { url: absolute("/gioi-thieu") },
    { url: absolute("/lien-he") },
    ...categories.map((c) => ({ url: absolute(`/danh-muc/${c.slug}`), lastModified: newestIn(c.slug) })),
    ...products.map((p) => ({ url: absolute(`/san-pham/${p.slug}`), lastModified: p.updatedAt })),
    ...policies.map((p) => ({ url: absolute(`/chinh-sach/${p.slug}`), lastModified: p.updatedAt })),
  ];
}

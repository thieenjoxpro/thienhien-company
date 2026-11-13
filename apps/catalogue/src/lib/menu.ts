import { getCategoryTree, getProductsByCategory } from "@/lib/catalog";
import type { Product } from "@/lib/schema";

interface MenuProduct {
  slug: string;
  sku: string;
  name: string;
  image: { src: string; alt: string };
  priceFrom: number | null;
  unit: string;
}

export interface MenuGroup {
  slug: string;
  name: string;
  count: number;
  children: { slug: string; name: string }[];
  products: MenuProduct[];
}

const featuredThenNewest = (a: Product, b: Product) =>
  Number(b.isFeatured) - Number(a.isFeatured) || b.updatedAt.localeCompare(a.updatedAt);

/** Nhóm hàng cấp 1 cho header, menu điện thoại và footer: danh mục con + 3 mẫu tiêu biểu có ảnh. */
export async function getMenuGroups(): Promise<MenuGroup[]> {
  const tree = await getCategoryTree();
  return Promise.all(
    tree.map(async (node) => {
      const products = await getProductsByCategory(node.slug);
      return {
        slug: node.slug,
        name: node.name,
        count: products.length,
        children: node.children.map((child) => ({ slug: child.slug, name: child.name })),
        products: products
          .toSorted(featuredThenNewest)
          .slice(0, 3)
          .flatMap(({ slug, sku, name, images: [image], priceFrom, unit }) =>
            image ? [{ slug, sku, name, image, priceFrom, unit }] : [],
          ),
      };
    }),
  );
}

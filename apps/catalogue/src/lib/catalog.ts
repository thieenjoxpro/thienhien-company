// Lớp truy cập dữ liệu (docs/PLAN.md mục 4.2). Mọi trang chỉ gọi các hàm ở đây, không import JSON.
// Sang v2 chỉ thay phần thân bằng fetch tới API; chữ ký giữ nguyên (đều trả Promise).
import { z } from "zod";
import categoriesJson from "@/data/categories.json";
import productsJson from "@/data/products.json";
import { CategorySchema, ProductSchema, type Category, type Product } from "./schema";
import { liveData } from "./server/mode";

export type CategoryNode = Category & { children: CategoryNode[] };

const byOrder = (a: Category, b: Category) => a.order - b.order || a.name.localeCompare(b.name, "vi");
const newestFirst = (a: Product, b: Product) => b.updatedAt.localeCompare(a.updatedAt) || a.sku.localeCompare(b.sku);

/** Dựng catalogue từ dữ liệu thô. Dữ liệu sai schema thì ném lỗi ngay khi build. */
export function createCatalog(source: { categories: unknown; products: unknown }) {
  const allCategories = z.array(CategorySchema).parse(source.categories).toSorted(byOrder);
  // Sản phẩm chưa có ảnh không lên trang (mục 4.3)
  const products = z
    .array(ProductSchema)
    .parse(source.products)
    .filter((p) => p.images.length > 0);

  const parentOf = new Map(allCategories.map((c) => [c.slug, c.parentSlug]));
  const descendantsOf = (slug: string): string[] => [
    slug,
    ...allCategories.filter((c) => c.parentSlug === slug).flatMap((c) => descendantsOf(c.slug)),
  ];
  const topOf = (slug: string): string => {
    const parent = parentOf.get(slug);
    return parent ? topOf(parent) : slug;
  };
  const inCategory = (slug: string, includeChildren: boolean) => {
    const slugs = new Set(includeChildren ? descendantsOf(slug) : [slug]);
    return products.filter((p) => slugs.has(p.categorySlug));
  };

  // Số mẫu tính cả danh mục con; danh mục không còn sản phẩm nào thì không hiện
  const counts = new Map(allCategories.map((c) => [c.slug, inCategory(c.slug, true).length]));
  const categories = allCategories.filter((c) => (counts.get(c.slug) ?? 0) > 0);

  const buildTree = (parent: string | null): CategoryNode[] =>
    categories.filter((c) => c.parentSlug === parent).map((c) => ({ ...c, children: buildTree(c.slug) }));

  return {
    getCategories: async (): Promise<Category[]> => categories,
    getCategoryTree: async (): Promise<CategoryNode[]> => buildTree(null),
    getCategory: async (slug: string): Promise<Category | null> => categories.find((c) => c.slug === slug) ?? null,
    getProducts: async (): Promise<Product[]> => products,
    getProduct: async (slug: string): Promise<Product | null> => products.find((p) => p.slug === slug) ?? null,
    getProductsByCategory: async (slug: string, { includeChildren = true } = {}): Promise<Product[]> =>
      inCategory(slug, includeChildren),
    /** Cùng nhóm hàng cấp 1, khác mã; mẫu cùng danh mục đứng trước, mới trước cũ. */
    getRelatedProducts: async (product: Product, limit = 4): Promise<Product[]> => {
      const group = topOf(product.categorySlug);
      const sameCategory = (p: Product) => Number(p.categorySlug === product.categorySlug);
      return products
        .filter((p) => p.sku !== product.sku && topOf(p.categorySlug) === group)
        .toSorted(newestFirst)
        .toSorted((a, b) => sameCategory(b) - sameCategory(a))
        .slice(0, limit);
    },
    getFeaturedProducts: async (limit = 8): Promise<Product[]> =>
      products.filter((p) => p.isFeatured).toSorted(newestFirst).slice(0, limit),
    getNewProducts: async (limit = 8): Promise<Product[]> =>
      products.filter((p) => p.isNew).toSorted(newestFirst).slice(0, limit),
    countByCategory: async (): Promise<Record<string, number>> =>
      Object.fromEntries(categories.map((c) => [c.slug, counts.get(c.slug) ?? 0])),
  };
}

type Catalog = ReturnType<typeof createCatalog>;

const bundled = createCatalog({ categories: categoriesJson, products: productsJson });

/** Chế độ máy chủ đọc bản trong bộ nhớ nạp từ database (src/lib/server/store.ts); còn lại là JSON đi kèm bản build. */
async function current(): Promise<Catalog> {
  if (!liveData()) return bundled;
  return (await (await import("./server/store")).ensureStore()).catalog;
}

const via =
  <K extends keyof Catalog>(name: K) =>
  async (...args: Parameters<Catalog[K]>): Promise<Awaited<ReturnType<Catalog[K]>>> =>
    (await ((await current())[name] as (...a: unknown[]) => unknown)(...args)) as Awaited<ReturnType<Catalog[K]>>;

export const getCategories = via("getCategories");
export const getCategoryTree = via("getCategoryTree");
export const getCategory = via("getCategory");
export const getProducts = via("getProducts");
export const getProduct = via("getProduct");
export const getProductsByCategory = via("getProductsByCategory");
export const getRelatedProducts = via("getRelatedProducts");
export const getFeaturedProducts = via("getFeaturedProducts");
export const getNewProducts = via("getNewProducts");
export const countByCategory = via("countByCategory");

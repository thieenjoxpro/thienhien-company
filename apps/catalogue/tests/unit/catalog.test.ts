import { describe, expect, it } from "vitest";
import * as realCatalog from "../../src/lib/catalog";
import { createCatalog } from "../../src/lib/catalog";
import fixtureCategories from "../fixtures/categories.json";
import fixtureProducts from "../fixtures/products.json";

const catalog = createCatalog({ categories: fixtureCategories, products: fixtureProducts });
const skus = (list: { sku: string }[]) => list.map((p) => p.sku);

describe("catalog trên fixture (24 mẫu, 2 mẫu chưa có ảnh)", () => {
  it("loại sản phẩm chưa có ảnh", async () => {
    const products = await catalog.getProducts();
    expect(products).toHaveLength(22);
    expect(skus(products)).not.toContain("TH-TN05");
    expect(skus(products)).not.toContain("TH-MC05");
    expect(await catalog.getProduct("ton-chan-mang-xoi")).toBeNull();
  });

  it("getProductsByCategory gồm cả danh mục con", async () => {
    expect(await catalog.getProductsByCategory("ban-le")).toHaveLength(8);
    expect(await catalog.getProductsByCategory("ban-le", { includeChildren: false })).toHaveLength(0);
    expect(skus(await catalog.getProductsByCategory("ban-le-coi"))).toEqual(["TH-BL01", "TH-BL02", "TH-BL03", "TH-BL04"]);
    expect(await catalog.getProductsByCategory("khong-co")).toEqual([]);
  });

  it("countByCategory đếm cả danh mục con, chỉ sản phẩm có ảnh", async () => {
    expect(await catalog.countByCategory()).toEqual({
      pano: 6,
      "ban-le": 8,
      ton: 4,
      "mam-cau-thang": 4,
      "ban-le-coi": 4,
      "ban-le-la": 4,
    });
  });

  it("getCategoryTree xếp theo order, lồng danh mục con", async () => {
    const tree = await catalog.getCategoryTree();
    expect(tree.map((c) => c.slug)).toEqual(["pano", "ban-le", "ton", "mam-cau-thang"]);
    expect(tree[1]?.children.map((c) => c.slug)).toEqual(["ban-le-coi", "ban-le-la"]);
    expect(tree[0]?.children).toEqual([]);
  });

  it("getProduct và getCategory theo slug, không có thì null", async () => {
    expect((await catalog.getProduct("ban-le-coi-16-ly"))?.sku).toBe("TH-BL03");
    expect((await catalog.getCategory("ban-le-la"))?.name).toBe("Bản lề lá");
    expect(await catalog.getCategory("khong-co")).toBeNull();
  });

  it("getRelatedProducts: cùng nhóm, khác mã, cùng danh mục đứng trước, tối đa 4", async () => {
    const bl03 = await catalog.getProduct("ban-le-coi-16-ly");
    if (!bl03) throw new Error("thiếu TH-BL03 trong fixture");
    const related = await catalog.getRelatedProducts(bl03);
    expect(related).toHaveLength(4);
    expect(skus(related)).not.toContain("TH-BL03");
    expect(related.every((p) => p.categorySlug.startsWith("ban-le"))).toBe(true);
    expect(related.slice(0, 3).every((p) => p.categorySlug === "ban-le-coi")).toBe(true);
    expect(await catalog.getRelatedProducts(bl03, 2)).toHaveLength(2);
  });

  it("getNewProducts và getFeaturedProducts: mới trước, có giới hạn", async () => {
    const fresh = await catalog.getNewProducts();
    expect(fresh.every((p) => p.isNew)).toBe(true);
    const dates = fresh.map((p) => p.updatedAt);
    expect(dates).toEqual(dates.toSorted().reverse());
    expect(fresh.length).toBeGreaterThanOrEqual(4); // khối "Mẫu mới về" cần ít nhất 4 (mục 5.2)
    expect(await catalog.getNewProducts(2)).toHaveLength(2);
    expect((await catalog.getFeaturedProducts()).every((p) => p.isFeatured)).toBe(true);
  });
});

describe("catalog ẩn danh mục không còn sản phẩm có ảnh", () => {
  it("danh mục chỉ có sản phẩm chưa ảnh thì không hiện, cả trong cây và bộ đếm", async () => {
    const withoutPhotos = fixtureProducts.map((p) => (p.categorySlug === "ban-le-la" ? { ...p, images: [] } : p));
    const partial = createCatalog({ categories: fixtureCategories, products: withoutPhotos });
    expect(await partial.getCategory("ban-le-la")).toBeNull();
    expect((await partial.getCategoryTree())[1]?.children.map((c) => c.slug)).toEqual(["ban-le-coi"]);
    expect(await partial.countByCategory()).not.toHaveProperty("ban-le-la");
  });

  it("dữ liệu sai schema thì ném lỗi khi dựng catalogue", () => {
    expect(() => createCatalog({ categories: fixtureCategories, products: [{ sku: "sai" }] })).toThrow();
  });
});

describe("catalog trên dữ liệu thật (src/data)", () => {
  it("chưa có hàng thật: không sản phẩm, không danh mục nào lộ ra trang", async () => {
    const sample = (await catalog.getProducts())[0];
    if (!sample) throw new Error("fixture rỗng");
    expect(await realCatalog.getProducts()).toEqual([]);
    expect(await realCatalog.getCategories()).toEqual([]);
    expect(await realCatalog.getCategoryTree()).toEqual([]);
    expect(await realCatalog.getCategory("pano")).toBeNull(); // có trong categories.json nhưng chưa có hàng
    expect(await realCatalog.getProduct(sample.slug)).toBeNull();
    expect(await realCatalog.getProductsByCategory("pano")).toEqual([]);
    expect(await realCatalog.getRelatedProducts(sample)).toEqual([]);
    expect(await realCatalog.getFeaturedProducts()).toEqual([]);
    expect(await realCatalog.getNewProducts()).toEqual([]);
    expect(await realCatalog.countByCategory()).toEqual({});
  });
});

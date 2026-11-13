import { describe, expect, it } from "vitest";
import { CategorySchema, ProductSchema } from "../../src/lib/schema";
import fixtureProducts from "../fixtures/products.json";

const [valid] = fixtureProducts;
if (!valid) throw new Error("fixture rỗng");
const withChange = (change: Record<string, unknown>) => ({ ...valid, ...change });

describe("ProductSchema", () => {
  it("nhận mọi sản phẩm trong fixture", () => {
    for (const product of fixtureProducts) expect(ProductSchema.safeParse(product).success, product.sku).toBe(true);
  });

  it.each([
    ["mã không đúng dạng TH-XX00", { sku: "BL-03" }],
    ["mã viết thường", { sku: "TH-bl03" }],
    ["slug có dấu", { slug: "bản-lề" }],
    ["tên quá ngắn", { name: "Pa" }],
    ["summary dưới 20 ký tự", { summary: "Pano đẹp." }],
    ["dưới 2 hàng thông số", { specs: [{ label: "Kích thước", value: "400 × 600 mm" }] }],
    ["alt ảnh dưới 8 ký tự", { images: [{ src: "/products/TH-PN01-1.webp", alt: "Pano" }] }],
    ["quá 6 ảnh", { images: Array.from({ length: 7 }, (_, i) => ({ src: `/products/TH-PN01-${i}.webp`, alt: "Pano dập ô vuông" })) }],
    ["đơn vị lạ", { unit: "cuộn" }],
    ["giá âm", { priceFrom: -1000 }],
    ["giá có phần lẻ", { priceFrom: 18000.5 }],
    ["ngày không đúng ISO", { updatedAt: "12/11/2026" }],
  ])("từ chối: %s", (_, change) => {
    expect(ProductSchema.safeParse(withChange(change)).success).toBe(false);
  });

  it("isNew và isFeatured mặc định false", () => {
    const rest: Record<string, unknown> = { ...valid };
    delete rest.isNew;
    delete rest.isFeatured;
    const parsed = ProductSchema.parse(rest);
    expect(parsed.isNew).toBe(false);
    expect(parsed.isFeatured).toBe(false);
  });
});

describe("CategorySchema", () => {
  const category = { slug: "pano", name: "Pano", parentSlug: null, description: "Pano cửa sắt.", image: null, order: 1 };

  it("nhận danh mục hợp lệ", () => {
    expect(CategorySchema.safeParse(category).success).toBe(true);
  });

  it.each([
    ["slug có chữ hoa", { slug: "Pano" }],
    ["mô tả quá 160 ký tự", { description: "x".repeat(161) }],
    ["order không nguyên", { order: 1.5 }],
  ])("từ chối: %s", (_, change) => {
    expect(CategorySchema.safeParse({ ...category, ...change }).success).toBe(false);
  });
});

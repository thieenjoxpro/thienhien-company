import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Product } from "@/lib/schema";

const product: Product = {
  sku: "TH-BL03",
  slug: "ban-le-coi-16-ly",
  name: "Bản lề cối 16 ly",
  categorySlug: "ban-le",
  summary: "Bản lề cối đường kính 16 mm, dài 100 mm, thép CT3, bề mặt mộc.",
  images: [{ src: "/products/TH-BL03-1.webp", alt: "Bản lề cối 16 ly, thép mộc" }],
  specs: [
    { label: "Kích thước", value: "Ø16 × 100 mm" },
    { label: "Vật liệu", value: "Thép CT3" },
  ],
  mainSpec: "Ø16 × 100 mm",
  filters: {},
  unit: "cái",
  priceFrom: 18000,
  isNew: false,
  isFeatured: false,
  updatedAt: "2026-09-01",
};

async function renderCard(item: Product, showPrice = true) {
  vi.resetModules();
  vi.doMock("@/lib/site.config", () => ({ site: { showPrice } }));
  const { ProductCard } = await import("@/components/catalogue/ProductCard");
  return renderToStaticMarkup(createElement(ProductCard, { product: item, sizes: "50vw" }));
}

afterEach(() => {
  vi.doUnmock("@/lib/site.config");
});

describe("ProductCard", () => {
  it("hiện mã, tên, thông số chính và giá từ; cả thẻ là một link tới trang chi tiết", async () => {
    const html = await renderCard(product);
    expect(html).toMatch(/^<a [^>]*href="\/san-pham\/ban-le-coi-16-ly"/);
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain("TH-BL03");
    expect(html).toContain("Bản lề cối 16 ly</h3>");
    expect(html).toContain("Ø16 × 100 mm");
    expect(html).toContain("18.000 đ");
    expect(html).toContain("/ cái");
    expect(html).toContain('alt="Bản lề cối 16 ly, thép mộc"');
    expect(html).not.toContain("<button");
  });

  it('không có priceFrom thì hiện "Giá theo số lượng"', async () => {
    const html = await renderCard({ ...product, priceFrom: null });
    expect(html).toContain("Giá theo số lượng");
    expect(html).not.toContain(" đ<");
  });

  it('showPrice=false thì mọi thẻ hiện "Giá theo số lượng", kể cả mẫu có giá', async () => {
    const html = await renderCard(product, false);
    expect(html).toContain("Giá theo số lượng");
    expect(html).not.toContain("18.000");
  });

  it("sản phẩm chưa có ảnh thì không có thẻ", async () => {
    expect(await renderCard({ ...product, images: [] })).toBe("");
  });
});

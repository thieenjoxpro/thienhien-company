import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductCard } from "../../src/components/catalogue/ProductCard";
import { ProductSchema } from "../../src/lib/schema";
import fixtureProducts from "../fixtures/products.json";

const state = vi.hoisted(() => ({ showPrice: true }));

vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: ReactNode; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("@/lib/site.config", async (importOriginal) => {
  const { site } = await importOriginal<typeof import("../../src/lib/site.config")>();
  return {
    site: {
      ...site,
      get showPrice() {
        return state.showPrice;
      },
    },
  };
});

const bl03 = ProductSchema.parse(fixtureProducts.find((p) => p.sku === "TH-BL03"));
const render = (change: Partial<typeof bl03> = {}) => renderToStaticMarkup(<ProductCard product={{ ...bl03, ...change }} />);
const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

describe("ProductCard", () => {
  beforeEach(() => {
    state.showPrice = true;
  });

  it("cả thẻ là một link tới trang chi tiết, có mã, tên, thông số chính và giá từ", () => {
    const html = render();
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain('href="/san-pham/ban-le-coi-16-ly"');
    expect(text(html)).toBe("TH-BL03 Bản lề cối 16 ly Ø16 × 100 mm từ 18.000 đ / cái");
  });

  it('không có priceFrom thì hiện "Giá theo số lượng"', () => {
    expect(text(render({ priceFrom: null }))).toContain("Giá theo số lượng");
  });

  it('showPrice=false thì cũng hiện "Giá theo số lượng" dù có giá', () => {
    state.showPrice = false;
    const html = text(render());
    expect(html).toContain("Giá theo số lượng");
    expect(html).not.toContain("18.000");
  });

  it("không nút, không badge, chỉ một ảnh", () => {
    const html = render();
    expect(html).not.toContain("<button");
    expect(html.match(/<img /g)).toHaveLength(1);
  });

  it("sản phẩm chưa có ảnh thì không có thẻ", () => {
    expect(render({ images: [] })).toBe("");
  });
});

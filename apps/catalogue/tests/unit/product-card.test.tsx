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

  it("ảnh và tên dẫn tới trang chi tiết; có mã, tên, thông số chính, giá từ và nút thêm vào hỏi giá", () => {
    const html = render();
    expect(html.match(/href="\/san-pham\/ban-le-coi-16-ly"/g)).toHaveLength(2);
    expect(text(html)).toBe("Mới Mã TH-BL03 Bản lề cối 16 ly Ø16 × 100 mm từ 18.000đ /cái Thêm vào hỏi giá : Bản lề cối 16 ly");
  });

  it('không có priceFrom thì hiện "Liên hệ báo giá"', () => {
    expect(text(render({ priceFrom: null }))).toContain("Liên hệ báo giá");
  });

  it('tắt giá toàn site thì hiện "Liên hệ báo giá" dù có giá', () => {
    state.showPrice = false;
    const html = text(render());
    expect(html).toContain("Liên hệ báo giá");
    expect(html).not.toContain("18.000");
  });

  it('tắt giá riêng mẫu đó (showPrice của sản phẩm) thì hiện "Liên hệ báo giá"', () => {
    const html = text(render({ showPrice: false }));
    expect(html).toContain("Liên hệ báo giá");
    expect(html).not.toContain("18.000");
  });

  it("một ảnh, một nút; nhãn Mới chỉ khi isNew", () => {
    const html = render();
    expect(html.match(/<button/g)).toHaveLength(1);
    expect(html.match(/<img /g)).toHaveLength(1);
    expect(text(render({ isNew: false }))).not.toContain("Mới");
  });

  it("sản phẩm chưa có ảnh thì không có thẻ", () => {
    expect(render({ images: [] })).toBe("");
  });
});

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { CardProduct } from "./ProductCard";
import { ProductCard } from "./ProductCard";

const layouts = {
  /** Trang chủ, sản phẩm liên quan: 6 thẻ một hàng từ 1024px. */
  wide: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  /** Trang danh sách, cạnh cột lọc: 4 thẻ một hàng từ 1280px. */
  listing: "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
} as const;

/** Lưới thẻ sản phẩm, thẻ cùng hàng cao bằng nhau. `extra` là ô cuối (ví dụ hộp "Không thấy mẫu cần tìm?"). */
export function ProductGrid({ products, layout = "listing", extra }: { products: CardProduct[]; layout?: keyof typeof layouts; extra?: ReactNode }) {
  return (
    <ul className={cn("grid gap-3 lg:gap-4", layouts[layout])}>
      {products.map((product, index) => (
        // Kệ trang chủ trên điện thoại: 4 thẻ (2 hàng), đủ 6 từ 768px
        <li key={product.sku} className={layout === "wide" && index >= 4 ? "max-md:hidden" : undefined}>
          <ProductCard product={product} />
        </li>
      ))}
      {extra ? <li>{extra}</li> : null}
    </ul>
  );
}

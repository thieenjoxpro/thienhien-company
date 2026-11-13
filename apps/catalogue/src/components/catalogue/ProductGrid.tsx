import type { Product } from "@/lib/schema";
import { ProductCard } from "./ProductCard";

const layouts = {
  // Lưới catalogue: 2 cột trên điện thoại, 3 cột từ 768px, 4 cột từ 1280px
  catalogue: {
    grid: "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
    sizes: "(min-width: 1280px) 302px, (min-width: 768px) 33vw, 50vw",
  },
  // Một hàng 4 thẻ từ 1024px (khối trên trang chủ, cuối trang chi tiết); điện thoại 2×2
  row: {
    grid: "grid-cols-2 lg:grid-cols-4",
    sizes: "(min-width: 1024px) 302px, 50vw",
  },
} as const;

interface ProductGridProps {
  products: Product[];
  layout: keyof typeof layouts;
  heading?: "h2" | "h3";
}

/** Lưới thẻ sản phẩm; các thẻ cùng hàng cao bằng nhau. */
export function ProductGrid({ products, layout, heading }: ProductGridProps) {
  const { grid, sizes } = layouts[layout];
  return (
    <ul className={`grid gap-x-3 gap-y-8 md:gap-x-6 ${grid}`}>
      {products.map((product) => (
        <li key={product.sku}>
          <ProductCard product={product} heading={heading} sizes={sizes} />
        </li>
      ))}
    </ul>
  );
}

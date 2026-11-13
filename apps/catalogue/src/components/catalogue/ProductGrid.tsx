import type { Product } from "@/lib/schema";
import { ProductCard } from "./ProductCard";

/** Lưới sản phẩm: 2 cột trên điện thoại, 3 từ 768px, 4 từ 1280px; thẻ cùng hàng cao bằng nhau. */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.sku}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

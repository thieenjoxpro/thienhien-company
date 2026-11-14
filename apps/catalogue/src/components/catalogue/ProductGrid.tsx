import type { CardProduct } from "./ProductCard";
import { ProductCard } from "./ProductCard";

/**
 * Lưới sản phẩm của trang danh sách, nằm trong vùng 9 cột cạnh cột danh mục (mục 5.3):
 * 2 cột trên điện thoại, 3 cột từ 768px. Thẻ cùng hàng cao bằng nhau.
 */
export function ProductGrid({ products }: { products: CardProduct[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-6">
      {products.map((product) => (
        <li key={product.sku}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

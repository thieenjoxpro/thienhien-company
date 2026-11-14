import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import type { Product } from "@/lib/schema";
import { Price } from "./Price";

/** Đủ dữ liệu cho một thẻ; danh sách "Mẫu vừa xem" lưu đúng chừng này trong trình duyệt. */
export type CardProduct = Pick<Product, "sku" | "slug" | "name" | "images" | "mainSpec" | "priceFrom" | "unit">;

/**
 * Thẻ sản phẩm (design/components/ProductCard/README.md): ảnh vuông và bốn dòng chữ đặt thẳng
 * trên trang, không nền, không viền, không badge. Cả thẻ là một link. Sản phẩm chưa có ảnh thì không có thẻ.
 */
export function ProductCard({ product }: { product: CardProduct }) {
  const [image] = product.images;
  if (!image) return null;
  return (
    <Link href={`/san-pham/${product.slug}`} className="m-lift block h-full">
      <Photo
        src={image.src}
        alt={image.alt}
        ratio="1/1"
        sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
        className="m-zoom mb-4"
      />
      <p className="mb-1 font-mono text-sku text-ink-muted">{product.sku}</p>
      <h3 className="mb-1 line-clamp-2 text-title">{product.name}</h3>
      <p className="mb-1 font-mono text-spec">{product.mainSpec}</p>
      <Price priceFrom={product.priceFrom} unit={product.unit} />
    </Link>
  );
}

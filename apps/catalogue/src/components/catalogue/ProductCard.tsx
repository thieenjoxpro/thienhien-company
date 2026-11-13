import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import type { Product } from "@/lib/schema";
import { Price } from "./Price";

interface ProductCardProps {
  product: Product;
  /** Cấp tiêu đề của tên mẫu: h2 khi lưới nằm ngay dưới h1, h3 khi nằm trong một khối có h2. */
  heading?: "h2" | "h3";
  sizes: string;
}

/**
 * Thẻ sản phẩm (design/components/ProductCard/README.md): ảnh vuông và bốn dòng chữ đặt thẳng trên trang.
 * Cả thẻ là một link; không nút, không badge. Sản phẩm chưa có ảnh thì không có thẻ.
 */
export function ProductCard({ product, heading: Heading = "h3", sizes }: ProductCardProps) {
  const [image] = product.images;
  if (!image) return null;
  return (
    <Link href={`/san-pham/${product.slug}`} className="m-lift flex h-full flex-col">
      <Photo src={image.src} alt={image.alt} ratio="1/1" sizes={sizes} className="m-zoom" />
      <p className="mt-4 font-mono text-sku text-ink-muted">{product.sku}</p>
      <Heading className="mt-1 line-clamp-2 text-title">{product.name}</Heading>
      <p className="mt-1 font-mono text-spec">{product.mainSpec}</p>
      <div className="mt-1">
        <Price priceFrom={product.priceFrom} unit={product.unit} />
      </div>
    </Link>
  );
}

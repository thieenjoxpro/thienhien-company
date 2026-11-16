import Link from "next/link";
import { QuoteToggle } from "@/components/quote/QuoteToggle";
import { Photo } from "@/components/ui/Photo";
import type { Product } from "@/lib/schema";
import { Price } from "./Price";

/** Đủ dữ liệu cho một thẻ; danh sách "Mẫu vừa xem" lưu đúng chừng này trong trình duyệt. */
export type CardProduct = Pick<Product, "sku" | "slug" | "name" | "images" | "mainSpec" | "priceFrom" | "unit"> & { isNew?: boolean };

/**
 * Thẻ sản phẩm design 3: viền line bo 6px, hover viền ink. Ô ảnh vuông nền photo, nhãn "Mới",
 * mã, tên, thông số chính, giá, nút thêm vào hỏi giá. Sản phẩm chưa có ảnh thì không có thẻ.
 */
export function ProductCard({ product, sizes = "(min-width: 1280px) 200px, (min-width: 768px) 25vw, 50vw" }: { product: CardProduct; sizes?: string }) {
  const [image] = product.images;
  if (!image) return null;
  const href = `/san-pham/${product.slug}`;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-ground hover:border-ink">
      <Link href={href} tabIndex={-1} aria-hidden className="relative block">
        <Photo src={image.src} alt="" ratio="1/1" sizes={sizes} className="m-zoom" />
        {product.isNew ? <span className="absolute top-2 left-2 rounded-tag bg-accent px-2 py-1 text-tag font-bold text-on-accent">Mới</span> : null}
      </Link>
      <div className="flex grow flex-col gap-1 px-3 pt-3 pb-3 lg:px-4">
        <p className="text-tag font-medium text-ink-muted">Mã {product.sku}</p>
        <h3 className="text-base font-semibold">
          <Link href={href} className="block min-h-11 hover:text-link">
            {product.name}
          </Link>
        </h3>
        <p className="text-label text-ink-muted">{product.mainSpec}</p>
        <div className="mt-auto pt-2">
          <Price priceFrom={product.priceFrom} unit={product.unit} />
        </div>
        <QuoteToggle sku={product.sku} name={product.name} />
      </div>
    </article>
  );
}

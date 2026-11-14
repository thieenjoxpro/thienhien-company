import { AddToQuoteButton } from "@/components/quote/AddToQuoteButton";
import { zaloLink } from "@/lib/contact";
import type { Product } from "@/lib/schema";
import { site } from "@/lib/site.config";
import { Price } from "./Price";
import { SpecTable } from "./SpecTable";

/**
 * Cột thông tin trang chi tiết (mục 5.4), dính theo cuộn từ 1024px: mã, tên, mô tả, giá, bảng thông số,
 * ô số lượng và nút "Thêm vào hỏi giá", link hỏi riêng mã này qua Zalo.
 */
export function ProductInfo({ product }: { product: Product }) {
  const zalo = zaloLink(site.zaloWholesale);
  return (
    <div className="lg:stick-aside">
      <p className="mb-2 font-mono text-sku text-ink-muted">{product.sku}</p>
      <h1 className="mb-4 text-h2">{product.name}</h1>
      <p className="mb-4">{product.summary}</p>
      <div className="mb-6">
        <Price priceFrom={product.priceFrom} unit={product.unit} />
      </div>
      <SpecTable sku={product.sku} specs={product.specs} />
      <AddToQuoteButton sku={product.sku} unit={product.unit} />
      {zalo ? (
        <a href={zalo} target="_blank" rel="noopener noreferrer" className="mt-6 flex min-h-11 items-center underline underline-offset-4">
          Hỏi riêng mã {product.sku} qua Zalo
        </a>
      ) : null}
    </div>
  );
}

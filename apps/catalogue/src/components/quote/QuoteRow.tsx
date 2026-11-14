"use client";

import Link from "next/link";
import { type CardProduct } from "@/components/catalogue/ProductCard";
import { Input } from "@/components/ui/Input";
import { Photo } from "@/components/ui/Photo";
import { QTY_MAX, useQuoteStore } from "@/lib/quote-store";

/** Một hàng mở trong danh sách hỏi giá: ảnh 96px, mã, tên, thông số chính, ô số lượng, link bỏ mẫu. */
export function QuoteRow({ product, qty }: { product: CardProduct; qty: number }) {
  const setQty = useQuoteStore((state) => state.setQty);
  const remove = useQuoteStore((state) => state.remove);
  const [image] = product.images;
  return (
    <li className="flex gap-4 border-t border-line py-6 last:border-b">
      {image ? <Photo src={image.src} alt={image.alt} ratio="1/1" sizes="96px" className="size-24 shrink-0" /> : null}
      <div className="flex grow flex-col gap-1">
        <p className="font-mono text-sku text-ink-muted">{product.sku}</p>
        <Link href={`/san-pham/${product.slug}`} className="flex min-h-11 items-center text-title underline-offset-4 hover:underline">
          {product.name}
        </Link>
        <p className="font-mono text-spec">{product.mainSpec}</p>
        <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-3">
          <Input
            label={`Số lượng ${product.sku} (${product.unit})`}
            type="number"
            inputMode="numeric"
            min={1}
            max={QTY_MAX}
            defaultValue={qty}
            onBlur={(event) => setQty(product.sku, Number(event.target.value))}
            onChange={(event) => {
              if (event.target.value !== "") setQty(product.sku, Number(event.target.value));
            }}
            className="w-40"
          />
          <button type="button" onClick={() => remove(product.sku)} className="flex min-h-12 items-center underline underline-offset-4">
            Bỏ mẫu này
          </button>
        </div>
      </div>
    </li>
  );
}

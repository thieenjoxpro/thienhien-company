"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { formatNumber } from "@/lib/format";
import { QTY_MAX, stepQty, useQuoteStore } from "@/lib/quote-store";
import type { QuoteProduct } from "@/lib/quote-ui";

const stepButton = "flex size-11 items-center justify-center bg-ground text-ink hover:bg-surface";

/** Một hàng của danh sách hỏi giá (design V2): ảnh 72px, mã, tên, thông số, giá; ô số lượng có nút trừ cộng; nút bỏ. */
export function QuoteRow({ product, qty, onNavigate }: { product: QuoteProduct; qty: number; onNavigate?: () => void }) {
  const setQty = useQuoteStore((state) => state.setQty);
  const remove = useQuoteStore((state) => state.remove);
  const input = useRef<HTMLInputElement>(null);
  // Nút trừ cộng ghi số mới vào ô (ô không điều khiển bằng state để khách gõ không mất con trỏ)
  const step = (direction: 1 | -1) => {
    const next = stepQty(qty, direction);
    setQty(product.sku, next);
    if (input.current) input.current.value = String(next);
  };
  return (
    <li className="flex flex-wrap items-center gap-4 border-b border-line py-4">
      <span className="relative size-16 shrink-0 overflow-hidden rounded-tag bg-photo sm:size-18">
        {product.image ? <Image src={product.image} alt="" fill sizes="72px" className="object-contain p-1" /> : null}
      </span>
      <span className="flex min-w-0 grow basis-56 flex-col gap-1">
        <span className="text-tag font-medium text-ink-muted">Mã {product.sku}</span>
        <Link href={`/san-pham/${product.slug}`} onClick={onNavigate} className="flex min-h-11 items-center text-base font-semibold hover:text-link">
          {product.name}
        </Link>
        <span className="text-label text-ink-muted">{product.spec}</span>
        {product.price ? (
          <span className="text-label text-ink-soft">
            từ <b>{formatNumber(product.price)}đ</b>/{product.unit}
          </span>
        ) : (
          <span className="text-label font-semibold text-link">Liên hệ báo giá</span>
        )}
      </span>
      <span className="flex items-center gap-2">
        <span className="flex overflow-hidden rounded-btn border-2 border-ink">
          <button type="button" aria-label={`Giảm ${product.sku}`} onClick={() => step(-1)} className={stepButton}>
            <Minus size={16} strokeWidth={2.4} aria-hidden />
          </button>
          <input
            ref={input}
            type="number"
            inputMode="numeric"
            min={1}
            max={QTY_MAX}
            defaultValue={qty}
            aria-label={`Số lượng ${product.sku} (${product.unit})`}
            onChange={(event) => {
              if (event.target.value !== "") setQty(product.sku, Number(event.target.value));
            }}
            // Rời ô khi để trống hoặc số hỏng: hiện lại số đang lưu
            onBlur={(event) => {
              event.target.value = String(qty);
            }}
            className="h-11 w-16 border-x border-line text-center text-base font-bold"
          />
          <button type="button" aria-label={`Tăng ${product.sku}`} onClick={() => step(1)} className={stepButton}>
            <Plus size={16} strokeWidth={2.4} aria-hidden />
          </button>
        </span>
        <span className="min-w-8 text-small text-ink-muted">{product.unit}</span>
        <button type="button" aria-label={`Bỏ ${product.sku} khỏi danh sách`} onClick={() => remove(product.sku)} className="flex size-11 items-center justify-center text-ink-muted hover:text-danger">
          <Trash2 size={18} strokeWidth={2} aria-hidden />
        </button>
      </span>
    </li>
  );
}

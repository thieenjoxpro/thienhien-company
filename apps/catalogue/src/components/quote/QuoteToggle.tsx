"use client";

import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { useQuoteStore } from "@/lib/quote-store";

/** Nút trên thẻ sản phẩm: thêm 1 đơn vị vào danh sách hỏi giá, bấm lần nữa thì bỏ ra (aria-pressed). */
export function QuoteToggle({ sku, name }: { sku: string; name: string }) {
  const added = useQuoteStore((state) => state.hasHydrated && state.items.some((item) => item.sku === sku));
  const add = useQuoteStore((state) => state.add);
  const remove = useQuoteStore((state) => state.remove);
  return (
    <button
      type="button"
      aria-pressed={added}
      onClick={() => (added ? remove(sku) : add(sku, 1))}
      className={cn(
        "mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-btn border-2 border-ink text-small font-semibold",
        added ? "bg-ink text-on-ink" : "bg-ground text-ink hover:bg-surface",
      )}
    >
      {added ? <Check size={16} strokeWidth={2.4} aria-hidden /> : <Plus size={16} strokeWidth={2.4} aria-hidden />}
      {added ? "Đã thêm vào hỏi giá" : "Thêm vào hỏi giá"}
      <span className="sr-only">: {name}</span>
    </button>
  );
}

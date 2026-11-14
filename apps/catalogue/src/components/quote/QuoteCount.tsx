"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuoteStore } from "@/lib/quote-store";

/**
 * Link "Danh sách hỏi giá" trên header kèm số mẫu (nền accent, mục 7). Nằm ở mọi trang nên
 * đây là nơi đọc localStorage một lần sau khi hydrate.
 */
export function QuoteCount() {
  const count = useQuoteStore((state) => (state.hasHydrated ? state.items.length : 0));
  useEffect(() => {
    void useQuoteStore.persist.rehydrate();
  }, []);
  return (
    <Link href="/hoi-gia" className="hidden min-h-11 items-center gap-2 px-2 underline-offset-4 hover:underline lg:flex">
      Danh sách hỏi giá
      {count > 0 ? (
        <span className="rounded-btn bg-accent px-2 font-mono text-sku text-on-accent">
          {count}
          <span className="sr-only"> mẫu</span>
        </span>
      ) : null}
    </Link>
  );
}

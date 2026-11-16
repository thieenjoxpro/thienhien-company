"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useQuoteStore } from "@/lib/quote-store";

/**
 * Link "Danh sách hỏi giá" trên header kèm số mẫu (nền accent). Nằm ở mọi trang nên
 * đây là nơi đọc localStorage một lần sau khi hydrate. Dưới 1024px chỉ còn biểu tượng và số.
 */
export function QuoteCount() {
  const count = useQuoteStore((state) => (state.hasHydrated ? state.items.length : 0));
  useEffect(() => {
    void useQuoteStore.persist.rehydrate();
  }, []);
  return (
    <Link
      href="/hoi-gia"
      aria-label={`Danh sách hỏi giá, ${count} mẫu`}
      className="flex h-12 items-center gap-2 rounded-btn border-2 border-line px-3 text-small font-semibold hover:border-ink lg:px-4"
    >
      <ClipboardList size={20} strokeWidth={2} aria-hidden />
      <span className="hidden lg:inline">Danh sách hỏi giá</span>
      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-2 text-label font-bold text-on-accent">{count}</span>
    </Link>
  );
}

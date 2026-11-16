"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useQuoteStore } from "@/lib/quote-store";

/**
 * Link "Danh sách hỏi giá" trên header kèm số mẫu (nền accent). Nằm ở mọi trang nên
 * đây là nơi đọc localStorage một lần sau khi hydrate. Dưới 1024px chỉ còn biểu tượng và số.
 * Số đổi do người dùng thêm, bớt mẫu thì nảy nhẹ (m-pop); lần đọc localStorage đầu thì không.
 */
export function QuoteCount() {
  const hydrated = useQuoteStore((state) => state.hasHydrated);
  const count = useQuoteStore((state) => (state.hasHydrated ? state.items.length : 0));
  const badge = useRef<HTMLSpanElement>(null);
  const previous = useRef<number | null>(null);
  useEffect(() => {
    void useQuoteStore.persist.rehydrate();
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    const el = badge.current;
    if (el && previous.current !== null && previous.current !== count) {
      // Gỡ rồi gắn lại class để animation chạy lại mỗi lần đổi
      el.classList.remove("m-pop");
      void el.offsetWidth;
      el.classList.add("m-pop");
    }
    previous.current = count;
  }, [count, hydrated]);
  return (
    <Link
      href="/hoi-gia"
      aria-label={`Danh sách hỏi giá, ${count} mẫu`}
      className="flex h-12 items-center gap-2 rounded-btn border-2 border-line px-3 text-small font-semibold hover:border-ink lg:px-4"
    >
      <ClipboardList size={20} strokeWidth={2} aria-hidden />
      <span className="hidden lg:inline">Danh sách hỏi giá</span>
      <span ref={badge} className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-2 text-label font-bold text-on-accent">{count}</span>
    </Link>
  );
}

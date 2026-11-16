"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { useQuoteStore } from "@/lib/quote-store";

/** Dải tối cuối lưới: danh sách hỏi giá đang có bao nhiêu mẫu, link tới trang gửi qua Zalo. */
export function QuoteStrip() {
  const count = useQuoteStore((state) => (state.hasHydrated ? state.items.length : 0));
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-card bg-ink px-6 py-5 text-on-ink">
      <p className="text-base">
        Danh sách hỏi giá đang có <strong className="text-accent">{count} mẫu</strong>. Ghi số lượng rồi gửi qua Zalo, xưởng báo giá sỉ.
      </p>
      <Link href="/hoi-gia" className="flex h-12 items-center gap-2 rounded-btn bg-accent px-5 text-small font-bold text-on-accent hover:bg-accent-strong">
        <ClipboardList size={18} strokeWidth={2} aria-hidden />
        Xem danh sách hỏi giá
      </Link>
    </div>
  );
}

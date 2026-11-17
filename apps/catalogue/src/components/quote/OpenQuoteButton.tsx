"use client";

import Link from "next/link";
import { useQuoteStore } from "@/lib/quote-store";
import { useQuoteUi } from "@/lib/quote-ui";

/**
 * "Mở danh sách hỏi giá (n)" ở khối 3 bước: mở popup. Là link tới /hoi-gia để vẫn dùng được khi
 * JS chưa chạy hoặc khách mở tab mới.
 */
export function OpenQuoteButton() {
  const count = useQuoteStore((state) => (state.hasHydrated ? state.items.length : 0));
  const setOpen = useQuoteUi((state) => state.setOpen);
  return (
    <Link
      href="/hoi-gia"
      // Không tải sẵn trang /hoi-gia: bấm là mở popup, trang chỉ dùng khi chưa có JS hoặc mở tab mới
      prefetch={false}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        setOpen(true);
      }}
      className="flex h-12 items-center self-start rounded-btn bg-ink px-5 text-small font-bold text-on-ink hover:bg-ink-soft"
    >
      Mở danh sách hỏi giá ({count})
    </Link>
  );
}

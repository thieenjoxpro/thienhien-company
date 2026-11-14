"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { telLink, zaloLink } from "@/lib/contact";
import { site } from "@/lib/site.config";
import { usePrimaryInView } from "@/lib/use-primary-in-view";

/**
 * Thanh hành động dính đáy, chỉ dưới 640px (mục 5.1). Chỉ hiện khi không còn nút chính nào
 * (nút có data-primary-action, ví dụ nút của hero) trong màn hình. Thiếu số Zalo thì không render.
 * Không có ở trang hỏi giá: ở đó nút Zalo phải đi kèm việc copy danh sách (SendQuote).
 */
export function PhoneBar() {
  const bar = useRef<HTMLDivElement>(null);
  const primaryInView = usePrimaryInView("[data-primary-action]", bar);
  const zalo = zaloLink(site.zaloWholesale);
  const tel = telLink(site.phone);
  const pathname = usePathname();

  if (!zalo || pathname === "/hoi-gia") return null;
  return (
    <>
      {/* Chừa chỗ cuối trang để thanh không che dòng cuối của footer */}
      <div aria-hidden className="h-18 sm:hidden" />
      <div
        ref={bar}
        data-phone-bar=""
        className={cn(
          "bar-bottom flex gap-3 border-t border-line bg-ground px-4 py-3 sm:hidden",
          primaryInView !== false && "hidden",
        )}
      >
        <Button asChild variant="primary" className="flex-1 max-sm:px-4">
          <a href={zalo} target="_blank" rel="noopener noreferrer">
            {site.mainAction}
          </a>
        </Button>
        {tel ? (
          <Button asChild variant="secondary" className="flex-1 max-sm:px-4">
            <a href={tel}>Gọi xưởng</a>
          </Button>
        ) : null}
      </div>
    </>
  );
}

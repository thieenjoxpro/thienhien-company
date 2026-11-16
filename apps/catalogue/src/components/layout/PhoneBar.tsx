"use client";

import { MessageCircle, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { telLink, zaloLink } from "@/lib/contact";
import { site } from "@/lib/site.config";
import { usePrimaryInView } from "@/lib/use-primary-in-view";

/**
 * Lối liên hệ luôn trong tầm tay (design 3). Dưới 640px: thanh Zalo + Gọi xưởng dính đáy, chỉ hiện khi
 * không còn nút Zalo nào khác trong màn hình. Từ 640px: hai nút tròn nổi góc phải dưới.
 * Thiếu số Zalo thì không render. Không có ở trang hỏi giá: ở đó nút Zalo phải đi kèm việc copy danh sách.
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
        className={cn("bar-bottom flex gap-3 border-t border-line bg-ground px-4 py-3 sm:hidden", primaryInView !== false && "hidden")}
      >
        <Button asChild variant="zalo" size="md" className="flex-1">
          <a href={zalo} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} strokeWidth={2} aria-hidden />
            {site.mainAction}
          </a>
        </Button>
        {tel ? (
          <Button asChild variant="outline" size="md" className="flex-1">
            <a href={tel}>Gọi xưởng</a>
          </Button>
        ) : null}
      </div>
      <div className="dock hidden flex-col gap-3 sm:flex">
        <a
          href={zalo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn Zalo cho xưởng"
          className="flex size-14 items-center justify-center rounded-full bg-zalo text-small font-bold text-on-ink shadow-float hover:bg-zalo-strong"
        >
          Zalo
        </a>
        {tel ? (
          <a href={tel} aria-label="Gọi xưởng" className="flex size-14 items-center justify-center rounded-full bg-accent text-on-accent shadow-float hover:bg-accent-strong">
            <Phone size={24} strokeWidth={2} aria-hidden />
          </a>
        ) : null}
      </div>
    </>
  );
}

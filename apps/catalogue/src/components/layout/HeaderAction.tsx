"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site.config";
import { usePrimaryInView } from "@/lib/use-primary-in-view";

/**
 * Nút chính trên header (từ 640px). Nhường chỗ khi nút chính của trang (hero, dải liên hệ) đang trong
 * màn hình, để mỗi màn hình chỉ có một nút tô màu. Ẩn tới khi đo xong để không nháy hai nút.
 */
export function HeaderAction({ href }: { href: string }) {
  const own = useRef<HTMLDivElement>(null);
  const pagePrimaryInView = usePrimaryInView("main [data-primary-action]", own);
  return (
    <div ref={own} className={cn("hidden", pagePrimaryInView === false && "sm:block")}>
      <Button asChild variant="primary">
        <a href={href} target="_blank" rel="noopener noreferrer">
          {site.mainAction}
        </a>
      </Button>
    </div>
  );
}

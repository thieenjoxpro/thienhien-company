"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { usePrimaryInView } from "@/lib/use-primary-in-view";

interface HeaderActionProps {
  href: string;
  label: string;
}

/** Nút chính trên header, từ 640px. Ẩn (vẫn giữ chỗ) khi một nút chính khác đang trong màn hình. */
export function HeaderAction({ href, label }: HeaderActionProps) {
  const otherInView = usePrimaryInView();
  return (
    <div data-action-follower="" className={cn("hidden sm:block", otherInView !== false && "invisible")}>
      <Button asChild variant="primary">
        <a href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      </Button>
    </div>
  );
}

import Link from "next/link";
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  id?: string;
  as?: ElementType;
  children: ReactNode;
  /** Link hoặc lời nằm bên phải cùng hàng (Xem tất cả). */
  aside?: ReactNode;
  /** Kẻ ngang dưới cả hàng (tiêu đề khối); tắt khi tiêu đề nằm trong cột. */
  rule?: boolean;
  className?: string;
}

/** Tiêu đề khối của design 3: chữ condensed viết hoa, vạch vàng 56×4 bên dưới, kẻ line dưới cả hàng. */
export function SectionHeading({ id, as: Tag = "h2", children, aside, rule = true, className }: Props) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-3", rule && "mb-5 border-b border-line pb-3", className)}>
      <div className="flex flex-col gap-2">
        <Tag id={id} className="font-display text-h2 uppercase">
          {children}
        </Tag>
        <span aria-hidden className="block h-1 w-14 bg-accent" />
      </div>
      {aside}
    </div>
  );
}

/** Link "Xem tất cả" có dấu › màu link, cạnh tiêu đề khối. */
export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="flex min-h-11 items-center text-small font-semibold text-link hover:underline">
      {children}
      <span aria-hidden>&nbsp;›</span>
    </Link>
  );
}

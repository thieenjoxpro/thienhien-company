import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site.config";

/**
 * Logo "khối thép": chữ T và H khoét trên hai mặt một khối đẳng cự, mặt trên màu accent;
 * kèm chữ THIỆN HIỀN condensed, bản header có thêm dòng nhóm hàng. Favicon ở app/icon.svg dùng cùng hình.
 */
const TOP = "M16.5 33L60 7.9L103.5 33L60 58.1Z";
const LEFT =
  "M14.9 35.8L58.4 60.9L58.4 111.2L14.9 86.1ZM19.8 45.4L53.5 64.9L53.5 75.7L41.3 68.6L41.3 94.6L31.9 89.2L31.9 63.2L19.8 56.2Z";
const RIGHT =
  "M61.6 60.9L105.1 35.8L105.1 86.1L61.6 111.2ZM67.5 64.3L76.8 58.9L76.8 71.9L89.9 64.3L89.9 51.4L99.3 46L99.3 82.7L89.9 88.1L89.9 75.1L76.8 82.7L76.8 95.6L67.5 101Z";

interface LogoProps {
  tone?: "light" | "dark";
  tagline?: boolean;
  className?: string;
  /** Menu điện thoại đóng lại khi bấm logo. */
  onClick?: () => void;
}

export function Logo({ tone = "light", tagline = false, className, onClick }: LogoProps) {
  return (
    <Link href="/" onClick={onClick} className={cn("flex min-h-11 items-center gap-3", className)}>
      <svg aria-hidden viewBox="0 0 120 120" className={cn("size-11 shrink-0 lg:size-12", tone === "dark" ? "fill-on-ink" : "fill-ink")}>
        <path d={TOP} className="fill-accent" />
        <path d={LEFT} fillRule="evenodd" />
        <path d={RIGHT} fillRule="evenodd" />
      </svg>
      <span className="flex flex-col">
        <span className={cn("font-display text-logo uppercase", tone === "dark" ? "text-on-ink" : "text-ink")}>{site.name}</span>
        {tagline ? <span className="mt-1 hidden text-tag text-ink-muted sm:block">Pano · Bản lề · Tôn · Mâm cầu thang</span> : null}
      </span>
    </Link>
  );
}

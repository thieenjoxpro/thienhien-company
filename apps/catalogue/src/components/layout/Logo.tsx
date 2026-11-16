import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site.config";

/** Logo design 3: ô vàng "TH" và chữ THIỆN HIỀN condensed; bản header có thêm dòng nhóm hàng. */
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
      <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-tag bg-accent font-display text-h3 text-on-accent lg:size-12">
        TH
      </span>
      <span className="flex flex-col">
        <span className={cn("font-display text-logo uppercase", tone === "dark" ? "text-on-ink" : "text-ink")}>{site.name}</span>
        {tagline ? <span className="mt-1 hidden text-tag text-ink-muted sm:block">Pano · Bản lề · Tôn · Mâm cầu thang</span> : null}
      </span>
    </Link>
  );
}

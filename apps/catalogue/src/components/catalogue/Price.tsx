import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site.config";

interface PriceProps {
  priceFrom: number | null;
  unit: string;
  /** Trang chi tiết: số cỡ price-lg. */
  large?: boolean;
}

/** "từ 18.000đ /cái": số condensed đậm, "từ" và đơn vị nhỏ màu phụ. Không có giá thì "Giá theo số lượng". */
export function Price({ priceFrom, unit, large = false }: PriceProps) {
  if (!site.showPrice || priceFrom === null) return <p className="text-base font-semibold text-link">Giá theo số lượng</p>;
  return (
    <p className="flex flex-wrap items-baseline gap-1">
      <span className="text-label text-ink-muted">{large ? "Giá lẻ từ" : "từ"}</span>
      <span className={cn("font-display", large ? "text-price-lg" : "text-price")}>{formatNumber(priceFrom)}đ</span>
      <span className="text-label text-ink-muted">/{unit}</span>
    </p>
  );
}

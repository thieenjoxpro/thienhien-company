import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site.config";

interface PriceProps {
  priceFrom: number | null;
  unit: string;
  /** Cờ hiện giá của sản phẩm; tắt thì "Liên hệ báo giá". */
  showPrice?: boolean;
  /** Trang chi tiết: số cỡ price-lg. */
  large?: boolean;
}

/**
 * "từ 18.000đ /cái": số condensed đậm, "từ" và đơn vị nhỏ màu phụ. Tắt giá (toàn site hoặc riêng mẫu)
 * hay chưa có giá thì "Liên hệ báo giá" (design V2).
 */
export function Price({ priceFrom, unit, showPrice = true, large = false }: PriceProps) {
  if (!site.showPrice || !showPrice || priceFrom === null) return <p className="text-base font-semibold text-link">Liên hệ báo giá</p>;
  return (
    <p className="flex flex-wrap items-baseline gap-1">
      <span className="text-label text-ink-muted">{large ? "Giá lẻ từ" : "từ"}</span>
      <span className={cn("font-display", large ? "text-price-lg" : "text-price")}>{formatNumber(priceFrom)}đ</span>
      <span className="text-label text-ink-muted">/{unit}</span>
    </p>
  );
}

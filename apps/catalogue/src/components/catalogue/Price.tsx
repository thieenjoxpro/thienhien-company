import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site.config";

interface PriceProps {
  priceFrom: number | null;
  unit: string;
}

/** "từ 18.000 đ / cái"; không có giá hoặc tắt giá toàn site thì "Giá theo số lượng". */
export function Price({ priceFrom, unit }: PriceProps) {
  if (!site.showPrice || priceFrom === null) return <p className="text-body">Giá theo số lượng</p>;
  return (
    <p className="text-body">
      từ <span className="font-mono text-price">{formatPrice(priceFrom)}</span> / {unit}
    </p>
  );
}

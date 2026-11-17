import { MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { AddToQuoteButton } from "@/components/quote/AddToQuoteButton";
import { Button } from "@/components/ui/Button";
import { zaloLink } from "@/lib/contact";
import type { Category, Product } from "@/lib/schema";
import { site } from "@/lib/site.config";
import { Price } from "./Price";

/** Chip thông số dưới tên: kích thước, độ dày, vật liệu, bề mặt lấy từ bảng thông số. */
function chipsOf(specs: Product["specs"]): string[] {
  const value = (label: string) => specs.find((s) => s.label === label)?.value;
  const thickness = value("Độ dày");
  const finish = value("Bề mặt");
  return [value("Kích thước"), thickness && `Dày ${thickness}`, value("Vật liệu"), finish && `Bề mặt ${finish.toLowerCase()}`].filter(
    (chip): chip is string => Boolean(chip),
  );
}

/**
 * Cột thông tin trang chi tiết (design 3): mã, danh mục, tên, mô tả, chip thông số, khung giá,
 * số lượng và nút thêm vào hỏi giá, nút hỏi riêng mã này qua Zalo, dòng gọi xưởng và ghé xưởng.
 */
export function ProductInfo({ product, category }: { product: Product; category: Category | null }) {
  const zalo = zaloLink(site.zaloWholesale);
  const visit = [site.district, site.openingHours].filter(Boolean).join(", ");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 text-label">
        <span className="rounded-tag border border-ink px-2 py-1 font-bold">Mã {product.sku}</span>
        {category ? (
          <Link href={`/danh-muc/${category.slug}`} className="flex min-h-11 min-w-11 items-center font-semibold text-link hover:underline">
            {category.name}
          </Link>
        ) : null}
      </div>
      <h1 className="font-display text-h1 uppercase">{product.name}</h1>
      <p className="text-body text-ink-soft">{product.summary}</p>
      <ul aria-label="Thông số chính" className="flex flex-wrap gap-2">
        {chipsOf(product.specs).map((chip) => (
          <li key={chip} className="rounded-tag bg-surface px-3 py-1 text-small font-semibold">
            {chip}
          </li>
        ))}
      </ul>
      <div className="overflow-hidden rounded-card border border-line">
        <div className="border-b border-line px-5 py-4">
          <Price priceFrom={product.priceFrom} unit={product.unit} showPrice={product.showPrice} large />
        </div>
        <p className="bg-surface px-5 py-3 text-small text-ink-soft">Giá sỉ tính theo số lượng. Thêm vào danh sách rồi gửi qua Zalo, xưởng báo giá.</p>
      </div>
      <AddToQuoteButton sku={product.sku} unit={product.unit} />
      {zalo ? (
        <Button asChild variant="zalo" className="sm:w-full">
          <a href={zalo} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={20} strokeWidth={2} aria-hidden />
            Hỏi giá {product.sku} qua Zalo
          </a>
        </Button>
      ) : null}
      {site.phone || visit ? (
        <ul className="flex flex-col gap-2 border-t border-line pt-4 text-small text-ink-soft">
          {site.phone ? (
            <li className="flex items-center gap-3">
              <Phone size={18} strokeWidth={2} aria-hidden />
              Gọi xưởng: <span className="font-semibold text-ink">{site.phone}</span>
            </li>
          ) : null}
          {visit ? (
            <li className="flex items-center gap-3">
              <MapPin size={18} strokeWidth={2} aria-hidden />
              Xem hàng tại xưởng: {visit}
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}

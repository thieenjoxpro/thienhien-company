import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site.config";

/** Thanh tối trên cùng (từ 768px): nơi chốn, giờ mở cửa, hotline, Zalo. Trường nào chưa có thì bỏ. */
export function TopBar() {
  const left = [site.district && `Xưởng dập sắt tại ${site.district}`, site.openingHours && `Mở cửa: ${site.openingHours}`];
  const right = [site.phone && `Hotline sỉ: ${site.phone}`, site.zaloWholesale && `Zalo: ${site.zaloWholesale}`];
  if (![...left, ...right].some(Boolean)) return null;
  return (
    <div className="hidden bg-ink text-label text-on-ink-muted md:block">
      <Container className="flex min-h-10 flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <p className="flex flex-wrap gap-x-5">
          {left.filter(Boolean).map((text) => (
            <span key={String(text)}>{text}</span>
          ))}
        </p>
        <p className="flex flex-wrap gap-x-5">
          {right.filter(Boolean).map((text) => (
            <span key={String(text)}>{text}</span>
          ))}
        </p>
      </Container>
    </div>
  );
}

import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/layout/LogoMark";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { telLink, zaloLink } from "@/lib/contact";
import { site } from "@/lib/site.config";

/**
 * Hero design V2: khối tối hoa văn (nhãn xưởng, h1, số mẫu đếm từ dữ liệu, hai nút Hỏi giá qua Zalo và
 * Gọi xưởng, link catalogue) và ảnh chính bên phải. Chưa có ảnh thì khung logo. Điện thoại có thêm
 * dải địa chỉ, giờ mở cửa dưới ảnh (máy tính đã có ở thanh trên cùng).
 */
export function Hero({ productCount }: { productCount: number }) {
  const zalo = zaloLink(site.zaloWholesale);
  const tel = telLink(site.phone);
  const photo = site.photos.warehouse;
  const facts = [
    ["Địa chỉ xưởng", site.street ?? site.district],
    ["Giờ mở cửa", site.openingHours],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  return (
    <Container as="section" aria-labelledby="hero-tieu-de" className="mt-4 flex flex-col gap-4 lg:mt-6 lg:flex-row">
      <div className="bg-pattern flex flex-col justify-center gap-5 rounded-card p-6 lg:min-h-120 lg:basis-1/2 lg:p-12">
        <p className="self-start rounded-tag bg-accent px-3 py-1 text-label font-bold text-on-accent">
          Xưởng sản xuất {site.name}
          {site.district ? ` · ${site.district}` : ""}
        </p>
        <h1 id="hero-tieu-de" className="font-display text-hero text-balance text-on-ink">
          Pano, bản lề, tôn, mâm cầu thang <span className="text-accent">giá sỉ</span> cho đại lý và thợ
        </h1>
        {productCount > 0 ? (
          <p className="max-w-lg text-lead text-on-ink-muted">
            {productCount} mẫu có sẵn mã, kích thước và độ dày. Chọn mẫu, gửi danh sách qua Zalo hoặc gọi thẳng xưởng để lấy giá sỉ.
          </p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          {zalo ? (
            <Button asChild variant="zalo">
              <a href={zalo} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={20} strokeWidth={2} aria-hidden />
                {site.mainAction}
              </a>
            </Button>
          ) : null}
          {tel ? (
            <Button asChild variant="outlineLight">
              <a href={tel}>
                <Phone size={20} strokeWidth={2} aria-hidden />
                Gọi {site.phone}
              </a>
            </Button>
          ) : null}
        </div>
        {productCount > 0 ? (
          <Link href="/san-pham" className="flex min-h-11 items-center self-start text-base font-semibold text-on-ink underline">
            Xem catalogue {productCount} mẫu ›
          </Link>
        ) : null}
      </div>
      <div className="flex flex-col gap-4 lg:basis-1/2">
        {photo ? (
          <Photo src={photo.src} alt={photo.alt} ratio="4/3" fit="cover" sizes="(min-width: 1024px) 640px, 100vw" priority className="rounded-card lg:aspect-auto lg:h-full" />
        ) : (
          <div className="flex grow flex-col items-center justify-center gap-4 rounded-card border border-line bg-surface p-8 text-center">
            <LogoMark className="size-24 lg:size-40" />
            <span className="font-display text-h1 uppercase">{site.name}</span>
            <span className="text-small text-ink-muted">Hàng sản xuất tại xưởng{site.district ? ` · ${site.district}` : ""}</span>
          </div>
        )}
        {facts.length ? (
          <dl className="flex flex-col gap-3 rounded-card border border-line p-4 md:hidden">
            {facts.map(([label, value]) => (
              <div key={label} className="flex flex-col">
                <dt className="text-label text-ink-muted">{label}</dt>
                <dd className="text-base font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </Container>
  );
}

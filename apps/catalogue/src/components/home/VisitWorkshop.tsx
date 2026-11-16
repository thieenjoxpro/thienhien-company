import { MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { zaloLink } from "@/lib/contact";
import { site } from "@/lib/site.config";

/**
 * Khối "Ghé xưởng xem hàng" nền surface (design 3): lời của chủ xưởng, bảng liên hệ, nút Zalo,
 * chỉ đường, ảnh mặt tiền. Chưa có quận lẫn địa chỉ thì bỏ cả khối.
 */
export function VisitWorkshop() {
  if (!site.district && !site.street) return null;
  const zalo = zaloLink(site.zaloWholesale);
  const rows = [
    ["Địa chỉ", site.street ?? site.district],
    ["Giờ mở cửa", site.openingHours],
    ["Điện thoại", site.phone],
    ["Zalo sỉ", site.zaloWholesale],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  const photo = site.photos.storefront;
  return (
    <section id="xuong" aria-labelledby="ghe-xuong" className="mt-14 border-t border-line bg-surface">
      <Container className="grid gap-8 py-12 lg:grid-cols-2">
        <div className="m-reveal flex flex-col gap-5">
          <SectionHeading id="ghe-xuong" rule={false}>
            Ghé xưởng xem hàng
          </SectionHeading>
          {site.workshopText ? <p className="max-w-lg text-body text-ink-soft">{site.workshopText}</p> : null}
          <dl className="grid grid-cols-3 gap-x-4 gap-y-3 text-base">
            {rows.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-ink-muted">{label}</dt>
                <dd className="col-span-2 font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-3 sm:flex-row">
            {zalo ? (
              <Button asChild variant="zalo" size="md">
                <a href={zalo} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} strokeWidth={2} aria-hidden />
                  {site.mainAction}
                </a>
              </Button>
            ) : null}
            {site.mapUrl ? (
              <Button asChild variant="outline" size="md">
                <a href={site.mapUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin size={18} strokeWidth={2} aria-hidden />
                  Xem đường tới xưởng
                </a>
              </Button>
            ) : null}
          </div>
        </div>
        {photo ? <Photo src={photo.src} alt={photo.alt} ratio="3/2" fit="cover" sizes="(min-width: 1024px) 600px, 100vw" className="m-reveal rounded-card border border-line" /> : null}
      </Container>
    </section>
  );
}

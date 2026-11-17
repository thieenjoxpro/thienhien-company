import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { telLink, zaloLink } from "@/lib/contact";
import { site } from "@/lib/site.config";

/**
 * Khối "Ghé xưởng xem hàng" nền surface (design V2): bên trái ảnh mặt tiền 16:9 và hai ảnh 4:3
 * (máy dập, kho); bên phải địa chỉ, giờ mở cửa, từng người nghe máy (Nhắn Zalo nếu số có Zalo, Gọi),
 * nút chỉ đường. Chưa có quận lẫn địa chỉ thì bỏ cả khối; ảnh nào chưa có thì bỏ ảnh đó.
 */
export function VisitWorkshop() {
  if (!site.district && !site.street) return null;
  const { storefront, workshop, warehouse } = site.photos;
  const small = [workshop, warehouse].filter((photo) => photo !== null);
  return (
    <section id="xuong" aria-labelledby="ghe-xuong" className="mt-14 scroll-mt-6 border-t border-line bg-surface">
      <Container className="grid gap-8 py-12 lg:grid-cols-2 lg:gap-12 lg:py-14">
        {storefront || small.length ? (
          <div className="m-reveal flex flex-col gap-3">
            {storefront ? <Photo src={storefront.src} alt={storefront.alt} ratio="16/9" fit="cover" sizes="(min-width: 1024px) 640px, 100vw" className="rounded-card" /> : null}
            {small.length ? (
              <div className="grid grid-cols-2 gap-3">
                {small.map((photo) => (
                  <Photo key={photo.src} src={photo.src} alt={photo.alt} ratio="4/3" fit="cover" sizes="(min-width: 1024px) 320px, 50vw" className="rounded-card" />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="m-reveal flex flex-col gap-5">
          <SectionHeading id="ghe-xuong" rule={false}>
            Ghé xưởng xem hàng
          </SectionHeading>
          <div className="flex flex-col gap-1 text-body">
            <p className="font-semibold">{site.street ?? site.district}</p>
            {site.openingHours ? <p className="text-ink-soft">Mở cửa {site.openingHours}</p> : null}
          </div>
          {site.workshopText ? <p className="max-w-lg text-body text-ink-soft">{site.workshopText}</p> : null}
          {site.contacts.length ? (
            <ul className="rounded-card border border-line bg-ground">
              {site.contacts.map((contact) => {
                const zalo = contact.zalo ? zaloLink(contact.phone) : null;
                return (
                  <li key={contact.phone} className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 last:border-b-0">
                    <span className="flex min-w-40 grow flex-col">
                      <span className="text-label text-ink-muted">{[contact.name, contact.note].filter(Boolean).join(" · ")}</span>
                      <span className="font-display text-h3">{contact.phone}</span>
                    </span>
                    <span className="flex gap-2">
                    {zalo ? (
                      <a href={zalo} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center rounded-btn bg-zalo px-4 text-small font-bold text-on-ink hover:bg-zalo-strong">
                        Nhắn Zalo
                      </a>
                    ) : null}
                    <a href={telLink(contact.phone) ?? undefined} className="flex h-11 items-center rounded-btn border-2 border-ink px-4 text-small font-bold hover:bg-surface">
                      Gọi
                    </a>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : null}
          {site.mapUrl ? (
            <Button asChild variant="dark" size="md" className="self-start">
              <a href={site.mapUrl} target="_blank" rel="noopener noreferrer">
                <MapPin size={18} strokeWidth={2} aria-hidden />
                Chỉ đường tới xưởng
              </a>
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

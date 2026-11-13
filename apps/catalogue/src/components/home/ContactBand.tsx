import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { telLink, zaloLink } from "@/lib/contact";
import { site } from "@/lib/site.config";

/**
 * Dải liên hệ nền ink (mục 5.2), khoảnh khắc chữ của trang: tên quận cỡ display, địa chỉ, giờ mở cửa,
 * số điện thoại, nút chính, link chỉ đường. Không nhúng bản đồ. Chưa có quận thì bỏ cả dải.
 */
export function ContactBand() {
  if (!site.district) return null;
  const zalo = zaloLink(site.zaloWholesale);
  const tel = telLink(site.phone);
  return (
    <Section screens={1} className="bg-ink text-on-ink">
      <h2 className="mb-12 text-display">{site.district}</h2>
      <div className="mb-12 grid gap-6 md:grid-cols-2">
        <div>
          {site.street ? <p>{site.street}</p> : null}
          {site.openingHours ? <p className="text-on-ink-muted">{site.openingHours}</p> : null}
        </div>
        {tel && site.phone ? (
          <a href={tel} className="flex min-h-11 items-start font-mono text-price underline underline-offset-4">
            {site.phone}
          </a>
        ) : null}
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {zalo ? (
          <Button asChild variant="primary">
            <a href={zalo} target="_blank" rel="noopener noreferrer">
              {site.mainAction}
            </a>
          </Button>
        ) : null}
        {site.mapUrl ? (
          <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center underline underline-offset-4">
            Chỉ đường tới xưởng
          </a>
        ) : null}
      </div>
    </Section>
  );
}

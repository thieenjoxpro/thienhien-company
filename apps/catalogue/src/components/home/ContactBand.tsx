import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { telLink, zaloLink } from "@/lib/contact";
import { site } from "@/lib/site.config";

/**
 * Dải liên hệ cuối trang chủ (mục 5.2): dải tối duy nhất ngoài footer, tên quận đặt cỡ display.
 * Chưa có tên quận thì bỏ cả khối; từng dòng dữ kiện thiếu thì bỏ dòng đó.
 */
export function ContactBand() {
  const district = site.district;
  if (!district) return null;
  const zalo = zaloLink(site.zaloWholesale);
  const tel = telLink(site.phone);

  return (
    <Section screens={1} className="bg-ink text-on-ink">
      <div className="flex flex-col gap-12 lg:min-h-0 lg:flex-1 lg:justify-between">
        <h2 className="text-display">{district}</h2>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
          <div className="lg:col-span-4">
            {site.street ? <p>{site.street}</p> : null}
            {site.openingHours ? <p className="text-on-ink-muted">{site.openingHours}</p> : null}
          </div>
          <div className="lg:col-span-3">
            {tel ? (
              <p>
                <a href={tel} className="font-mono text-spec underline underline-offset-4">
                  {site.phone}
                </a>
              </p>
            ) : null}
            {site.mapUrl ? (
              <p>
                <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  Chỉ đường tới xưởng
                </a>
              </p>
            ) : null}
          </div>
          {zalo ? (
            <div className="lg:col-span-5 lg:justify-self-end">
              <Button asChild variant="primary">
                <a href={zalo} target="_blank" rel="noopener noreferrer">
                  {site.mainAction}
                </a>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

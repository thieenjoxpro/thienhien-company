import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { telLink, zaloLink } from "@/lib/contact";
import { site } from "@/lib/site.config";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: `Địa chỉ, giờ mở cửa và số điện thoại của xưởng ${site.name}.`,
  alternates: { canonical: "/lien-he" },
};

// Liên hệ (mục 5.6): địa chỉ, giờ, điện thoại, nút chính, link chỉ đường; trường nào null thì bỏ.
export default function ContactPage() {
  const zalo = zaloLink(site.zaloWholesale);
  const tel = telLink(site.phone);
  return (
    <Section>
      <h1 className="mb-8 text-h2 lg:mb-12">Liên hệ xưởng {site.name}</h1>
      <dl className="mb-12 grid max-w-3xl gap-6 md:grid-cols-2">
        {site.street ? (
          <div>
            <dt className="mb-1 text-label text-ink-muted">Địa chỉ</dt>
            <dd>{site.street}</dd>
          </div>
        ) : null}
        {site.openingHours ? (
          <div>
            <dt className="mb-1 text-label text-ink-muted">Giờ mở cửa</dt>
            <dd>{site.openingHours}</dd>
          </div>
        ) : null}
        {tel && site.phone ? (
          <div>
            <dt className="mb-1 text-label text-ink-muted">Điện thoại</dt>
            <dd>
              <a href={tel} className="flex min-h-11 items-center font-mono text-price underline underline-offset-4">
                {site.phone}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
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

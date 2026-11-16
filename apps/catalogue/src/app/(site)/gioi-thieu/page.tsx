import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { site } from "@/lib/site.config";

const place = site.district ? ` ở ${site.district}` : "";

export const metadata: Metadata = {
  title: `Xưởng ${site.name}${place}`,
  description: site.aboutText ?? undefined,
  alternates: { canonical: "/gioi-thieu" },
};

// Giới thiệu (mục 5.6): chữ của chủ xưởng và 3 ảnh xưởng khác nhau; thiếu gì bỏ phần đó.
export default function AboutPage() {
  const photos = [site.photos.storefront, site.photos.workshop, site.photos.warehouse].filter((photo) => photo !== null);
  return (
    <Section>
      <h1 className="mb-8 text-h2 lg:mb-12">
        Xưởng {site.name}
        {place}
      </h1>
      {site.aboutText ? <p className="mb-12 max-w-3xl">{site.aboutText}</p> : null}
      {photos.length ? (
        <ul className="mb-12 grid gap-6 md:grid-cols-3">
          {photos.map((photo) => (
            <li key={photo.src}>
              <Photo src={photo.src} alt={photo.alt} ratio="4/5" sizes="(min-width: 768px) 33vw, 100vw" />
            </li>
          ))}
        </ul>
      ) : null}
      <Link href="/lien-he" className="flex min-h-11 items-center underline underline-offset-4">
        Chỉ đường và giờ mở cửa
      </Link>
    </Section>
  );
}

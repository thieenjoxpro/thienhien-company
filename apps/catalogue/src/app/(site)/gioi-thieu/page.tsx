import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { site } from "@/lib/site.config";
import { PageTitle } from "@/components/ui/PageTitle";

// Hàm chứ không phải hằng: ở chế độ máy chủ quận và đoạn giới thiệu sửa được trong /admin
export const generateMetadata = (): Metadata => ({
  title: `Xưởng ${site.name}${site.district ? ` ở ${site.district}` : ""}`,
  description: site.aboutText ?? undefined,
  alternates: { canonical: "/gioi-thieu" },
});

// Giới thiệu (mục 5.6): chữ của chủ xưởng và 3 ảnh xưởng khác nhau; thiếu gì bỏ phần đó.
export default function AboutPage() {
  const photos = [site.photos.storefront, site.photos.workshop, site.photos.warehouse].filter((photo) => photo !== null);
  return (
    <Section>
      <PageTitle>
        Xưởng {site.name}
        {site.district ? ` ở ${site.district}` : ""}
      </PageTitle>
      {site.aboutText ? <p className="mb-12 max-w-3xl">{site.aboutText}</p> : null}
      {photos.length ? (
        <ul className="mb-12 grid gap-6 md:grid-cols-3">
          {photos.map((photo) => (
            <li key={photo.src}>
              <Photo src={photo.src} alt={photo.alt} ratio="4/5" fit="cover" sizes="(min-width: 768px) 33vw, 100vw" className="rounded-card" />
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

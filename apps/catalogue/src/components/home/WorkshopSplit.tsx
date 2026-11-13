import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { site } from "@/lib/site.config";

/**
 * Khối Xưởng (mục 5.2): ảnh máy đang chạy bên trái, chữ của chủ xưởng bên phải.
 * Chủ xưởng chưa đưa chữ và ảnh (site.workshop null) thì bỏ cả khối.
 */
export function WorkshopSplit() {
  const workshop = site.workshop;
  if (!workshop) return null;

  return (
    <Section heading="Hàng dập tại xưởng" screens={1}>
      <div className="grid gap-8 lg:min-h-0 lg:flex-1 lg:grid-cols-12 lg:gap-6">
        <Photo
          src={workshop.photo.src}
          alt={workshop.photo.alt}
          ratio="3/2"
          sizes="(min-width: 1024px) 740px, 100vw"
          className="lg:col-span-7 lg:aspect-auto lg:h-full"
        />
        <p className="text-body lg:col-span-5 lg:self-end">{workshop.text}</p>
      </div>
    </Section>
  );
}

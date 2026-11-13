import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { site } from "@/lib/site.config";

/**
 * Khối "Hàng dập tại xưởng" (mục 5.2): ảnh máy dập 7 cột trái, chữ của chủ xưởng 5 cột phải.
 * Chưa có chữ hoặc ảnh của xưởng thì bỏ cả khối.
 */
export function WorkshopSplit() {
  const photo = site.photos.workshop;
  if (!site.workshopText || !photo) return null;
  return (
    <Section screens={1}>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
        <Photo src={photo.src} alt={photo.alt} ratio="3/2" sizes="(min-width: 1024px) 58vw, 100vw" className="lg:col-span-7" />
        <div className="lg:col-span-5">
          <h2 className="mb-6 text-h2">Hàng dập tại xưởng</h2>
          <p className="mb-8">{site.workshopText}</p>
          <Button asChild variant="secondary">
            <Link href="/gioi-thieu">Xem xưởng</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

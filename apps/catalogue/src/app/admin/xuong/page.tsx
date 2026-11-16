import type { Metadata } from "next";
import { removeSitePhoto, saveSitePhoto } from "@/app/admin/_actions/content";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Notice, noticeFrom } from "@/components/admin/Notice";
import { SiteForm } from "@/components/admin/SiteForm";
import { Photo } from "@/components/ui/Photo";
import { loadSite } from "@/lib/admin/repo";
import type { SitePhotoSlot } from "@/lib/site-schema";

export const metadata: Metadata = { title: "Thông tin xưởng" };

const SLOTS: { slot: SitePhotoSlot; label: string; ratio: "4/5" | "3/2"; note: string }[] = [
  { slot: "warehouse", label: "Kho hàng", ratio: "4/5", note: "Ảnh lớn ở đầu trang chủ. Tỉ lệ 4:5, hàng xếp chồng hoặc kho." },
  { slot: "workshop", label: "Máy dập", ratio: "3/2", note: "Khối Xưởng ở trang chủ. Tỉ lệ 3:2, máy đang chạy." },
  { slot: "storefront", label: "Mặt tiền", ratio: "3/2", note: "Trang giới thiệu và liên hệ. Tỉ lệ 3:2." },
];

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminSite({ searchParams }: Props) {
  const site = await loadSite();
  return (
    <>
      <h1 className="mb-8 text-h2 lg:mb-12">Thông tin xưởng</h1>
      <Notice text={await noticeFrom(searchParams)} />
      <SiteForm site={site} />
      <section id="anh" aria-labelledby="anh-xuong" className="mt-24 max-w-3xl">
        <h2 id="anh-xuong" className="mb-8 text-h3">
          Ảnh xưởng
        </h2>
        <ul className="flex flex-col">
          {SLOTS.map(({ slot, label, ratio, note }) => {
            const photo = site.photos[slot];
            return (
              <li key={slot} className="grid gap-6 border-t border-line py-8 sm:grid-cols-3">
                <div>
                  <h3 className="mb-2 text-lead font-semibold">{label}</h3>
                  <p className="mb-4 text-small text-ink-muted">{note}</p>
                  {photo ? <Photo src={photo.src} alt={photo.alt} ratio={ratio} sizes="240px" /> : <p className="text-ink-muted">Chưa có ảnh; khối dùng ảnh này đang bị bỏ.</p>}
                </div>
                <div className="flex flex-col gap-6 sm:col-span-2">
                  <ImageUpload action={saveSitePhoto} hidden={{ slot }} alt={photo?.alt} fileOptional={Boolean(photo)} submitLabel="Lưu ảnh" />
                  {photo ? (
                    <form action={removeSitePhoto}>
                      <input type="hidden" name="slot" value={slot} />
                      <ConfirmButton question={`Bỏ ảnh ${label}? File ảnh bị xoá.`}>
                        Bỏ ảnh này
                      </ConfirmButton>
                    </form>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

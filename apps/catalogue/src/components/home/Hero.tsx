import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { zaloLink } from "@/lib/contact";
import { site } from "@/lib/site.config";

/**
 * Hero (mục 5.2): đúng một màn hình, vào một lần khi tải. h1 gọi tên loại hàng và nơi chốn,
 * một câu có số mẫu đếm từ dữ liệu, nút chính và nút phụ. Ảnh kho hàng bên phải nếu đã có.
 */
export function Hero({ productCount }: { productCount: number }) {
  const zalo = zaloLink(site.zaloWholesale);
  const photo = site.photos.warehouse;
  const place = site.district ? ` ở ${site.district}` : "";
  return (
    <Section screens={1}>
      <div className="m-enter grid gap-8 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col justify-end lg:col-span-7">
          <h1 className="mb-6 text-display">Xưởng pano và bản lề cửa sắt{place}</h1>
          {productCount > 0 ? (
            <p className="mb-8 max-w-xl">
              {productCount} mẫu pano, bản lề, tôn và mâm cầu thang, có sẵn mã và kích thước. Chọn mẫu, gửi danh
              sách, xưởng báo giá sỉ.
            </p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            {zalo ? (
              <Button asChild variant="primary">
                <a href={zalo} target="_blank" rel="noopener noreferrer">
                  {site.mainAction}
                </a>
              </Button>
            ) : null}
            <Button asChild variant="secondary">
              <Link href="/san-pham">Xem catalogue</Link>
            </Button>
          </div>
        </div>
        {photo ? (
          <Photo src={photo.src} alt={photo.alt} ratio="4/5" sizes="(min-width: 1024px) 40vw, 100vw" priority className="lg:col-span-5" />
        ) : null}
      </div>
    </Section>
  );
}

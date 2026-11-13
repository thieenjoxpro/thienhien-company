import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { getProducts } from "@/lib/catalog";
import { zaloLink } from "@/lib/contact";
import { site } from "@/lib/site.config";

/**
 * Khối đầu trang chủ (mục 5.2): cùng header vừa một màn hình, vào một lần khi tải.
 * h1 gọi tên loại hàng và nơi chốn; câu dưới có số mẫu đếm từ dữ liệu.
 */
export async function Hero() {
  const count = (await getProducts()).length;
  const zalo = zaloLink(site.zaloWholesale);
  const photo = site.heroPhoto;

  return (
    <section aria-labelledby="hero-heading" className="lg:grid lg:screen-hero">
      <div>
        <Container className="grid gap-8 py-12 lg:h-full lg:grid-cols-12 lg:gap-6 lg:py-0">
          <div className="m-enter flex flex-col justify-end gap-6 lg:col-span-6 lg:py-24">
            <h1 id="hero-heading" className="text-display">
              Xưởng pano và bản lề cửa sắt{site.district ? ` ở ${site.district}` : ""}
            </h1>
            <p className="text-body">
              {count > 0 ? `${count} mẫu pano, bản lề, tôn và mâm cầu thang, có sẵn mã và kích thước. ` : ""}
              Chọn mẫu, gửi danh sách, xưởng báo giá sỉ qua Zalo.
            </p>
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
            <div className="m-enter lg:col-span-6">
              <Photo
                src={photo.src}
                alt={photo.alt}
                ratio="4/5"
                sizes="(min-width: 1024px) 640px, 100vw"
                priority
                className="lg:aspect-auto lg:h-full"
              />
            </div>
          ) : null}
        </Container>
      </div>
    </section>
  );
}

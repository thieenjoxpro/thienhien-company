import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { Price } from "@/components/catalogue/Price";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { zaloLink } from "@/lib/contact";
import type { Product } from "@/lib/schema";
import { site } from "@/lib/site.config";

interface HeroProps {
  productCount: number;
  /** Hai ảnh xếp chồng bên phải khối tối (mẫu tiêu biểu). */
  showcase: Product[];
  /** Mẫu mới nổi bật ở ô bên phải. */
  spotlight: Product | null;
}

/**
 * Hero design 3: khối tối hoa văn pano (h1, đoạn có số mẫu đếm từ dữ liệu, nút Zalo + Xem catalogue,
 * hai ảnh mẫu) và cột phải gồm một mẫu mới, hộp vàng "Mua sỉ theo mã" tới trang hỏi giá.
 */
export function Hero({ productCount, showcase, spotlight }: HeroProps) {
  const zalo = zaloLink(site.zaloWholesale);
  const [back, front] = showcase.flatMap((p) => (p.images[0] ? [p.images[0]] : []));
  return (
    <Container as="section" aria-labelledby="hero-tieu-de" className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-3">
      <div className="bg-pattern grid items-center gap-6 overflow-hidden rounded-card p-6 md:grid-cols-5 lg:col-span-2 lg:min-h-110 lg:p-12">
        <div className="flex flex-col gap-5 md:col-span-3">
          <p className="self-start rounded-tag bg-accent px-3 py-1 text-label font-bold text-on-accent">
            Xưởng {site.name}
            {site.district ? ` · ${site.district}` : ""}
          </p>
          <h1 id="hero-tieu-de" className="font-display text-hero text-balance text-on-ink">
            Pano, bản lề, tôn, mâm cầu thang <span className="text-accent">giá sỉ</span> cho thợ và đại lý
          </h1>
          {productCount > 0 ? (
            <p className="max-w-md text-lead text-on-ink-muted">
              {productCount} mẫu có sẵn mã, kích thước và độ dày. Chọn mẫu, gửi danh sách qua Zalo, xưởng báo giá theo số lượng.
            </p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            {zalo ? (
              <Button asChild variant="zalo">
                <a href={zalo} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={20} strokeWidth={2} aria-hidden />
                  {site.mainAction}
                </a>
              </Button>
            ) : null}
            <Button asChild variant="outlineLight">
              <Link href="/san-pham">Xem catalogue</Link>
            </Button>
          </div>
          {site.phone ? <p className="text-small text-on-ink-faint">Hoặc gọi xưởng: {site.phone}</p> : null}
        </div>
        {back ? (
          <div aria-hidden className="relative hidden aspect-square md:col-span-2 md:block">
            <div className="absolute top-0 left-0 w-3/4">
              <Photo src={back.src} alt="" ratio="1/1" sizes="300px" priority bare />
            </div>
            {front ? (
              <div className="absolute right-0 bottom-0 w-1/2">
                <Photo src={front.src} alt="" ratio="1/1" sizes="220px" bare />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-4">
        {spotlight?.images[0] ? (
          <Link href={`/san-pham/${spotlight.slug}`} className="flex grow items-center gap-3 rounded-card border border-line bg-surface p-5 hover:border-ink">
            <span className="flex grow flex-col gap-1">
              <span className="self-start rounded-tag bg-accent px-2 py-1 text-tag font-bold text-on-accent">Mới về</span>
              <span className="text-lead font-bold">{spotlight.name}</span>
              <span className="text-label text-ink-muted">{spotlight.mainSpec}</span>
              <Price priceFrom={spotlight.priceFrom} unit={spotlight.unit} />
              <span className="text-small font-semibold text-link">Xem mẫu ›</span>
            </span>
            <Photo src={spotlight.images[0].src} alt={spotlight.images[0].alt} ratio="1/1" sizes="132px" bare className="w-28 shrink-0 lg:w-32" />
          </Link>
        ) : null}
        <Link href="/hoi-gia" className="flex grow flex-col justify-center gap-2 rounded-card bg-accent p-5 text-on-accent hover:bg-accent-strong">
          <span className="font-display text-h2">Mua sỉ theo mã</span>
          <span className="text-small">Gửi danh sách mã và số lượng, xưởng báo giá sỉ qua Zalo. Không cần tài khoản.</span>
          <span className="text-small font-bold underline">Xem cách hỏi giá ›</span>
        </Link>
      </div>
    </Container>
  );
}

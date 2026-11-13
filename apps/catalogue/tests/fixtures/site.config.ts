// Cấu hình xưởng giả cho e2e: thay src/lib/site.config.ts khi build với CATALOGUE_FIXTURES=1
// (xem next.config.ts). Không bao giờ dùng cho build thật.
interface SitePhoto {
  src: string;
  alt: string;
}

export const site = {
  name: "Thiện Hiền",
  url: "http://localhost:4310",
  district: "Bình Tân, TP.HCM" as string | null,
  street: "12 đường số 7, Bình Tân, TP.HCM" as string | null,
  mapUrl: "https://maps.google.com/?q=Binh+Tan" as string | null,
  openingHours: "7:00 đến 17:30, thứ Hai đến thứ Bảy" as string | null,
  phone: "0900 000 000" as string | null,
  zaloWholesale: "0900000000" as string | null,
  zaloRetail: null as string | null,
  // Ảnh hero (kho hàng hoặc hàng xếp chồng, 4:5). null: hero chỉ có chữ
  heroPhoto: { src: "/xuong/kho-hang.webp", alt: "Kho hàng của xưởng, pano và bản lề xếp trên kệ" } as SitePhoto | null,
  // Khối Xưởng trên trang chủ: chữ do chủ xưởng viết + ảnh máy đang chạy. null: bỏ cả khối
  workshop: {
    text: "Xưởng dập pano và mâm cầu thang bằng máy dập 40 tấn, thép CT3 dày 0,8 đến 2 mm. Bản lề tiện tại xưởng. Nhận dập theo mẫu khách đưa.",
    photo: { src: "/xuong/may-dap.webp", alt: "Máy dập đang dập pano ô vuông tại xưởng" },
  } as { text: string; photo: SitePhoto } | null,
  showPrice: true,
  mainAction: "Hỏi giá qua Zalo",
} as const;

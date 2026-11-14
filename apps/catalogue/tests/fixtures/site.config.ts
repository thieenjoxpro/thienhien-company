// Cấu hình xưởng giả cho e2e: thay src/lib/site.config.ts khi build với CATALOGUE_FIXTURES=1
// (xem next.config.ts). Không bao giờ dùng cho build thật.
type SitePhoto = { src: string; alt: string };

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
  // Ảnh xưởng trong public/workshop (mục 4.3); null thì khối dùng ảnh đó không render ảnh hoặc bị bỏ
  photos: {
    warehouse: { src: "/workshop/kho-hang.webp", alt: "Pano và bản lề xếp chồng trong kho xưởng" } as SitePhoto | null,
    workshop: { src: "/workshop/may-dap.webp", alt: "Máy dập đang dập pano trong xưởng" } as SitePhoto | null,
    storefront: { src: "/workshop/mat-tien.webp", alt: "Mặt tiền xưởng nhìn từ đường" } as SitePhoto | null,
  },
  workshopText: "Máy dập 60 tấn chạy thép CT3 và SS400 dày tới 3 ly. Nhận dập pano theo mẫu khách mang tới." as string | null, // 2 đến 3 câu chủ xưởng viết cho khối Xưởng; null thì bỏ khối
  aboutText: "Xưởng dập pano, bản lề, mâm cầu thang từ thép tấm. Khách sỉ đặt theo mã trong catalogue, khách lẻ ghé xưởng xem hàng." as string | null, // đoạn giới thiệu xưởng do chủ xưởng viết cho /gioi-thieu; null thì trang chỉ có ảnh và liên hệ
  showPrice: true,
  mainAction: "Hỏi giá qua Zalo",
} as const;

// Cấu hình xưởng giả cho e2e: thay src/lib/site.config.ts khi build với CATALOGUE_FIXTURES=1
// (xem next.config.ts). Không bao giờ dùng cho build thật.
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
  showPrice: true,
  mainAction: "Hỏi giá qua Zalo",
} as const;

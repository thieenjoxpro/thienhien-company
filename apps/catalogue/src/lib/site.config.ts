// Dữ kiện của xưởng. Trường nào còn null thì phần tử dùng nó không được render;
// check:slop --production chặn build khi district hoặc zaloWholesale còn null (docs/PLAN.md mục 4.4).
interface SitePhoto {
  src: string;
  alt: string;
}

export const site = {
  name: "Thiện Hiền",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4310",
  district: null as string | null, // dạng "Quận, Thành phố"; BẮT BUỘC khi production
  street: null as string | null, // địa chỉ đầy đủ do chủ xưởng đưa
  mapUrl: null as string | null,
  openingHours: null as string | null, // dạng "7:00 đến 17:30, thứ Hai đến thứ Bảy"
  phone: null as string | null,
  zaloWholesale: null as string | null, // BẮT BUỘC khi production
  zaloRetail: null as string | null, // null: dùng chung zaloWholesale
  // Ảnh hero (kho hàng hoặc hàng xếp chồng, 4:5). null: hero chỉ có chữ
  heroPhoto: null as SitePhoto | null,
  // Khối Xưởng trên trang chủ: chữ do chủ xưởng viết + ảnh máy đang chạy. null: bỏ cả khối
  workshop: null as { text: string; photo: SitePhoto } | null,
  showPrice: true,
  mainAction: "Hỏi giá qua Zalo", // một cách viết, dùng ở nav, hero, dải liên hệ, PhoneBar
} as const;

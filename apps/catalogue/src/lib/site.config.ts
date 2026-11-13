// Dữ kiện của xưởng. Trường nào còn null thì phần tử dùng nó không được render;
// check:slop --production chặn build khi district hoặc zaloWholesale còn null (docs/PLAN.md mục 4.4).
type SitePhoto = { src: string; alt: string };

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
  // Ảnh xưởng trong public/workshop (mục 4.3); null thì khối dùng ảnh đó không render ảnh hoặc bị bỏ
  photos: {
    warehouse: null as SitePhoto | null, // kho hàng hoặc hàng xếp chồng, 4:5, cho hero
    workshop: null as SitePhoto | null, // máy dập đang chạy, 3:2
    storefront: null as SitePhoto | null, // mặt tiền xưởng
  },
  workshopText: null as string | null, // 2 đến 3 câu chủ xưởng viết cho khối Xưởng; null thì bỏ khối
  showPrice: true,
  mainAction: "Hỏi giá qua Zalo", // một cách viết, dùng ở nav, hero, dải liên hệ, PhoneBar
} as const;

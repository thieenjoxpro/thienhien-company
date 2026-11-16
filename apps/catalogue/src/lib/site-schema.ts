import { z } from "zod";

// Dữ kiện xưởng sửa được trong /admin/xuong, lưu ở src/data/site.json
const text = z.string().trim().min(1).nullable();
const PhotoSchema = z.object({ src: z.string().startsWith("/workshop/"), alt: z.string().min(8) }).nullable();

export const SiteDataSchema = z.object({
  district: text, // dạng "Quận, Thành phố"; BẮT BUỘC khi production
  street: text, // địa chỉ đầy đủ do chủ xưởng đưa
  mapUrl: z.url().nullable(),
  openingHours: text, // dạng "7:00 đến 17:30, thứ Hai đến thứ Bảy"
  phone: text,
  zaloWholesale: text, // BẮT BUỘC khi production
  zaloRetail: text, // null: dùng chung zaloWholesale
  // Ảnh xưởng trong public/workshop (mục 4.3); null thì khối dùng ảnh đó không render ảnh hoặc bị bỏ
  photos: z.object({
    warehouse: PhotoSchema, // kho hàng hoặc hàng xếp chồng, 4:5, cho hero
    workshop: PhotoSchema, // máy dập đang chạy, 3:2
    storefront: PhotoSchema, // mặt tiền xưởng
  }),
  workshopText: text, // 2 đến 3 câu chủ xưởng viết cho khối Xưởng; null thì bỏ khối
  aboutText: text, // đoạn giới thiệu cho /gioi-thieu; null thì trang chỉ có ảnh và liên hệ
  showPrice: z.boolean(),
});

export type SiteData = z.infer<typeof SiteDataSchema>;
export type SitePhotoSlot = keyof SiteData["photos"];

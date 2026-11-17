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
  showPrice: z.boolean(), // tắt thì mọi thẻ hiện "Liên hệ báo giá"; bật thì theo cờ showPrice của từng sản phẩm
  legalName: text, // tên công ty trên giấy phép, ở footer
  taxCode: text, // mã số thuế, ở footer
  // Người nghe máy ở khối "Ghé xưởng" và footer, theo thứ tự hiện; zalo: số đó có Zalo
  contacts: z
    .array(z.object({ name: z.string().trim().min(1), note: z.string().trim(), phone: z.string().trim().min(8), zalo: z.boolean() }))
    .max(4)
    .default([]),
});

export type SiteData = z.infer<typeof SiteDataSchema>;
export type SiteContact = SiteData["contacts"][number];
export type SitePhotoSlot = keyof SiteData["photos"];

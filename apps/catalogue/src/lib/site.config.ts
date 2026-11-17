// Dữ kiện của xưởng: phần sửa được nằm ở src/data/site.json (sửa qua /admin/xuong khi chạy dev).
// Trường nào còn null thì phần tử dùng nó không được render;
// check:slop --production chặn build khi district hoặc zaloWholesale còn null (docs/PLAN.md mục 4.4).
// Không parse bằng zod ở đây: file này vào cả component client, zod sẽ thêm khoảng 30 KB JS cho mọi trang.
// site.json được kiểm bằng SiteDataSchema trong check:data (verify, build) và khi admin ghi.
import siteJson from "@/data/site.json";
import type { SiteData } from "@/lib/site-schema";

const bundled = {
  name: "Thiện Hiền",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4310",
  ...(siteJson as SiteData),
  mainAction: "Hỏi giá qua Zalo", // một cách viết, dùng ở nav, hero, dải liên hệ, PhoneBar
} as const;

type Site = { readonly [K in keyof typeof bundled]: (typeof bundled)[K] };

// Chế độ máy chủ: thông tin xưởng sửa ở /admin nằm trong database, src/lib/server/store.ts nạp vào
// globalThis.__thStore. Đọc qua Proxy để mọi chỗ dùng site.phone, site.district thấy bản mới mà không
// phải đổi thành hàm async. Trên trình duyệt không có store nên component client chỉ được dùng các hằng
// (name, mainAction); dữ kiện sửa được (phone, zalo, địa chỉ) phải nhận qua props từ component server.
const live = () => (globalThis as { __thStore?: { site: SiteData } }).__thStore?.site;

export const site: Site = new Proxy(bundled, {
  get: (target, key: string) => {
    const store = live();
    return store && key in store ? store[key as keyof SiteData] : target[key as keyof typeof target];
  },
});

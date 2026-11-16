// Dữ kiện của xưởng: phần sửa được nằm ở src/data/site.json (sửa qua /admin/xuong khi chạy dev).
// Trường nào còn null thì phần tử dùng nó không được render;
// check:slop --production chặn build khi district hoặc zaloWholesale còn null (docs/PLAN.md mục 4.4).
import siteJson from "@/data/site.json";
import { SiteDataSchema } from "@/lib/site-schema";

export const site = {
  name: "Thiện Hiền",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4310",
  ...SiteDataSchema.parse(siteJson),
  mainAction: "Hỏi giá qua Zalo", // một cách viết, dùng ở nav, hero, dải liên hệ, PhoneBar
} as const;

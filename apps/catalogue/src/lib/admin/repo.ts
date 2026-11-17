// Đọc dữ liệu thật (file khi dev, database ở chế độ máy chủ) mỗi lần gọi, để /admin luôn thấy bản vừa ghi.
// Page và layout render song song: kiểm quyền ở đây nữa để không trang nào đọc dữ liệu khi chưa được phép.
import { z } from "zod";
import { PolicySchema } from "@/lib/policy-schema";
import { CategorySchema, ProductSchema } from "@/lib/schema";
import { SiteDataSchema } from "@/lib/site-schema";
import { readData } from "./files";
import { requireAdmin } from "./guard";

async function load<T extends z.ZodType>(file: string, schema: T) {
  await requireAdmin();
  return readData(file, schema);
}

export const loadProducts = () => load("products.json", z.array(ProductSchema));
export const loadCategories = () => load("categories.json", z.array(CategorySchema));
export const loadPolicies = () => load("policies.json", z.array(PolicySchema));
export const loadSite = () => load("site.json", SiteDataSchema);

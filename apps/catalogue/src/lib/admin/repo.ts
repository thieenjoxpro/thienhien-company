// Đọc dữ liệu thật trên đĩa mỗi lần gọi (không qua import), để /admin luôn thấy bản vừa ghi.
// Page và layout render song song: chặn ở đây nữa để bản build không bao giờ đọc file khi /admin bị tắt.
import { notFound } from "next/navigation";
import { z } from "zod";
import { PolicySchema } from "@/lib/policies";
import { CategorySchema, ProductSchema } from "@/lib/schema";
import { SiteDataSchema } from "@/lib/site-schema";
import { readData } from "./files";
import { adminEnabled } from "./guard";

function load<T extends z.ZodType>(file: string, schema: T) {
  if (!adminEnabled()) notFound();
  return readData(file, schema);
}

export const loadProducts = () => load("products.json", z.array(ProductSchema));
export const loadCategories = () => load("categories.json", z.array(CategorySchema));
export const loadPolicies = () => load("policies.json", z.array(PolicySchema));
export const loadSite = () => load("site.json", SiteDataSchema);

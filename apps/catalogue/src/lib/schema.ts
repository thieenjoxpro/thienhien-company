import { z } from "zod";

export const CategorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  parentSlug: z.string().nullable(), // tối đa 2 cấp
  description: z.string().max(160),
  image: z.string().nullable(),
  order: z.number().int(),
});

export const ProductSchema = z.object({
  sku: z.string().regex(/^TH-[A-Z]{2}\d{2,3}$/), // TH-BL03, trùng SKU app quản lý
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(4).max(80),
  categorySlug: z.string(),
  summary: z.string().min(20).max(200), // 1-2 câu, có số liệu
  images: z.array(z.object({ src: z.string(), alt: z.string().min(8) })).max(6), // rỗng: sản phẩm không lên trang
  specs: z.array(z.object({ label: z.string(), value: z.string() })).min(2),
  mainSpec: z.string(), // "Ø16 × 100 mm", hiện trên thẻ
  filters: z.object({
    thicknessMm: z.number().positive().optional(),
    material: z.string().optional(),
    finish: z.string().optional(),
  }),
  unit: z.enum(["cái", "bộ", "tấm", "mét", "kg"]),
  priceFrom: z.number().int().positive().nullable(), // VND, giá lẻ khởi điểm
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  updatedAt: z.iso.date(),
});

export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;

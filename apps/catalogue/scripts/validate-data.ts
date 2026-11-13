// Lớp dữ liệu (docs/PLAN.md mục 9.5): kiểm categories.json và products.json trước khi build.
//
//   tsx scripts/validate-data.ts [--production] [--data-dir src/data] [--image-dir public/products]
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { CategorySchema, ProductSchema } from "../src/lib/schema";

const TOP_LEVEL = ["pano", "ban-le", "ton", "mam-cau-thang"];
const MIN_PRODUCTS_IN_PRODUCTION = 12;

const args = process.argv.slice(2);
const production = args.includes("--production");
const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const option = (flag: string, fallback: string) => {
  const value = args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined;
  return resolve(appRoot, value ?? fallback);
};
const dataDir = option("--data-dir", "src/data");
const imageDir = option("--image-dir", "public/products");

const errors: string[] = [];
const fail = (message: string) => errors.push(message);

function load<T extends z.ZodType>(file: string, schema: T): z.infer<T> | null {
  const path = join(dataDir, file);
  const parsed = schema.safeParse(JSON.parse(readFileSync(path, "utf8")));
  if (parsed.success) return parsed.data;
  for (const issue of parsed.error.issues) fail(`${file} ${issue.path.join(".")}: ${issue.message}`);
  return null;
}

const hasData = existsSync(join(dataDir, "categories.json")) && existsSync(join(dataDir, "products.json"));
if (!hasData) {
  if (production) {
    console.error(`check:data: thiếu categories.json hoặc products.json trong ${dataDir}`);
    process.exit(1);
  }
  console.log(`check:data: chưa có dữ liệu trong ${dataDir}, bỏ qua (M1 tạo dữ liệu)`);
  process.exit(0);
}

const categories = load("categories.json", z.array(CategorySchema)) ?? [];
const products = load("products.json", z.array(ProductSchema)) ?? [];

const duplicates = (values: string[]) => values.filter((value, i) => values.indexOf(value) !== i);
for (const slug of duplicates(categories.map((c) => c.slug))) fail(`categories.json: slug "${slug}" trùng`);
for (const sku of duplicates(products.map((p) => p.sku))) fail(`products.json: sku "${sku}" trùng`);
for (const slug of duplicates(products.map((p) => p.slug))) fail(`products.json: slug "${slug}" trùng`);

const bySlug = new Map(categories.map((c) => [c.slug, c]));
for (const category of categories) {
  if (category.parentSlug && !bySlug.has(category.parentSlug)) fail(`categories.json: "${category.slug}" trỏ tới parentSlug "${category.parentSlug}" không tồn tại`);
}

for (const product of products) {
  const where = `products.json ${product.sku}`;
  if (!bySlug.has(product.categorySlug)) fail(`${where}: categorySlug "${product.categorySlug}" không tồn tại`);
  if (!product.specs.some((s) => s.label === "Kích thước" || s.label === "Độ dày")) fail(`${where}: specs thiếu "Kích thước" hoặc "Độ dày"`);
  for (const image of product.images) {
    const file = basename(image.src);
    if (!file.startsWith(product.sku)) fail(`${where}: ảnh "${file}" phải bắt đầu bằng mã ${product.sku}`);
    if (!existsSync(join(imageDir, file))) fail(`${where}: không thấy file ảnh ${join(imageDir, file)}`);
  }
}

if (production) {
  const withImages = products.filter((p) => p.images.length > 0);
  if (withImages.length < MIN_PRODUCTS_IN_PRODUCTION) {
    fail(`production: mới có ${withImages.length} sản phẩm có ảnh, cần ít nhất ${MIN_PRODUCTS_IN_PRODUCTION}`);
  }
  const topOf = (slug: string): string => {
    const parent = bySlug.get(slug)?.parentSlug;
    return parent ? topOf(parent) : slug;
  };
  for (const top of TOP_LEVEL) {
    if (!withImages.some((p) => topOf(p.categorySlug) === top)) fail(`production: nhóm "${top}" chưa có sản phẩm nào có ảnh`);
  }
}

if (errors.length) {
  for (const error of errors) console.error(`check:data: ${error}`);
  console.error(`\ncheck:data: ${errors.length} lỗi${production ? " (--production)" : ""}`);
  process.exit(1);
}
console.log(`check:data: hợp lệ, ${categories.length} danh mục, ${products.length} sản phẩm${production ? " (--production)" : ""}`);

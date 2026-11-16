// Form sản phẩm: chuyển giá trị chữ thành Product, kiểm theo ProductSchema và luật của check:data.
import { ProductSchema, type Category, type Product } from "@/lib/schema";
import { orNull, parseNumber, slugify, today, zodErrors, type FieldErrors, type Result, type Values } from "./form";

export const SPEC_ROWS = 10;

const MESSAGES: Record<string, string> = {
  sku: "Mã dạng TH-BL03: TH, hai chữ in hoa, 2 đến 3 chữ số.",
  slug: "Đường dẫn chỉ gồm chữ thường không dấu, số và dấu gạch ngang.",
  name: "Tên dài 4 đến 80 ký tự.",
  categorySlug: "Chọn một danh mục.",
  summary: "Mô tả ngắn dài 20 đến 200 ký tự.",
  specs: "Cần ít nhất 2 dòng thông số có cả tên và giá trị.",
  mainSpec: "Nhập thông số chính, ví dụ Ø16 × 100 mm.",
  unit: "Chọn đơn vị tính.",
  priceFrom: "Giá là số nguyên dương tính bằng đồng, hoặc để trống.",
  filters: "Độ dày là số dương, ví dụ 0,8.",
};

interface Context {
  products: Product[];
  categories: Category[];
  /** Mã của sản phẩm đang sửa; null khi thêm mới. */
  originalSku: string | null;
}

export function productFromForm(values: Values, { products, categories, originalSku }: Context): Result<Product> {
  const existing = products.find((p) => p.sku === originalSku);
  const name = values.name?.trim() ?? "";
  const specs = Array.from({ length: SPEC_ROWS }, (_, i) => ({
    label: values[`spec-${i}-label`]?.trim() ?? "",
    value: values[`spec-${i}-value`]?.trim() ?? "",
  })).filter((row) => row.label || row.value);
  const thickness = parseNumber(values.thicknessMm);
  const material = orNull(values.material);
  const finish = orNull(values.finish);

  const parsed = ProductSchema.safeParse({
    sku: values.sku?.trim().toUpperCase(),
    slug: values.slug?.trim() || slugify(name),
    name,
    categorySlug: values.categorySlug ?? "",
    summary: values.summary?.trim(),
    images: existing?.images ?? [],
    specs,
    mainSpec: values.mainSpec?.trim(),
    filters: { ...(thickness === undefined ? {} : { thicknessMm: thickness }), ...(material ? { material } : {}), ...(finish ? { finish } : {}) },
    unit: values.unit,
    priceFrom: parseNumber(values.priceFrom, true) ?? null,
    isNew: values.isNew === "on",
    isFeatured: values.isFeatured === "on",
    updatedAt: today(),
  });

  const errors: FieldErrors = parsed.success ? {} : zodErrors(parsed.error, MESSAGES);
  if (!values.mainSpec?.trim()) errors.mainSpec = MESSAGES.mainSpec ?? "";
  if (specs.some((row) => !row.label || !row.value)) errors.specs = "Mỗi dòng thông số cần cả tên và giá trị.";
  else if (specs.length >= 2 && !specs.some((row) => row.label === "Kích thước" || row.label === "Độ dày")) {
    errors.specs = "Cần một dòng tên đúng là \"Kích thước\" hoặc \"Độ dày\".";
  }
  if (!parsed.success || Object.keys(errors).length) return { ok: false, errors };

  const product = parsed.data;
  const others = products.filter((p) => p.sku !== originalSku);
  if (others.some((p) => p.sku === product.sku)) errors.sku = `Mã ${product.sku} đã có.`;
  if (others.some((p) => p.slug === product.slug)) errors.slug = `Đường dẫn ${product.slug} đã có ở sản phẩm khác.`;
  if (!categories.some((c) => c.slug === product.categorySlug)) errors.categorySlug = MESSAGES.categorySlug ?? "";
  if (Object.keys(errors).length) return { ok: false, errors };

  // Đổi mã thì đổi cả tên file ảnh (check:data đòi tên ảnh bắt đầu bằng mã)
  if (originalSku && originalSku !== product.sku) {
    product.images = product.images.map((image) => ({ ...image, src: image.src.replace(`/${originalSku}-`, `/${product.sku}-`) }));
  }
  return { ok: true, data: product };
}

/** Thay sản phẩm cũ tại chỗ, hoặc thêm vào cuối. */
export function upsert<T>(list: T[], item: T, isOriginal: (entry: T) => boolean): T[] {
  const index = list.findIndex(isOriginal);
  return index < 0 ? [...list, item] : list.map((entry, i) => (i === index ? item : entry));
}

/** Đổi chỗ phần tử i với phần tử kề bên (dir -1 lên, 1 xuống). */
export function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (index < 0 || target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target] as T, next[index] as T];
  return next;
}

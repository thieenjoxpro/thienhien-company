// Form danh mục, chính sách và thông tin xưởng.
import { PolicySchema, type Policy } from "@/lib/policies";
import { CategorySchema, type Category, type Product } from "@/lib/schema";
import { SiteDataSchema, type SiteData } from "@/lib/site-schema";
import { orNull, parseNumber, slugify, today, zodErrors, type Result, type Values } from "./form";

const CATEGORY_MESSAGES = {
  slug: "Đường dẫn chỉ gồm chữ thường không dấu, số và dấu gạch ngang.",
  name: "Tên dài ít nhất 2 ký tự.",
  description: "Mô tả tối đa 160 ký tự.",
  order: "Thứ tự là số nguyên.",
};

export function categoryFromForm(values: Values, categories: Category[], originalSlug: string | null): Result<Category> {
  const name = values.name?.trim() ?? "";
  const existing = categories.find((c) => c.slug === originalSlug);
  const parsed = CategorySchema.safeParse({
    slug: values.slug?.trim() || slugify(name),
    name,
    parentSlug: orNull(values.parentSlug),
    description: values.description?.trim() ?? "",
    image: existing?.image ?? null,
    order: parseNumber(values.order, true) ?? 0,
  });
  if (!parsed.success) return { ok: false, errors: zodErrors(parsed.error, CATEGORY_MESSAGES) };
  const category = parsed.data;
  const others = categories.filter((c) => c.slug !== originalSlug);
  if (others.some((c) => c.slug === category.slug)) return { ok: false, errors: { slug: `Đường dẫn ${category.slug} đã có.` } };
  if (category.parentSlug) {
    const parent = others.find((c) => c.slug === category.parentSlug);
    if (!parent || parent.parentSlug) return { ok: false, errors: { parentSlug: "Nhóm cha phải là một nhóm hàng cấp đầu." } };
    if (originalSlug && others.some((c) => c.parentSlug === originalSlug)) {
      return { ok: false, errors: { parentSlug: "Danh mục này đang có danh mục con nên phải ở cấp đầu (tối đa 2 cấp)." } };
    }
  }
  return { ok: true, data: category };
}

/** Đổi slug danh mục: kéo theo categorySlug của sản phẩm và parentSlug của danh mục con. */
export function renameCategory(products: Product[], categories: Category[], from: string, to: string) {
  if (from === to) return { products, categories };
  return {
    products: products.map((p) => (p.categorySlug === from ? { ...p, categorySlug: to } : p)),
    categories: categories.map((c) => (c.parentSlug === from ? { ...c, parentSlug: to } : c)),
  };
}

/** Lý do không xoá được danh mục, hoặc null. */
export function categoryInUse(slug: string, products: Product[], categories: Category[]): string | null {
  const count = products.filter((p) => p.categorySlug === slug).length;
  if (count) return `Còn ${count} sản phẩm thuộc danh mục này; chuyển chúng sang danh mục khác trước.`;
  if (categories.some((c) => c.parentSlug === slug)) return "Danh mục này còn danh mục con; xoá hoặc chuyển chúng trước.";
  return null;
}

export function policyFromForm(values: Values, policies: Policy[], originalSlug: string | null): Result<Policy> {
  const title = values.title?.trim() ?? "";
  const parsed = PolicySchema.safeParse({
    slug: values.slug?.trim() || slugify(title),
    title,
    updatedAt: today(),
    body: values.body?.replace(/\r\n/g, "\n").trim() ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      errors: zodErrors(parsed.error, {
        slug: CATEGORY_MESSAGES.slug,
        title: "Tiêu đề dài ít nhất 2 ký tự.",
        body: "Nhập nội dung chính sách.",
      }),
    };
  }
  if (policies.some((p) => p.slug !== originalSlug && p.slug === parsed.data.slug)) {
    return { ok: false, errors: { slug: `Đường dẫn ${parsed.data.slug} đã có.` } };
  }
  return { ok: true, data: parsed.data };
}

const SITE_TEXT_FIELDS = ["district", "street", "mapUrl", "openingHours", "phone", "zaloWholesale", "zaloRetail"] as const;

export function siteFromForm(values: Values, current: SiteData): Result<SiteData> {
  const parsed = SiteDataSchema.safeParse({
    ...current,
    ...Object.fromEntries(SITE_TEXT_FIELDS.map((field) => [field, orNull(values[field])])),
    workshopText: orNull(values.workshopText),
    aboutText: orNull(values.aboutText),
    showPrice: values.showPrice === "on",
  });
  if (!parsed.success) return { ok: false, errors: zodErrors(parsed.error, { mapUrl: "Link bản đồ phải bắt đầu bằng https://." }) };
  return { ok: true, data: parsed.data };
}

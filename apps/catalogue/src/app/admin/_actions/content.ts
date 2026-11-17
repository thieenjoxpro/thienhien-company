"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { categoryFromForm, categoryInUse, policyFromForm, renameCategory, siteFromForm } from "@/lib/admin/content-forms";
import { checkUpload, removePublic, saveUpload, writeData } from "@/lib/admin/files";
import { failed, formValues, type FormState } from "@/lib/admin/form";
import { assertAdmin } from "@/lib/admin/guard";
import { upsert } from "@/lib/admin/product-form";
import { loadCategories, loadPolicies, loadProducts, loadSite } from "@/lib/admin/repo";
import type { SitePhotoSlot } from "@/lib/site-schema";

const done = (path: string) => {
  revalidatePath("/", "layout");
  redirect(path);
};

export async function saveCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const values = formValues(formData);
  const original = values.originalSlug || null;
  const [categories, products] = await Promise.all([loadCategories(), loadProducts()]);
  const result = categoryFromForm(values, categories, original);
  if (!result.ok) return failed(result.errors, values);
  const renamed = original ? renameCategory(products, categories, original, result.data.slug) : { products, categories };
  await writeData("categories.json", upsert(renamed.categories, result.data, (c) => c.slug === original));
  if (renamed.products !== products) await writeData("products.json", renamed.products);
  done(`/admin/danh-muc/${result.data.slug}?luu=1`);
  return null;
}

export async function deleteCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const slug = String(formData.get("slug"));
  const [categories, products] = await Promise.all([loadCategories(), loadProducts()]);
  const reason = categoryInUse(slug, products, categories);
  if (reason) return failed({ delete: reason }, {});
  await writeData("categories.json", categories.filter((c) => c.slug !== slug));
  done("/admin/danh-muc?xoa=1");
  return null;
}

export async function savePolicy(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const values = formValues(formData);
  const original = values.originalSlug || null;
  const policies = await loadPolicies();
  const result = policyFromForm(values, policies, original);
  if (!result.ok) return failed(result.errors, values);
  await writeData("policies.json", upsert(policies, result.data, (p) => p.slug === original));
  done(`/admin/chinh-sach/${result.data.slug}?luu=1`);
  return null;
}

export async function deletePolicy(formData: FormData): Promise<void> {
  await assertAdmin();
  const slug = String(formData.get("slug"));
  await writeData("policies.json", (await loadPolicies()).filter((p) => p.slug !== slug));
  done("/admin/chinh-sach?xoa=1");
}

export async function saveSite(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const values = formValues(formData);
  const result = siteFromForm(values, await loadSite());
  if (!result.ok) return failed(result.errors, values);
  await writeData("site.json", result.data);
  done("/admin/xuong?luu=1");
  return null;
}

const SLOT_FILE: Record<SitePhotoSlot, string> = { warehouse: "kho-hang", workshop: "may-dap", storefront: "mat-tien" };

export async function removeSitePhoto(formData: FormData): Promise<void> {
  await assertAdmin();
  const slot = String(formData.get("slot")) as SitePhotoSlot;
  const site = await loadSite();
  const current = site.photos[slot];
  if (current) await removePublic(current.src);
  await writeData("site.json", { ...site, photos: { ...site.photos, [slot]: null } });
  done("/admin/xuong#anh");
}

/** Ảnh xưởng: tải ảnh mới (kèm mô tả) hoặc chỉ sửa mô tả. */
export async function saveSitePhoto(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const values = formValues(formData);
  const slot = values.slot as SitePhotoSlot;
  const site = await loadSite();
  const current = site.photos[slot];
  const file = formData.get("file");
  const hasFile = file instanceof File && file.size > 0;
  const errors: Record<string, string> = {};
  if (hasFile || !current) {
    const fileError = checkUpload(file);
    if (fileError) errors.file = fileError;
  }
  if ((values.alt?.trim().length ?? 0) < 8) errors.alt = "Mô tả ảnh dài ít nhất 8 ký tự: tả thứ có trong ảnh.";
  if (Object.keys(errors).length) return failed(errors, values);
  let src = current?.src ?? "";
  if (hasFile) {
    src = await saveUpload("workshop", SLOT_FILE[slot], file);
    if (current) await removePublic(current.src);
  }
  await writeData("site.json", { ...site, photos: { ...site.photos, [slot]: { src, alt: values.alt?.trim() ?? "" } } });
  done("/admin/xuong?anh=1#anh");
  return null;
}

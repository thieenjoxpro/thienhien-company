"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkUpload, removePublic, renamePublic, saveUpload, writeData } from "@/lib/admin/files";
import { failed, formValues, type FormState } from "@/lib/admin/form";
import { assertAdmin } from "@/lib/admin/guard";
import { move, productFromForm, upsert } from "@/lib/admin/product-form";
import { loadCategories, loadProducts } from "@/lib/admin/repo";

const done = (path: string) => {
  revalidatePath("/", "layout");
  redirect(path);
};

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const values = formValues(formData);
  const originalSku = values.originalSku || null;
  const [products, categories] = await Promise.all([loadProducts(), loadCategories()]);
  const result = productFromForm(values, { products, categories, originalSku });
  if (!result.ok) return failed(result.errors, values);
  const product = result.data;
  const before = products.find((p) => p.sku === originalSku);
  for (const [i, image] of (before?.images ?? []).entries()) {
    const renamed = product.images[i];
    if (renamed && renamed.src !== image.src) await renamePublic(image.src, renamed.src);
  }
  await writeData("products.json", upsert(products, product, (p) => p.sku === originalSku));
  done(`/admin/san-pham/${product.sku}?luu=1`);
  return null;
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await assertAdmin();
  const sku = String(formData.get("sku"));
  const products = await loadProducts();
  const product = products.find((p) => p.sku === sku);
  if (!product) return;
  for (const image of product.images) await removePublic(image.src);
  await writeData("products.json", products.filter((p) => p.sku !== sku));
  done("/admin/san-pham?xoa=1");
}

export async function addProductImage(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const values = formValues(formData);
  const products = await loadProducts();
  const product = products.find((p) => p.sku === values.sku);
  if (!product) return failed({ file: "Không thấy sản phẩm này." }, values);
  const file = formData.get("file");
  const errors: Record<string, string> = {};
  const fileError = checkUpload(file);
  if (fileError) errors.file = fileError;
  if ((values.alt?.trim().length ?? 0) < 8) errors.alt = "Mô tả ảnh dài ít nhất 8 ký tự: tả thứ có trong ảnh.";
  if (product.images.length >= 6) errors.file = "Mỗi sản phẩm tối đa 6 ảnh.";
  if (Object.keys(errors).length || !(file instanceof File)) return failed(errors, values);
  const src = await saveUpload("products", product.sku, file);
  const next = { ...product, images: [...product.images, { src, alt: values.alt?.trim() ?? "" }] };
  await writeData("products.json", upsert(products, next, (p) => p.sku === product.sku));
  done(`/admin/san-pham/${product.sku}?anh=1#anh`);
  return null;
}

/** Một form cho mỗi ảnh: nút bấm gửi intent = luu | len | xuong | xoa. */
export async function editProductImage(formData: FormData): Promise<void> {
  await assertAdmin();
  const values = formValues(formData);
  const index = Number(values.index);
  const products = await loadProducts();
  const product = products.find((p) => p.sku === values.sku);
  const image = product?.images[index];
  if (!product || !image) return;
  let images = product.images;
  if (values.intent === "luu" && (values.alt?.trim().length ?? 0) >= 8) images = images.map((img, i) => (i === index ? { ...img, alt: values.alt?.trim() ?? "" } : img));
  if (values.intent === "len") images = move(images, index, -1);
  if (values.intent === "xuong") images = move(images, index, 1);
  if (values.intent === "xoa") {
    await removePublic(image.src);
    images = images.filter((_, i) => i !== index);
  }
  await writeData("products.json", upsert(products, { ...product, images }, (p) => p.sku === product.sku));
  done(`/admin/san-pham/${product.sku}#anh`);
}

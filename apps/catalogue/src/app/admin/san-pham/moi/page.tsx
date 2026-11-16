import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { loadCategories } from "@/lib/admin/repo";

export const metadata: Metadata = { title: "Thêm sản phẩm" };

export default async function NewProduct() {
  const categories = await loadCategories();
  return (
    <>
      <Link href="/admin/san-pham" className="mb-6 flex min-h-11 items-center text-ink-muted underline underline-offset-4">
        Sản phẩm
      </Link>
      <h1 className="mb-2 text-h2">Thêm sản phẩm</h1>
      <p className="mb-8 text-ink-muted lg:mb-12">Lưu xong mới thêm được ảnh. Sản phẩm chưa có ảnh thì chưa hiện trên site.</p>
      <ProductForm product={null} categories={categories} />
    </>
  );
}

import type { Metadata } from "next";
import { BackLink } from "@/components/admin/AdminList";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { loadCategories } from "@/lib/admin/repo";

export const metadata: Metadata = { title: "Thêm danh mục" };

export default async function NewCategory() {
  return (
    <>
      <BackLink href="/admin/danh-muc">Danh mục</BackLink>
      <h1 className="mb-8 text-h2 lg:mb-12">Thêm danh mục</h1>
      <CategoryForm category={null} categories={await loadCategories()} />
    </>
  );
}

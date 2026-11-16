import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/admin/AdminList";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Notice, noticeFrom } from "@/components/admin/Notice";
import { loadCategories } from "@/lib/admin/repo";

export const metadata: Metadata = { title: "Sửa danh mục" };

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function EditCategory({ params, searchParams }: Props) {
  const { slug } = await params;
  const categories = await loadCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  return (
    <>
      <BackLink href="/admin/danh-muc">Danh mục</BackLink>
      <h1 className="mb-8 text-h2 lg:mb-12">{category.name}</h1>
      <Notice text={await noticeFrom(searchParams)} />
      <CategoryForm category={category} categories={categories} />
    </>
  );
}

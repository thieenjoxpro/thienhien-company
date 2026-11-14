import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Listing } from "@/components/catalogue/Listing";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog";

interface Props {
  params: Promise<{ slug: string }>;
}

// Chỉ danh mục đang có hàng mới có trang; slug khác trả 404
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCategories()).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  return category
    ? { title: category.name, description: category.description, alternates: { canonical: `/danh-muc/${category.slug}` } }
    : {};
}

// Trang danh mục (mục 5.3): cột danh mục, tìm, lọc, sắp xếp trong nhóm.
export default async function CategoryPage({ params }: Props) {
  const category = await getCategory((await params).slug);
  if (!category) notFound();
  const [products, parent] = await Promise.all([
    getProductsByCategory(category.slug),
    category.parentSlug ? getCategory(category.parentSlug) : null,
  ]);
  const crumbs = [
    { name: "Trang chủ", href: "/" },
    ...(parent ? [{ name: parent.name, href: `/danh-muc/${parent.slug}` }] : []),
    { name: category.name, href: `/danh-muc/${category.slug}` },
  ];
  return <Listing crumbs={crumbs} title={category.name} products={products} current={category.slug} />;
}

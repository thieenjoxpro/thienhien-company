import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingHeader } from "@/components/catalogue/ListingHeader";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { Section } from "@/components/ui/Section";
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
  return category ? { title: category.name, description: category.description } : {};
}

// Trang danh mục (mục 5.3). Cột danh mục bên trái và bộ lọc thêm ở M4.
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
  return (
    <Section>
      <ListingHeader crumbs={crumbs} title={category.name} count={products.length} />
      <ProductGrid products={products.toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt))} />
    </Section>
  );
}

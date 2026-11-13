import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Crumb } from "@/components/catalogue/Breadcrumb";
import { ProductListing } from "@/components/catalogue/ProductListing";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog";
import { site } from "@/lib/site.config";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await getCategories()).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  if (!category) return {};
  return { title: `${category.name} | ${site.name}`, description: category.description };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategory((await params).slug);
  if (!category) notFound();

  const [products, categories] = await Promise.all([getProductsByCategory(category.slug), getCategories()]);
  const parent = categories.find((c) => c.slug === category.parentSlug);
  const crumbs: Crumb[] = [
    { label: "Trang chủ", href: "/" },
    ...(parent ? [{ label: parent.name, href: `/danh-muc/${parent.slug}` }] : []),
    { label: category.name },
  ];

  return (
    <ProductListing
      title={category.name}
      crumbs={crumbs}
      intro={category.description}
      children={categories.filter((c) => c.parentSlug === category.slug)}
      products={products}
    />
  );
}

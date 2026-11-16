import type { Metadata } from "next";
import { PageSlide } from "@/components/layout/PageSlide";
import { notFound } from "next/navigation";
import { Listing } from "@/components/catalogue/Listing";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { getCategories, getCategory, getCategoryTree, getProductsByCategory } from "@/lib/catalog";

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

// Trang danh mục (design 3): cột danh mục và lọc, danh mục con, tìm, lọc, sắp xếp trong nhóm.
export default async function CategoryPage({ params }: Props) {
  const category = await getCategory((await params).slug);
  if (!category) notFound();
  const [products, parent, tree] = await Promise.all([
    getProductsByCategory(category.slug),
    category.parentSlug ? getCategory(category.parentSlug) : null,
    getCategoryTree(),
  ]);
  const children = tree.find((node) => node.slug === category.slug)?.children ?? [];
  const subs = children.map((child) => {
    const items = products.filter((p) => p.categorySlug === child.slug);
    return { slug: child.slug, name: child.name, count: items.length, image: items[0]?.images[0] ?? null };
  });
  const crumbs = [
    { name: "Trang chủ", href: "/" },
    ...(parent ? [{ name: parent.name, href: `/danh-muc/${parent.slug}` }] : []),
    { name: category.name, href: `/danh-muc/${category.slug}` },
  ];
  return (
    <>
      <PageSlide>
        <Listing crumbs={crumbs} title={category.name} description={category.description} products={products} current={category.slug} subs={subs} />
        <JsonLd data={breadcrumbLd(crumbs)} />
      </PageSlide>
    </>
  );
}

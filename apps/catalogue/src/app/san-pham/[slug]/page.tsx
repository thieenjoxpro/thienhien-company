import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/catalogue/Breadcrumb";
import { ProductGallery } from "@/components/catalogue/ProductGallery";
import { ProductInfo } from "@/components/catalogue/ProductInfo";
import { RecentlyViewed } from "@/components/catalogue/RecentlyViewed";
import { RelatedProducts } from "@/components/catalogue/RelatedProducts";
import { Section } from "@/components/ui/Section";
import { getCategory, getProduct, getProducts } from "@/lib/catalog";
import { site } from "@/lib/site.config";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  return {
    title: { absolute: `${product.name} ${product.sku} | ${site.name}` },
    description: product.summary,
    alternates: { canonical: `/san-pham/${product.slug}` },
    openGraph: { images: product.images.slice(0, 1).map((image) => ({ url: image.src, alt: image.alt })) },
  };
}

// Trang chi tiết (mục 5.4): ảnh 7 cột | thông tin 5 cột dính theo cuộn; rồi cùng nhóm, mẫu vừa xem.
export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const category = await getCategory(product.categorySlug);
  const group = category?.parentSlug ? await getCategory(category.parentSlug) : category;
  const crumbs = [
    { name: "Trang chủ", href: "/" },
    ...(group ? [{ name: group.name, href: `/danh-muc/${group.slug}` }] : []),
    ...(category && category !== group ? [{ name: category.name, href: `/danh-muc/${category.slug}` }] : []),
    { name: product.name, href: `/san-pham/${product.slug}` },
  ];
  return (
    <>
      <Section>
        <Breadcrumb items={crumbs} />
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-6">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} />
          </div>
          <div className="lg:col-span-5">
            <ProductInfo product={product} />
          </div>
        </div>
      </Section>
      {group ? <RelatedProducts product={product} groupName={group.name} /> : null}
      <RecentlyViewed current={product} />
    </>
  );
}

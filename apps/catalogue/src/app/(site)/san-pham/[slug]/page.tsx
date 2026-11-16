import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/catalogue/Breadcrumb";
import { ProductGallery } from "@/components/catalogue/ProductGallery";
import { ProductInfo } from "@/components/catalogue/ProductInfo";
import { RecentlyViewed } from "@/components/catalogue/RecentlyViewed";
import { RelatedProducts } from "@/components/catalogue/RelatedProducts";
import { JsonLd } from "@/components/seo/JsonLd";
import { SpecTable } from "@/components/catalogue/SpecTable";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategory, getProduct, getProducts } from "@/lib/catalog";
import { breadcrumbLd, productLd } from "@/lib/seo";

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
    title: `${product.name} ${product.sku}`,
    description: product.summary,
    alternates: { canonical: `/san-pham/${product.slug}` },
    openGraph: { images: product.images.slice(0, 1).map((image) => ({ url: image.src, alt: image.alt })) },
  };
}

// Trang chi tiết (design 3): ảnh | thông tin và mua; thông số kỹ thuật; cùng nhóm; mẫu vừa xem.
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
      <Container>
        <Breadcrumb items={crumbs} />
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
          <ProductGallery sku={product.sku} images={product.images} />
          <ProductInfo product={product} category={category} />
        </div>
        <section aria-labelledby="thong-so" className="mt-12 max-w-3xl lg:mt-14">
          <SectionHeading id="thong-so" rule={false} className="mb-4">
            Thông số kỹ thuật
          </SectionHeading>
          <SpecTable sku={product.sku} specs={product.specs} />
        </section>
      </Container>
      {group ? <RelatedProducts product={product} group={group} /> : null}
      <RecentlyViewed current={product} />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={productLd(product)} />
    </>
  );
}

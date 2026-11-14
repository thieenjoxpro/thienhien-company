// Dữ liệu có cấu trúc và URL tuyệt đối (mục 6). Thiếu dữ kiện thì không sinh khối tương ứng.
import type { Crumb } from "@/components/catalogue/Breadcrumb";
import type { Product } from "@/lib/schema";
import { site } from "@/lib/site.config";

export const absolute = (path: string) => new URL(path, site.url).toString();

/** Organization + LocalBusiness: chỉ khi đã có quận và địa chỉ thật. */
export function businessLd(): Record<string, unknown> | null {
  if (!site.district || !site.street) return null;
  return {
    "@type": ["Organization", "LocalBusiness"],
    name: site.name,
    url: absolute("/"),
    address: { "@type": "PostalAddress", streetAddress: site.street, addressLocality: site.district, addressCountry: "VN" },
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.openingHours ? { openingHours: site.openingHours } : {}),
    ...(site.photos.storefront ? { image: absolute(site.photos.storefront.src) } : {}),
  };
}

export function breadcrumbLd(crumbs: Crumb[]): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: absolute(crumb.href) })),
  };
}

/** Product: chỉ thêm offers khi có giá và site đang hiện giá. */
export function productLd(product: Product): Record<string, unknown> {
  const offers =
    site.showPrice && product.priceFrom !== null
      ? { offers: { "@type": "Offer", price: product.priceFrom, priceCurrency: "VND", url: absolute(`/san-pham/${product.slug}`) } }
      : {};
  return {
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.summary,
    image: product.images.map((image) => absolute(image.src)),
    brand: { "@type": "Brand", name: site.name },
    ...offers,
  };
}

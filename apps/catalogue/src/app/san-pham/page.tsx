import type { Metadata } from "next";
import { ProductListing } from "@/components/catalogue/ProductListing";
import { getProducts } from "@/lib/catalog";
import { site } from "@/lib/site.config";

export const metadata: Metadata = {
  title: `Tất cả sản phẩm | ${site.name}`,
  description: `Toàn bộ mẫu pano, bản lề, tôn và mâm cầu thang của xưởng ${site.name}, kèm mã và kích thước.`,
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <ProductListing
      title="Tất cả sản phẩm"
      crumbs={[{ label: "Trang chủ", href: "/" }, { label: "Tất cả sản phẩm" }]}
      products={products}
    />
  );
}

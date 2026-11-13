import type { Metadata } from "next";
import { ListingHeader } from "@/components/catalogue/ListingHeader";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { Section } from "@/components/ui/Section";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Tất cả sản phẩm" };

// Cửa hàng (mục 5.3). Tìm, lọc, sắp xếp thêm ở M4.
export default async function ShopPage() {
  const products = (await getProducts()).toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return (
    <Section>
      <ListingHeader
        crumbs={[
          { name: "Trang chủ", href: "/" },
          { name: "Tất cả sản phẩm", href: "/san-pham" },
        ]}
        title="Tất cả sản phẩm"
        count={products.length}
      />
      {products.length ? <ProductGrid products={products} /> : <p>Catalogue chưa có mẫu nào.</p>}
    </Section>
  );
}

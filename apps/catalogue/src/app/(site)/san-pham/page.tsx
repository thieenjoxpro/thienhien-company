import type { Metadata } from "next";
import { Listing } from "@/components/catalogue/Listing";
import { PageSlide } from "@/components/layout/PageSlide";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Tất cả sản phẩm", alternates: { canonical: "/san-pham" } };

// Cửa hàng (mục 5.3): mọi mẫu, có tìm, lọc, sắp xếp.
export default async function ShopPage() {
  return (
    <PageSlide>
      <Listing
        crumbs={[
          { name: "Trang chủ", href: "/" },
          { name: "Tất cả sản phẩm", href: "/san-pham" },
        ]}
        title="Tất cả sản phẩm"
        products={await getProducts()}
        current={null}
      />
    </PageSlide>
  );
}

import { Suspense } from "react";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/lib/schema";
import type { Crumb } from "./Breadcrumb";
import { CategorySidebar } from "./CategorySidebar";
import { ListingHeader } from "./ListingHeader";
import { ProductBrowser } from "./ProductBrowser";
import { ProductGrid } from "./ProductGrid";

interface ListingProps {
  crumbs: Crumb[];
  title: string;
  products: Product[];
  /** Slug danh mục đang xem; null là trang tất cả sản phẩm. */
  current: string | null;
}

/** Bố cục trang cửa hàng và danh mục (mục 5.3): cột danh mục 3 cột | bộ lọc và lưới 9 cột. */
export function Listing({ crumbs, title, products, current }: ListingProps) {
  return (
    <Section>
      <ListingHeader crumbs={crumbs} title={title} count={products.length} />
      <div className="lg:grid lg:grid-cols-12 lg:gap-6">
        <CategorySidebar current={current} />
        <div className="lg:col-span-9">
          {products.length ? (
            // Trước khi JS đọc xong tham số lọc trên URL, hiện lưới đầy đủ (HTML tĩnh vẫn có đủ thẻ)
            <Suspense fallback={<ProductGrid products={products} />}>
              <ProductBrowser products={products} />
            </Suspense>
          ) : (
            <p>Catalogue chưa có mẫu nào.</p>
          )}
        </div>
      </div>
    </Section>
  );
}

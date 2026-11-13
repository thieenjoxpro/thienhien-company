import Link from "next/link";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/lib/schema";
import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { ProductGrid } from "./ProductGrid";

interface ProductListingProps {
  title: string;
  crumbs: Crumb[];
  intro?: string;
  /** Danh mục con, hiện thành một hàng link dưới tiêu đề. */
  children?: { slug: string; name: string }[];
  products: Product[];
}

/** Khung chung của trang cửa hàng và trang danh mục (mục 5.3): đường dẫn, tiêu đề, số mẫu, lưới. */
export function ProductListing({ title, crumbs, intro, children = [], products }: ProductListingProps) {
  return (
    <Section>
      <Breadcrumb crumbs={crumbs} />
      <div className="mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 lg:mb-12">
        <h1 className="text-h2">{title}</h1>
        <p className="text-body text-ink-muted">{products.length} mẫu</p>
      </div>
      {intro ? <p className="mb-8 text-body">{intro}</p> : null}
      {children.length > 0 ? (
        <ul className="mb-8 flex flex-wrap gap-x-6">
          {children.map((child) => (
            <li key={child.slug}>
              <Link href={`/danh-muc/${child.slug}`} className="flex min-h-11 min-w-11 items-center underline underline-offset-4">
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {products.length > 0 ? (
        <ProductGrid products={products} layout="catalogue" heading="h2" />
      ) : (
        <p className="text-body">Catalogue chưa có mẫu nào.</p>
      )}
    </Section>
  );
}

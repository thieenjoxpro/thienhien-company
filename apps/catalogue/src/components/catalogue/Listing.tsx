import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { QuoteStrip } from "@/components/quote/QuoteStrip";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import type { Product } from "@/lib/schema";
import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { CategorySidebar } from "./CategorySidebar";
import { FilterProvider } from "./FilterContext";
import { FilterPanel } from "./FilterPanel";
import { FilterResults } from "./FilterResults";
import { HelpBox } from "./HelpBox";
import { FORWARD } from "./ProductCard";
import { ProductGrid } from "./ProductGrid";

interface SubCategory {
  slug: string;
  name: string;
  count: number;
  image: { src: string; alt: string } | null;
}

interface ListingProps {
  crumbs: Crumb[];
  title: string;
  description?: string;
  products: Product[];
  /** Slug danh mục đang xem; null là trang tất cả sản phẩm. */
  current: string | null;
  subs?: SubCategory[];
}

/**
 * Trang cửa hàng và danh mục (design 3): cột trái (danh mục, lọc, hộp trợ giúp) | tiêu đề, danh mục con,
 * thanh công cụ, lưới, dải hỏi giá. Trước khi JS đọc tham số lọc trên URL, hiện lưới đầy đủ.
 */
export function Listing({ crumbs, title, description, products, current, subs = [] }: ListingProps) {
  const intro = (
    <div className="mb-5 flex flex-col gap-2">
      <h1 className="font-display text-h1 uppercase">{title}</h1>
      <span aria-hidden className="block h-1 w-14 bg-accent" />
      {description ? <p className="mt-1 max-w-prose text-base text-ink-soft">{description}</p> : null}
    </div>
  );
  const tiles = subs.length ? (
    <ul className="mb-5 grid gap-3 sm:grid-cols-2">
      {subs.map((sub) => (
        <li key={sub.slug}>
          <Link href={`/danh-muc/${sub.slug}`} transitionTypes={FORWARD} className="flex items-center gap-4 rounded-card border-2 border-line p-3 hover:border-ink">
            {sub.image ? <Photo src={sub.image.src} alt="" ratio="1/1" sizes="88px" className="w-20 shrink-0 rounded-btn" /> : null}
            <span className="flex flex-col gap-1">
              <span className="text-lead font-bold">{sub.name}</span>
              <span className="text-small text-ink-muted">{sub.count} mẫu</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  ) : null;
  const layout = (aside: ReactNode, main: ReactNode) => (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="flex flex-col gap-5 lg:w-72 lg:shrink-0">{aside}</aside>
      <section aria-label="Danh sách mẫu" className="min-w-0 grow">
        {intro}
        {tiles}
        {main}
        <QuoteStrip />
      </section>
    </div>
  );
  const sidebar = <CategorySidebar current={current} />;
  return (
    <Container className="pb-4">
      <Breadcrumb items={crumbs} />
      {products.length ? (
        <Suspense fallback={layout(<div className="hidden lg:block">{sidebar}</div>, <ProductGrid products={products} />)}>
          <FilterProvider products={products}>
            {layout(
              <>
                <div className="hidden lg:block">{sidebar}</div>
                <div className="hidden lg:block">
                  <FilterPanel />
                </div>
                <div className="hidden lg:block">
                  <HelpBox tone="dark" />
                </div>
              </>,
              <FilterResults />,
            )}
          </FilterProvider>
        </Suspense>
      ) : (
        layout(sidebar, <p>Catalogue chưa có mẫu nào.</p>)
      )}
    </Container>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { MoreLink } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/lib/schema";

interface ProductShelfProps {
  id: string;
  title: string;
  products: Product[];
  /** Link "Xem tất cả" cuối hàng tiêu đề. */
  more: { href: string; label: string };
  /** Danh mục con hiện cạnh link Xem tất cả. */
  subs?: { slug: string; name: string }[];
  /** Ô cuối lưới (hộp trợ giúp). */
  extra?: ReactNode;
  /** Ảnh thẻ biến sang trang chi tiết; chỉ bật khi mã không lặp ở kệ khác (xem ProductGrid). */
  morph?: boolean;
}

/** Kệ hàng trên trang chủ: tiêu đề khối, danh mục con, tối đa 6 thẻ một hàng. Không có mẫu thì bỏ cả khối. */
export function ProductShelf({ id, title, products, more, subs = [], extra, morph = false }: ProductShelfProps) {
  if (!products.length) return null;
  return (
    <Section
      id={id}
      heading={title}
      headingAside={
        <div className="flex flex-wrap items-center gap-x-5">
          {subs.map((sub) => (
            <Link key={sub.slug} href={`/danh-muc/${sub.slug}`} className="flex min-h-11 items-center text-small font-medium text-ink-soft hover:text-link">
              {sub.name}
            </Link>
          ))}
          <MoreLink href={more.href}>{more.label}</MoreLink>
        </div>
      }
    >
      <ProductGrid products={products} layout="wide" extra={extra} morph={morph} />
    </Section>
  );
}

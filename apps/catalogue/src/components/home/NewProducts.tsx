import Link from "next/link";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { Section } from "@/components/ui/Section";
import { getNewProducts } from "@/lib/catalog";

const ROW = 4;

/** Khối Mẫu mới về (mục 5.2): một hàng 4 thẻ. Dưới 4 mẫu mới thì bỏ cả khối. */
export async function NewProducts() {
  const products = await getNewProducts(ROW);
  if (products.length < ROW) return null;

  return (
    <Section
      heading="Mẫu mới về"
      headingAside={
        <Link href="/san-pham?sx=moi" className="flex min-h-11 items-center underline underline-offset-4">
          Xem tất cả mẫu mới
        </Link>
      }
      screens={1}
    >
      <ProductGrid products={products} layout="row" />
    </Section>
  );
}

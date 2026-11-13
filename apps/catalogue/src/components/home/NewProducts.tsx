import Link from "next/link";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { Section } from "@/components/ui/Section";
import { getNewProducts } from "@/lib/catalog";

/** Khối "Mẫu mới về": một hàng 4 thẻ (điện thoại 2×2). Dưới 4 mẫu mới thì ẩn cả khối. */
export async function NewProducts() {
  const products = await getNewProducts(4);
  if (products.length < 4) return null;
  return (
    <Section
      heading="Mẫu mới về"
      screens={1}
      headingAside={
        <Link href="/san-pham?sx=moi" className="flex min-h-11 shrink-0 items-center underline underline-offset-4">
          Xem tất cả mẫu mới
        </Link>
      }
    >
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <li key={product.sku}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

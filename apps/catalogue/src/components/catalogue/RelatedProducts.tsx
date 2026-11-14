import { Section } from "@/components/ui/Section";
import { getRelatedProducts } from "@/lib/catalog";
import type { Product } from "@/lib/schema";
import { ProductCard } from "./ProductCard";

/** "Cùng nhóm {tên nhóm}" (mục 5.4): 4 thẻ cùng nhóm hàng; không có thì ẩn. */
export async function RelatedProducts({ product, groupName }: { product: Product; groupName: string }) {
  const related = await getRelatedProducts(product, 4);
  if (related.length === 0) return null;
  return (
    <Section heading={`Cùng nhóm ${groupName.toLowerCase()}`}>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
        {related.map((item) => (
          <li key={item.sku}>
            <ProductCard product={item} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

import { Section } from "@/components/ui/Section";
import { MoreLink } from "@/components/ui/SectionHeading";
import { getProductsByCategory, getRelatedProducts } from "@/lib/catalog";
import type { Product } from "@/lib/schema";
import { ProductGrid } from "./ProductGrid";

/** "Cùng nhóm {tên nhóm}" (design 3): tối đa 6 thẻ cùng nhóm hàng, link xem tất cả; không có thì ẩn. */
export async function RelatedProducts({ product, group }: { product: Product; group: { slug: string; name: string } }) {
  const [related, all] = await Promise.all([getRelatedProducts(product, 6), getProductsByCategory(group.slug)]);
  if (related.length === 0) return null;
  return (
    <Section
      heading={`Cùng nhóm ${group.name.toLowerCase()}`}
      headingAside={<MoreLink href={`/danh-muc/${group.slug}`}>{`Xem tất cả ${all.length} mẫu`}</MoreLink>}
    >
      <ProductGrid products={related} layout="wide" />
    </Section>
  );
}

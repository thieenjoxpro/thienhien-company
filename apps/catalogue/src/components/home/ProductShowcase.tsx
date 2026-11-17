import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { Section } from "@/components/ui/Section";
import { MoreLink } from "@/components/ui/SectionHeading";
import type { Product } from "@/lib/schema";
import { ProductTabs } from "./ProductTabs";

const PER_GROUP = 6;

interface ShowcaseGroup {
  slug: string;
  name: string;
  products: Product[];
}

/**
 * Khối "Mẫu đang có tại xưởng" (design V2) thay cho năm kệ hàng: một tab cho mỗi nhóm hàng
 * (số mẫu đếm từ dữ liệu), 6 mẫu đầu của nhóm, link xem tất cả nhóm đó.
 */
export function ProductShowcase({ groups }: { groups: ShowcaseGroup[] }) {
  const filled = groups.filter((group) => group.products.length > 0);
  if (!filled.length) return null;
  const panels = filled.map((group) => ({
    slug: group.slug,
    label: `${group.name} (${group.products.length})`,
    content: (
      <>
        {/* Mỗi mã chỉ thuộc một nhóm nên ảnh thẻ được mang tên view transition */}
        <ProductGrid products={group.products.slice(0, PER_GROUP)} layout="wide" morph />
        <div className="mt-4 flex justify-end">
          <MoreLink href={`/danh-muc/${group.slug}`}>{`Xem tất cả ${group.products.length} mẫu ${group.name.toLowerCase()}`}</MoreLink>
        </div>
      </>
    ),
  }));
  return (
    <Section id="mau" heading="Mẫu đang có tại xưởng">
      <ProductTabs panels={panels} />
    </Section>
  );
}

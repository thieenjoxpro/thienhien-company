import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Photo } from "@/components/ui/Photo";
import { MoreLink } from "@/components/ui/SectionHeading";
import { FORWARD } from "./ProductCard";
import { getCategoryTree, getProductsByCategory } from "@/lib/catalog";

const COUNT_WORDS = ["", "Một", "Hai", "Ba", "Bốn", "Năm", "Sáu"];

/**
 * Khối "Bốn nhóm hàng" (design V2): một thẻ cho mỗi nhóm hàng cấp đầu. Ảnh ngang 4:3 (ảnh danh mục,
 * chưa có thì ảnh mẫu đầu tiên), tên viết hoa, số mẫu đếm từ dữ liệu và các loại trong nhóm.
 */
export async function CategoryGrid() {
  const groups = await getCategoryTree();
  const cards = await Promise.all(
    groups.map(async (group) => {
      const products = await getProductsByCategory(group.slug);
      const image = group.image ? { src: group.image, alt: group.name } : products[0]?.images[0];
      // "bản lề cối, bản lề lá": danh mục con, không có thì tên vài mẫu
      const kinds = (group.children.length ? group.children.map((child) => child.name) : products.slice(0, 3).map((p) => p.name)).join(", ").toLowerCase();
      return image && products.length ? { group, image, count: products.length, kinds } : null;
    }),
  );
  const visible = cards.filter((card) => card !== null);
  if (!visible.length) return null;
  const total = (await Promise.all(groups.map((g) => getProductsByCategory(g.slug)))).reduce((sum, list) => sum + list.length, 0);

  return (
    <Section heading={`${COUNT_WORDS[visible.length] ?? visible.length} nhóm hàng`} headingAside={<MoreLink href="/san-pham">{`Xem tất cả ${total} mẫu`}</MoreLink>}>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {visible.map(({ group, image, count, kinds }) => (
          <li key={group.slug} className="m-reveal">
            <Link href={`/danh-muc/${group.slug}`} transitionTypes={FORWARD} className="m-lift flex h-full flex-col overflow-hidden rounded-card border border-line hover:border-ink">
              <Photo src={image.src} alt={image.alt} ratio="4/3" sizes="(min-width: 1024px) 300px, 50vw" className="m-zoom" />
              <span className="flex flex-col gap-1 p-4">
                <span className="font-display text-h3 uppercase">{group.name}</span>
                <span className="text-small text-ink-muted">
                  {count} mẫu<span className="hidden sm:inline"> · {kinds}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

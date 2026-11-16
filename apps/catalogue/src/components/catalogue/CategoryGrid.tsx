import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Photo } from "@/components/ui/Photo";
import { getCategoryTree, getProductsByCategory } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { site } from "@/lib/site.config";

/**
 * Khối "Danh mục sản phẩm" (design 3): một thẻ cho mỗi nhóm hàng cấp đầu. Ô ảnh nền photo (ảnh danh mục,
 * chưa có thì ảnh mẫu đầu tiên), tên viết hoa, số mẫu và giá lẻ thấp nhất, dòng danh mục con hoặc vài mẫu.
 */
export async function CategoryGrid() {
  const groups = await getCategoryTree();
  const cards = await Promise.all(
    groups.map(async (group) => {
      const products = await getProductsByCategory(group.slug);
      const cheapest = products.filter((p) => p.priceFrom !== null).toSorted((a, b) => (a.priceFrom ?? 0) - (b.priceFrom ?? 0))[0];
      const image = group.image ? { src: group.image, alt: group.name } : products[0]?.images[0];
      const note = group.children.length
        ? group.children.map((child) => `${child.name} (${products.filter((p) => p.categorySlug === child.slug).length})`).join(" · ")
        : products.slice(0, 3).map((p) => p.name).join(", ");
      return image && products.length ? { group, image, count: products.length, cheapest, note } : null;
    }),
  );
  const visible = cards.filter((card) => card !== null);
  if (!visible.length) return null;
  const total = (await Promise.all(groups.map((g) => getProductsByCategory(g.slug)))).reduce((sum, list) => sum + list.length, 0);

  return (
    <Section heading="Danh mục sản phẩm" headingAside={<p className="text-small text-ink-muted">{`${visible.length} nhóm hàng · ${total} mẫu`}</p>}>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {visible.map(({ group, image, count, cheapest, note }) => (
          <li key={group.slug} className="m-reveal">
            <Link href={`/danh-muc/${group.slug}`} className="m-lift flex h-full flex-col overflow-hidden rounded-card border border-line hover:border-ink">
              <Photo src={image.src} alt={image.alt} ratio="3/2" sizes="(min-width: 1024px) 300px, 50vw" className="m-zoom" />
              <span className="flex flex-col gap-1 p-4">
                <span className="font-display text-h3 uppercase">{group.name}</span>
                <span className="text-small text-ink-muted">
                  {count} mẫu
                  {site.showPrice && cheapest?.priceFrom ? ` · giá lẻ từ ${formatNumber(cheapest.priceFrom)}đ/${cheapest.unit}` : ""}
                </span>
                {note ? <span className="hidden text-label text-ink-muted sm:block">{note}</span> : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

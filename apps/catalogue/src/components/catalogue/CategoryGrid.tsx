import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { countByCategory, getCategoryTree, getProductsByCategory } from "@/lib/catalog";
import { CategoryTile } from "./CategoryTile";

/**
 * Khối "Bốn nhóm hàng" (mục 5.2): lưới không đều, ô đầu rộng 6 cột cao 2 hàng, các ô sau 3 cột,
 * kèm một ô chữ "Tất cả {n} mẫu". Ảnh ô là ảnh danh mục, chưa có thì lấy ảnh mẫu đầu tiên của nhóm.
 */
export async function CategoryGrid() {
  const [groups, counts] = await Promise.all([getCategoryTree(), countByCategory()]);
  const tiles = await Promise.all(
    groups.map(async (group) => {
      const products = await getProductsByCategory(group.slug);
      const prices = products.flatMap((p) => (p.priceFrom === null ? [] : [p.priceFrom]));
      const image = group.image ? { src: group.image, alt: group.name } : products[0]?.images[0];
      return image ? { group, image, priceFrom: prices.length ? Math.min(...prices) : null } : null;
    }),
  );
  const visible = tiles.filter((tile) => tile !== null);
  if (visible.length === 0) return null;
  const total = groups.reduce((sum, group) => sum + (counts[group.slug] ?? 0), 0);

  return (
    <Section heading="Bốn nhóm hàng" screens={1}>
      <div className="grid grid-cols-2 gap-3 lg:h-144 lg:grid-cols-12 lg:grid-rows-2 lg:gap-6">
        {visible.map(({ group, image, priceFrom }, index) => (
          <CategoryTile
            key={group.slug}
            category={group}
            image={image}
            count={counts[group.slug] ?? 0}
            priceFrom={priceFrom}
            span={index === 0 ? "large" : "small"}
          />
        ))}
        <Link
          href="/san-pham"
          className="flex min-h-11 items-end text-h3 underline underline-offset-4 lg:col-span-3"
        >
          Tất cả {total} mẫu
        </Link>
      </div>
    </Section>
  );
}

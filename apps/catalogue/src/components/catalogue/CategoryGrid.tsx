import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { getCategoryTree, getProducts, getProductsByCategory } from "@/lib/catalog";
import { CategoryTile, type CategoryTileData } from "./CategoryTile";

const COUNT_WORDS: Record<number, string> = { 2: "Hai nhóm hàng", 3: "Ba nhóm hàng", 4: "Bốn nhóm hàng" };

/** Ảnh của nhóm: ảnh nhóm trong dữ liệu, nếu chưa có thì ảnh của một mẫu trong nhóm (ưu tiên mẫu không nằm ở khối Mẫu mới về). */
async function getTiles(): Promise<CategoryTileData[]> {
  const groups = await getCategoryTree();
  const tiles = await Promise.all(
    groups.map(async (group) => {
      const products = await getProductsByCategory(group.slug);
      const prices = products.flatMap((p) => (p.priceFrom === null ? [] : [p.priceFrom]));
      const fallback = (products.find((p) => !p.isNew) ?? products[0])?.images[0];
      const image = group.image ? { src: group.image, alt: `Nhóm hàng ${group.name} của xưởng` } : fallback;
      if (!image) return null;
      return {
        slug: group.slug,
        name: group.name,
        count: products.length,
        priceFrom: prices.length > 0 ? Math.min(...prices) : null,
        image,
      };
    }),
  );
  return tiles.filter((tile) => tile !== null);
}

/** Khối nhóm hàng trên trang chủ (mục 5.2): ô đầu lớn, các ô còn lại nhỏ, cuối cùng là link tới toàn bộ catalogue. */
export async function CategoryGrid() {
  const tiles = await getTiles();
  if (tiles.length === 0) return null;
  const total = (await getProducts()).length;

  return (
    <Section heading={COUNT_WORDS[tiles.length] ?? "Nhóm hàng"} screens={1}>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:min-h-0 lg:flex-1 lg:grid-cols-12 lg:grid-rows-2 lg:gap-6">
        {tiles.map((tile, index) => (
          <CategoryTile key={tile.slug} tile={tile} span={index === 0 ? "large" : "small"} />
        ))}
        <Link href="/san-pham" className="flex min-h-11 items-end text-h3 underline underline-offset-4 lg:col-span-3">
          Tất cả {total} mẫu
        </Link>
      </div>
    </Section>
  );
}

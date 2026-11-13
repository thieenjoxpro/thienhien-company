import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site.config";

const spans = {
  large: "col-span-2 lg:col-span-6 lg:row-span-2",
  small: "lg:col-span-3",
} as const;

export interface CategoryTileData {
  slug: string;
  name: string;
  count: number;
  /** Giá lẻ thấp nhất trong nhóm; null khi nhóm không có mẫu nào ghi giá. */
  priceFrom: number | null;
  image: { src: string; alt: string };
}

interface CategoryTileProps {
  tile: CategoryTileData;
  span: keyof typeof spans;
}

/** Ô nhóm hàng: ảnh phủ ô, tên và số mẫu nằm dưới ảnh trong cùng ô. Cả ô là một link. */
export function CategoryTile({ tile, span }: CategoryTileProps) {
  const price = site.showPrice && tile.priceFrom !== null ? `, từ ${formatPrice(tile.priceFrom)}` : "";
  return (
    <Link href={`/danh-muc/${tile.slug}`} className={`m-lift flex flex-col ${spans[span]}`}>
      <Photo
        src={tile.image.src}
        alt={tile.image.alt}
        ratio={span === "large" ? "3/2" : "1/1"}
        sizes={span === "large" ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 320px, 50vw"}
        className="m-zoom lg:aspect-auto lg:min-h-0 lg:flex-1"
      />
      <h3 className="mt-4 text-h3">{tile.name}</h3>
      <p className="text-body text-ink-muted">
        {tile.count} mẫu{price}
      </p>
    </Link>
  );
}

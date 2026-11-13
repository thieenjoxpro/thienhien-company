import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site.config";

interface CategoryTileProps {
  category: { slug: string; name: string };
  image: { src: string; alt: string };
  count: number;
  priceFrom: number | null;
  /** Ô lớn (Pano): rộng 6 cột, cao 2 hàng từ 1024px. */
  span: "large" | "small";
}

/** Ô nhóm hàng trên trang chủ: ảnh phủ kín ô, dưới ảnh trong cùng ô là tên và "{n} mẫu, từ {giá} đ". */
export function CategoryTile({ category, image, count, priceFrom, span }: CategoryTileProps) {
  const price = site.showPrice && priceFrom !== null ? `, từ ${formatPrice(priceFrom)}` : "";
  return (
    <Link
      href={`/danh-muc/${category.slug}`}
      className={cn("m-lift flex flex-col", span === "large" ? "col-span-2 lg:col-span-6 lg:row-span-2" : "lg:col-span-3")}
    >
      <Photo
        src={image.src}
        alt={image.alt}
        ratio={span === "large" ? "4/5" : "1/1"}
        sizes={span === "large" ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
        className="m-zoom mb-4 lg:aspect-auto lg:min-h-0 lg:flex-1"
      />
      <h3 className="text-h3">{category.name}</h3>
      <p>
        {count} mẫu{price}
      </p>
    </Link>
  );
}

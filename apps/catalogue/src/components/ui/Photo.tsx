import Image from "next/image";
import { cn } from "@/lib/cn";

const ratios = {
  "1/1": "aspect-square",
  "4/5": "aspect-4/5",
  "3/2": "aspect-3/2",
} as const;

interface PhotoProps {
  src: string;
  alt: string;
  ratio: keyof typeof ratios;
  /** Khai báo đúng theo lưới nơi ảnh nằm, ví dụ "(min-width: 1280px) 300px, 50vw". */
  sizes: string;
  /** Ảnh LCP (hero): tải trước. Next 16 gọi là preload. */
  priority?: boolean;
  className?: string;
}

/** Ảnh vuông góc, nền surface khi đang tải, không chú thích. img là con trực tiếp để lớp phóng ảnh của thẻ bắt được. */
export function Photo({ src, alt, ratio, sizes, priority = false, className }: PhotoProps) {
  return (
    <div className={cn("relative overflow-hidden bg-surface", ratios[ratio], className)}>
      <Image src={src} alt={alt} fill sizes={sizes} preload={priority} className="object-cover" />
    </div>
  );
}

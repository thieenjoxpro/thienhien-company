"use client";

import Image from "next/image";
import { useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";

/** Ảnh chính 1:1 trong khung viền và hàng ảnh nhỏ 96px bấm để đổi (design 3). Không zoom, không lightbox. */
export function ProductGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;
  return (
    <div className="flex flex-col gap-3">
      <Photo
        key={current.src}
        src={current.src}
        alt={current.alt}
        ratio="1/1"
        sizes="(min-width: 1024px) 600px, 100vw"
        priority
        className="rounded-card border border-line"
      />
      {images.length > 1 ? (
        <ul aria-label="Chọn ảnh" className="flex gap-3">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                aria-label={`Xem ảnh ${index + 1}`}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
                className={cn("relative block size-24 overflow-hidden rounded-btn border-2 bg-photo", index === active ? "border-ink" : "border-line")}
              >
                <Image src={image.src} alt="" fill sizes="96px" className="object-contain" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

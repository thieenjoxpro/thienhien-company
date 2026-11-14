"use client";

import Image from "next/image";
import { useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";

/** Ảnh chính 1:1 và hàng ảnh nhỏ bấm để đổi (mục 5.4). Không zoom, không lightbox. */
export function ProductGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;
  return (
    <div>
      <Photo key={current.src} src={current.src} alt={current.alt} ratio="1/1" sizes="(min-width: 1024px) 55vw, 100vw" priority />
      {images.length > 1 ? (
        <ul className="mt-3 flex gap-3">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                aria-label={`Xem ảnh ${index + 1}`}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
                className={cn("relative block size-20 overflow-hidden border", index === active ? "border-ink" : "border-transparent")}
              >
                <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

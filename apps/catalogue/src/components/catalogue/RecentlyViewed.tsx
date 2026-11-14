"use client";

import { useEffect, useState } from "react";
import { Section } from "@/components/ui/Section";
import { ProductCard, type CardProduct } from "./ProductCard";

const KEY = "th-recent-v1";
const KEEP = 8;
const SHOW = 4;

function read(): CardProduct[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as CardProduct[]) : [];
  } catch {
    return [];
  }
}

/**
 * "Mẫu vừa xem" (mục 5.4): tối đa 4 thẻ, không tính mẫu đang xem; rỗng thì ẩn.
 * Lưu trong trình duyệt, đọc sau khi hydrate để không lệch HTML máy chủ.
 */
export function RecentlyViewed({ current }: { current: CardProduct }) {
  const [items, setItems] = useState<CardProduct[]>([]);
  useEffect(() => {
    const previous = read().filter((p) => p.sku !== current.sku && p.images.length > 0);
    setItems(previous.slice(0, SHOW));
    const own = { ...current, images: current.images.slice(0, 1) };
    try {
      window.localStorage.setItem(KEY, JSON.stringify([own, ...previous].slice(0, KEEP)));
    } catch {
      // Chế độ ẩn danh hoặc bị chặn lưu trữ: chỉ mất danh sách vừa xem
    }
  }, [current]);

  if (items.length === 0) return null;
  return (
    <Section heading="Mẫu vừa xem">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
        {items.map((product) => (
          <li key={product.sku}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

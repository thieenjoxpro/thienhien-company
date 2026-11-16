"use client";

import { useEffect, useState } from "react";
import { Section } from "@/components/ui/Section";
import type { CardProduct } from "./ProductCard";
import { ProductGrid } from "./ProductGrid";

const KEY = "th-recent-v1";
const KEEP = 8;
const SHOW = 6;

function read(): CardProduct[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as CardProduct[]) : [];
  } catch {
    return [];
  }
}

/**
 * "Mẫu vừa xem": tối đa 6 thẻ, không tính mẫu đang xem; rỗng thì ẩn.
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
      <ProductGrid products={items} layout="wide" />
    </Section>
  );
}

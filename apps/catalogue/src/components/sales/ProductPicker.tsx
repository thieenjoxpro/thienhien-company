"use client";

import { normalizeVietnamese } from "@thien-hien/shared";
import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { parseQuantity } from "@/lib/sales/money";
import type { SaleLine } from "@/lib/sales/sale-state";
import type { SaleProduct } from "@/lib/sales/types";
import { PickButton } from "./PickButton";
import { SearchField } from "./SearchField";

interface Props {
  products: SaleProduct[];
  top: SaleProduct[];
  lines: SaleLine[];
  onAdd: (product: SaleProduct) => void;
}

/** Lưới mặt hàng hay bán và ô tìm: chạm một lần thêm 1, chạm lại cộng 1. */
export function ProductPicker({ products, top, lines, onAdd }: Props) {
  const [query, setQuery] = useState("");
  const needle = normalizeVietnamese(query);
  const found = needle ? products.filter((p) => normalizeVietnamese(`${p.sku} ${p.name}`).includes(needle)).slice(0, 12) : [];
  const chosen = (sku: string) => {
    const line = lines.find((l) => l.sku === sku);
    const quantity = line ? parseQuantity(line.quantity) : 0;
    return line ? `Đã chọn: ${Number.isNaN(quantity) ? line.quantity : formatNumber(quantity)}` : null;
  };
  const tile = (p: SaleProduct) => (
    <li key={p.sku}>
      <PickButton title={p.name} note={`${p.sku} · tính theo ${p.unit}`} badge={chosen(p.sku)} onClick={() => onAdd(p)} />
    </li>
  );

  return (
    <div className="flex flex-col gap-4">
      {top.length ? (
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Mặt hàng hay bán">
          {top.map(tile)}
        </ul>
      ) : null}
      <SearchField label="Tìm hàng khác (tên không dấu hoặc mã)" value={query} onChange={setQuery} />
      {needle ? (
        found.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Mặt hàng tìm được">
            {found.map(tile)}
          </ul>
        ) : (
          <p className="text-sale">Không thấy mặt hàng nào như vậy.</p>
        )
      ) : null}
    </div>
  );
}

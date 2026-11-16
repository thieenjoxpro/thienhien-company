"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { applyFilters, facetsOf, isFiltered, parseFilters, serializeFilters, type FilterState } from "@/lib/filters";
import type { Product } from "@/lib/schema";

interface FilterApi {
  state: FilterState;
  update: (next: FilterState) => void;
  results: Product[];
  facets: ReturnType<typeof facetsOf>;
  filtered: boolean;
  /** Đường dẫn không có tham số lọc (link Xoá lọc). */
  pathname: string;
}

const FilterCtx = createContext<FilterApi | null>(null);

export function useFilters(): FilterApi {
  const api = use(FilterCtx);
  if (!api) throw new Error("useFilters phải nằm trong <FilterProvider>");
  return api;
}

/**
 * Trạng thái tìm, lọc, sắp xếp của trang danh sách, dùng chung cho cột lọc và lưới (hai cột khác nhau).
 * Đổi ngay trên giao diện, URL theo sau (router.replace, không cuộn); Back hoặc reload thì đọc lại từ URL.
 */
export function FilterProvider({ products, children }: { products: Product[]; children: ReactNode }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = params.toString();
  const [state, setState] = useState(() => parseFilters(new URLSearchParams(query)));
  useEffect(() => setState(parseFilters(new URLSearchParams(query))), [query]);
  const results = useMemo(() => applyFilters(products, state), [products, state]);
  const facets = useMemo(() => facetsOf(products), [products]);
  const update = useCallback(
    (next: FilterState) => {
      setState(next);
      const qs = serializeFilters(next);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );
  const filtered = isFiltered(state);
  const api = useMemo(() => ({ state, update, results, facets, filtered, pathname }), [state, update, results, facets, filtered, pathname]);
  return (
    <FilterCtx value={api}>
      {/* Trang đang lọc: không index, canonical vẫn là URL gốc (khai trong metadata của trang) */}
      {filtered ? <meta name="robots" content="noindex, follow" /> : null}
      {children}
    </FilterCtx>
  );
}

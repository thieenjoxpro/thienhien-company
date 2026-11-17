"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { createContext, use, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
 * Đổi ngay trên giao diện, URL theo sau (history.replaceState, không cuộn); Back hoặc reload thì đọc lại từ URL.
 */
export function FilterProvider({ products, children }: { products: Product[]; children: ReactNode }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const query = params.toString();
  const [state, setState] = useState(() => parseFilters(new URLSearchParams(query)));
  // URL do chính trang ghi có thể về trễ hơn state, nhất là khi view transition đang chạy.
  // Bỏ qua các URL đó, nếu không URL cũ sẽ ghi đè lựa chọn mới; chỉ URL từ ngoài (Back, link) mới nạp lại state.
  const pushed = useRef(new Set<string>());
  useEffect(() => {
    const fromUrl = parseFilters(new URLSearchParams(query));
    if (pushed.current.delete(serializeFilters(fromUrl))) return;
    setState(fromUrl);
  }, [query]);
  // Ô lọc đổi ngay; lưới đọc giá trị trễ, lần render đó là transition nên <ViewTransition> quanh lưới chạy hiệu ứng
  const shown = useDeferredValue(state);
  const results = useMemo(() => applyFilters(products, shown), [products, shown]);
  const facets = useMemo(() => facetsOf(products), [products]);
  const update = useCallback(
    (next: FilterState) => {
      setState(next);
      const qs = serializeFilters(next);
      pushed.current.add(qs);
      // history.replaceState thay cho router.replace: Next vẫn đồng bộ useSearchParams, nhưng URL đổi ngay,
      // không phải chờ một lượt điều hướng (bị view transition đang chạy giữ lại) và không gọi lại server.
      window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname],
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

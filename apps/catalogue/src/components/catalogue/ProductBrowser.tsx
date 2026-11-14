"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { applyFilters, facetsOf, isFiltered, parseFilters, serializeFilters, type FilterState } from "@/lib/filters";
import type { Product } from "@/lib/schema";
import { FilterBar } from "./FilterBar";
import { ProductGrid } from "./ProductGrid";

const FIRST_PAGE = 48;
const MORE = 24;

/**
 * Lưới có tìm, lọc, sắp xếp phía client; trạng thái nằm trên URL (router.replace, không cuộn).
 * Từ 1024px bộ lọc nằm trên lưới; dưới 1024px nút "Lọc mẫu" mở bảng lọc toàn màn hình.
 */
export function ProductBrowser({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState(FIRST_PAGE);

  const query = params.toString();
  // Đổi ngay trên giao diện, URL theo sau; Back hoặc reload thì đọc lại từ URL
  const [state, setState] = useState(() => parseFilters(new URLSearchParams(query)));
  useEffect(() => setState(parseFilters(new URLSearchParams(query))), [query]);
  const results = useMemo(() => applyFilters(products, state), [products, state]);
  const facets = useMemo(() => facetsOf(products), [products]);
  const update = useCallback(
    (next: FilterState) => {
      setState(next);
      const qs = serializeFilters(next);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      setShown(FIRST_PAGE);
    },
    [router, pathname],
  );
  const filtered = isFiltered(state);

  return (
    <>
      {/* Trang đang lọc: không index, canonical vẫn là URL gốc (khai trong metadata của trang) */}
      {filtered ? <meta name="robots" content="noindex, follow" /> : null}
      <div className="mb-8 hidden lg:block">
        <FilterBar facets={facets} value={state} onChange={update} />
      </div>
      <div className="mb-8 flex items-center gap-6 lg:hidden">
        <Button variant="secondary" onClick={() => dialog.current?.showModal()}>
          Lọc mẫu
        </Button>
      </div>
      <dialog ref={dialog} aria-label="Lọc mẫu" className="m-0 size-full max-h-none max-w-none bg-ground p-0 text-ink lg:hidden">
        <Container className="py-8">
          <FilterBar facets={facets} value={state} onChange={update} />
          <Button variant="secondary" onClick={() => dialog.current?.close()} className="mt-8">
            Xem {results.length} mẫu
          </Button>
        </Container>
      </dialog>
      <div className="mb-6 flex min-h-11 flex-wrap items-center gap-x-6">
        <p aria-live="polite">{results.length} mẫu khớp</p>
        {filtered ? (
          <Link href={pathname} scroll={false} className="flex min-h-11 items-center underline underline-offset-4">
            Xoá lọc
          </Link>
        ) : null}
      </div>
      {results.length ? (
        <ProductGrid products={results.slice(0, shown)} />
      ) : (
        <p>Không có mẫu nào khớp với lọc này.</p>
      )}
      {results.length > shown ? (
        <Button variant="secondary" onClick={() => setShown((n) => n + MORE)} className="mt-12">
          Hiện thêm {MORE} mẫu
        </Button>
      ) : null}
    </>
  );
}

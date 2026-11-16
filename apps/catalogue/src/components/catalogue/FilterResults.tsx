"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GROUPS, SORTS, type SortKey } from "@/lib/filters";
import { useFilters } from "./FilterContext";
import { FilterPanel } from "./FilterPanel";
import { ProductGrid } from "./ProductGrid";

const FIRST_PAGE = 48;
const MORE = 24;

/**
 * Thanh công cụ (số mẫu, chip lọc đang bật bấm để bỏ, sắp xếp), lưới, trạng thái rỗng, nút hiện thêm.
 * Dưới 1024px nút "Lọc mẫu" mở bảng lọc toàn màn hình bằng <dialog>.
 */
export function FilterResults() {
  const { state, update, results, facets, filtered, pathname } = useFilters();
  const [shown, setShown] = useState(FIRST_PAGE);
  const dialog = useRef<HTMLDialogElement>(null);
  const sortId = useId();
  const chips = [
    ...(state.q ? [{ key: "q", label: `Tìm: ${state.q}`, remove: () => update({ ...state, q: "" }) }] : []),
    ...GROUPS.flatMap(({ key }) =>
      state[key].map((value) => ({
        key: `${key}-${value}`,
        label: facets[key].find((f) => f.value === value)?.label ?? value,
        remove: () => update({ ...state, [key]: state[key].filter((v) => v !== value) }),
      })),
    ),
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-card bg-surface px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 text-small">
          <p aria-live="polite" className="font-bold">
            {results.length} mẫu
          </p>
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.remove}
              aria-label={`Bỏ lọc ${chip.label}`}
              className="flex h-8 items-center gap-1 rounded-full border border-ink bg-ground px-3 text-label font-medium"
            >
              {chip.label}
              <X size={14} strokeWidth={2.4} aria-hidden />
            </button>
          ))}
          {filtered ? (
            <Link href={pathname} scroll={false} className="flex min-h-11 items-center px-1 font-semibold text-link underline">
              Xoá lọc
            </Link>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="md" onClick={() => dialog.current?.showModal()} className="lg:hidden">
            Lọc mẫu
          </Button>
          <label htmlFor={sortId} className="text-small text-ink-muted">
            Sắp xếp
          </label>
          <select
            id={sortId}
            value={state.sx}
            onChange={(event) => {
              update({ ...state, sx: event.target.value as SortKey });
              setShown(FIRST_PAGE);
            }}
            className="h-11 rounded-btn border border-line-strong bg-ground px-3 text-small font-medium"
          >
            {SORTS.map((sort) => (
              <option key={sort.key} value={sort.key}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <dialog ref={dialog} aria-label="Lọc mẫu" className="m-0 size-full max-h-none max-w-none bg-ground p-0 text-ink lg:hidden">
        <Container className="py-6">
          <FilterPanel />
          <Button variant="dark" onClick={() => dialog.current?.close()} className="mt-6">
            Xem {results.length} mẫu
          </Button>
        </Container>
      </dialog>
      {results.length ? (
        <ProductGrid products={results.slice(0, shown)} />
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-card border-2 border-dashed border-line-strong px-6 py-10 text-center">
          <p className="text-lead font-bold">Không có mẫu nào khớp với lọc này.</p>
          <Button asChild variant="outline" size="md">
            <Link href={pathname} scroll={false}>
              Bỏ hết lọc
            </Link>
          </Button>
        </div>
      )}
      {results.length > shown ? (
        <Button variant="outline" onClick={() => setShown((n) => n + MORE)} className="mt-8">
          Hiện thêm {MORE} mẫu
        </Button>
      ) : null}
    </>
  );
}

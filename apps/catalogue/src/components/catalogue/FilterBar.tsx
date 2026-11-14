"use client";

import { useId } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { GROUPS, SORTS, type FacetValue, type FilterState, type SortKey } from "@/lib/filters";
import { SearchBox } from "./SearchBox";

type Facets = Record<(typeof GROUPS)[number]["key"], FacetValue[]>;

interface FilterBarProps {
  facets: Facets;
  value: FilterState;
  onChange: (next: FilterState) => void;
}

/**
 * Tìm, ba nhóm lọc (checkbox có số lượng) và sắp xếp bằng <select> gốc (mục 5.3).
 * Chỉ hiện giá trị có trong tập hiện tại; nhóm không có giá trị nào thì bỏ.
 */
export function FilterBar({ facets, value, onChange }: FilterBarProps) {
  const sortId = useId();
  const toggle = (key: (typeof GROUPS)[number]["key"], option: string, on: boolean) =>
    onChange({ ...value, [key]: on ? [...value[key], option] : value[key].filter((v) => v !== option) });

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2">
        <SearchBox value={value.q} onChange={(q) => onChange({ ...value, q })} />
        <div>
          <label htmlFor={sortId} className="mb-2 block text-label">
            Sắp xếp
          </label>
          <select
            id={sortId}
            value={value.sx}
            onChange={(event) => onChange({ ...value, sx: event.target.value as SortKey })}
            className="h-12 w-full rounded-btn border border-ink-muted bg-surface px-4 text-body"
          >
            {SORTS.map((sort) => (
              <option key={sort.key} value={sort.key}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {GROUPS.map(({ key, label }) =>
          facets[key].length ? (
            <fieldset key={key}>
              <legend className="mb-2 text-label">{label}</legend>
              {facets[key].map((facet) => (
                <Checkbox
                  key={facet.value}
                  label={facet.label}
                  count={facet.count}
                  checked={value[key].includes(facet.value)}
                  onChange={(event) => toggle(key, facet.value, event.target.checked)}
                />
              ))}
            </fieldset>
          ) : null,
        )}
      </div>
    </div>
  );
}

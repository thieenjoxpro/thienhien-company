"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { GROUPS } from "@/lib/filters";
import { useFilters } from "./FilterContext";
import { SearchBox } from "./SearchBox";

/**
 * Hộp "Lọc mẫu" (design 3): tìm trong nhóm, ba nhóm checkbox có số mẫu. Chỉ hiện giá trị có trong tập
 * hiện tại; nhóm không có giá trị nào thì bỏ. Từ 1024px nằm ở cột trái, dưới đó nằm trong bảng lọc.
 */
export function FilterPanel() {
  const { state, update, facets } = useFilters();
  const toggle = (key: (typeof GROUPS)[number]["key"], option: string, on: boolean) =>
    update({ ...state, [key]: on ? [...state[key], option] : state[key].filter((v) => v !== option) });
  return (
    <div className="flex flex-col gap-5 rounded-card border border-line p-5">
      <h2 className="text-eyebrow uppercase">Lọc mẫu</h2>
      <SearchBox value={state.q} onChange={(q) => update({ ...state, q })} />
      {GROUPS.map(({ key, label }) =>
        facets[key].length ? (
          <fieldset key={key}>
            <legend className="mb-1 text-label font-bold text-ink-muted">{label}</legend>
            {facets[key].map((facet) => (
              <Checkbox
                key={facet.value}
                label={facet.label}
                count={facet.count}
                checked={state[key].includes(facet.value)}
                onChange={(event) => toggle(key, facet.value, event.target.checked)}
              />
            ))}
          </fieldset>
        ) : null,
      )}
    </div>
  );
}

// Lọc, tìm, sắp xếp phía client (mục 5.3), logic thuần để test được. Trạng thái nằm trên URL:
// ?q=&day=2,3&vl=thep-ct3&bm=ma-kem&sx=moi
import { normalizeVietnamese } from "@thien-hien/shared";
import { formatNumber } from "./format";
import type { Product } from "./schema";

export type SortKey = "moi" | "gia" | "ma";
type Group = "day" | "vl" | "bm";

export interface FilterState {
  q: string;
  day: string[];
  vl: string[];
  bm: string[];
  sx: SortKey;
}

export interface FacetValue {
  value: string;
  label: string;
  count: number;
}

export const GROUPS: { key: Group; label: string }[] = [
  { key: "day", label: "Độ dày" },
  { key: "vl", label: "Vật liệu" },
  { key: "bm", label: "Bề mặt" },
];

export const SORTS: { key: SortKey; label: string }[] = [
  { key: "moi", label: "Mới nhất" },
  { key: "gia", label: "Giá tăng dần" },
  { key: "ma", label: "Mã A đến Z" },
];

const slugify = (text: string) =>
  normalizeVietnamese(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Độ dày luôn có một chữ số thập phân: 2 -> "2,0", 0.45 -> "0,45" (design/components/SpecTable)
const thickness = (mm: number) => (Number.isInteger(mm) ? mm.toFixed(1).replace(".", ",") : formatNumber(mm));

type Option = { value: string; label: string; order: number | string };
const optionOf: Record<Group, (p: Product) => Option | null> = {
  day: ({ filters: { thicknessMm: mm } }) =>
    mm === undefined ? null : { value: String(mm), label: `${thickness(mm)} mm`, order: mm },
  vl: ({ filters: { material } }) => (material ? { value: slugify(material), label: material, order: material } : null),
  bm: ({ filters: { finish } }) => (finish ? { value: slugify(finish), label: finish, order: finish } : null),
};

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  moi: (a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.sku.localeCompare(b.sku),
  gia: (a, b) => (a.priceFrom ?? Infinity) - (b.priceFrom ?? Infinity) || a.sku.localeCompare(b.sku),
  ma: (a, b) => a.sku.localeCompare(b.sku),
};

export function parseFilters(params: URLSearchParams): FilterState {
  const list = (key: string) => (params.get(key) ?? "").split(",").filter(Boolean);
  const sx = params.get("sx");
  return { q: params.get("q") ?? "", day: list("day"), vl: list("vl"), bm: list("bm"), sx: sx === "gia" || sx === "ma" ? sx : "moi" };
}

export function serializeFilters(state: FilterState): string {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set("q", state.q.trim());
  for (const { key } of GROUPS) if (state[key].length) params.set(key, state[key].join(","));
  if (state.sx !== "moi") params.set("sx", state.sx);
  return params.toString().replace(/%2C/g, ",");
}

export const isFiltered = (state: FilterState) =>
  Boolean(state.q.trim() || state.day.length || state.vl.length || state.bm.length);

/** Giá trị lọc có trong tập hiện tại, kèm số mẫu; độ dày theo số, còn lại theo chữ. */
export function facetsOf(products: Product[]): Record<Group, FacetValue[]> {
  const result = {} as Record<Group, FacetValue[]>;
  for (const { key } of GROUPS) {
    const found = new Map<string, Option & { count: number }>();
    for (const option of products.map(optionOf[key])) {
      if (!option) continue;
      const seen = found.get(option.value);
      found.set(option.value, { ...option, count: (seen?.count ?? 0) + 1 });
    }
    result[key] = [...found.values()]
      .toSorted((a, b) =>
        typeof a.order === "number" && typeof b.order === "number" ? a.order - b.order : String(a.order).localeCompare(String(b.order), "vi"),
      )
      .map(({ value, label, count }) => ({ value, label, count }));
  }
  return result;
}

/** Nhiều giá trị trong một nhóm là HOẶC, giữa các nhóm là VÀ; tìm không dấu trên mã và tên. */
export function applyFilters(products: Product[], state: FilterState): Product[] {
  const query = normalizeVietnamese(state.q);
  return products
    .filter((p) => !query || normalizeVietnamese(`${p.sku} ${p.name}`).includes(query))
    .filter((p) =>
      GROUPS.every(({ key }) => {
        if (state[key].length === 0) return true;
        const option = optionOf[key](p);
        return option !== null && state[key].includes(option.value);
      }),
    )
    .toSorted(sorters[state.sx]);
}

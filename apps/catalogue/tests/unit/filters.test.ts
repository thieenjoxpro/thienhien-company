import { describe, expect, it } from "vitest";
import { createCatalog } from "../../src/lib/catalog";
import { applyFilters, facetsOf, isFiltered, parseFilters, serializeFilters, type FilterState } from "../../src/lib/filters";
import fixtureCategories from "../fixtures/categories.json";
import fixtureProducts from "../fixtures/products.json";

const products = await createCatalog({ categories: fixtureCategories, products: fixtureProducts }).getProducts();
const state = (change: Partial<FilterState> = {}): FilterState => ({ q: "", day: [], vl: [], bm: [], sx: "moi", ...change });
const skus = (list: { sku: string }[]) => list.map((p) => p.sku).toSorted();

describe("applyFilters", () => {
  it("nhiều giá trị trong một nhóm là HOẶC", () => {
    expect(skus(applyFilters(products, state({ vl: ["thep-ss400", "inox-201"] })))).toEqual(
      ["TH-BL04", "TH-BL07", "TH-MC03", "TH-MC04", "TH-PN04", "TH-PN06"],
    );
  });

  it("giữa các nhóm là VÀ", () => {
    expect(skus(applyFilters(products, state({ vl: ["thep-ct3"], day: ["2"], bm: ["moc"] })))).toEqual(
      ["TH-BL01", "TH-BL03", "TH-MC01", "TH-MC02"],
    );
  });

  it("tìm không dấu, không phân biệt hoa thường, trên mã và tên", () => {
    expect(skus(applyFilters(products, state({ q: "bl03" })))).toEqual(["TH-BL03"]);
    expect(skus(applyFilters(products, state({ q: "BAN LE COI" })))).toHaveLength(4);
    expect(skus(applyFilters(products, state({ q: "mâm cầu thang tròn" })))).toEqual(["TH-MC02"]);
    expect(applyFilters(products, state({ q: "khong co mau nay" }))).toEqual([]);
  });

  it("sắp xếp: mới nhất, giá tăng dần (chưa có giá xuống cuối), mã A đến Z", () => {
    const newest = applyFilters(products, state()).map((p) => p.updatedAt);
    expect(newest).toEqual(newest.toSorted().reverse());
    const prices = applyFilters(products, state({ sx: "gia" })).map((p) => p.priceFrom);
    expect(prices.slice(0, 2)).toEqual([6500, 7500]);
    expect(prices.slice(-2)).toEqual([null, null]);
    const codes = applyFilters(products, state({ sx: "ma" })).map((p) => p.sku);
    expect(codes).toEqual(codes.toSorted());
  });
});

describe("facetsOf", () => {
  it("chỉ có giá trị đang có, kèm số mẫu, độ dày xếp theo số", () => {
    const facets = facetsOf(products);
    expect(facets.day.map((f) => f.label)).toEqual(["0,4 mm", "0,45 mm", "0,5 mm", "0,8 mm", "1,0 mm", "1,2 mm", "1,5 mm", "2,0 mm", "2,5 mm", "3,0 mm"]);
    expect(facets.vl.find((f) => f.value === "thep-ct3")?.count).toBe(13);
    expect(facets.bm.map((f) => f.value)).toContain("ma-kem");
  });
});

describe("trạng thái trên URL", () => {
  it("đọc và ghi lại giữ nguyên, dấu phẩy không bị mã hoá", () => {
    const query = "q=ban+le&day=2,3&vl=thep-ct3&bm=ma-kem&sx=gia";
    const parsed = parseFilters(new URLSearchParams(query));
    expect(parsed).toEqual({ q: "ban le", day: ["2", "3"], vl: ["thep-ct3"], bm: ["ma-kem"], sx: "gia" });
    expect(serializeFilters(parsed)).toBe(query);
  });

  it("mặc định không ghi lên URL; sx lạ quay về mới nhất", () => {
    expect(serializeFilters(state())).toBe("");
    expect(parseFilters(new URLSearchParams("sx=abc")).sx).toBe("moi");
    expect(isFiltered(state({ sx: "gia" }))).toBe(false);
    expect(isFiltered(state({ day: ["2"] }))).toBe(true);
  });
});

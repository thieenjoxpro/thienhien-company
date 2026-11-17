import { beforeEach, describe, expect, it } from "vitest";
import type { StateStorage } from "zustand/middleware";
import { buildQuoteMessage } from "../../src/lib/quote-message";
import { clampQty, createQuoteStore, stepQty } from "../../src/lib/quote-store";

function memoryStorage(): StateStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (name) => data.get(name) ?? null,
    setItem: (name, value) => void data.set(name, value),
    removeItem: (name) => void data.delete(name),
  };
}

describe("buildQuoteMessage", () => {
  const lines = [
    { sku: "TH-BL03", name: "Bản lề cối 16 ly", spec: "Ø16 × 100 mm", qty: 50, unit: "cái" },
    { sku: "TH-PN01", name: "Pano dập ô vuông", spec: "400 × 600 × 0,8 mm", qty: 20, unit: "tấm" },
  ];

  it("mỗi mã một dòng: mã, tên, thông số, số lượng; có ghi chú", () => {
    expect(buildQuoteMessage(lines, "giao Bình Chánh")).toMatchInlineSnapshot(`
      "Chào xưởng Thiện Hiền, em cần báo giá sỉ:
      1. TH-BL03 · Bản lề cối 16 ly · Ø16 × 100 mm · SL: 50 cái
      2. TH-PN01 · Pano dập ô vuông · 400 × 600 × 0,8 mm · SL: 20 tấm
      Ghi chú: giao Bình Chánh"
    `);
  });

  it("bỏ dòng Ghi chú khi khách để trống hoặc chỉ gõ khoảng trắng; thiếu thông số thì bỏ đoạn đó", () => {
    expect(buildQuoteMessage([{ sku: "TH-BL03", name: "Bản lề cối 16 ly", spec: "", qty: 50, unit: "cái" }], "  ")).toBe(["Chào xưởng Thiện Hiền, em cần báo giá sỉ:", "1. TH-BL03 · Bản lề cối 16 ly · SL: 50 cái"].join("\n"));
  });
});

describe("quote-store", () => {
  let storage: ReturnType<typeof memoryStorage>;
  beforeEach(() => {
    storage = memoryStorage();
  });

  it("stepQty: dưới 100 thì cộng trừ 1, từ 100 thì 10, không xuống dưới 1", () => {
    expect([stepQty(1, 1), stepQty(99, 1), stepQty(100, 1), stepQty(150, -1), stepQty(100, -1), stepQty(1, -1)]).toEqual([2, 100, 110, 140, 99, 1]);
  });

  it("clampQty kẹp 1..9999, làm tròn, giá trị hỏng thành 1", () => {
    expect([0, -5, 1, 50.6, 9999, 10000, Number.NaN].map(clampQty)).toEqual([1, 1, 1, 51, 9999, 9999, 1]);
  });

  it("add cộng dồn cùng mã, setQty kẹp, remove và clear", () => {
    const store = createQuoteStore(storage);
    const { add, setQty, remove, clear } = store.getState();
    add("TH-BL03", 50);
    add("TH-PN01");
    add("TH-BL03", 9990);
    expect(store.getState().items).toEqual([
      { sku: "TH-BL03", qty: 9999 },
      { sku: "TH-PN01", qty: 1 },
    ]);
    setQty("TH-PN01", 0);
    expect(store.getState().items[1]).toEqual({ sku: "TH-PN01", qty: 1 });
    remove("TH-BL03");
    expect(store.getState().items).toEqual([{ sku: "TH-PN01", qty: 1 }]);
    clear();
    expect(store.getState().items).toEqual([]);
  });

  it("persist: lưu dưới khoá th-quote-v1, store mới đọc lại được và bật hasHydrated", async () => {
    const first = createQuoteStore(storage);
    first.getState().add("TH-MC02", 12);
    expect(JSON.parse(storage.data.get("th-quote-v1") ?? "{}").state).toEqual({ items: [{ sku: "TH-MC02", qty: 12 }] });

    const second = createQuoteStore(storage);
    expect(second.getState().hasHydrated).toBe(false);
    await second.persist.rehydrate();
    expect(second.getState().items).toEqual([{ sku: "TH-MC02", qty: 12 }]);
    expect(second.getState().hasHydrated).toBe(true);
  });
});

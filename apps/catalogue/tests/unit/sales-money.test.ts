import { describe, expect, it } from "vitest";
import { appendThousand, formatMoneyInput, moneyText, parseMoney, parseQuantity, quantityText } from "../../src/lib/sales/money";
import { lineAmount, orderTotals, receiptCode, validateOrder } from "../../src/lib/sales/order";
import { emptySale, saleNumbers, saleReducer, toOrderInput, type SaleState } from "../../src/lib/sales/sale-state";
import { suggestPrice } from "../../src/lib/sales/types";

describe("ô tiền", () => {
  it("chèn dấu chấm khi gõ, bỏ số 0 thừa, bỏ chữ", () => {
    expect(formatMoneyInput("1250000", 7)).toEqual({ text: "1.250.000", caret: 9 });
    expect(formatMoneyInput("0012a3", 6)).toEqual({ text: "123", caret: 3 });
    expect(formatMoneyInput("", 0)).toEqual({ text: "", caret: 0 });
    expect(formatMoneyInput("0", 1)).toEqual({ text: "0", caret: 1 });
  });

  it("giữ con trỏ đúng chỗ khi gõ giữa số", () => {
    // "1.250.000", gõ 9 sau chữ số 1: "19.250.000" -> con trỏ sau 9 (vị trí 2)
    expect(formatMoneyInput("19.250.000", 2)).toEqual({ text: "19.250.000", caret: 2 });
    // "125.000", gõ 0 sau "125": "1250.000" -> "1.250.000", con trỏ sau chữ số thứ 4 (vị trí 5)
    expect(formatMoneyInput("1250.000", 4)).toEqual({ text: "1.250.000", caret: 5 });
    // xoá dấu chấm (Backspace) chỉ làm mất dấu chấm, định dạng lại như cũ
    expect(formatMoneyInput("1250.000", 1)).toEqual({ text: "1.250.000", caret: 1 });
  });

  it("nút 000 thêm ba số 0, ô rỗng giữ rỗng", () => {
    expect(appendThousand("1.250")).toBe("1.250.000");
    expect(appendThousand("")).toBe("");
  });

  it("đọc số tiền và số lượng kiểu Việt", () => {
    expect(parseMoney("1.250.000")).toBe(1_250_000);
    expect(parseMoney("")).toBe(0);
    expect(moneyText(0)).toBe("");
    expect(parseQuantity("1,5")).toBe(1.5);
    expect(parseQuantity("2")).toBe(2);
    expect(parseQuantity("1,2345")).toBeNaN();
    expect(parseQuantity("")).toBeNaN();
    expect(quantityText(2.5)).toBe("2,5");
  });
});

describe("tính tiền và kiểm đơn", () => {
  it("thành tiền làm tròn, giảm giá trừ vào tổng", () => {
    expect(lineAmount(1.5, 100_001)).toBe(150_002);
    expect(orderTotals([{ sku: "A", quantity: 2, unitPrice: 100_000 }], 20_000, 50_000)).toEqual({ subtotal: 200_000, total: 180_000, debtChange: 130_000 });
  });

  it("lỗi bằng lời đời thường, theo ô", () => {
    expect(validateOrder({ customerId: null, lines: [], discount: 0, paid: 0 })).toEqual({ customer: "Chưa chọn khách.", lines: "Chưa chọn hàng nào." });
    expect(validateOrder({ customerId: 1, lines: [{ sku: "A", quantity: 0, unitPrice: 1 }], discount: 5, paid: 0 })).toMatchObject({
      "line-0-quantity": "Số lượng phải lớn hơn 0.",
      discount: "Giảm giá lớn hơn tiền hàng.",
    });
    expect(receiptCode(123)).toBe("PH000123");
  });

  it("giá gợi ý: khách sỉ lấy giá đã bán cho họ, khách lẻ lấy giá bảng", () => {
    const product = { sku: "A", name: "A", unit: "cái", price: 20_000, stock: 0 };
    expect(suggestPrice(product, "si", { A: 18_000 })).toBe(18_000);
    expect(suggestPrice(product, "le", { A: 18_000 })).toBe(20_000);
    expect(suggestPrice({ ...product, price: null }, "le", { A: 18_000 })).toBe(18_000);
    expect(suggestPrice({ ...product, price: null }, "si", {})).toBe(0);
  });
});

describe("trạng thái form bán hàng", () => {
  const run = (...actions: Parameters<typeof saleReducer>[1][]): SaleState => actions.reduce(saleReducer, emptySale);

  it("chạm mặt hàng thêm dòng số lượng 1, chạm lại cộng 1; nút trừ không xuống dưới 0", () => {
    const state = run({ type: "add", sku: "A", price: 18_000 }, { type: "add", sku: "A", price: 18_000 }, { type: "add", sku: "B", price: 5000 });
    expect(state.lines).toEqual([
      { sku: "A", quantity: "2", price: "18.000" },
      { sku: "B", quantity: "1", price: "5.000" },
    ]);
    const down = run({ type: "add", sku: "A", price: 1 }, { type: "step", index: 0, delta: -1 }, { type: "step", index: 0, delta: -1 });
    expect(down.lines[0]?.quantity).toBe("0");
  });

  it("trả đủ theo tổng, chưa trả là 0, gõ tay thì theo số gõ", () => {
    const base = run({ type: "customer", id: 1, paidMode: "full" }, { type: "add", sku: "A", price: 100_000 }, { type: "discount", text: "10000" });
    expect(saleNumbers(base)).toMatchObject({ subtotal: 100_000, total: 90_000, paid: 90_000, debtChange: 0 });
    expect(saleNumbers(saleReducer(base, { type: "paidMode", mode: "none" })).debtChange).toBe(90_000);
    const custom = saleReducer(base, { type: "paid", text: "100000" });
    expect(custom.paid).toBe("100.000");
    expect(saleNumbers(custom).debtChange).toBe(-10_000);
    expect(toOrderInput(custom)).toEqual({ customerId: 1, lines: [{ sku: "A", quantity: 1, unitPrice: 100_000 }], discount: 10_000, paid: 100_000, note: "" });
  });

  it("đổi khách giữ nguyên các dòng hàng", () => {
    const state = run({ type: "customer", id: 1 }, { type: "add", sku: "A", price: 1 }, { type: "customer", id: 2, paidMode: "none" });
    expect(state.customerId).toBe(2);
    expect(state.lines).toHaveLength(1);
  });
});

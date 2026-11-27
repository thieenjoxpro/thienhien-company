// Trạng thái form bán hàng: hàm thuần để test, màn bán hàng dùng qua useReducer. Cũng là dạng lưu nháp.
import { formatMoneyInput, moneyText, parseMoney, parseQuantity, quantityText } from "./money";
import { orderTotals, type OrderInput } from "./order";

export interface SaleLine {
  sku: string;
  quantity: string; // chữ trong ô, kiểu Việt: "1,5"
  price: string; // chữ trong ô tiền: "250.000"
}

export type PaidMode = "full" | "none" | "custom";

export interface SaleState {
  customerId: number | null;
  lines: SaleLine[];
  discount: string;
  paidMode: PaidMode;
  paid: string;
  note: string;
}

export const emptySale: SaleState = { customerId: null, lines: [], discount: "", paidMode: "full", paid: "", note: "" };

export type SaleAction =
  | { type: "customer"; id: number | null; paidMode?: PaidMode }
  | { type: "add"; sku: string; price: number }
  | { type: "quantity"; index: number; text: string }
  | { type: "step"; index: number; delta: 1 | -1 }
  | { type: "price"; index: number; text: string }
  | { type: "remove"; index: number }
  | { type: "replace"; lines: { sku: string; quantity: number; price: number }[] }
  | { type: "discount"; text: string }
  | { type: "paid"; text: string }
  | { type: "paidMode"; mode: PaidMode }
  | { type: "note"; text: string }
  | { type: "reset"; state?: SaleState };

const setLine = (state: SaleState, index: number, change: Partial<SaleLine>): SaleState => ({
  ...state,
  lines: state.lines.map((line, i) => (i === index ? { ...line, ...change } : line)),
});

const money = (text: string) => formatMoneyInput(text, text.length).text;

export function saleReducer(state: SaleState, action: SaleAction): SaleState {
  switch (action.type) {
    case "customer":
      return { ...state, customerId: action.id, ...(action.paidMode && { paidMode: action.paidMode, paid: "" }) };
    case "add": {
      // chạm lại mặt hàng đã có thì cộng 1
      const index = state.lines.findIndex((line) => line.sku === action.sku);
      if (index >= 0) return saleReducer(state, { type: "step", index, delta: 1 });
      return { ...state, lines: [...state.lines, { sku: action.sku, quantity: "1", price: moneyText(action.price) }] };
    }
    case "quantity":
      return setLine(state, action.index, { quantity: action.text.replace(/[^0-9.,]/g, "") });
    case "step": {
      const line = state.lines[action.index];
      if (!line) return state;
      const current = parseQuantity(line.quantity);
      const base = Number.isNaN(current) ? 0 : current;
      const next = Math.max(0, Math.round((base + action.delta) * 1000) / 1000);
      return setLine(state, action.index, { quantity: quantityText(next) });
    }
    case "price":
      return setLine(state, action.index, { price: money(action.text) });
    case "remove":
      return { ...state, lines: state.lines.filter((_, i) => i !== action.index) };
    case "replace":
      return { ...state, lines: action.lines.map((l) => ({ sku: l.sku, quantity: quantityText(l.quantity), price: moneyText(l.price) })) };
    case "discount":
      return { ...state, discount: money(action.text) };
    case "paid":
      return { ...state, paidMode: "custom", paid: money(action.text) };
    case "paidMode":
      return { ...state, paidMode: action.mode, paid: action.mode === "custom" ? state.paid : "" };
    case "note":
      return { ...state, note: action.text.slice(0, 200) };
    case "reset":
      return action.state ?? emptySale;
  }
}

/** Số liệu tính từ form: tiền hàng, tổng, khách trả, còn nợ thêm (âm là trả dư). */
export function saleNumbers(state: SaleState) {
  const lines = state.lines.map((line) => ({ sku: line.sku, quantity: parseQuantity(line.quantity), unitPrice: parseMoney(line.price) }));
  const discount = parseMoney(state.discount);
  const { subtotal, total } = orderTotals(lines, discount, 0);
  const paid = state.paidMode === "full" ? total : state.paidMode === "none" ? 0 : parseMoney(state.paid);
  return { lines, discount, subtotal, total, paid, debtChange: total - paid };
}

/** Dữ liệu gửi máy chủ. Máy chủ tự tính lại tổng. */
export function toOrderInput(state: SaleState): OrderInput {
  const { lines, discount, paid } = saleNumbers(state);
  return { customerId: state.customerId, lines, discount, paid, note: state.note };
}

/** Form có gì đáng giữ làm nháp không. */
export const hasContent = (state: SaleState): boolean => state.lines.length > 0 || state.customerId !== null || state.note.trim() !== "";

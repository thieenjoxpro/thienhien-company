// Tính tiền và kiểm đơn: cùng một hàm cho màn bán hàng (hiện lỗi ngay cạnh ô) và máy chủ (tự tính tổng, không nhận tổng từ client).
// Không import thư viện: file này vào component client.

export interface OrderLineInput {
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderInput {
  customerId: number | null;
  lines: OrderLineInput[];
  discount: number;
  /** Số khách trả ngay. */
  paid: number;
  note?: string;
}

export type OrderErrors = Record<string, string>;

/** Thành tiền một dòng, làm tròn về đồng. */
export const lineAmount = (quantity: number, unitPrice: number): number =>
  Number.isFinite(quantity) && Number.isFinite(unitPrice) ? Math.round(quantity * unitPrice) : 0;

export function orderTotals(lines: OrderLineInput[], discount: number, paid: number) {
  const subtotal = lines.reduce((sum, line) => sum + lineAmount(line.quantity, line.unitPrice), 0);
  const total = Math.max(0, subtotal - Math.max(0, discount || 0));
  const debtChange = total - (paid || 0); // dương: còn nợ thêm; âm: trả dư
  return { subtotal, total, debtChange };
}

const MAX_MONEY = 999_999_999_999;
const money = (value: number) => Number.isInteger(value) && value >= 0 && value <= MAX_MONEY;

/**
 * Lỗi theo ô, lời đời thường. Khoá: customer, lines, line-<i>-quantity, line-<i>-price, discount, paid.
 * Rỗng là hợp lệ.
 */
export function validateOrder(input: OrderInput, walkIn = false): OrderErrors {
  const errors: OrderErrors = {};
  if (!input.customerId) errors.customer = "Chưa chọn khách.";
  if (input.lines.length === 0) errors.lines = "Chưa chọn hàng nào.";
  input.lines.forEach((line, i) => {
    if (!Number.isFinite(line.quantity)) errors[`line-${i}-quantity`] = "Số lượng chưa đúng. Ví dụ: 2 hoặc 1,5.";
    else if (line.quantity <= 0) errors[`line-${i}-quantity`] = "Số lượng phải lớn hơn 0.";
    else if (line.quantity > 1_000_000) errors[`line-${i}-quantity`] = "Số lượng lớn quá, kiểm lại.";
    if (!money(line.unitPrice)) errors[`line-${i}-price`] = "Đơn giá chưa đúng.";
  });
  const { subtotal } = orderTotals(input.lines, 0, 0);
  if (!money(input.discount)) errors.discount = "Số giảm giá chưa đúng.";
  else if (input.discount > subtotal) errors.discount = "Giảm giá lớn hơn tiền hàng.";
  if (!money(input.paid)) errors.paid = "Số tiền khách trả chưa đúng.";
  // Khách vãng lai không có sổ nợ để thu lại sau
  else if (walkIn && !errors.discount && input.paid < orderTotals(input.lines, input.discount, 0).total) {
    errors.paid = "Khách vãng lai phải trả đủ. Muốn ghi nợ thì chọn hoặc thêm tên khách.";
  }
  return errors;
}

/** Số phiếu in trên phiếu và làm nội dung chuyển khoản: PH000123. */
export const receiptCode = (orderId: number): string => `PH${String(orderId).padStart(6, "0")}`;

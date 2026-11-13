const integer = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 });

/** Số kiểu Việt: 18000 -> "18.000", 2.5 -> "2,5". */
export function formatNumber(value: number): string {
  return Number.isInteger(value) ? integer.format(value) : decimal.format(value);
}

/** Giá VND: 18000 -> "18.000 đ". */
export function formatPrice(vnd: number): string {
  return `${integer.format(Math.round(vnd))} đ`;
}

// Kiểu dữ liệu màn bán hàng nhận từ máy chủ. Component client chỉ import từ đây, không import src/lib/server.

export type CustomerKind = "le" | "si";

export interface SaleCustomer {
  id: number;
  name: string;
  phone: string | null;
  kind: CustomerKind;
  walkIn: boolean;
}

export interface SaleProduct {
  sku: string;
  name: string;
  unit: string;
  /** Giá bảng (giá lẻ khởi điểm của catalogue); null là chưa có giá. */
  price: number | null;
  stock: number;
}

export interface CustomerContext {
  debt: number;
  /** Giá bán lần gần nhất cho khách này theo SKU. */
  lastPrices: Record<string, number>;
  /** Các dòng của đơn gần nhất (chưa huỷ), cho nút "Bán giống lần trước". */
  lastOrder: { id: number; createdAt: string; lines: { sku: string; quantity: number; unitPrice: number }[] } | null;
}

/**
 * Giá gợi ý khi thêm dòng. Khách sỉ: giá đã bán cho chính khách đó lần trước (giá thoả thuận), chưa có thì giá bảng.
 * Khách lẻ: giá bảng, chưa có giá bảng mới dùng giá lần trước. Người bán luôn sửa tay được.
 */
export function suggestPrice(product: SaleProduct, kind: CustomerKind | null, lastPrices: Record<string, number>): number {
  const last = lastPrices[product.sku];
  if (kind === "si" && last !== undefined) return last;
  return product.price ?? last ?? 0;
}

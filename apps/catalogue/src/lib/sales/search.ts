// Tìm khách theo tên không dấu hoặc số điện thoại; dùng ở màn bán hàng (client) và danh sách đơn (máy chủ).
import { normalizeVietnamese } from "@thien-hien/shared";

/** Tìm khách theo tên không dấu hoặc số điện thoại (bỏ khoảng trắng, dấu chấm). */
export function matchCustomer(customer: { name: string; phone: string | null }, query: string): boolean {
  const needle = normalizeVietnamese(query);
  if (!needle) return true;
  const digits = needle.replace(/[^0-9]/g, "");
  if (digits.length >= 3 && digits.length === needle.replace(/[\s.]/g, "").length) {
    return (customer.phone ?? "").replace(/\D/g, "").includes(digits);
  }
  return normalizeVietnamese(customer.name).includes(needle);
}

/**
 * Bỏ dấu tiếng Việt để tìm kiếm không dấu: tách dấu (NFD), bỏ dấu kết hợp,
 * đổi đ/Đ thành d, viết thường, gộp khoảng trắng.
 *
 * normalizeVietnamese("Bản lề CỐI 16 ly") === "ban le coi 16 ly"
 */
export function normalizeVietnamese(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

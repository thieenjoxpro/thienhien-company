// Khu /admin chỉ mở khi chạy `pnpm dev` trên máy: nó ghi thẳng vào src/data và public/.
// Bản build production không có đăng nhập nên /admin luôn trả 404 và mọi action đều từ chối.
export const adminEnabled = () => process.env.NODE_ENV === "development";

export function assertAdmin(): void {
  if (!adminEnabled()) throw new Error("Khu quản trị chỉ chạy khi pnpm dev");
}

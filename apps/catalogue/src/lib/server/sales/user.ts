// Tên người đang bán: tài khoản đăng nhập ở chế độ máy chủ; pnpm dev trên máy không có đăng nhập nên là "may-nay".
import { serverMode } from "../mode";

export async function currentUser(): Promise<string> {
  if (!serverMode()) return "may-nay";
  return (await (await import("../session")).currentAdmin()) ?? "khach";
}

// Khu /admin có hai chế độ:
// - pnpm dev trên máy: ghi thẳng vào src/data và public/, không đăng nhập.
// - chế độ máy chủ (CATALOGUE_SERVER=1, Docker): ghi database, bắt buộc đăng nhập ở /dang-nhap.
// Bản build thường (Vercel) không có cả hai nên /admin trả 404 và mọi action đều từ chối.
import { notFound, redirect } from "next/navigation";
import { serverMode } from "@/lib/server/mode";

const adminEnabled = () => serverMode() || process.env.NODE_ENV === "development";

const signedIn = async () => !serverMode() || (await (await import("@/lib/server/session")).currentAdmin()) !== null;

/** Cho page và layout: /admin tắt thì 404, chưa đăng nhập thì sang trang đăng nhập. */
export async function requireAdmin(): Promise<void> {
  if (!adminEnabled()) notFound();
  if (!(await signedIn())) redirect("/dang-nhap");
}

/** Cho server action: không đủ quyền thì ném lỗi, không ghi gì. */
export async function assertAdmin(): Promise<void> {
  if (!adminEnabled()) throw new Error("Khu quản trị chưa bật");
  if (!(await signedIn())) throw new Error("Chưa đăng nhập");
}

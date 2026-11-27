// Quyền xem phiếu và tải file của khu bán hàng.
// - Người đã đăng nhập /admin (pnpm dev trên máy thì không cần đăng nhập).
// - Chromium của máy chủ khi chụp PDF, PNG: mang token HMAC ký riêng cho đúng một đơn, hết hạn sau 60 giây,
//   gửi qua header (không nằm trong URL). Khoá ký sinh ngẫu nhiên mỗi lần chạy tiến trình, không lưu đâu cả.
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { serverMode } from "../mode";
import { salesEnabled } from "./customers";

export const receiptHeader = "x-th-receipt";
const TTL_MS = 60_000;

const shared = globalThis as { __thReceiptKey?: Buffer };
const key = () => (shared.__thReceiptKey ??= randomBytes(32));
const sign = (body: string) => createHmac("sha256", key()).update(body).digest("hex");

export function receiptToken(orderId: number, now = Date.now()): string {
  const body = `${orderId}.${now + TTL_MS}`;
  return `${body}.${sign(body)}`;
}

export function checkReceiptToken(token: string | null | undefined, orderId: number, now = Date.now()): boolean {
  const [id, expires, mac] = (token ?? "").split(".");
  if (!id || !expires || !mac || Number(id) !== orderId || Number(expires) < now) return false;
  const want = Buffer.from(sign(`${id}.${expires}`), "hex");
  const got = Buffer.from(mac, "hex");
  return got.length === want.length && timingSafeEqual(got, want);
}

/** Người đang gọi có phải người quản trị không (dùng cho route handler: không đủ quyền thì 401, không chuyển trang). */
export async function isAdminRequest(): Promise<boolean> {
  if (!salesEnabled()) return false;
  if (!serverMode()) return process.env.NODE_ENV === "development";
  return (await (await import("../session")).currentAdmin()) !== null;
}

/** Trang /phieu/[id]: người quản trị, hoặc Chromium của máy chủ mang token đúng đơn. */
export async function canViewReceipt(orderId: number): Promise<boolean> {
  if (!salesEnabled()) return false;
  if (checkReceiptToken((await headers()).get(receiptHeader), orderId)) return true;
  return isAdminRequest();
}

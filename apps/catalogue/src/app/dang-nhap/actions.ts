"use server";

import { redirect } from "next/navigation";
import { serverMode } from "@/lib/server/mode";
import { checkLogin, endSession, startSession, throttled } from "@/lib/server/session";

export type LoginState = { error: string; username: string } | null;

export async function signIn(_: LoginState, form: FormData): Promise<LoginState> {
  if (!serverMode()) throw new Error("Đăng nhập chỉ có ở chế độ máy chủ");
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!username || !password) return { error: "Nhập tên đăng nhập và mật khẩu.", username };
  if (throttled(username)) return { error: "Sai quá 5 lần. Chờ 10 phút rồi thử lại.", username };
  const userId = await checkLogin(username, password);
  // Không nói rõ sai tên hay sai mật khẩu
  if (userId === null) return { error: "Tên đăng nhập hoặc mật khẩu không đúng.", username };
  await startSession(userId);
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  if (serverMode()) await endSession();
  redirect("/dang-nhap");
}

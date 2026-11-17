// Phiên đăng nhập quản trị: token ngẫu nhiên trong cookie httpOnly, database chỉ lưu SHA-256 của token.
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";
import { hashPassword, verifyPassword } from "./password";

const COOKIE = "th_admin";
const DAYS = 14;
const digest = (token: string) => createHash("sha256").update(token).digest("hex");

// Chặn dò mật khẩu: mỗi tên đăng nhập tối đa 5 lần sai trong 10 phút (đếm trong bộ nhớ của tiến trình).
const MAX_FAILS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const fails = new Map<string, { count: number; since: number }>();

export function throttled(username: string, now = Date.now()): boolean {
  const entry = fails.get(username);
  if (!entry) return false;
  if (now - entry.since > WINDOW_MS) {
    fails.delete(username);
    return false;
  }
  return entry.count >= MAX_FAILS;
}

function recordFail(username: string, now = Date.now()) {
  const entry = fails.get(username);
  if (!entry || now - entry.since > WINDOW_MS) fails.set(username, { count: 1, since: now });
  else entry.count += 1;
}

// Băm sẵn một mật khẩu giả để tên đăng nhập sai cũng tốn thời gian như tên đúng
let dummy: Promise<string> | undefined;

/** Kiểm tên và mật khẩu; đúng thì trả id người dùng. */
export async function checkLogin(username: string, password: string): Promise<number | null> {
  const [user] = await (await getDb()).query<{ id: number; password_hash: string }>(
    "SELECT id, password_hash FROM admin_users WHERE username = $1",
    [username],
  );
  dummy ??= hashPassword("khong-co-tai-khoan-nay");
  const ok = await verifyPassword(password, user?.password_hash ?? (await dummy));
  if (user && ok) {
    fails.delete(username);
    return user.id;
  }
  recordFail(username);
  return null;
}

export async function startSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000);
  const db = await getDb();
  await db.query("DELETE FROM admin_sessions WHERE expires_at < now()");
  await db.query("INSERT INTO admin_sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)", [digest(token), userId, expires.toISOString()]);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    // Sau Caddy (HTTPS) thì bật; chạy thử qua http://localhost thì đặt ADMIN_COOKIE_INSECURE=1
    secure: process.env.ADMIN_COOKIE_INSECURE !== "1",
    path: "/",
    expires,
  });
}

/** Tên người đang đăng nhập, hoặc null. */
export async function currentAdmin(): Promise<string | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [row] = await (await getDb()).query<{ username: string }>(
    "SELECT u.username FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id WHERE s.token_hash = $1 AND s.expires_at > now()",
    [digest(token)],
  );
  return row?.username ?? null;
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await (await getDb()).query("DELETE FROM admin_sessions WHERE token_hash = $1", [digest(token)]);
  jar.delete(COOKIE);
}

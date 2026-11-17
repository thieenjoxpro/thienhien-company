// Chạy một lần khi server khởi động. Chế độ máy chủ: tạo bảng, nạp dữ liệu ban đầu, tạo tài khoản quản trị,
// rồi nạp bản dữ liệu vào bộ nhớ trước khi nhận yêu cầu đầu tiên (site.config.ts đọc đồng bộ từ đó).
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.CATALOGUE_SERVER !== "1" || !process.env.DATABASE_URL) return;
  const { ensureStore } = await import("@/lib/server/store");
  await ensureStore();
}

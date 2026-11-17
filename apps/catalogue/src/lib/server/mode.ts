/**
 * Chế độ máy chủ (Docker, VPS): dữ liệu nằm trong database, /admin có đăng nhập, trang render theo yêu cầu.
 * Không bật (Vercel, pnpm dev thường, e2e): dữ liệu là các file JSON trong src/data như trước.
 * Biến này phải có cả lúc build lẫn lúc chạy (Dockerfile đặt sẵn).
 */
export const serverMode = () => process.env.CATALOGUE_SERVER === "1";

/** Chế độ máy chủ và đã có database. Lúc build trong Docker chưa có DATABASE_URL: khi đó đọc JSON đi kèm. */
export const liveData = () => serverMode() && Boolean(process.env.DATABASE_URL);

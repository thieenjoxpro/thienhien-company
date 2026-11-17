import { connection } from "next/server";
import { getQuoteProducts } from "@/lib/quote-products";
import { serverMode } from "@/lib/server/mode";

// Bản gọn mọi mẫu cho popup danh sách hỏi giá. Popup chỉ tải khi mở, nên trang không phải nhúng dữ liệu này.
// Bản tĩnh: dựng sẵn lúc build. Chế độ máy chủ: đọc lúc yêu cầu để giá, tên sửa ở /admin có ngay.
export async function GET() {
  if (serverMode()) await connection();
  return Response.json(await getQuoteProducts());
}

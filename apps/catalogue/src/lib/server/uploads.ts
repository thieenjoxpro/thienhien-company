// Phục vụ ảnh /admin tải lên ở chế độ máy chủ. Ảnh nằm trong UPLOAD_DIR (volume), không phải public/:
// next start chỉ phục vụ các file public/ có lúc build. Ảnh có sẵn trong public/ vẫn do Next phục vụ trước.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { uploadDir } from "@/lib/admin/files";
import { serverMode } from "./mode";

const TYPES: Record<string, string> = { webp: "image/webp", jpg: "image/jpeg", png: "image/png" };

export async function serveUpload(folder: "products" | "workshop", file: string): Promise<Response> {
  const extension = file.split(".").at(-1) ?? "";
  // Chỉ nhận tên file phẳng: chữ, số, gạch; không cho đi lên thư mục cha
  if (!serverMode() || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(file) || !TYPES[extension]) return new Response(null, { status: 404 });
  try {
    const body = await readFile(join(/* turbopackIgnore: true */ uploadDir(), folder, file));
    // Tên file đổi mỗi lần tải lên (có dấu thời gian) nên cho cache dài
    return new Response(new Uint8Array(body), { headers: { "Content-Type": TYPES[extension], "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response(null, { status: 404 });
  }
}

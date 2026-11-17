// Đọc, ghi dữ liệu và ảnh cho khu /admin. ADMIN_DATA_DIR, ADMIN_PUBLIC_DIR đổi thư mục khi test.
// Chế độ máy chủ (CATALOGUE_SERVER=1): dữ liệu vào database, ảnh vào UPLOAD_DIR (volume của Docker),
// tên file dữ liệu ("products.json") thành khoá của bảng content.
import { existsSync } from "node:fs";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { z } from "zod";
import { serverMode } from "@/lib/server/mode";

const dataDir = () => process.env.ADMIN_DATA_DIR ?? join(/* turbopackIgnore: true */ process.cwd(), "src/data");
/** Thư mục ảnh tải lên của chế độ máy chủ; route /products/[file], /workshop/[file] phục vụ từ đây. */
export const uploadDir = () => process.env.UPLOAD_DIR ?? join(/* turbopackIgnore: true */ process.cwd(), ".data/uploads");
const publicDir = () => process.env.ADMIN_PUBLIC_DIR ?? (serverMode() ? uploadDir() : join(/* turbopackIgnore: true */ process.cwd(), "public"));

export async function readData<T extends z.ZodType>(file: string, schema: T): Promise<z.infer<T>> {
  if (serverMode()) return schema.parse(await (await import("@/lib/server/db")).readContent(file));
  return schema.parse(JSON.parse(await readFile(join(/* turbopackIgnore: true */ dataDir(), file), "utf8")));
}

/** Ghi qua file tạm rồi đổi tên: dev server không bao giờ đọc phải file ghi dở. */
export async function writeData(file: string, data: unknown): Promise<void> {
  if (serverMode()) {
    await (await import("@/lib/server/db")).writeContent(file, data);
    await (await import("@/lib/server/store")).refreshStore(); // trang công khai thấy bản mới ngay
    return;
  }
  const path = join(/* turbopackIgnore: true */ dataDir(), file);
  await writeFile(`${path}.tmp`, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await rename(`${path}.tmp`, path);
}

const IMAGE_TYPES: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };
const MAX_BYTES = 8 * 1024 * 1024;

/** Kiểm file ảnh tải lên; trả lời nhắn lỗi hoặc null. */
export function checkUpload(file: FormDataEntryValue | null): string | null {
  if (!(file instanceof File) || file.size === 0) return "Chọn một file ảnh.";
  if (!IMAGE_TYPES[file.type]) return "Ảnh phải là webp, jpg hoặc png.";
  if (file.size > MAX_BYTES) return "Ảnh nặng quá 8 MB.";
  return null;
}

/** Lưu ảnh vào public/<folder>/<tên>-<thời điểm>.<đuôi>; tên mới mỗi lần để cache ảnh của Next không giữ ảnh cũ. */
export async function saveUpload(folder: "products" | "workshop", name: string, file: File): Promise<string> {
  const src = `/${folder}/${name}-${Date.now().toString(36)}.${IMAGE_TYPES[file.type] ?? "webp"}`;
  const path = join(/* turbopackIgnore: true */ publicDir(), src);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, Buffer.from(await file.arrayBuffer()));
  return src;
}

export async function removePublic(src: string): Promise<void> {
  await rm(join(/* turbopackIgnore: true */ publicDir(), src), { force: true });
}

export async function renamePublic(from: string, to: string): Promise<void> {
  if (existsSync(join(/* turbopackIgnore: true */ publicDir(), from))) await rename(join(/* turbopackIgnore: true */ publicDir(), from), join(/* turbopackIgnore: true */ publicDir(), to));
}

export function dataFileExists(file: string): boolean {
  return existsSync(join(/* turbopackIgnore: true */ dataDir(), file));
}

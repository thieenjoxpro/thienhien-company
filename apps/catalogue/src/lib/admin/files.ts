// Đọc, ghi file dữ liệu và ảnh cho khu /admin. ADMIN_DATA_DIR, ADMIN_PUBLIC_DIR đổi thư mục khi test.
import { existsSync } from "node:fs";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { z } from "zod";

const dataDir = () => process.env.ADMIN_DATA_DIR ?? join(process.cwd(), "src/data");
const publicDir = () => process.env.ADMIN_PUBLIC_DIR ?? join(process.cwd(), "public");

export async function readData<T extends z.ZodType>(file: string, schema: T): Promise<z.infer<T>> {
  return schema.parse(JSON.parse(await readFile(join(dataDir(), file), "utf8")));
}

/** Ghi qua file tạm rồi đổi tên: dev server không bao giờ đọc phải file ghi dở. */
export async function writeData(file: string, data: unknown): Promise<void> {
  const path = join(dataDir(), file);
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
  const path = join(publicDir(), src);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, Buffer.from(await file.arrayBuffer()));
  return src;
}

export async function removePublic(src: string): Promise<void> {
  await rm(join(publicDir(), src), { force: true });
}

export async function renamePublic(from: string, to: string): Promise<void> {
  if (existsSync(join(publicDir(), from))) await rename(join(publicDir(), from), join(publicDir(), to));
}

export function dataFileExists(file: string): boolean {
  return existsSync(join(dataDir(), file));
}

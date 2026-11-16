// Phần chung của các form quản trị: giá trị chữ của FormData, lỗi theo ô, slug, ngày.
import { normalizeVietnamese } from "@thien-hien/shared";
import type { z } from "zod";

export type FieldErrors = Record<string, string>;
export type Values = Record<string, string>;
/** Trạng thái form sau một lần gửi lỗi: lỗi theo tên ô và giá trị vừa gõ để điền lại. */
export type FormState = { errors: FieldErrors; values: Values; nonce: number } | null;
export type Result<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors };

export function formValues(formData: FormData): Values {
  const values: Values = {};
  for (const [key, value] of formData.entries()) if (typeof value === "string") values[key] = value;
  return values;
}

export const failed = (errors: FieldErrors, values: Values): FormState => ({ errors, values, nonce: Date.now() });

export function slugify(text: string): string {
  return normalizeVietnamese(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const today = () => new Date().toISOString().slice(0, 10);

/** Chữ rỗng thành null. */
export const orNull = (text: string | undefined) => (text?.trim() ? text.trim() : null);

/** Số kiểu Việt: "0,8" -> 0.8, "18.000" -> 18000 (khi integer). Rỗng: undefined. */
export function parseNumber(text: string | undefined, integer = false): number | undefined {
  const raw = text?.trim();
  if (!raw) return undefined;
  return Number(integer ? raw.replace(/[.\s]/g, "") : raw.replace(",", "."));
}

/** Gom lỗi zod về tên ô đầu tiên của đường dẫn, dùng lời nhắn tiếng Việt theo ô. */
export function zodErrors(error: z.ZodError, messages: Record<string, string>): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    errors[field] ??= messages[field] ?? "Giá trị chưa hợp lệ.";
  }
  return errors;
}

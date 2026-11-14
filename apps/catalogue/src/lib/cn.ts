import { clsx, type ClassValue } from "clsx";

/**
 * Gộp class có điều kiện. Không dùng tailwind-merge: nó thêm khoảng 8 KB gzip vào JS mọi trang
 * (DEVIATIONS mục 67). Muốn ghi đè class gốc của component thì dùng biến thể (ví dụ `max-sm:px-4`),
 * không viết hai class cùng thuộc tính ở cùng một mức.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

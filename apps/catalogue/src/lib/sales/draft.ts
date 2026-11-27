// Nháp đơn đang bán dở trong localStorage, mỗi người đăng nhập một khoá. Trình duyệt chặn bộ nhớ thì bỏ qua, không lỗi.
import type { SaleState } from "./sale-state";

const PREFIX = "th-ban-hang-nhap:";
const VERSION = 1;

export const draftKey = (user: string) => `${PREFIX}${user}`;

export function readDraft(key: string): SaleState | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw) as { v?: number; state?: SaleState };
    if (data.v !== VERSION || !data.state || !Array.isArray(data.state.lines)) return null;
    return data.state;
  } catch {
    return null;
  }
}

export function writeDraft(key: string, state: SaleState): void {
  try {
    window.localStorage.setItem(key, JSON.stringify({ v: VERSION, state, savedAt: Date.now() }));
  } catch {
    // bộ nhớ đầy hoặc bị chặn: nháp không lưu được, đơn vẫn bán được
  }
}

export function clearDraft(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // như trên
  }
}

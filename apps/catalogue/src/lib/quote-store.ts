import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

export const QTY_MAX = 9999;

interface QuoteItem {
  sku: string;
  qty: number;
}

interface QuoteState {
  items: QuoteItem[];
  /** false cho tới khi đọc xong localStorage; component đọc cờ này để không lệch HTML máy chủ. */
  hasHydrated: boolean;
  add: (sku: string, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
  setHydrated: () => void;
}

/** Số lượng nguyên trong khoảng 1 đến 9999; giá trị hỏng (rỗng, NaN) thành 1. */
export const clampQty = (qty: number) => (Number.isFinite(qty) ? Math.min(QTY_MAX, Math.max(1, Math.round(qty))) : 1);

/** localStorage bọc try/catch: chế độ ẩn danh hoặc bị chặn lưu trữ thì danh sách chỉ sống trong trang. */
const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // Không lưu được thì thôi, danh sách vẫn dùng được trong phiên này
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // như trên
    }
  },
};

/** Danh sách hỏi giá (mục 5.5): chỉ lưu mã và số lượng; tên, ảnh, đơn vị lấy lại từ catalogue. */
export function createQuoteStore(storage: StateStorage) {
  return create<QuoteState>()(
    persist(
      (set) => ({
        items: [],
        hasHydrated: false,
        add: (sku, qty = 1) =>
          set(({ items }) => {
            const existing = items.find((item) => item.sku === sku);
            if (!existing) return { items: [...items, { sku, qty: clampQty(qty) }] };
            return { items: items.map((item) => (item.sku === sku ? { sku, qty: clampQty(item.qty + qty) } : item)) };
          }),
        setQty: (sku, qty) =>
          set(({ items }) => ({ items: items.map((item) => (item.sku === sku ? { sku, qty: clampQty(qty) } : item)) })),
        remove: (sku) => set(({ items }) => ({ items: items.filter((item) => item.sku !== sku) })),
        clear: () => set({ items: [] }),
        setHydrated: () => set({ hasHydrated: true }),
      }),
      {
        name: "th-quote-v1",
        storage: createJSONStorage(() => storage),
        partialize: ({ items }) => ({ items }),
        // Đọc localStorage sau khi hydrate (QuoteHydrator), không lúc tạo store, để không lệch HTML
        skipHydration: true,
        onRehydrateStorage: () => (state) => state?.setHydrated(),
      },
    ),
  );
}

export const useQuoteStore = createQuoteStore(safeLocalStorage);

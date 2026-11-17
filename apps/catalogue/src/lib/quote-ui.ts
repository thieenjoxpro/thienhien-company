import { create } from "zustand";

/** Popup danh sách hỏi giá đang mở hay đóng; header, khối 3 bước, thẻ sản phẩm cùng gọi open(). */
export const useQuoteUi = create<{ open: boolean; setOpen: (open: boolean) => void }>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

/** Thông tin một mẫu mà bảng hỏi giá cần; giá null nghĩa là "Liên hệ báo giá". */
export interface QuoteProduct {
  sku: string;
  slug: string;
  name: string;
  spec: string;
  unit: string;
  price: number | null;
  image: string | null;
}

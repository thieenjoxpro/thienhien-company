"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuoteStore } from "@/lib/quote-store";
import { useQuoteUi, type QuoteProduct } from "@/lib/quote-ui";
import { QuotePanel, type QuoteContact } from "./QuotePanel";

/**
 * Popup danh sách hỏi giá (design V2): máy tính là hộp giữa màn hình, điện thoại là tấm trượt từ đáy.
 * <dialog> gốc nên Esc đóng, focus giữ trong popup, đóng xong trả focus. Dữ liệu mẫu tải lần đầu mở.
 */
export default function QuoteDialog({ contact }: { contact: QuoteContact }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const open = useQuoteUi((state) => state.open);
  const setOpen = useQuoteUi((state) => state.setOpen);
  const count = useQuoteStore((state) => state.items.length);
  const [products, setProducts] = useState<QuoteProduct[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  useEffect(() => {
    if (!open || products) return;
    fetch("/api/hoi-gia")
      .then((response) => (response.ok ? (response.json() as Promise<QuoteProduct[]>) : Promise.reject(new Error(String(response.status)))))
      .then(setProducts)
      .catch(() => setFailed(true));
  }, [open, products]);

  const close = () => setOpen(false);
  return (
    <dialog
      ref={dialog}
      aria-labelledby="hoi-gia-tieu-de"
      onClose={close}
      className="m-auto w-full max-w-3xl rounded-card bg-ground p-0 text-ink backdrop:bg-scrim max-sm:mb-0 max-sm:max-h-11/12 max-sm:max-w-none max-sm:rounded-b-none"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line py-4 pr-2 pl-6">
        <div className="flex flex-col gap-1">
          <h2 id="hoi-gia-tieu-de" className="font-display text-h2 uppercase">
            Danh sách hỏi giá ({count} mã)
          </h2>
          <p className="text-small text-ink-muted max-sm:hidden">Ghi số lượng từng mã, xưởng báo giá sỉ qua Zalo.</p>
        </div>
        <button type="button" aria-label="Đóng" onClick={close} className="flex size-11 shrink-0 items-center justify-center">
          <X size={22} strokeWidth={2.2} aria-hidden />
        </button>
      </div>
      <div className="px-6 pb-6">
        {products ? <QuotePanel products={products} contact={contact} onNavigate={close} /> : null}
        {!products && !failed ? <p className="py-8">Đang mở danh sách hỏi giá.</p> : null}
        {failed ? <p className="py-8 text-danger">Không tải được danh sách. Tải lại trang rồi thử lại.</p> : null}
      </div>
    </dialog>
  );
}

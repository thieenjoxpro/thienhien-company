"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useRef, useState, ViewTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { buildQuoteMessage } from "@/lib/quote-message";
import { useQuoteStore } from "@/lib/quote-store";
import type { QuoteProduct } from "@/lib/quote-ui";
import { QuoteRow } from "./QuoteRow";

type Status = "idle" | "copied" | "manual";

export interface QuoteContact {
  /** Link zalo.me của số chính; null thì không có nút gửi Zalo. */
  zalo: string | null;
  tel: string | null;
  phone: string | null;
}

/**
 * Nội dung danh sách hỏi giá (design V2), dùng ở popup và trang /hoi-gia: các mã với số lượng,
 * ghi chú, xem trước tin nhắn, nút copy danh sách rồi mở Zalo, gọi xưởng, xoá hết.
 */
export function QuotePanel({ products, contact, onNavigate }: { products: QuoteProduct[]; contact: QuoteContact; onNavigate?: () => void }) {
  const { items: liveItems, hasHydrated, clear } = useQuoteStore();
  // Store đổi đồng bộ, không phải transition; đọc giá trị trễ để <ViewTransition> của từng hàng chạy enter, exit
  const items = useDeferredValue(liveItems);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const manual = useRef<HTMLTextAreaElement>(null);

  if (!hasHydrated) return <p className="py-8">Đang mở danh sách hỏi giá.</p>;
  const rows = items.flatMap((item) => {
    const product = products.find((p) => p.sku === item.sku);
    return product ? [{ product, qty: item.qty }] : [];
  });
  if (!rows.length) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <p className="text-lead font-bold">Chưa có mã nào trong danh sách</p>
        <p className="text-ink-muted">Bấm Thêm vào hỏi giá ở thẻ sản phẩm, mã sẽ hiện ở đây.</p>
        <Button asChild variant="outline" size="md">
          <Link href="/san-pham" onClick={onNavigate}>
            Xem mẫu
          </Link>
        </Button>
      </div>
    );
  }

  const message = buildQuoteMessage(
    rows.map(({ product, qty }) => ({ sku: product.sku, name: product.name, spec: product.spec, qty, unit: product.unit })),
    note,
  );
  const send = () => {
    // Copy bắt đầu trước khi mở tab Zalo (trang còn focus), mở tab ngay trong cú bấm để không bị chặn popup
    navigator.clipboard
      ?.writeText(message)
      .then(() => setStatus("copied"))
      .catch(() => {
        setStatus("manual");
        requestAnimationFrame(() => manual.current?.select());
      });
    if (contact.zalo) window.open(contact.zalo, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-4">
      <ul>
        {rows.map(({ product, qty }) => (
          // Mẫu bỏ trượt ra, các hàng còn lại dồn lên theo tên riêng
          <ViewTransition key={product.sku} name={`hang-${product.sku}`} enter="row-in" exit="row-out">
            <QuoteRow product={product} qty={qty} onNavigate={onNavigate} />
          </ViewTransition>
        ))}
      </ul>
      <Input label="Ghi chú thêm (không bắt buộc)" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ví dụ: giao Bình Chánh, cần trong tuần" />
      <details className="rounded-btn border border-line bg-surface">
        <summary className="flex min-h-11 cursor-pointer items-center px-4 text-small font-semibold">Xem tin nhắn sẽ gửi</summary>
        <p className="px-4 pb-4 text-small whitespace-pre-wrap text-ink-soft">{message}</p>
      </details>
      <div role="status">
        {status === "copied" ? (
          <p className="rounded-btn border border-success bg-surface px-4 py-3 text-small">
            Đã copy danh sách. Zalo đang mở: giữ vào khung chat với xưởng, chọn Dán rồi gửi.
            {contact.zalo ? (
              <>
                {" "}
                Zalo chưa mở?{" "}
                <a href={contact.zalo} target="_blank" rel="noopener noreferrer" className="font-semibold text-link underline">
                  Mở Zalo {contact.phone}
                </a>
              </>
            ) : null}
          </p>
        ) : null}
        {status === "manual" ? (
          <>
            <p className="mb-2">Không copy tự động được. Chọn đoạn này, copy rồi dán vào Zalo.</p>
            <textarea ref={manual} readOnly aria-label="Tin nhắn hỏi giá" value={message} rows={message.split("\n").length + 1} className="w-full rounded-btn border border-ink-muted bg-surface p-4 text-base" />
          </>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {contact.zalo ? (
          <Button variant="zalo" onClick={send} className="max-sm:grow">
            <MessageCircle size={20} strokeWidth={2} aria-hidden />
            Copy danh sách, mở Zalo
          </Button>
        ) : null}
        {contact.tel ? (
          <Button asChild variant="outline" className="max-sm:grow">
            <a href={contact.tel}>Gọi {contact.phone}</a>
          </Button>
        ) : null}
        <button type="button" onClick={clear} className="ml-auto flex min-h-11 items-center text-small font-semibold text-ink-muted underline">
          Xoá hết
        </button>
      </div>
    </div>
  );
}

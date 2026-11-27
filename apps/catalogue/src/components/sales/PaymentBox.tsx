"use client";

import { docSoThanhChu } from "@thien-hien/shared";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { moneyText } from "@/lib/sales/money";
import type { PaidMode } from "@/lib/sales/sale-state";
import { MoneyInput } from "./MoneyInput";

interface Props {
  subtotal: number;
  total: number;
  paid: number;
  discountText: string;
  paidText: string;
  paidMode: PaidMode;
  errors: Record<string, string>;
  onDiscount: (text: string) => void;
  onPaid: (text: string) => void;
  onPaidMode: (mode: PaidMode) => void;
  onThousand: () => void;
}

const quick = (active: boolean) =>
  cn("h-14 shrink-0 rounded-btn border-2 px-4 text-sale font-semibold", active ? "border-ink bg-ink text-on-ink" : "border-ink bg-ground text-ink");

/** Giảm giá, tổng tiền, khách trả; mỗi ô tiền có số bằng chữ ngay dưới. */
export function PaymentBox({ subtotal, total, paid, discountText, paidText, paidMode, errors, onDiscount, onPaid, onPaidMode, onThousand }: Props) {
  const change = total - paid;
  return (
    <section aria-labelledby="buoc-tien" className="flex flex-col gap-6 rounded-card border border-line p-4 sm:p-6">
      <h2 id="buoc-tien" className="text-sale-lg font-bold">
        Tiền
      </h2>
      <p className="text-sale tabular-nums">Tiền hàng: {formatPrice(subtotal)}</p>
      <MoneyInput label="Giảm giá (nếu có)" value={discountText} onChange={onDiscount} error={errors.discount} />
      <div className="rounded-card bg-surface p-4">
        <p className="text-sale font-semibold">Tổng tiền</p>
        <p className="text-sale-total font-bold tabular-nums" data-testid="tong-tien">
          {formatPrice(total)}
        </p>
        <p className="text-sale text-ink-soft">{docSoThanhChu(total)}</p>
      </div>
      <MoneyInput label="Khách trả" value={paidMode === "full" ? moneyText(total) : paidMode === "none" ? "" : paidText} onChange={onPaid} error={errors.paid}>
        <button type="button" className={quick(false)} onClick={onThousand} aria-label="Thêm 000">
          000
        </button>
        <button type="button" className={quick(paidMode === "full")} aria-pressed={paidMode === "full"} onClick={() => onPaidMode("full")}>
          Trả đủ
        </button>
        <button type="button" className={quick(paidMode === "none")} aria-pressed={paidMode === "none"} onClick={() => onPaidMode("none")}>
          Chưa trả
        </button>
      </MoneyInput>
      <p className={cn("text-sale-lg font-bold tabular-nums", change > 0 ? "text-danger" : "text-success")} aria-live="polite">
        {change > 0 ? `Còn nợ thêm: ${formatPrice(change)}` : change < 0 ? `Trả dư: ${formatPrice(-change)}` : "Trả đủ, không nợ thêm"}
      </p>
    </section>
  );
}

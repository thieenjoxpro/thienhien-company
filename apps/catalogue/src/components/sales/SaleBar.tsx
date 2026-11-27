"use client";

import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

interface Props {
  customerName: string | null;
  count: number;
  total: number;
  paid: number;
  saving: boolean;
  onSubmit: () => void;
}

/** Thanh chốt đơn dính đáy màn hình: tóm tắt một dòng và một nút chính. Không hỏi lại "Bạn có chắc không?". */
export function SaleBar({ customerName, count, total, paid, saving, onSubmit }: Props) {
  const change = total - paid;
  const parts = [
    customerName ?? "Chưa chọn khách",
    `${count} món`,
    formatPrice(total),
    `trả ${formatPrice(paid)}`,
    change > 0 ? `còn nợ ${formatPrice(change)}` : change < 0 ? `trả dư ${formatPrice(-change)}` : null,
  ].filter(Boolean);
  return (
    <div className="bar-bottom border-t-2 border-ink bg-ground">
      <div className="mx-auto flex max-w-page flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sale font-semibold tabular-nums" aria-live="polite" data-testid="tom-tat">
          {parts.join(" · ")}
        </p>
        <Button variant="dark" size="xl" onClick={onSubmit} disabled={saving} aria-busy={saving}>
          {saving ? "Đang lưu" : "Xong, in phiếu"}
        </Button>
      </div>
    </div>
  );
}

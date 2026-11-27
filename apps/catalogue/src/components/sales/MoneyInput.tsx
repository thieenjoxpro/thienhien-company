"use client";

import { docSoThanhChu } from "@thien-hien/shared";
import { useId, useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatMoneyInput, parseMoney } from "@/lib/sales/money";

interface Props {
  label: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
  /** Hiện số bằng chữ ngay dưới ô (mặc định bật). */
  words?: boolean;
  /** Dòng phụ thay cho số bằng chữ khi words tắt, ví dụ "Lần trước bán: 250.000 đ". */
  hint?: string;
  /** Nút nhanh cạnh ô ("000", "Trả đủ"). */
  children?: ReactNode;
  className?: string;
  name?: string;
}

/** Ô tiền: tự chèn dấu chấm khi gõ, con trỏ đứng yên đúng chỗ, số bằng chữ ngay dưới, lỗi nằm dưới ô tới khi sửa. */
export function MoneyInput({ label, value, onChange, error, words = true, hint, children, className, name }: Props) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (caret.current !== null && ref.current && document.activeElement === ref.current) {
      ref.current.setSelectionRange(caret.current, caret.current);
      caret.current = null;
    }
  }, [value]);

  const amount = parseMoney(value);
  return (
    <div className={className} data-error={error ? "" : undefined}>
      <label htmlFor={id} className="mb-2 block text-sale font-semibold text-ink">
        {label}
      </label>
      <div className="flex flex-wrap items-stretch gap-3">
        <div className="relative min-w-0 grow basis-48">
          <input
            ref={ref}
            id={id}
            name={name}
            inputMode="numeric"
            autoComplete="off"
            value={value}
            aria-invalid={error ? true : undefined}
            aria-describedby={`${id}-words ${id}-error`}
            onChange={(event) => {
              const next = formatMoneyInput(event.target.value, event.target.selectionStart ?? event.target.value.length);
              caret.current = next.caret;
              onChange(next.text);
            }}
            className={cn(
              "h-14 w-full rounded-btn border-2 bg-ground pr-12 pl-4 text-sale-lg font-semibold text-ink tabular-nums",
              error ? "border-danger" : "border-ink-muted",
            )}
          />
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sale text-ink-soft">
            đ
          </span>
        </div>
        {children}
      </div>
      <p id={`${id}-words`} className="mt-2 min-h-7 text-sale text-ink-soft">
        {words ? (amount > 0 ? docSoThanhChu(amount) : null) : hint}
      </p>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sale font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

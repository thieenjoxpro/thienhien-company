"use client";

import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { clampQty, QTY_MAX, useQuoteStore } from "@/lib/quote-store";

const stepButton = "flex w-12 items-center justify-center bg-ground text-ink hover:bg-surface";

/**
 * Số lượng (bớt, ô số, thêm) và nút tối "Thêm vào hỏi giá" trên trang chi tiết (design 3).
 * Thêm xong hiện dòng trạng thái kèm link tới danh sách.
 */
export function AddToQuoteButton({ sku, unit }: { sku: string; unit: string }) {
  const add = useQuoteStore((state) => state.add);
  const [qty, setQty] = useState("1");
  const [added, setAdded] = useState<number | null>(null);
  const id = useId();
  const number = Number(qty);
  const invalid = qty !== "" && (!Number.isInteger(number) || number < 1 || number > QTY_MAX);
  const step = (delta: number) => {
    setQty(String(clampQty((number || 1) + delta)));
    setAdded(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small font-semibold">
        Số lượng ({unit})
      </label>
      <div className="flex flex-wrap gap-3">
        <div className="flex h-13 overflow-hidden rounded-btn border-2 border-ink">
          <button type="button" aria-label="Bớt 1" onClick={() => step(-1)} className={stepButton}>
            <Minus size={18} strokeWidth={2.4} aria-hidden />
          </button>
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={1}
            max={QTY_MAX}
            value={qty}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? `${id}-loi` : undefined}
            onChange={(event) => {
              setQty(event.target.value);
              setAdded(null);
            }}
            className="w-18 border-x border-line text-center text-lead font-bold"
          />
          <button type="button" aria-label="Thêm 1" onClick={() => step(1)} className={stepButton}>
            <Plus size={18} strokeWidth={2.4} aria-hidden />
          </button>
        </div>
        <Button
          variant="dark"
          disabled={invalid}
          onClick={() => {
            const amount = clampQty(number || 1);
            add(sku, amount);
            setAdded(amount);
          }}
          className="grow"
        >
          <Plus size={18} strokeWidth={2.4} aria-hidden />
          Thêm vào hỏi giá
        </Button>
      </div>
      {invalid ? (
        <p id={`${id}-loi`} className="text-small text-danger">
          Số lượng từ 1 đến {QTY_MAX}.
        </p>
      ) : null}
      <p role="status" className="min-h-6 text-small font-semibold text-success">
        {added ? (
          <>
            Đã thêm {sku} ({added} {unit}) vào danh sách hỏi giá.{" "}
            <Link href="/hoi-gia" className="underline underline-offset-4">
              Xem danh sách hỏi giá
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}

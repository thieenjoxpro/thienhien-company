"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { clampQty, QTY_MAX, useQuoteStore } from "@/lib/quote-store";

/**
 * Ô số lượng và nút "Thêm vào hỏi giá" trên trang chi tiết (mục 5.4). Thêm xong nút giữ nguyên nhãn,
 * bên dưới hiện dòng trạng thái kèm link tới danh sách.
 */
export function AddToQuoteButton({ sku, unit }: { sku: string; unit: string }) {
  const add = useQuoteStore((state) => state.add);
  const [qty, setQty] = useState("1");
  const [added, setAdded] = useState(false);
  const number = Number(qty);
  const invalid = qty !== "" && (!Number.isInteger(number) || number < 1 || number > QTY_MAX);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Input
          label={`Số lượng (${unit})`}
          type="number"
          inputMode="numeric"
          min={1}
          max={QTY_MAX}
          value={qty}
          onChange={(event) => {
            setQty(event.target.value);
            setAdded(false);
          }}
          error={invalid ? `Số lượng từ 1 đến ${QTY_MAX}.` : undefined}
          className="sm:w-40"
        />
        <Button
          variant="primary"
          onClick={() => {
            add(sku, clampQty(number || 1));
            setAdded(true);
          }}
          className={invalid ? "sm:mb-12" : undefined}
        >
          Thêm vào hỏi giá
        </Button>
      </div>
      <p role="status" className="mt-3 min-h-11 text-success">
        {added ? (
          <>
            Đã thêm {sku} vào danh sách hỏi giá.{" "}
            <Link href="/hoi-gia" className="underline underline-offset-4">
              Xem danh sách hỏi giá
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}

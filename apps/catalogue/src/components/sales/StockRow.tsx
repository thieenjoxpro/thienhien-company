"use client";

import { useActionState } from "react";
import { saveStockAction } from "@/app/admin/_actions/sales-admin";
import { Button } from "@/components/ui/Button";
import type { FormState } from "@/lib/admin/form";
import { quantityText } from "@/lib/sales/money";

interface Props {
  sku: string;
  name: string;
  unit: string;
  quantity: number;
}

/** Một dòng của trang Kho: đặt lại số tồn sau khi đếm kho hoặc nhập hàng. */
export function StockRow({ sku, name, unit, quantity }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveStockAction, null);
  const error = state?.errors[`q-${sku}`];
  return (
    <li id={sku} className="border-b border-line py-4">
      <form action={action} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <input type="hidden" name="sku" value={sku} />
        <div className="grow">
          <p className="text-sale font-semibold">{name}</p>
          <p className="text-sale text-ink-soft">
            {sku} · tính theo {unit}
            {quantity < 0 ? " · đang âm vì bán vượt tồn" : ""}
          </p>
        </div>
        <div>
          <label htmlFor={`ton-${sku}`} className="mb-2 block text-sale font-semibold">
            Tồn ({unit})
          </label>
          <input
            id={`ton-${sku}`}
            name="quantity"
            inputMode="decimal"
            defaultValue={state?.values.quantity ?? quantityText(quantity)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `ton-${sku}-loi` : undefined}
            className="h-12 w-32 rounded-btn border-2 border-ink-muted bg-ground px-3 text-sale tabular-nums"
          />
        </div>
        <Button variant="outline" size="sale" type="submit" disabled={pending}>
          Lưu số tồn
        </Button>
      </form>
      {error ? (
        <p id={`ton-${sku}-loi`} className="mt-2 text-sale font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </li>
  );
}

"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { formatNumber, formatPrice } from "@/lib/format";
import { parseMoney, parseQuantity } from "@/lib/sales/money";
import { lineAmount } from "@/lib/sales/order";
import type { SaleLine } from "@/lib/sales/sale-state";
import type { SaleProduct } from "@/lib/sales/types";
import { MoneyInput } from "./MoneyInput";

interface Props {
  index: number;
  line: SaleLine;
  product: SaleProduct | undefined;
  lastPrice: number | undefined;
  errors: Record<string, string>;
  onQuantity: (text: string) => void;
  onStep: (delta: 1 | -1) => void;
  onPrice: (text: string) => void;
  onRemove: () => void;
}

const stepClass = "flex size-14 shrink-0 items-center justify-center rounded-btn border-2 border-ink bg-ground text-sale-total font-bold text-ink active:bg-surface";

export function SaleLineRow({ index, line, product, lastPrice, errors, onQuantity, onStep, onPrice, onRemove }: Props) {
  const id = useId();
  const quantity = parseQuantity(line.quantity);
  const amount = lineAmount(quantity, parseMoney(line.price));
  const quantityError = errors[`line-${index}-quantity`];
  const over = product && Number.isFinite(quantity) && quantity > product.stock;
  const name = product?.name ?? line.sku;

  return (
    <li className="flex flex-col gap-4 border-b border-line py-6 first:pt-0 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-sale-lg font-semibold">
          {index + 1}. {name}
        </p>
        <button type="button" onClick={onRemove} className="min-h-12 rounded-btn border-2 border-ink-muted px-4 text-sale font-semibold" aria-label={`Xoá dòng ${name}`}>
          Xoá dòng
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div data-error={quantityError ? "" : undefined}>
          <label htmlFor={id} className="mb-2 block text-sale font-semibold">
            Số lượng
          </label>
          <div className="flex items-center gap-3">
            <button type="button" className={stepClass} onClick={() => onStep(-1)} aria-label={`Bớt 1 ${product?.unit ?? ""}`}>
              −
            </button>
            <input
              id={id}
              inputMode="decimal"
              autoComplete="off"
              value={line.quantity}
              onChange={(event) => onQuantity(event.target.value)}
              aria-invalid={quantityError ? true : undefined}
              aria-describedby={quantityError ? `${id}-error` : undefined}
              className={cn("h-14 w-24 min-w-0 rounded-btn border-2 bg-ground px-3 text-center text-sale-lg font-semibold tabular-nums", quantityError ? "border-danger" : "border-ink-muted")}
            />
            <button type="button" className={stepClass} onClick={() => onStep(1)} aria-label={`Thêm 1 ${product?.unit ?? ""}`}>
              +
            </button>
            <span className="text-sale">{product?.unit}</span>
          </div>
          {quantityError ? (
            <p id={`${id}-error`} className="mt-2 text-sale font-semibold text-danger">
              {quantityError}
            </p>
          ) : null}
          {over ? (
            <p className="mt-3 rounded-btn border-2 border-accent bg-warning-surface px-3 py-2 text-sale text-ink">
              {product.stock > 0 ? `Kho chỉ còn ${formatNumber(product.stock)} ${product.unit}.` : "Kho đã hết hàng này."} Vẫn bán được, nhớ nhập thêm hàng.
            </p>
          ) : null}
        </div>
        <div>
          <MoneyInput
            label="Đơn giá"
            value={line.price}
            onChange={onPrice}
            error={errors[`line-${index}-price`]}
            words={false}
            hint={lastPrice !== undefined ? `Lần trước bán: ${formatPrice(lastPrice)}` : product?.price ? `Giá bảng: ${formatPrice(product.price)}` : "Chưa có giá bảng, nhập đơn giá."}
          />
        </div>
      </div>
      <p className="text-sale-lg font-semibold tabular-nums">Thành tiền: {formatPrice(amount)}</p>
    </li>
  );
}

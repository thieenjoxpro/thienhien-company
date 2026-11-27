"use client";

import { useState, useTransition } from "react";
import { addCustomer } from "@/app/admin/_actions/sales";
import { Button } from "@/components/ui/Button";
import type { CustomerKind, SaleCustomer } from "@/lib/sales/types";
import { TextField } from "./TextField";

interface Props {
  initialName: string;
  initialPhone: string;
  onDone: (customer: SaleCustomer) => void;
  onCancel: () => void;
}

/** Thêm khách ngay trong màn bán hàng (không mở hộp thoại). */
export function NewCustomerForm({ initialName, initialPhone, onDone, onCancel }: Props) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [kind, setKind] = useState<CustomerKind>("si");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  const save = () =>
    start(async () => {
      const result = await addCustomer({ name, phone, kind });
      if (result.ok) onDone(result.customer);
      else setErrors(result.errors);
    });

  return (
    <fieldset className="flex flex-col gap-4 rounded-card border border-line bg-surface p-4">
      <legend className="px-2 text-sale font-semibold">Khách mới</legend>
      <TextField label="Tên khách" value={name} onChange={setName} error={errors.name} autoComplete="off" />
      <TextField label="Số điện thoại (có thể bỏ trống)" value={phone} onChange={setPhone} error={errors.phone} inputMode="tel" autoComplete="off" />
      <div role="radiogroup" aria-label="Loại khách" className="flex flex-wrap gap-3">
        {(
          [
            ["si", "Khách sỉ (ghi nợ được)"],
            ["le", "Khách lẻ"],
          ] as const
        ).map(([value, label]) => (
          <label key={value} className="flex min-h-12 items-center gap-3 rounded-btn border-2 border-ink-muted bg-ground px-4 text-sale">
            <input type="radio" name="loai-khach" value={value} checked={kind === value} onChange={() => setKind(value)} className="size-6" />
            {label}
          </label>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="dark" size="sale" onClick={save} disabled={pending}>
          {pending ? "Đang lưu khách" : "Lưu khách này"}
        </Button>
        <Button variant="outline" size="sale" onClick={onCancel}>
          Bỏ qua
        </Button>
      </div>
    </fieldset>
  );
}

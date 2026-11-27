"use client";

import { useActionState, useState } from "react";
import { addPaymentAction } from "@/app/admin/_actions/sales-admin";
import { Button } from "@/components/ui/Button";
import type { FormState } from "@/lib/admin/form";
import { MoneyInput } from "./MoneyInput";
import { TextField } from "./TextField";

/** Thu nợ: số tiền khách trả thêm, có số bằng chữ ngay dưới ô. */
export function PaymentForm({ customerId }: { customerId: number }) {
  const [state, action, pending] = useActionState<FormState, FormData>(addPaymentAction, null);
  const [amount, setAmount] = useState(state?.values.amount ?? "");
  const [note, setNote] = useState(state?.values.note ?? "");
  return (
    <form action={action} noValidate className="flex max-w-xl flex-col gap-4">
      <input type="hidden" name="customerId" value={customerId} />
      <MoneyInput label="Khách trả nợ" name="amount" value={amount} onChange={setAmount} error={state?.errors.amount} />
      <TextField label="Ghi chú (có thể bỏ trống)" name="note" value={note} onChange={setNote} placeholder="Ví dụ: chuyển khoản" />
      <div>
        <Button variant="dark" size="sale" type="submit" disabled={pending}>
          {pending ? "Đang lưu" : "Lưu khoản trả"}
        </Button>
      </div>
    </form>
  );
}

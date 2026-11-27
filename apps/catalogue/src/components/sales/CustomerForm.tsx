"use client";

import { useActionState } from "react";
import { saveCustomerAction } from "@/app/admin/_actions/sales-admin";
import { Select } from "@/components/admin/Field";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { FormState } from "@/lib/admin/form";
import type { CustomerKind } from "@/lib/sales/types";

interface Props {
  customer?: { id: number; name: string; phone: string | null; address: string | null; kind: CustomerKind };
}

/** Thêm hoặc sửa khách. Lỗi nằm dưới ô của nó. */
export function CustomerForm({ customer }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCustomerAction, null);
  const val = (name: "name" | "phone" | "address") => state?.values[name] ?? customer?.[name] ?? "";
  return (
    <form key={state?.nonce} action={action} noValidate className="flex max-w-3xl flex-col gap-6">
      {customer ? <input type="hidden" name="id" value={customer.id} /> : null}
      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="Tên khách" name="name" defaultValue={val("name")} error={state?.errors.name} autoComplete="off" />
        <Input label="Số điện thoại" name="phone" inputMode="tel" defaultValue={val("phone")} error={state?.errors.phone} autoComplete="off" />
        <Input label="Địa chỉ (in trên phiếu)" name="address" defaultValue={val("address")} autoComplete="off" />
        <Select label="Loại khách" name="kind" defaultValue={state?.values.kind ?? customer?.kind ?? "si"} hint="Khách sỉ: phiếu in nợ cũ, nợ mới, tổng nợ.">
          <option value="si">Khách sỉ</option>
          <option value="le">Khách lẻ</option>
        </Select>
      </div>
      <div>
        <Button variant="dark" type="submit" disabled={pending}>
          {pending ? "Đang lưu" : "Lưu khách"}
        </Button>
      </div>
    </form>
  );
}

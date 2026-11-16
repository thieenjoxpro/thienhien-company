"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { FormState } from "@/lib/admin/form";

interface Props {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  /** Ô ẩn gửi kèm (sku của sản phẩm, hoặc vị trí ảnh xưởng). */
  hidden: Record<string, string>;
  alt?: string;
  /** Có ảnh rồi thì file không bắt buộc: chỉ sửa mô tả. */
  fileOptional?: boolean;
  submitLabel: string;
}

export function ImageUpload({ action, hidden, alt = "", fileOptional = false, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, null);
  return (
    <form key={state?.nonce} action={formAction} className="flex max-w-xl flex-col gap-4">
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Input
        label={fileOptional ? "Ảnh mới (để trống nếu chỉ sửa mô tả)" : "File ảnh"}
        name="file"
        type="file"
        accept="image/webp,image/jpeg,image/png"
        error={state?.errors.file}
        hint="webp, jpg hoặc png, tối đa 8 MB; cạnh dài từ 1600px."
      />
      <Input label="Mô tả ảnh" name="alt" defaultValue={state?.values.alt ?? alt} error={state?.errors.alt} hint="Tả thứ có trong ảnh, ví dụ: Bản lề cối Ø16, thép mạ kẽm, nhìn nghiêng." />
      <div>
        <Button variant="secondary" type="submit" disabled={pending}>
          {pending ? "Đang tải" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

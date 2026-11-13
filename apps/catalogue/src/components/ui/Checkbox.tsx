import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  /** Số mẫu khớp giá trị này (bộ lọc), in kiểu mã. */
  count?: number;
}

/** Checkbox gốc của trình duyệt, cả hàng là vùng bấm cao 44px. */
export function Checkbox({ label, count, className, ...rest }: CheckboxProps) {
  return (
    <label className={cn("flex min-h-11 cursor-pointer items-center gap-3 text-body", className)}>
      <input type="checkbox" className="size-5 shrink-0 accent-ink" {...rest} />
      <span>{label}</span>
      {count === undefined ? null : <span className="font-mono text-sku text-ink-muted">{count}</span>}
    </label>
  );
}

"use client";

import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange"> & {
  label: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
};

/** Ô chữ chữ to của khu bán hàng; lỗi nằm ngay dưới ô tới khi sửa. */
export function TextField({ label, value, onChange, error, className, ...rest }: Props) {
  const id = useId();
  return (
    <div className={className} data-error={error ? "" : undefined}>
      <label htmlFor={id} className="mb-2 block text-sale font-semibold">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn("h-14 w-full rounded-btn border-2 bg-ground px-4 text-sale text-ink", error ? "border-danger" : "border-ink-muted")}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sale font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

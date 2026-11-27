"use client";

import { useId } from "react";

/** Ô tìm của màn bán hàng: nhãn luôn hiện, chữ to, nút xoá chữ có chữ. */
export function SearchField({ label, value, onChange }: { label: string; value: string; onChange: (text: string) => void }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sale font-semibold">
        {label}
      </label>
      <div className="flex gap-3">
        <input
          id={id}
          type="search"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-14 min-w-0 grow rounded-btn border-2 border-ink-muted bg-ground px-4 text-sale text-ink"
        />
        {value ? (
          <button type="button" onClick={() => onChange("")} className="h-14 shrink-0 rounded-btn border-2 border-ink px-4 text-sale font-semibold">
            Xoá chữ
          </button>
        ) : null}
      </div>
    </div>
  );
}

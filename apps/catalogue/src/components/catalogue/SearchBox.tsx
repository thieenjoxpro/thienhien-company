"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";

const DELAY = 250;

/** Ô tìm theo mã hoặc tên, không dấu. Gõ xong 250ms mới đẩy lên URL để không giật con trỏ. */
export function SearchBox({ value, onChange }: { value: string; onChange: (q: string) => void }) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  useEffect(() => {
    if (text === value) return;
    const timer = window.setTimeout(() => onChange(text), DELAY);
    return () => window.clearTimeout(timer);
  }, [text, value, onChange]);

  return (
    <Input
      label="Tìm theo mã hoặc tên"
      type="search"
      name="q"
      autoComplete="off"
      value={text}
      onChange={(event) => setText(event.target.value)}
    />
  );
}

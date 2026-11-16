"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";

const DELAY = 250;

/** Ô tìm theo mã hoặc tên, không dấu. Gõ xong 250ms mới đẩy lên URL để không giật con trỏ. */
export function SearchBox({ value, onChange }: { value: string; onChange: (q: string) => void }) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  // Gõ trước khi trang hydrate xong thì React không nhận onChange: lấy lại chữ đang có trong ô
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const typed = input.current?.value;
    if (typed) setText(typed);
  }, []);
  useEffect(() => {
    if (text === value) return;
    const timer = window.setTimeout(() => onChange(text), DELAY);
    return () => window.clearTimeout(timer);
  }, [text, value, onChange]);

  return (
    <Input
      ref={input}
      label="Tìm theo mã hoặc tên"
      type="search"
      name="q"
      autoComplete="off"
      value={text}
      onChange={(event) => setText(event.target.value)}
    />
  );
}

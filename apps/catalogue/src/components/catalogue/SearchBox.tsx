"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";

const DELAY = 250;

/**
 * Ô tìm theo mã hoặc tên, không dấu. Gõ xong 250ms mới đẩy lên URL để không giật con trỏ.
 * Ô không điều khiển bằng state (defaultValue): khách gõ trước khi trang hydrate xong thì React
 * không xoá chữ đó; lúc gắn JS đọc lại chữ trong ô. Giá trị đổi từ ngoài (Back, Xoá lọc) ghi thẳng vào ô.
 */
export function SearchBox({ value, onChange }: { value: string; onChange: (q: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(value);

  const first = useRef(true);

  useEffect(() => {
    const node = input.current;
    if (first.current) {
      // Lần chạy đầu, lúc gắn JS: lấy chữ khách đã gõ sớm (bằng value thì effect dưới không gửi gì)
      first.current = false;
      setText(node?.value ?? value);
      return;
    }
    setText(value);
    if (node && node.value !== value && document.activeElement !== node) node.value = value;
  }, [value]);

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
      defaultValue={value}
      onChange={(event) => setText(event.target.value)}
    />
  );
}

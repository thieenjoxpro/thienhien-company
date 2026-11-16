"use client";

import type { MouseEvent, ReactNode } from "react";
import { Button } from "@/components/ui/Button";

/** Nút gửi form có hỏi lại trước khi làm việc không hoàn tác được (xoá). */
export function ConfirmButton({ question, name, value, children }: { question: string; name?: string; value?: string; children: ReactNode }) {
  const ask = (event: MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(question)) event.preventDefault();
  };
  return (
    <Button variant="secondary" type="submit" name={name} value={value} formNoValidate onClick={ask}>
      {children}
    </Button>
  );
}

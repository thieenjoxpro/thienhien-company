import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  /** Nhãn luôn hiện, không dùng placeholder thay nhãn. */
  label: string;
  hint?: string;
  /** Lỗi nằm ngay dưới ô, luôn kèm lời. */
  error?: string;
}

export function Input({ label, hint, error, className, ...rest }: InputProps) {
  const id = useId();
  const noteId = `${id}-note`;
  const note = error ?? hint;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-label text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={note ? noteId : undefined}
        className={cn(
          "h-12 w-full rounded-btn border bg-surface px-4 text-body text-ink",
          error ? "border-danger" : "border-ink-muted",
        )}
        {...rest}
      />
      {note ? (
        <p id={noteId} className={cn("mt-2 text-body", error ? "text-danger" : "text-ink-muted")}>
          {note}
        </p>
      ) : null}
    </div>
  );
}

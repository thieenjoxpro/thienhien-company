import { useId, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

// Ô nhiều dòng và ô chọn cho form quản trị, cùng kiểu với ui/Input: nhãn luôn hiện, lỗi ngay dưới ô.
interface FrameProps {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: (props: { id: string; describedBy?: string; invalid?: true; box: string }) => ReactNode;
}

function FieldFrame({ label, hint, error, className, children }: FrameProps) {
  const id = useId();
  const note = error ?? hint;
  const box = cn("w-full rounded-btn border bg-surface px-4 text-body text-ink", error ? "border-danger" : "border-ink-muted");
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-label text-ink">
        {label}
      </label>
      {children({ id, describedBy: note ? `${id}-note` : undefined, invalid: error ? true : undefined, box })}
      {note ? (
        <p id={`${id}-note`} className={cn("mt-2 text-body", error ? "text-danger" : "text-ink-muted")}>
          {note}
        </p>
      ) : null}
    </div>
  );
}

type Shared = { label: string; hint?: string; error?: string; className?: string };

export function Textarea({ label, hint, error, className, ...rest }: Shared & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">) {
  return (
    <FieldFrame label={label} hint={hint} error={error} className={className}>
      {({ id, describedBy, invalid, box }) => (
        <textarea id={id} aria-describedby={describedBy} aria-invalid={invalid} rows={4} className={cn(box, "py-3")} {...rest} />
      )}
    </FieldFrame>
  );
}

export function Select({ label, hint, error, className, children, ...rest }: Shared & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id">) {
  return (
    <FieldFrame label={label} hint={hint} error={error} className={className}>
      {({ id, describedBy, invalid, box }) => (
        <select id={id} aria-describedby={describedBy} aria-invalid={invalid} className={cn(box, "h-12")} {...rest}>
          {children}
        </select>
      )}
    </FieldFrame>
  );
}

/** Lỗi chung của một nhóm ô (ví dụ bảng thông số), đọc to khi xuất hiện. */
export function GroupError({ message }: { message?: string }) {
  return message ? (
    <p role="alert" className="mt-2 text-body text-danger">
      {message}
    </p>
  ) : null;
}

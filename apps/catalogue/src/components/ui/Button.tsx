import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement } from "react";
import { cn } from "@/lib/cn";

// design/components/Button/README.md: hai dạng, cùng chiều cao 48px, cùng bo 2px, lún 1px khi bấm
const variants = {
  primary: "bg-accent text-on-accent hover:bg-accent-strong",
  secondary: "bg-transparent text-ink hover:bg-ink hover:text-on-ink",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: keyof typeof variants;
  /** Gắn kiểu nút lên phần tử con (thường là <a> hoặc <Link>) thay vì render <button>. */
  asChild?: boolean;
}

export function Button({ variant, asChild = false, className, children, type = "button", ...rest }: ButtonProps) {
  const classes = cn(
    "m-press inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-btn border border-ink px-6 text-button sm:w-auto",
    variants[variant],
    className,
  );
  // PhoneBar dựa vào dấu này để biết nút chính nào đang trong màn hình
  const marker = variant === "primary" ? { "data-primary-action": "" } : {};

  if (asChild && isValidElement<{ className?: string }>(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, { ...marker, className: cn(classes, child.props.className) });
  }
  return (
    <button type={type} className={classes} {...marker} {...rest}>
      {children}
    </button>
  );
}

import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement } from "react";
import { cn } from "@/lib/cn";

// design/README.md: bốn dạng, bo 4px, chữ đậm, lún 1px khi bấm
const variants = {
  zalo: "border-zalo bg-zalo text-on-ink hover:border-zalo-strong hover:bg-zalo-strong",
  dark: "border-ink bg-ink text-on-ink hover:bg-ink-soft",
  outline: "border-ink bg-ground text-ink hover:bg-surface",
  outlineLight: "border-on-ink bg-transparent text-on-ink hover:bg-ink-soft",
} as const;

const sizes = { md: "h-12 px-5 text-small", lg: "h-13 px-6 text-body" } as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Gắn kiểu nút lên phần tử con (thường là <a> hoặc <Link>) thay vì render <button>. */
  asChild?: boolean;
}

export function Button({ variant, size = "lg", asChild = false, className, children, type = "button", ...rest }: ButtonProps) {
  const classes = cn(
    "m-press inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-btn border-2 font-bold sm:w-auto",
    sizes[size],
    variants[variant],
    className,
  );
  // PhoneBar dựa vào dấu này để biết nút Zalo nào đang trong màn hình
  const marker = variant === "zalo" ? { "data-primary-action": "" } : {};

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

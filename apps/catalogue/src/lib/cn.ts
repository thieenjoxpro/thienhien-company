import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge phải biết thang chữ riêng của hệ; nếu không nó coi text-display là màu chữ và nuốt text-ink
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "h2", "h3", "title", "body", "small", "label", "button", "sku", "spec", "price"],
    },
  },
});

/** Gộp class có điều kiện và bỏ class Tailwind xung đột (class sau thắng). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

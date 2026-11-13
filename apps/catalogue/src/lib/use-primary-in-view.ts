"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type RefObject } from "react";

/**
 * Có nút chính nào (phần tử mang data-primary-action, khớp selector) đang trong màn hình không,
 * bỏ qua các nút nằm trong `own`. Dùng để giữ luật "mỗi màn hình đúng một nút tô màu":
 * nút trên header và PhoneBar nhường chỗ khi nút chính của trang đang hiện.
 * Trả null cho tới khi đo xong lần đầu.
 */
export function usePrimaryInView(selector: string, own: RefObject<HTMLElement | null>): boolean | null {
  const [inView, setInView] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const targets = [...document.querySelectorAll(selector)].filter((el) => !own.current?.contains(el));
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setInView(visible.size > 0);
    });
    for (const target of targets) observer.observe(target);
    if (targets.length === 0) setInView(false);
    return () => observer.disconnect();
  }, [selector, own, pathname]);

  return inView;
}

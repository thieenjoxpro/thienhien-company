"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Có nút chính nào khác (data-primary-action, ví dụ nút của hero) đang trong màn hình không.
 * Nút nằm trong phần tử data-action-follower (nút trên header, PhoneBar) không tính: chúng là bên đi theo.
 * null khi chưa đo xong. Mỗi màn hình chỉ có một nút tô màu (docs/PLAN.md mục 5.1, 8).
 */
export function usePrimaryInView(): boolean | null {
  const [inView, setInView] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const targets = [...document.querySelectorAll("[data-primary-action]")].filter(
      (el) => !el.closest("[data-action-follower]"),
    );
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
  }, [pathname]);

  return inView;
}

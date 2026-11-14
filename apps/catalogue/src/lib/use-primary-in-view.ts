"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type RefObject } from "react";

/**
 * Có nút chính nào (phần tử mang data-primary-action, khớp selector) đang trong màn hình không,
 * bỏ qua các nút nằm trong `own`. Dùng để giữ luật "mỗi màn hình đúng một nút tô màu":
 * nút trên header và PhoneBar nhường chỗ khi nút chính của trang đang hiện.
 * Quét lại khi DOM đổi, vì có nút chỉ xuất hiện sau khi hydrate (ví dụ nút gửi ở trang hỏi giá).
 * Trả null cho tới khi đo xong lần đầu.
 */
export function usePrimaryInView(selector: string, own: RefObject<HTMLElement | null>): boolean | null {
  const [inView, setInView] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setInView(visible.size > 0);
    });
    let watched: Element[] = [];
    const scan = () => {
      const targets = [...document.querySelectorAll(selector)].filter((el) => !own.current?.contains(el));
      if (targets.length === watched.length && targets.every((el, i) => el === watched[i])) return;
      observer.disconnect();
      visible.clear();
      watched = targets;
      for (const target of targets) observer.observe(target);
      if (targets.length === 0) setInView(false);
    };
    let frame = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    scan();
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      observer.disconnect();
    };
  }, [selector, own, pathname]);

  return inView;
}

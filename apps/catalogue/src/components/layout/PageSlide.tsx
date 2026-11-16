import { ViewTransition, type ReactNode } from "react";

const DIRECTIONS = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

/**
 * Khung chuyển trang có hướng, bọc nội dung của từng page.tsx (không đặt ở layout hay template:
 * layout không chạy enter, exit; template dựng lại khi đổi tham số lọc làm mất trạng thái ô lọc).
 * Chỉ link gắn transitionTypes nav-forward (thẻ, ô danh mục) hoặc nav-back (breadcrumb) mới trượt;
 * nút Back của trình duyệt, đổi tham số lọc thì không có hiệu ứng. CSS ở globals.css.
 */
export function PageSlide({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={DIRECTIONS} exit={DIRECTIONS} default="none">
      {children}
    </ViewTransition>
  );
}

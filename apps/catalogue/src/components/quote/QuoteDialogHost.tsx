"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuoteUi } from "@/lib/quote-ui";
import type { QuoteContact } from "./QuotePanel";

// Mã của popup (bảng, số lượng, gửi Zalo) chỉ tải khi khách mở lần đầu, không cộng vào JS của mọi trang
const QuoteDialog = dynamic(() => import("./QuoteDialog"), { ssr: false });

/** Gắn một lần trong khung site. Đổi trang thì đóng popup (bấm tên mẫu trong popup để xem chi tiết). */
export function QuoteDialogHost({ contact }: { contact: QuoteContact }) {
  const open = useQuoteUi((state) => state.open);
  const setOpen = useQuoteUi((state) => state.setOpen);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  if (open && !mounted) setMounted(true);
  useEffect(() => setOpen(false), [pathname, setOpen]);
  return mounted ? <QuoteDialog contact={contact} /> : null;
}

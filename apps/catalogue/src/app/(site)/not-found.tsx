import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/NotFoundContent";

export const metadata: Metadata = { title: "Không có trang này", robots: { index: false, follow: true } };

// notFound() gọi trong các trang công khai: đã nằm trong khung (site)/layout
export default function NotFound() {
  return <NotFoundContent />;
}

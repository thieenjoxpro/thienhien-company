import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { SiteChrome } from "@/components/layout/SiteChrome";

export const metadata: Metadata = { title: "Không có trang này", robots: { index: false, follow: true } };

// URL không khớp route nào: layout gốc không có khung site nên tự bọc SiteChrome
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}

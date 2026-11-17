import { connection } from "next/server";
import type { ReactNode } from "react";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { liveData, serverMode } from "@/lib/server/mode";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  // Chế độ máy chủ: render theo yêu cầu từ bản dữ liệu trong bộ nhớ, để sửa ở /admin là lên ngay
  // và HTML dựng sẵn lúc build (từ JSON) không bao giờ che dữ liệu trong database.
  if (serverMode()) {
    await connection();
    if (liveData()) await (await import("@/lib/server/store")).ensureStore();
  }
  return <SiteChrome>{children}</SiteChrome>;
}

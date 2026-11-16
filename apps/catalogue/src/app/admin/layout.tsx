import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { adminEnabled } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s | Quản trị Thiện Hiền" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/admin/san-pham", label: "Sản phẩm" },
  { href: "/admin/danh-muc", label: "Danh mục" },
  { href: "/admin/chinh-sach", label: "Chính sách" },
  { href: "/admin/xuong", label: "Thông tin xưởng" },
];

// Khu quản trị chạy trên máy (pnpm dev), ghi thẳng vào src/data và public/. Bản build không có trang này.
export default function AdminLayout({ children }: { children: ReactNode }) {
  if (!adminEnabled()) notFound();
  return (
    <>
      <header className="border-b border-line">
        <Container className="flex flex-wrap items-center gap-x-6 py-3">
          <Link href="/admin" className="mr-6 flex min-h-11 items-center text-lead font-semibold">
            Quản trị
          </Link>
          <nav aria-label="Khu quản trị" className="grow">
            <ul className="flex flex-wrap gap-x-6">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex min-h-11 items-center underline-offset-4 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link href="/" className="flex min-h-11 items-center text-ink-muted underline underline-offset-4">
            Xem site
          </Link>
        </Container>
      </header>
      <main id="noi-dung">
        <Container className="py-12">{children}</Container>
      </main>
    </>
  );
}

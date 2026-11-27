import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { signOut } from "@/app/dang-nhap/actions";
import { requireAdmin } from "@/lib/admin/guard";
import { serverMode } from "@/lib/server/mode";

export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s | Quản trị Thiện Hiền" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/admin/ban-hang", label: "Bán hàng" },
  { href: "/admin/don-hang", label: "Đơn hàng" },
  { href: "/admin/khach-hang", label: "Khách hàng" },
  { href: "/admin/kho", label: "Kho" },
  { href: "/admin/san-pham", label: "Sản phẩm" },
  { href: "/admin/danh-muc", label: "Danh mục" },
  { href: "/admin/chinh-sach", label: "Chính sách" },
  { href: "/admin/xuong", label: "Thông tin xưởng" },
];

// Khu quản trị: pnpm dev ghi thẳng vào src/data và public/; chế độ máy chủ ghi database và phải đăng nhập.
// Bản build thường (Vercel) không có trang này.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  return (
    <>
      <header className="border-b border-line print:hidden">
        <Container className="flex flex-wrap items-center gap-x-6 py-3">
          <Link href="/admin" className="mr-6 flex min-h-11 items-center text-lead font-semibold">
            Quản trị
          </Link>
          <nav aria-label="Khu quản trị" className="grow">
            <ul className="flex flex-wrap gap-x-6">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex min-h-11 min-w-11 items-center underline-offset-4 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link href="/" className="flex min-h-11 items-center text-ink-muted underline underline-offset-4">
            Xem site
          </Link>
          {serverMode() ? (
            <form action={signOut}>
              <button type="submit" className="flex min-h-11 items-center text-ink-muted underline underline-offset-4">
                Đăng xuất
              </button>
            </form>
          ) : null}
        </Container>
      </header>
      <main id="noi-dung">
        <Container className="py-12 print:p-0">{children}</Container>
      </main>
    </>
  );
}

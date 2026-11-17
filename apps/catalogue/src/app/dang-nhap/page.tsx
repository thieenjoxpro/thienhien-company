import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { serverMode } from "@/lib/server/mode";
import { currentAdmin } from "@/lib/server/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Đăng nhập quản trị", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Chỉ có ở chế độ máy chủ (Docker). Khi pnpm dev, /admin mở thẳng không cần đăng nhập.
export default async function LoginPage() {
  if (!serverMode()) notFound();
  if (await currentAdmin()) redirect("/admin");
  return (
    <main id="noi-dung">
      <Container className="max-w-md py-16">
        <h1 className="mb-8 font-display text-h1 uppercase">Đăng nhập quản trị</h1>
        <LoginForm />
      </Container>
    </main>
  );
}

import type { Metadata } from "next";
import { BackLink } from "@/components/admin/AdminList";
import { PolicyForm } from "@/components/admin/PolicyForm";

export const metadata: Metadata = { title: "Thêm chính sách" };

export default function NewPolicy() {
  return (
    <>
      <BackLink href="/admin/chinh-sach">Chính sách</BackLink>
      <h1 className="mb-8 text-h2 lg:mb-12">Thêm chính sách</h1>
      <PolicyForm policy={null} />
    </>
  );
}

import type { Metadata } from "next";
import { AdminList } from "@/components/admin/AdminList";
import { Notice, noticeFrom } from "@/components/admin/Notice";
import { loadPolicies } from "@/lib/admin/repo";

export const metadata: Metadata = { title: "Chính sách" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminPolicies({ searchParams }: Props) {
  const rows = (await loadPolicies()).map((p) => ({ href: `/admin/chinh-sach/${p.slug}`, title: p.title, meta: `Sửa ngày ${p.updatedAt}` }));
  return (
    <AdminList title="Chính sách" addHref="/admin/chinh-sach/moi" addLabel="Thêm chính sách" rows={rows} empty="Chưa có chính sách nào; footer chưa hiện cột Chính sách." notice={<Notice text={await noticeFrom(searchParams)} />} />
  );
}

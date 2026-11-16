import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deletePolicy } from "@/app/admin/_actions/content";
import { BackLink } from "@/components/admin/AdminList";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Notice, noticeFrom } from "@/components/admin/Notice";
import { PolicyForm } from "@/components/admin/PolicyForm";
import { loadPolicies } from "@/lib/admin/repo";

export const metadata: Metadata = { title: "Sửa chính sách" };

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function EditPolicy({ params, searchParams }: Props) {
  const { slug } = await params;
  const policy = (await loadPolicies()).find((p) => p.slug === slug);
  if (!policy) notFound();
  return (
    <>
      <BackLink href="/admin/chinh-sach">Chính sách</BackLink>
      <h1 className="mb-8 text-h2 lg:mb-12">{policy.title}</h1>
      <Notice text={await noticeFrom(searchParams)} />
      <PolicyForm policy={policy} />
      <form action={deletePolicy} className="mt-24 max-w-3xl border-t border-line pt-8">
        <input type="hidden" name="slug" value={policy.slug} />
        <ConfirmButton question={`Xoá chính sách ${policy.title}?`}>Xoá chính sách</ConfirmButton>
      </form>
    </>
  );
}

import type { Metadata } from "next";
import { AdminList } from "@/components/admin/AdminList";
import { Notice, noticeFrom } from "@/components/admin/Notice";
import { loadCategories, loadProducts } from "@/lib/admin/repo";

export const metadata: Metadata = { title: "Danh mục" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminCategories({ searchParams }: Props) {
  const [categories, products] = await Promise.all([loadCategories(), loadProducts()]);
  const byOrder = categories.toSorted((a, b) => a.order - b.order);
  const rows = byOrder
    .filter((c) => !c.parentSlug)
    .flatMap((top) => [top, ...byOrder.filter((c) => c.parentSlug === top.slug)])
    .map((c) => ({
      href: `/admin/danh-muc/${c.slug}`,
      title: c.name,
      meta: `${products.filter((p) => p.categorySlug === c.slug).length} sản phẩm`,
      indent: Boolean(c.parentSlug),
    }));
  return <AdminList title="Danh mục" addHref="/admin/danh-muc/moi" addLabel="Thêm danh mục" rows={rows} empty="Chưa có danh mục nào." notice={<Notice text={await noticeFrom(searchParams)} />} />;
}

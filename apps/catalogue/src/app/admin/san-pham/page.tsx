import { normalizeVietnamese } from "@thien-hien/shared";
import type { Metadata } from "next";
import Link from "next/link";
import { Notice, noticeFrom } from "@/components/admin/Notice";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { loadCategories, loadProducts } from "@/lib/admin/repo";

export const metadata: Metadata = { title: "Sản phẩm" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminProducts({ searchParams }: Props) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const [products, categories] = await Promise.all([loadProducts(), loadCategories()]);
  const names = new Map(categories.map((c) => [c.slug, c.name]));
  const needle = normalizeVietnamese(q);
  const shown = needle ? products.filter((p) => normalizeVietnamese(`${p.sku} ${p.name}`).includes(needle)) : products;
  return (
    <>
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
        <h1 className="text-h2">Sản phẩm</h1>
        <Button variant="dark" asChild>
          <Link href="/admin/san-pham/moi">Thêm sản phẩm</Link>
        </Button>
      </div>
      <Notice text={await noticeFrom(searchParams)} />
      <form className="mb-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end">
        <div className="grow">
          <label htmlFor="tim-sp" className="mb-2 block text-label">
            Tìm theo mã hoặc tên
          </label>
          <input id="tim-sp" name="q" type="search" defaultValue={q} className="h-12 w-full rounded-btn border border-ink-muted bg-surface px-4" />
        </div>
        <Button variant="outline" type="submit">
          Lọc danh sách
        </Button>
      </form>
      {shown.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-3xl text-left">
            <thead className="text-label text-ink-muted">
              <tr className="border-b border-line">
                <th scope="col" className="py-3 pr-6 font-medium">Mã</th>
                <th scope="col" className="py-3 pr-6 font-medium">Tên</th>
                <th scope="col" className="py-3 pr-6 font-medium">Danh mục</th>
                <th scope="col" className="py-3 pr-6 font-medium">Giá từ</th>
                <th scope="col" className="py-3 font-medium">Trên site</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.sku} className="border-b border-line">
                  <td className="py-3 pr-6 text-label font-semibold">{p.sku}</td>
                  <td className="py-3 pr-6">
                    <Link href={`/admin/san-pham/${p.sku}`} className="underline underline-offset-4">
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-6">{names.get(p.categorySlug) ?? p.categorySlug}</td>
                  <td className="py-3 pr-6">{p.priceFrom === null ? "Không hiện" : formatPrice(p.priceFrom)}</td>
                  <td className="py-3">{p.images.length ? `Hiện, ${p.images.length} ảnh` : "Ẩn: chưa có ảnh"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>{q ? `Không có sản phẩm khớp "${q}".` : "Chưa có sản phẩm nào. Bấm Thêm sản phẩm để nhập mẫu đầu tiên."}</p>
      )}
    </>
  );
}

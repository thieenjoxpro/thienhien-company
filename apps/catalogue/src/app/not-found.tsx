import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getCategoryTree } from "@/lib/catalog";

export const metadata: Metadata = { title: "Không có trang này", robots: { index: false, follow: true } };

// 404 (mục 5.6): ô tìm (form GET tới /san-pham) và các nhóm hàng đang có.
export default async function NotFound() {
  const groups = await getCategoryTree();
  return (
    <Section>
      <h1 className="mb-8 text-h2 lg:mb-12">Không có trang này</h1>
      <form action="/san-pham" className="mb-12 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end">
        <div className="grow">
          <label htmlFor="tim-404" className="mb-2 block text-label">
            Tìm theo mã hoặc tên
          </label>
          <input id="tim-404" name="q" type="search" className="h-12 w-full rounded-btn border border-ink-muted bg-surface px-4" />
        </div>
        <Button variant="secondary" type="submit">
          Xem mẫu khớp
        </Button>
      </form>
      {groups.length ? (
        <ul className="flex flex-wrap gap-x-6">
          {groups.map((group) => (
            <li key={group.slug}>
              <Link href={`/danh-muc/${group.slug}`} className="flex min-h-11 items-center underline underline-offset-4">
                {group.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}

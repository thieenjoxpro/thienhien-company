import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface Row {
  href: string;
  title: string;
  meta: string;
  indent?: boolean;
}

/** Trang danh sách quản trị: tiêu đề, nút thêm, các dòng có link sửa, lời khi rỗng. */
export function AdminList({ title, addHref, addLabel, rows, empty, notice }: { title: string; addHref: string; addLabel: string; rows: Row[]; empty: string; notice: ReactNode }) {
  return (
    <>
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
        <h1 className="text-h2">{title}</h1>
        <Button variant="primary" asChild>
          <Link href={addHref}>{addLabel}</Link>
        </Button>
      </div>
      {notice}
      {rows.length ? (
        <ul className="max-w-3xl border-t border-line">
          {rows.map((row) => (
            <li key={row.href} className="flex flex-wrap items-baseline justify-between gap-x-6 border-b border-line py-3">
              <Link href={row.href} className={row.indent ? "pl-6 underline underline-offset-4" : "underline underline-offset-4"}>
                {row.title}
              </Link>
              <span className="text-small text-ink-muted">{row.meta}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>{empty}</p>
      )}
    </>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="mb-6 flex min-h-11 items-center text-ink-muted underline underline-offset-4">
      {children}
    </Link>
  );
}

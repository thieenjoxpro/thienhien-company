import Link from "next/link";

export interface Crumb {
  label: string;
  /** Mục cuối (trang hiện tại) không có href. */
  href?: string;
}

/** Đường dẫn phân cấp ở đầu trang danh mục và trang chi tiết. */
export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Đường dẫn" className="mb-4 text-small text-ink-muted">
      <ol className="flex flex-wrap items-center gap-x-2">
        {crumbs.map((crumb, index) => (
          <li key={crumb.label} className="flex items-center gap-x-2">
            {index > 0 ? <span aria-hidden>/</span> : null}
            {crumb.href ? (
              <Link href={crumb.href} className="flex min-h-11 min-w-11 items-center underline-offset-4 hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="flex min-h-11 items-center text-ink">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

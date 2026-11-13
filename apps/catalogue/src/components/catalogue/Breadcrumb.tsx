import Link from "next/link";

export interface Crumb {
  name: string;
  href: string;
}

/** Đường dẫn trang (kiểu chữ small). Mục cuối là trang hiện tại, không phải link. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Đường dẫn" className="mb-6 text-small text-ink-muted">
      <ol className="flex flex-wrap items-center gap-x-2">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-x-2">
              {last ? (
                <span aria-current="page" className="flex min-h-11 items-center">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="flex min-h-11 min-w-11 items-center underline underline-offset-4">
                    {item.name}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

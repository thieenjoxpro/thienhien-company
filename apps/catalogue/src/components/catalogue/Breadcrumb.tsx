import Link from "next/link";

/** Breadcrumb là đường lùi ra ngoài: trang mới trượt từ trái sang (xem PageSlide). */
const BACK = ["nav-back"];

export interface Crumb {
  name: string;
  href: string;
}

/** Đường dẫn trang (chữ label, màu phụ). Mục cuối là trang hiện tại, đậm, không phải link. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Đường dẫn" className="py-2 text-label text-ink-muted">
      <ol className="flex flex-wrap items-center gap-x-2">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-x-2">
              {last ? (
                <span aria-current="page" className="flex min-h-11 items-center font-semibold text-ink">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} transitionTypes={BACK} className="flex min-h-11 min-w-11 items-center hover:text-link">
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

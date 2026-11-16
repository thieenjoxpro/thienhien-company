import Link from "next/link";
import { cn } from "@/lib/cn";
import { countByCategory, getCategoryTree, getProducts } from "@/lib/catalog";

/** Hộp "Danh mục sản phẩm" ở cột trái trang danh sách (design 3): mục đang xem đậm, danh mục con thụt vào. */
export async function CategorySidebar({ current }: { current: string | null }) {
  const [tree, counts, all] = await Promise.all([getCategoryTree(), countByCategory(), getProducts()]);
  const entry = (slug: string | null, name: string, href: string, nested = false) => (
    <li key={href}>
      <Link
        href={href}
        aria-current={slug === current ? "page" : undefined}
        className={cn(
          "flex min-h-11 items-center justify-between gap-3 border-b border-photo text-base hover:text-link",
          nested && "pl-4 text-small",
          slug === current && "font-bold",
        )}
      >
        <span>{name}</span>
        <span className="text-label font-normal text-ink-muted">{slug ? (counts[slug] ?? 0) : all.length}</span>
      </Link>
    </li>
  );
  return (
    <nav aria-labelledby="hop-danh-muc" className="rounded-card border border-line p-5">
      <h2 id="hop-danh-muc" className="text-eyebrow uppercase">
        Danh mục sản phẩm
      </h2>
      <span aria-hidden className="mt-1 mb-2 block h-1 w-10 bg-accent" />
      <ul>
        {entry(null, "Tất cả sản phẩm", "/san-pham")}
        {tree.flatMap((group) => [
          entry(group.slug, group.name, `/danh-muc/${group.slug}`),
          ...group.children.map((child) => entry(child.slug, child.name, `/danh-muc/${child.slug}`, true)),
        ])}
      </ul>
    </nav>
  );
}

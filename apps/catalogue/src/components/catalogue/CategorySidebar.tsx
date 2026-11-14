import Link from "next/link";
import { cn } from "@/lib/cn";
import { countByCategory, getCategoryTree, getProducts } from "@/lib/catalog";

const item = "flex min-h-11 items-center justify-between gap-3 underline-offset-4 hover:underline";

/** Cột danh mục từ 1024px (mục 5.3): danh sách chữ, mục đang chọn gạch chân, số mẫu kiểu mã. */
export async function CategorySidebar({ current }: { current: string | null }) {
  const [tree, counts, all] = await Promise.all([getCategoryTree(), countByCategory(), getProducts()]);
  const entry = (slug: string | null, name: string, href: string, nested = false) => (
    <li key={href}>
      <Link
        href={href}
        aria-current={slug === current ? "page" : undefined}
        className={cn(item, nested && "pl-4", slug === current && "underline")}
      >
        <span>{name}</span>
        <span className="font-mono text-sku text-ink-muted">{slug ? (counts[slug] ?? 0) : all.length}</span>
      </Link>
    </li>
  );
  return (
    <nav aria-label="Danh mục" className="hidden lg:col-span-3 lg:block">
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

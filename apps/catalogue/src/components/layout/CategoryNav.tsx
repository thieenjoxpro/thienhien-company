import { ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { MenuGroup } from "@/lib/menu";
import { CategoryMenu } from "./CategoryMenu";

/**
 * Thanh danh mục nền surface. Từ 1024px: ô tối "Danh mục sản phẩm", các nhóm hàng (rê chuột mở bảng),
 * Hàng mới về, Giới thiệu xưởng, link Cách hỏi giá sỉ bên phải. Dưới 1024px: nhóm hàng cuộn ngang.
 */
export function CategoryNav({ groups }: { groups: MenuGroup[] }) {
  return (
    <div className="relative border-b border-line bg-surface">
      <Container className="hidden items-stretch lg:flex">
        <Link href="/san-pham" className="flex min-h-13 w-60 items-center gap-3 bg-ink px-5 text-small font-semibold text-on-ink uppercase">
          <Menu size={20} strokeWidth={2} aria-hidden />
          Danh mục sản phẩm
        </Link>
        <CategoryMenu groups={groups} />
        <Link href="/#cach-hoi-gia" className="ml-auto flex min-h-13 items-center gap-1 text-small font-semibold text-link hover:underline">
          Cách hỏi giá sỉ
          <ChevronRight size={16} strokeWidth={2} aria-hidden />
        </Link>
      </Container>
      <Container as="nav" aria-label="Nhóm hàng" className="lg:hidden">
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 py-2">
          {groups.map((group) => (
            <li key={group.slug} className="shrink-0">
              <Link href={`/danh-muc/${group.slug}`} className="flex min-h-11 items-center rounded-full border border-line bg-ground px-4 text-small font-semibold">
                {group.name}
              </Link>
            </li>
          ))}
          <li className="shrink-0">
            <Link href="/san-pham?sx=moi" className="flex min-h-11 items-center rounded-full border border-line bg-ground px-4 text-small font-semibold">
              Hàng mới
            </Link>
          </li>
        </ul>
      </Container>
    </div>
  );
}

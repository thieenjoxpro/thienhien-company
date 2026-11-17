import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { MenuGroup } from "@/lib/menu";

const item = "flex min-h-13 min-w-11 shrink-0 items-center justify-center text-small font-semibold hover:text-link";

/**
 * Thanh nhóm hàng nền surface (design V2): bốn nhóm hàng, "Tất cả N mẫu", bên phải "Ghé xưởng xem hàng".
 * Dưới 1024px cuộn ngang, link ghé xưởng nằm trong menu.
 */
export function CategoryNav({ groups, total }: { groups: MenuGroup[]; total: number }) {
  return (
    <nav aria-label="Nhóm hàng" className="border-b border-line bg-surface">
      <Container className="flex items-stretch gap-x-6 overflow-x-auto lg:gap-x-8">
        {groups.map((group) => (
          <Link key={group.slug} href={`/danh-muc/${group.slug}`} className={item}>
            {group.name}
          </Link>
        ))}
        <Link href="/san-pham" className={item}>
          Tất cả {total} mẫu
        </Link>
        <Link href="/#xuong" className={`${item} ml-auto hidden gap-1 text-link lg:flex`}>
          Ghé xưởng xem hàng
          <ChevronRight size={16} strokeWidth={2} aria-hidden />
        </Link>
      </Container>
    </nav>
  );
}

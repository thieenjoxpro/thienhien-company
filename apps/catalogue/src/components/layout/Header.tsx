import { Search } from "lucide-react";
import Link from "next/link";
import { QuoteCount } from "@/components/quote/QuoteCount";
import { Container } from "@/components/ui/Container";
import { zaloLink } from "@/lib/contact";
import { getMenuGroups } from "@/lib/menu";
import { site } from "@/lib/site.config";
import { CategoryMenu } from "./CategoryMenu";
import { HeaderAction } from "./HeaderAction";
import { MobileNav } from "./MobileNav";

/**
 * Header dính, phẳng (mục 5.1). Từ 1024px: tên xưởng, nhóm hàng, tìm, danh sách hỏi giá, nút chính.
 * 640 đến 1023px: tên xưởng, nút chính, menu. Dưới 640px: tên xưởng, tìm, menu.
 */
export async function Header() {
  const groups = await getMenuGroups();
  const zalo = zaloLink(site.zaloWholesale);

  return (
    <header className="bar-top border-b border-line bg-ground">
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link href="/" className="flex min-h-11 items-center text-title">
          {site.name}
        </Link>
        <CategoryMenu groups={groups} />
        <div className="flex items-center gap-2">
          <Link href="/san-pham" aria-label="Tìm mẫu" className="flex size-11 items-center justify-center sm:hidden lg:flex">
            <Search size={20} strokeWidth={1.5} aria-hidden />
          </Link>
          <QuoteCount />
          {zalo ? <HeaderAction href={zalo} /> : null}
          <MobileNav groups={groups} />
        </div>
      </Container>
    </header>
  );
}

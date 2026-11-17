import { Phone } from "lucide-react";
import { QuoteCount } from "@/components/quote/QuoteCount";
import { Container } from "@/components/ui/Container";
import { telLink } from "@/lib/contact";
import { getMenuGroups } from "@/lib/menu";
import { site } from "@/lib/site.config";
import { CategoryNav } from "./CategoryNav";
import { HeaderSearch } from "./HeaderSearch";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { TopBar } from "./TopBar";

/**
 * Header design 3: thanh tối trên cùng, hàng logo + ô tìm + gọi xưởng + danh sách hỏi giá,
 * thanh danh mục. Dưới 1024px: logo, hỏi giá, menu; ô tìm xuống hàng riêng; nhóm hàng cuộn ngang.
 */
export async function Header() {
  const groups = await getMenuGroups();
  const tel = telLink(site.phone);
  return (
    <header>
      <TopBar />
      <div className="border-b border-line bg-ground">
        <Container className="flex flex-wrap items-center gap-x-8 gap-y-3 py-3 lg:py-4">
          <Logo tagline className="mr-auto lg:mr-0" />
          <HeaderSearch id="tim-header" className="order-last w-full lg:order-0 lg:w-auto lg:grow" />
          <div className="flex items-center gap-2 lg:gap-6">
            {tel && site.phone ? (
              <a href={tel} className="hidden items-center gap-3 xl:flex">
                <span className="flex size-11 items-center justify-center rounded-full bg-surface">
                  <Phone size={20} strokeWidth={2} aria-hidden />
                </span>
                <span className="flex flex-col">
                  <span className="text-tag text-ink-muted">Gọi xưởng</span>
                  <span className="text-base font-bold">{site.phone}</span>
                </span>
              </a>
            ) : null}
            <QuoteCount />
            <MobileNav groups={groups} phone={site.phone} zaloWholesale={site.zaloWholesale} />
          </div>
        </Container>
      </div>
      <CategoryNav groups={groups} />
    </header>
  );
}

import { MessageCircle } from "lucide-react";
import { QuoteCount } from "@/components/quote/QuoteCount";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getProducts } from "@/lib/catalog";
import { zaloLink } from "@/lib/contact";
import { getMenuGroups } from "@/lib/menu";
import { site } from "@/lib/site.config";
import { CategoryNav } from "./CategoryNav";
import { HeaderSearch } from "./HeaderSearch";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { TopBar } from "./TopBar";

/**
 * Header design V2: thanh tối (địa chỉ, giờ, số gọi), hàng logo + ô tìm + danh sách hỏi giá + nút Zalo,
 * thanh nhóm hàng. Dưới 1024px: logo, hỏi giá, menu; ô tìm xuống hàng riêng.
 */
export async function Header() {
  const [groups, products] = await Promise.all([getMenuGroups(), getProducts()]);
  const zalo = zaloLink(site.zaloWholesale);
  return (
    <header>
      <TopBar />
      <div className="border-b border-line bg-ground">
        <Container className="flex flex-wrap items-center gap-x-8 gap-y-3 py-3 lg:py-4">
          <Logo tagline className="mr-auto lg:mr-0" />
          <HeaderSearch id="tim-header" className="order-last w-full lg:order-0 lg:w-auto lg:grow" />
          <div className="flex items-center gap-2 lg:gap-3">
            <QuoteCount />
            {zalo ? (
              // Bọc ngoài để ẩn dưới 1024px: class flex của Button sẽ đè hidden nếu đặt thẳng lên nút
              <span className="hidden lg:block">
                <Button asChild variant="zalo" size="md">
                  <a href={zalo} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} strokeWidth={2} aria-hidden />
                    {site.mainAction}
                  </a>
                </Button>
              </span>
            ) : null}
            <MobileNav groups={groups} phone={site.phone} zaloWholesale={site.zaloWholesale} />
          </div>
        </Container>
      </div>
      <CategoryNav groups={groups} total={products.length} />
    </header>
  );
}

import { CategoryGrid } from "@/components/catalogue/CategoryGrid";
import { ContactBand } from "@/components/home/ContactBand";
import { Hero } from "@/components/home/Hero";
import { NewProducts } from "@/components/home/NewProducts";
import { WorkshopSplit } from "@/components/home/WorkshopSplit";

// Trang chủ (docs/PLAN.md mục 5.2): 5 khối, mỗi khối một màn hình. Khối thiếu dữ kiện tự bỏ.
export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <NewProducts />
      <WorkshopSplit />
      <ContactBand />
    </>
  );
}

import { CategoryGrid } from "@/components/catalogue/CategoryGrid";
import { ContactBand } from "@/components/home/ContactBand";
import { Hero } from "@/components/home/Hero";
import { NewProducts } from "@/components/home/NewProducts";
import { WorkshopSplit } from "@/components/home/WorkshopSplit";
import { getProducts } from "@/lib/catalog";

// Trang chủ: 5 khối theo đúng thứ tự của mục 5.2; khối nào thiếu dữ kiện tự ẩn.
export default async function HomePage() {
  const products = await getProducts();
  return (
    <>
      <Hero productCount={products.length} />
      <CategoryGrid />
      <NewProducts />
      <WorkshopSplit />
      <ContactBand />
    </>
  );
}

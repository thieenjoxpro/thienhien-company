import { CategoryGrid } from "@/components/catalogue/CategoryGrid";
import { Hero } from "@/components/home/Hero";
import { ProductShelf } from "@/components/home/ProductShelf";
import { QuoteSteps } from "@/components/home/QuoteSteps";
import { VisitWorkshop } from "@/components/home/VisitWorkshop";

export default function Page() {
  return (
    <main>
      <Hero />
      <QuoteSteps />
      <CategoryGrid />
      <ProductShelf />
      <VisitWorkshop />
    </main>
  );
}

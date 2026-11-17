import { CategoryGrid } from "@/components/catalogue/CategoryGrid";
import { Hero } from "@/components/home/Hero";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { QuoteSteps } from "@/components/home/QuoteSteps";
import { VisitWorkshop } from "@/components/home/VisitWorkshop";

export default function Page() {
  return (
    <main>
      <Hero />
      <CategoryGrid />
      <ProductShowcase />
      <QuoteSteps />
      <VisitWorkshop />
    </main>
  );
}

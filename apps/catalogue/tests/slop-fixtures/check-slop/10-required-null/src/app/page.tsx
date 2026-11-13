import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { NewProducts } from "@/components/home/NewProducts";
import { WorkshopSplit } from "@/components/home/WorkshopSplit";
import { ContactBand } from "@/components/home/ContactBand";

export default function Page() {
  return (
    <main>
      <Hero />
      <CategoryGrid />
      <NewProducts />
      <WorkshopSplit />
      <ContactBand />
    </main>
  );
}

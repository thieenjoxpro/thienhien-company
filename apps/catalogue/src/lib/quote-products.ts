import { getProducts } from "@/lib/catalog";
import type { QuoteProduct } from "@/lib/quote-ui";
import type { Product } from "@/lib/schema";
import { site } from "@/lib/site.config";

/** Giá hiện cho khách: tắt giá toàn site hoặc tắt riêng mẫu đó thì null ("Liên hệ báo giá"). */
const shownPrice = (product: Pick<Product, "priceFrom" | "showPrice">) => (site.showPrice && product.showPrice ? product.priceFrom : null);

/** Bản gọn của mọi mẫu cho bảng hỏi giá (trang /hoi-gia và popup). */
export async function getQuoteProducts(): Promise<QuoteProduct[]> {
  return (await getProducts()).map((product) => ({
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    spec: product.mainSpec,
    unit: product.unit,
    price: shownPrice(product),
    image: product.images[0]?.src ?? null,
  }));
}

import { Price } from "@/components/catalogue/Price";
import { Photo } from "@/components/ui/Photo";
import { getProducts } from "@/lib/catalog";

const ratios = ["1/1", "4/5", "3/2"] as const;

/** Ba tỉ lệ ảnh của hệ, lấy ảnh của ba sản phẩm đầu tiên; kèm giá có số và không có số. */
export async function PhotoSamples() {
  const products = (await getProducts()).slice(0, 3);
  if (products.length === 0) {
    return <p className="text-ink-muted">Ảnh và giá hiện ở đây khi dữ liệu có sản phẩm có ảnh.</p>;
  }
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {products.map((product, index) => {
        const [image] = product.images;
        const ratio = ratios[index] ?? "1/1";
        return image ? (
          <li key={product.sku}>
            <Photo src={image.src} alt={image.alt} ratio={ratio} sizes="(min-width: 768px) 33vw, 100vw" />
            <p className="mt-4 font-mono text-sku text-ink-muted">
              {product.sku}, tỉ lệ {ratio}
            </p>
            <p className="text-title">{product.name}</p>
            <Price priceFrom={index === 2 ? null : product.priceFrom} unit={product.unit} />
          </li>
        ) : null;
      })}
    </ul>
  );
}

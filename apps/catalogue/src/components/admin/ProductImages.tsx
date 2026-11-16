import { addProductImage, editProductImage } from "@/app/admin/_actions/products";
import { Photo } from "@/components/ui/Photo";
import type { Product } from "@/lib/schema";
import { ConfirmButton } from "./ConfirmButton";
import { ImageUpload } from "./ImageUpload";

const small = "flex min-h-11 items-center underline underline-offset-4 disabled:text-ink-muted disabled:no-underline";

/** Ảnh của một sản phẩm: mỗi ảnh một form (sửa mô tả, đổi thứ tự, xoá), cuối là form tải ảnh mới. */
export function ProductImages({ product }: { product: Product }) {
  return (
    <section id="anh" aria-labelledby="anh-tieu-de" className="mt-24 max-w-3xl">
      <h2 id="anh-tieu-de" className="mb-2 text-h3">
        Ảnh
      </h2>
      <p className="mb-8 text-ink-muted">Ảnh đầu tiên hiện trên thẻ sản phẩm. Chưa có ảnh nào thì sản phẩm không hiện trên site.</p>
      {product.images.length ? (
        <ol className="mb-12 flex flex-col">
          {product.images.map((image, index) => (
            <li key={image.src} className="grid gap-6 border-b border-line py-6 sm:grid-cols-4">
              <Photo src={image.src} alt={image.alt} ratio="1/1" sizes="200px" />
              <form action={editProductImage} className="flex flex-col gap-3 sm:col-span-3">
                <input type="hidden" name="sku" value={product.sku} />
                <input type="hidden" name="index" value={index} />
                <label htmlFor={`alt-${index}`} className="text-label">
                  Mô tả ảnh {index + 1}
                </label>
                <input id={`alt-${index}`} name="alt" defaultValue={image.alt} required minLength={8} className="h-12 w-full rounded-btn border border-ink-muted bg-surface px-4" />
                <div className="flex flex-wrap items-center gap-x-6">
                  <button type="submit" name="intent" value="luu" className={small}>
                    Lưu mô tả
                  </button>
                  <button type="submit" name="intent" value="len" disabled={index === 0} formNoValidate className={small}>
                    Đưa lên trước
                  </button>
                  <button type="submit" name="intent" value="xuong" disabled={index === product.images.length - 1} formNoValidate className={small}>
                    Đưa xuống sau
                  </button>
                  <ConfirmButton question="Xoá ảnh này? File ảnh cũng bị xoá khỏi public/products." name="intent" value="xoa">
                    Xoá ảnh
                  </ConfirmButton>
                </div>
              </form>
            </li>
          ))}
        </ol>
      ) : null}
      {product.images.length < 6 ? (
        <>
          <h3 className="mb-4 text-lead font-semibold">Thêm ảnh</h3>
          <ImageUpload action={addProductImage} hidden={{ sku: product.sku }} submitLabel="Tải ảnh lên" />
        </>
      ) : (
        <p>Đủ 6 ảnh, tối đa cho một sản phẩm.</p>
      )}
    </section>
  );
}

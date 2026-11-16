import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProduct } from "@/app/admin/_actions/products";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Notice, noticeFrom } from "@/components/admin/Notice";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductImages } from "@/components/admin/ProductImages";
import { loadCategories, loadProducts } from "@/lib/admin/repo";

type Props = { params: Promise<{ sku: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Sửa ${(await params).sku}` };
}

export default async function EditProduct({ params, searchParams }: Props) {
  const { sku } = await params;
  const [products, categories] = await Promise.all([loadProducts(), loadCategories()]);
  const product = products.find((p) => p.sku === decodeURIComponent(sku));
  if (!product) notFound();
  return (
    <>
      <Link href="/admin/san-pham" className="mb-6 flex min-h-11 items-center text-ink-muted underline underline-offset-4">
        Sản phẩm
      </Link>
      <div className="mb-8 flex flex-col gap-2 lg:mb-12">
        <p className="text-label font-semibold text-ink-muted">{product.sku}</p>
        <h1 className="text-h2">{product.name}</h1>
        {product.images.length ? (
          <Link href={`/san-pham/${product.slug}`} className="flex min-h-11 items-center underline underline-offset-4">
            Xem trang sản phẩm
          </Link>
        ) : null}
      </div>
      <Notice text={await noticeFrom(searchParams)} />
      <ProductForm product={product} categories={categories} />
      <ProductImages product={product} />
      <section aria-labelledby="xoa-sp" className="mt-24 max-w-3xl border-t border-line pt-8">
        <h2 id="xoa-sp" className="mb-2 text-h3">
          Xoá sản phẩm
        </h2>
        <p className="mb-6 text-ink-muted">Xoá cả {product.images.length} file ảnh của sản phẩm. Không hoàn tác được (trừ khi khôi phục bằng git).</p>
        <form action={deleteProduct}>
          <input type="hidden" name="sku" value={product.sku} />
          <ConfirmButton question={`Xoá ${product.sku} ${product.name}? Không hoàn tác được.`}>Xoá sản phẩm</ConfirmButton>
        </form>
      </section>
    </>
  );
}

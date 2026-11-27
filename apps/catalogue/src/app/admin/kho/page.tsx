import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/guard";
import { Notice, noticeFrom } from "@/components/admin/Notice";
import { SalesOff } from "@/components/sales/SalesOff";
import { StockRow } from "@/components/sales/StockRow";
import { loadProducts } from "@/lib/admin/repo";
import { salesEnabled } from "@/lib/server/sales/customers";
import { stockMap } from "@/lib/server/sales/stock";

export const metadata: Metadata = { title: "Kho" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

// Tồn kho theo mặt hàng của catalogue. Bán thì tự trừ, huỷ đơn thì cộng lại; đếm kho xong thì đặt lại số ở đây.
export default async function StockPage({ searchParams }: Props) {
  await requireAdmin(); // layout và page render song song: trang tự kiểm quyền trước khi đọc dữ liệu
  if (!salesEnabled()) return <SalesOff />;
  const [products, stock] = await Promise.all([loadProducts(), stockMap()]);
  return (
    <div className="flex flex-col gap-6 text-sale">
      <h1 className="text-h2">Kho</h1>
      <Notice text={await noticeFrom(searchParams)} />
      <p className="max-w-prose">Bán hàng tự trừ tồn, huỷ đơn thì cộng lại. Sau khi nhập hàng hoặc đếm kho, sửa số tồn rồi bấm lưu ở dòng đó.</p>
      {products.length ? (
        <ul className="flex flex-col">
          {products
            .toSorted((a, b) => a.name.localeCompare(b.name, "vi"))
            .map((p) => (
              <StockRow key={p.sku} sku={p.sku} name={p.name} unit={p.unit} quantity={stock[p.sku] ?? 0} />
            ))}
        </ul>
      ) : (
        <p>Chưa có mặt hàng nào. Thêm ở trang Sản phẩm.</p>
      )}
    </div>
  );
}

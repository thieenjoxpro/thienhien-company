import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/guard";
import { SaleScreen } from "@/components/sales/SaleScreen";
import { SalesOff } from "@/components/sales/SalesOff";
import { loadProducts } from "@/lib/admin/repo";
import type { SaleState } from "@/lib/sales/sale-state";
import { moneyText, quantityText } from "@/lib/sales/money";
import { suggestPrice, type SaleCustomer, type SaleProduct } from "@/lib/sales/types";
import { frequentCustomerIds, listCustomers, salesEnabled } from "@/lib/server/sales/customers";
import { getOrder } from "@/lib/server/sales/orders";
import { customerContext, stockMap, topSkus } from "@/lib/server/sales/stock";
import { currentUser } from "@/lib/server/sales/user";

export const metadata: Metadata = { title: "Bán hàng" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function SalePage({ searchParams }: Props) {
  await requireAdmin(); // layout và page render song song: trang tự kiểm quyền trước khi đọc dữ liệu
  if (!salesEnabled()) return <SalesOff />;
  const params = await searchParams;
  const [catalogue, rows, frequentIds, top, stock, user] = await Promise.all([loadProducts(), listCustomers(), frequentCustomerIds(8), topSkus(8), stockMap(), currentUser()]);
  const products: SaleProduct[] = catalogue
    .map((p) => ({ sku: p.sku, name: p.name, unit: p.unit, price: p.priceFrom, stock: stock[p.sku] ?? 0 }))
    .toSorted((a, b) => a.name.localeCompare(b.name, "vi"));
  const customers: SaleCustomer[] = rows.map(({ id, name, phone, kind, walkIn }) => ({ id, name, phone, kind, walkIn }));
  const byId = new Map(customers.map((c) => [c.id, c]));
  const bySku = new Map(products.map((p) => [p.sku, p]));
  // Hàng hay bán: theo số lượng 60 ngày; chưa đủ 8 thì thêm mẫu nổi bật rồi tới các mẫu còn lại
  const featured = catalogue.filter((p) => p.isFeatured).map((p) => p.sku);
  const topProducts = [...new Set([...top, ...featured, ...products.map((p) => p.sku)])]
    .flatMap((sku) => bySku.get(sku) ?? [])
    .slice(0, 8);

  return (
    <>
      <h1 className="mb-6 text-h2">Bán hàng</h1>
      <SaleScreen
        products={products}
        customers={customers}
        frequent={frequentIds.flatMap((id) => byId.get(id) ?? [])}
        top={topProducts}
        user={user}
        initial={await fromOrder(params.tu, bySku)}
      />
    </>
  );
}

/** "Tạo lại từ đơn": cùng khách, cùng hàng và số lượng, giá theo giá gợi ý hiện tại. */
async function fromOrder(param: string | string[] | undefined, bySku: Map<string, SaleProduct>): Promise<SaleState | null> {
  const id = Number(typeof param === "string" ? param : NaN);
  const order = Number.isInteger(id) ? await getOrder(id) : null;
  if (!order) return null;
  const { lastPrices } = await customerContext(order.customer.id);
  return {
    customerId: order.customer.id,
    lines: order.lines.flatMap((l) => {
      const product = bySku.get(l.sku);
      return product ? [{ sku: l.sku, quantity: quantityText(l.quantity), price: moneyText(suggestPrice(product, order.customer.kind, lastPrices)) }] : [];
    }),
    discount: "",
    paidMode: order.customer.kind === "le" ? "full" : "none",
    paid: "",
    note: "",
  };
}

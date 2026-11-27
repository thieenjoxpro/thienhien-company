import type { Metadata } from "next";
import Link from "next/link";
import { SalesOff } from "@/components/sales/SalesOff";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { dateTimeVN } from "@/lib/sales/dates";
import { receiptCode } from "@/lib/sales/order";
import { salesEnabled } from "@/lib/server/sales/customers";
import { listOrders, orderFilterFrom } from "@/lib/server/sales/order-list";

export const metadata: Metadata = { title: "Đơn hàng" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const field = "h-12 w-full rounded-btn border-2 border-ink-muted bg-ground px-3 text-sale";

export default async function OrdersPage({ searchParams }: Props) {
  if (!salesEnabled()) return <SalesOff />;
  const params = await searchParams;
  const filter = orderFilterFrom(params);
  const orders = await listOrders(filter);
  const query = new URLSearchParams(Object.entries(filter).flatMap(([k, v]) => (v ? [[k, String(v)]] : []))).toString();
  return (
    <div className="flex flex-col gap-8 text-sale">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-h2">Đơn hàng</h1>
        <Button variant="dark" size="sale" asChild>
          <Link href="/admin/ban-hang">Bán đơn mới</Link>
        </Button>
      </div>
      <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
        <div className="lg:col-span-2">
          <label htmlFor="loc-q" className="mb-2 block font-semibold">
            Tên khách, số điện thoại hoặc số phiếu
          </label>
          <input id="loc-q" name="q" type="search" defaultValue={filter.q} className={field} />
        </div>
        <div>
          <label htmlFor="loc-tu" className="mb-2 block font-semibold">
            Từ ngày
          </label>
          <input id="loc-tu" name="from" type="date" defaultValue={filter.from} className={field} />
        </div>
        <div>
          <label htmlFor="loc-den" className="mb-2 block font-semibold">
            Đến ngày
          </label>
          <input id="loc-den" name="to" type="date" defaultValue={filter.to} className={field} />
        </div>
        <div>
          <label htmlFor="loc-tt" className="mb-2 block font-semibold">
            Trạng thái
          </label>
          <select id="loc-tt" name="status" defaultValue={filter.status} className={field}>
            <option value="">Tất cả</option>
            <option value="ok">Còn hiệu lực</option>
            <option value="huy">Đã huỷ</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-5">
          <Button variant="outline" size="sale" type="submit">
            Lọc danh sách
          </Button>
          <Button variant="outline" size="sale" asChild>
            <a href={`/api/export/don-hang.xlsx${query ? `?${query}` : ""}`}>Tải file Excel</a>
          </Button>
        </div>
      </form>
      {orders.length ? (
        <ul className="flex flex-col">
          {orders.map((o) => (
            <li key={o.id} className="border-b border-line">
              <Link href={`/admin/don-hang/${o.id}`} className="flex min-h-16 flex-col gap-1 py-3 hover:bg-surface sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="font-semibold">{o.customerName}</span> · {receiptCode(o.id)} · {dateTimeVN(o.createdAt)}
                  {o.cancelled ? <span className="font-semibold text-danger"> · Đã huỷ</span> : null}
                </span>
                <span className="font-semibold tabular-nums">
                  {o.lineCount} món · {formatPrice(o.total)}
                  {o.total > o.paid && !o.cancelled ? ` · nợ ${formatPrice(o.total - o.paid)}` : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Chưa có đơn nào khớp bộ lọc.</p>
      )}
    </div>
  );
}

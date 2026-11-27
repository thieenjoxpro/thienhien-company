import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/guard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/sales/CustomerForm";
import { PaymentForm } from "@/components/sales/PaymentForm";
import { SalesOff } from "@/components/sales/SalesOff";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { dateVN } from "@/lib/sales/dates";
import { getCustomer, salesEnabled } from "@/lib/server/sales/customers";
import { ledger } from "@/lib/server/sales/ledger";

export const metadata: Metadata = { title: "Sổ nợ khách" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

const NOTICE: Record<string, string> = { luu: "Đã lưu khách.", thu: "Đã ghi khoản trả nợ." };

export default async function CustomerPage({ params, searchParams }: Props) {
  await requireAdmin(); // layout và page render song song: trang tự kiểm quyền trước khi đọc dữ liệu
  if (!salesEnabled()) return <SalesOff />;
  const id = Number((await params).id);
  const customer = Number.isInteger(id) ? await getCustomer(id) : null;
  if (!customer) notFound();
  const rows = await ledger(id);
  const balance = rows.at(-1)?.balance ?? 0;
  const sp = await searchParams;
  const notice = Object.keys(NOTICE).find((k) => sp[k] !== undefined);
  return (
    <div className="flex flex-col gap-10 text-sale">
      <div className="flex flex-col gap-2">
        <h1 className="text-h2">{customer.name}</h1>
        {notice ? (
          <p role="status" className="font-semibold text-success">
            {NOTICE[notice]}
          </p>
        ) : null}
        <p className={balance > 0 ? "text-sale-total font-bold text-danger tabular-nums" : "text-sale-total font-bold tabular-nums"}>
          {balance > 0 ? `Đang nợ ${formatPrice(balance)}` : balance < 0 ? `Trả dư ${formatPrice(-balance)}` : "Không nợ"}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="dark" size="sale" asChild>
          <Link href="/admin/ban-hang">Bán hàng cho khách này</Link>
        </Button>
        <Button variant="outline" size="sale" asChild>
          <a href={`/api/export/khach-hang/${id}.xlsx`}>Tải sổ nợ Excel</a>
        </Button>
      </div>
      {!customer.walkIn ? (
        <section aria-labelledby="thu-no">
          <h2 id="thu-no" className="mb-4 text-h3">
            Thu nợ
          </h2>
          <PaymentForm customerId={id} />
        </section>
      ) : null}
      <section aria-labelledby="so-no">
        <h2 id="so-no" className="mb-4 text-h3">
          Sổ nợ
        </h2>
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-xl border-collapse">
              <thead>
                <tr className="border-b-2 border-ink text-left">
                  <th scope="col" className="py-2 pr-3 font-semibold">Ngày</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Diễn giải</th>
                  <th scope="col" className="num-end py-2 pr-3 font-semibold">Phát sinh nợ</th>
                  <th scope="col" className="num-end py-2 pr-3 font-semibold">Đã trả</th>
                  <th scope="col" className="num-end py-2 font-semibold">Số dư</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-line">
                    <td className="py-2 pr-3">{dateVN(r.date)}</td>
                    <td className="py-2 pr-3">{r.orderId ? <Link href={`/admin/don-hang/${r.orderId}`} className="underline underline-offset-4">{r.text}</Link> : r.text}</td>
                    <td className="num-end py-2 pr-3">{r.debit ? formatPrice(r.debit) : ""}</td>
                    <td className="num-end py-2 pr-3">{r.credit ? formatPrice(r.credit) : ""}</td>
                    <td className="num-end py-2 font-semibold">{formatPrice(r.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Khách chưa mua đơn nào.</p>
        )}
      </section>
      {!customer.walkIn ? (
        <section aria-labelledby="sua-khach" className="border-t border-line pt-8">
          <h2 id="sua-khach" className="mb-6 text-h3">
            Sửa thông tin khách
          </h2>
          <CustomerForm customer={customer} />
        </section>
      ) : null}
    </div>
  );
}

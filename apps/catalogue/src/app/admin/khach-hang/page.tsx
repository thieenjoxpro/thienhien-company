import type { Metadata } from "next";
import Link from "next/link";
import { CustomerForm } from "@/components/sales/CustomerForm";
import { SalesOff } from "@/components/sales/SalesOff";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { matchCustomer } from "@/lib/sales/search";
import { listCustomers, salesEnabled } from "@/lib/server/sales/customers";

export const metadata: Metadata = { title: "Khách hàng" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CustomersPage({ searchParams }: Props) {
  if (!salesEnabled()) return <SalesOff />;
  const q = (await searchParams).q;
  const query = typeof q === "string" ? q : "";
  const customers = (await listCustomers()).filter((c) => matchCustomer(c, query));
  const totalDebt = customers.reduce((sum, c) => sum + Math.max(0, c.debt), 0);
  return (
    <div className="flex flex-col gap-8 text-sale">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-h2">Khách hàng</h1>
        <Button variant="outline" size="sale" asChild>
          <a href="/api/export/khach-hang.xlsx">Tải file Excel</a>
        </Button>
      </div>
      <form className="flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end">
        <div className="grow">
          <label htmlFor="tim-khach" className="mb-2 block font-semibold">
            Tìm theo tên không dấu hoặc số điện thoại
          </label>
          <input id="tim-khach" name="q" type="search" defaultValue={query} className="h-12 w-full rounded-btn border-2 border-ink-muted bg-ground px-3 text-sale" />
        </div>
        <Button variant="outline" size="sale" type="submit">
          Lọc danh sách
        </Button>
      </form>
      <p className="font-semibold tabular-nums">Tổng khách còn nợ: {formatPrice(totalDebt)}</p>
      {customers.length ? (
        <ul className="flex flex-col">
          {customers.map((c) => (
            <li key={c.id} className="border-b border-line">
              <Link href={`/admin/khach-hang/${c.id}`} className="flex min-h-16 flex-col gap-1 py-3 hover:bg-surface sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="font-semibold">{c.name}</span>
                  {c.phone ? ` · ${c.phone}` : ""} · {c.walkIn ? "vãng lai" : c.kind === "si" ? "khách sỉ" : "khách lẻ"}
                </span>
                <span className={c.debt > 0 ? "font-semibold text-danger tabular-nums" : "tabular-nums"}>
                  {c.debt > 0 ? `Nợ ${formatPrice(c.debt)}` : c.debt < 0 ? `Trả dư ${formatPrice(-c.debt)}` : "Không nợ"} · {c.orderCount} đơn
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không thấy khách nào.</p>
      )}
      <section aria-labelledby="khach-moi" className="border-t border-line pt-8">
        <h2 id="khach-moi" className="mb-6 text-h3">
          Thêm khách mới
        </h2>
        <CustomerForm />
      </section>
    </div>
  );
}

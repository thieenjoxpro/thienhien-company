import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelOrderAction } from "@/app/admin/_actions/sales-admin";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Receipt } from "@/components/sales/Receipt";
import { ReceiptActions } from "@/components/sales/ReceiptActions";
import { SalesOff } from "@/components/sales/SalesOff";
import { Button } from "@/components/ui/Button";
import { receiptCode } from "@/lib/sales/order";
import { salesEnabled } from "@/lib/server/sales/customers";
import { receiptData, receiptFileName } from "@/lib/server/sales/receipt";

export const metadata: Metadata = { title: "Phiếu bán hàng" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

// Sau khi chốt đơn (?moi=1) và khi mở lại đơn cũ: xem phiếu, in, gửi Zalo, tải PDF.
export default async function OrderPage({ params, searchParams }: Props) {
  if (!salesEnabled()) return <SalesOff />;
  const id = Number((await params).id);
  const data = Number.isInteger(id) ? await receiptData(id) : null;
  if (!data) notFound();
  const { order } = data;
  const fresh = (await searchParams).moi !== undefined;
  return (
    <div className="flex flex-col gap-8 text-sale">
      <div className="flex flex-col gap-2 print:hidden">
        <h1 className="text-h2">{fresh ? "Đã lưu đơn" : `Đơn ${receiptCode(order.id)}`}</h1>
        {fresh ? (
          <p role="status" className="text-sale-lg font-semibold text-success">
            Đã lưu đơn {receiptCode(order.id)} của {order.customer.name}. In hoặc gửi phiếu cho khách.
          </p>
        ) : null}
        {order.cancelledAt ? <p className="text-sale-lg font-semibold text-danger">Đơn này đã huỷ, không tính vào nợ.</p> : null}
      </div>
      <ReceiptActions orderId={order.id} fileName={receiptFileName(order, "pdf").replace(/\.pdf$/, "")} />
      <div className="rounded-card border border-line py-4 print:border-0 print:py-0">
        <Receipt data={data} />
      </div>
      <div className="flex flex-wrap gap-3 border-t border-line pt-6 print:hidden">
        <Button variant="outline" size="sale" asChild>
          <Link href={`/admin/ban-hang?tu=${order.id}`}>Tạo lại từ đơn này</Link>
        </Button>
        <Button variant="outline" size="sale" asChild>
          <Link href={`/admin/khach-hang/${order.customer.id}`}>Xem sổ nợ của khách</Link>
        </Button>
        {!order.cancelledAt ? (
          <form action={cancelOrderAction}>
            <input type="hidden" name="id" value={order.id} />
            <ConfirmButton question={`Huỷ đơn ${receiptCode(order.id)}? Hàng trả về kho, đơn không tính vào nợ nữa.`}>Huỷ đơn này</ConfirmButton>
          </form>
        ) : null}
      </div>
    </div>
  );
}

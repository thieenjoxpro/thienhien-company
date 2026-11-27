import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Receipt } from "@/components/sales/Receipt";
import { canViewReceipt } from "@/lib/server/sales/access";
import { receiptData } from "@/lib/server/sales/receipt";

export const metadata: Metadata = { title: "Phiếu bán hàng", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Trang phiếu trơn (không menu) để Chromium của máy chủ chụp PDF, PNG. Không công khai:
// chưa đăng nhập và không có token của đúng đơn thì 404, không lộ là đơn có tồn tại hay không.
export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || !(await canViewReceipt(id))) notFound();
  const data = await receiptData(id);
  if (!data) notFound();
  return (
    <main className="bg-ground">
      <Receipt data={data} />
    </main>
  );
}

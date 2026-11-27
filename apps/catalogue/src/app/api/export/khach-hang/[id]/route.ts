import { getCustomer } from "@/lib/server/sales/customers";
import { excelDate, workbook, xlsxResponse } from "@/lib/server/sales/excel";
import { ledger } from "@/lib/server/sales/ledger";

export const dynamic = "force-dynamic";

// Sổ nợ luỹ kế của một khách: /api/export/khach-hang/12.xlsx
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id.replace(/\.xlsx$/, ""));
  const customer = Number.isInteger(id) && id > 0 ? await getCustomer(id).catch(() => null) : null;
  return xlsxResponse(`so-no ${customer?.name ?? ""}`, async () => {
    if (!customer) return null;
    const rows = await ledger(id);
    return workbook(
      "Sổ nợ",
      [
        { header: "Ngày", width: 12, kind: "date" },
        { header: "Diễn giải", width: 40 },
        { header: "Phát sinh nợ", width: 16, kind: "money" },
        { header: "Đã trả", width: 16, kind: "money" },
        { header: "Số dư", width: 16, kind: "money" },
      ],
      rows.map((r) => [excelDate(r.date), r.text, r.debit || null, r.credit || null, r.balance]),
    );
  });
}

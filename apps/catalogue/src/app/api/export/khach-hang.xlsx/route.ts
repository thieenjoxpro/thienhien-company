import { listCustomers } from "@/lib/server/sales/customers";
import { workbook, xlsxResponse } from "@/lib/server/sales/excel";

export const dynamic = "force-dynamic";

// Danh sách khách và tổng nợ hiện tại
export function GET() {
  return xlsxResponse("khach-hang", async () => {
    const customers = await listCustomers();
    return workbook(
      "Khách hàng",
      [
        { header: "Tên khách", width: 32 },
        { header: "Số điện thoại", width: 16, kind: "text" },
        { header: "Địa chỉ", width: 36 },
        { header: "Loại", width: 12 },
        { header: "Số đơn", width: 10, kind: "number" },
        { header: "Đang nợ", width: 16, kind: "money" },
      ],
      customers.map((c) => [c.name, c.phone, c.address, c.walkIn ? "Vãng lai" : c.kind === "si" ? "Sỉ" : "Lẻ", c.orderCount, c.debt]),
    );
  });
}

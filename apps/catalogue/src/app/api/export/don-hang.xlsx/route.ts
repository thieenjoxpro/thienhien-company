import type { NextRequest } from "next/server";
import { receiptCode } from "@/lib/sales/order";
import { excelDate, workbook, xlsxResponse } from "@/lib/server/sales/excel";
import { listOrders, orderFilterFrom } from "@/lib/server/sales/order-list";

export const dynamic = "force-dynamic";

// Danh sách đơn theo đúng bộ lọc đang chọn ở /admin/don-hang (?q=&from=&to=&status=)
export function GET(request: NextRequest) {
  return xlsxResponse("don-hang", async () => {
    const orders = await listOrders(orderFilterFrom(request.nextUrl.searchParams), 5000);
    return workbook(
      "Đơn hàng",
      [
        { header: "Ngày", width: 12, kind: "date" },
        { header: "Số phiếu", width: 12 },
        { header: "Khách", width: 32 },
        { header: "Số món", width: 10, kind: "number" },
        { header: "Tổng tiền", width: 16, kind: "money" },
        { header: "Khách trả", width: 16, kind: "money" },
        { header: "Còn nợ", width: 16, kind: "money" },
        { header: "Trạng thái", width: 12 },
      ],
      orders.map((o) => [excelDate(o.createdAt), receiptCode(o.id), o.customerName, o.lineCount, o.total, o.paid, o.cancelled ? 0 : o.total - o.paid, o.cancelled ? "Đã huỷ" : "Hiệu lực"]),
    );
  });
}

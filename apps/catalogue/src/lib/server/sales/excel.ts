// Xuất Excel cho danh sách khách, sổ nợ, danh sách đơn (exceljs, phía máy chủ).
// Dòng tiêu đề in đậm và cố định, cột tiền dạng #,##0, cột ngày dd/mm/yyyy, tên file không dấu có ngày.
import { slugify } from "@/lib/admin/form";
import { todayVN } from "@/lib/sales/dates";
import { isAdminRequest } from "./access";

const XLSX_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export type Cell = string | number | Date | null;

export interface Column {
  header: string;
  width: number;
  kind?: "money" | "date" | "number" | "text";
}

/** Ngày theo giờ Việt Nam thành Date nửa đêm UTC, để Excel hiện đúng ngày dù máy chủ chạy giờ nào. */
export function excelDate(iso: string): Date {
  const [y, m, d] = todayVN(new Date(iso)).split("-").map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
}

const FORMATS = { money: "#,##0", date: "dd/mm/yyyy", number: "#,##0.###", text: "@" } as const;

export async function workbook(sheetName: string, columns: Column[], rows: Cell[][]): Promise<Buffer> {
  const ExcelJS = (await import("exceljs")).default;
  const book = new ExcelJS.Workbook();
  book.creator = "Thiện Hiền";
  const sheet = book.addWorksheet(sheetName.slice(0, 31), { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = columns.map((c) => ({ header: c.header, width: c.width, style: c.kind ? { numFmt: FORMATS[c.kind] } : {} }));
  sheet.getRow(1).font = { bold: true };
  for (const row of rows) sheet.addRow(row);
  return Buffer.from(await book.xlsx.writeBuffer());
}

/** Trả file .xlsx; chưa đăng nhập thì 401. `name`: phần đầu tên file, ví dụ "so-no Anh Hùng". */
export async function xlsxResponse(name: string, build: () => Promise<Buffer | null>): Promise<Response> {
  if (!(await isAdminRequest())) return new Response("Chưa đăng nhập", { status: 401 });
  const file = await build();
  if (!file) return new Response("Không có dữ liệu này", { status: 404 });
  return new Response(new Uint8Array(file), {
    headers: {
      "content-type": XLSX_TYPE,
      "content-disposition": `attachment; filename="${slugify(name)}-${todayVN()}.xlsx"`,
      "cache-control": "private, no-store",
    },
  });
}

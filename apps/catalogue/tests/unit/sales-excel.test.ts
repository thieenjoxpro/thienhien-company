import ExcelJS from "exceljs";
import { describe, expect, it, vi } from "vitest";
import { excelDate, workbook } from "../../src/lib/server/sales/excel";

vi.mock("next/headers", () => ({ headers: async () => new Headers(), cookies: async () => ({ get: () => undefined }) }));

describe("file Excel", () => {
  it("tiêu đề đậm và cố định, cột tiền #,##0, cột ngày dd/mm/yyyy, đủ số dòng", async () => {
    const file = await workbook(
      "Sổ nợ",
      [
        { header: "Ngày", width: 12, kind: "date" },
        { header: "Diễn giải", width: 30 },
        { header: "Số dư", width: 16, kind: "money" },
      ],
      [
        [excelDate("2026-11-01T18:30:00Z"), "Mua hàng", 1_250_000],
        [excelDate("2026-11-02T03:00:00Z"), "Trả nợ", 250_000],
      ],
    );
    const book = new ExcelJS.Workbook();
    await book.xlsx.load(file as unknown as ArrayBuffer);
    const sheet = book.getWorksheet("Sổ nợ");
    expect(sheet?.rowCount).toBe(3);
    expect(sheet?.getRow(1).font?.bold).toBe(true);
    expect(sheet?.views[0]).toMatchObject({ state: "frozen", ySplit: 1 });
    expect(sheet?.getCell("C2").numFmt).toBe("#,##0");
    expect(sheet?.getCell("A2").numFmt).toBe("dd/mm/yyyy");
    // 18:30 UTC ngày 1/11 là 1:30 sáng 2/11 giờ Việt Nam
    expect((sheet?.getCell("A2").value as Date).toISOString().slice(0, 10)).toBe("2026-11-02");
    expect(sheet?.getCell("C2").value).toBe(1_250_000);
  });
});

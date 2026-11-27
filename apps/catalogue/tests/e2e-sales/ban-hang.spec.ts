import { readFile, writeFile } from "node:fs/promises";
import ExcelJS from "exceljs";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { expectPageBasics } from "../e2e/checks";

/** Bấm và đếm số lần chạm của người bán. */
function tapper() {
  let count = 0;
  return {
    tap: async (target: Locator) => {
      count += 1;
      await target.click();
    },
    get count() {
      return count;
    },
  };
}

const tiles = (page: Page) => page.getByRole("list", { name: "Mặt hàng hay bán" }).getByRole("button");

test("luồng chính: khách quen, chạm 3 mặt hàng, trả đủ, in phiếu, tải PDF A5", async ({ page }, info) => {
  await page.goto("/admin/ban-hang");
  await expectPageBasics(page);
  const taps = tapper();
  await taps.tap(page.getByRole("list", { name: "Khách hay mua" }).getByRole("button", { name: /Khách lẻ/ }));
  await taps.tap(tiles(page).nth(0));
  await taps.tap(tiles(page).nth(1));
  await taps.tap(tiles(page).nth(2));
  await taps.tap(page.getByRole("button", { name: "Trả đủ" }));
  await expect(page.getByText("Trả đủ, không nợ thêm")).toBeVisible();
  await taps.tap(page.getByRole("button", { name: "Xong, in phiếu" }));

  await expect(page.getByRole("heading", { name: "Đã lưu đơn" })).toBeVisible();
  const receipt = page.locator("[data-receipt]");
  await expect(receipt).toContainText("Bằng chữ:");
  await expect(receipt).toContainText("không phải hoá đơn GTGT");
  await expect(receipt).not.toContainText("Nợ cũ"); // khách lẻ không in phần nợ
  await expectPageBasics(page);
  expect(taps.count).toBeLessThanOrEqual(8);
  await writeFile(info.outputPath("so-lan-cham.txt"), `${info.project.name}: ${taps.count} lần chạm cho đơn 3 món khách quen\n`);
  await page.screenshot({ path: `test-results/review/phieu-${info.project.name}.png`, fullPage: true });

  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name: "Tải PDF" }).click()]);
  expect(download.suggestedFilename()).toMatch(/^phieu-PH\d{6}-khach-le\.pdf$/);
  const pdf = await readFile(await download.path());
  expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
  // A5 dọc: 148 x 210 mm = 419,5 x 595,3 pt (Chromium làm tròn)
  const box = /MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/.exec(pdf.toString("latin1"));
  expect(Number(box?.[1])).toBeCloseTo(419.5, -1);
  expect(Number(box?.[2])).toBeCloseTo(595.3, -1);
  if (info.project.name === "desktop") await writeFile("test-results/review/phieu-mau.pdf", pdf);
});

test("khách sỉ còn nợ: phiếu in nợ cũ, nợ mới, tổng nợ và VietQR đúng số còn thiếu", async ({ page }, info) => {
  await page.goto("/admin/xuong");
  await page.getByLabel("Mã ngân hàng (BIN)").fill("970436");
  await page.getByLabel("Số tài khoản nhận tiền").fill("0123456789");
  await page.getByLabel("Tên chủ tài khoản").fill("NGUYEN VAN A");
  await page.getByRole("button", { name: "Lưu thông tin xưởng" }).click();
  await expect(page.getByText("Đã lưu.")).toBeVisible();

  const name = `Anh Hùng ${info.project.name}`;
  await page.goto("/admin/ban-hang");
  await page.getByRole("button", { name: "Thêm khách mới" }).click();
  await page.getByLabel("Tên khách").fill(name);
  await page.getByRole("button", { name: "Lưu khách này" }).click();
  await expect(page.getByText("Không nợ cũ")).toBeVisible();
  await page.getByLabel("Tìm hàng khác (tên không dấu hoặc mã)").fill("ban le coi 16");
  await page.getByRole("list", { name: "Mặt hàng tìm được" }).getByRole("button").first().click();
  await page.getByLabel("Số lượng").fill("10");
  await expect(page.getByText("Còn nợ thêm: 180.000 đ")).toBeVisible(); // khách sỉ mặc định chưa trả
  await page.getByRole("button", { name: "Xong, in phiếu" }).click();
  await expect(page.getByRole("heading", { name: "Đã lưu đơn" })).toBeVisible();

  await page.getByRole("link", { name: "Tạo lại từ đơn này" }).click();
  await expect(page.getByText("Nợ cũ: 180.000 đ")).toBeVisible();
  await page.getByRole("button", { name: "Xoá dòng Bản lề cối 16 ly" }).click();
  await page.getByLabel("Tìm hàng khác (tên không dấu hoặc mã)").fill("ton phang 1 ly");
  await page.getByRole("list", { name: "Mặt hàng tìm được" }).getByRole("button").first().click();
  await page.getByLabel("Khách trả").fill("200");
  await page.getByRole("button", { name: "Thêm 000" }).click();
  await expect(page.getByLabel("Khách trả")).toHaveValue("200.000");
  await expect(page.getByText("Hai trăm nghìn đồng")).toBeVisible();
  await page.getByRole("button", { name: "Xong, in phiếu" }).click();

  const receipt = page.locator("[data-receipt]");
  await expect(receipt).toContainText("Nợ cũ180.000 đ");
  await expect(receipt).toContainText("Nợ mới (đơn này)320.000 đ");
  await expect(receipt).toContainText("Tổng nợ500.000 đ");
  await expect(receipt.getByRole("img", { name: "Mã VietQR chuyển khoản 320.000 đ" })).toBeVisible();
  await expectPageBasics(page);

  const png = await page.request.get(page.url().replace(/\/admin\/don-hang\/(\d+).*/, "/api/orders/$1/receipt.png"));
  expect(png.status()).toBe(200);
  expect(png.headers()["content-type"]).toBe("image/png");
});

test("nháp: điền dở, tải lại trang, dữ liệu còn nguyên", async ({ page }) => {
  await page.goto("/admin/ban-hang");
  await page.getByRole("list", { name: "Khách hay mua" }).getByRole("button", { name: /Khách lẻ/ }).click();
  await tiles(page).nth(3).click();
  await tiles(page).nth(3).click();
  await page.waitForTimeout(800);
  await page.reload();
  await expect(page.getByText("Đang tiếp tục đơn chưa xong.")).toBeVisible();
  await expect(page.getByRole("list", { name: "Hàng trong đơn" }).getByLabel("Số lượng")).toHaveValue("2");
  await page.getByRole("button", { name: "Bỏ đơn này" }).click();
  await page.reload();
  await expect(page.getByText("Đang tiếp tục đơn chưa xong.")).toHaveCount(0);
});

test("API: chưa đăng nhập 401, đơn không có 404, Excel đúng kiểu và số dòng", async ({ page, playwright, baseURL }) => {
  // storageState rỗng: request của test runner mặc định mang cookie đăng nhập của project
  const anonymous = await playwright.request.newContext({ baseURL, storageState: { cookies: [], origins: [] } });
  expect((await anonymous.get("/api/orders/1/receipt.pdf")).status()).toBe(401);
  expect((await anonymous.get("/api/export/khach-hang.xlsx")).status()).toBe(401);
  expect((await anonymous.get("/phieu/1")).status()).toBe(404); // trang phiếu không công khai
  await anonymous.dispose();

  expect((await page.request.get("/api/orders/999999/receipt.pdf")).status()).toBe(404);
  const pdf = await page.request.get("/api/orders/1/receipt.pdf");
  expect(pdf.headers()["content-type"]).toBe("application/pdf");

  const xlsx = await page.request.get("/api/export/don-hang.xlsx?status=ok");
  expect(xlsx.headers()["content-type"]).toBe("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  const book = new ExcelJS.Workbook();
  await book.xlsx.load((await xlsx.body()) as unknown as ArrayBuffer);
  await page.goto("/admin/don-hang?status=ok");
  const shown = await page.locator("main ul > li").count();
  expect(book.getWorksheet("Đơn hàng")?.rowCount).toBe(shown + 1);
});

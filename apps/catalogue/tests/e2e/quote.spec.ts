import { expectPageBasics } from "./checks";
import { expect, test } from "./test";

const EXPECTED_MESSAGE = [
  "Chào xưởng Thiện Hiền, tôi cần báo giá:",
  "1. TH-BL03 Bản lề cối 16 ly: 50 cái",
  "2. TH-PN01 Pano dập ô vuông: 20 tấm",
  "Tên: Anh Tư",
  "Giao tới: Thủ Đức",
].join("\n");

test("thêm 2 mẫu từ hai trang chi tiết, sửa số lượng, gửi: clipboard đúng nội dung và mở tab zalo.me", async ({ page, context, baseURL }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" && /hydrat/i.test(msg.text())) hydrationErrors.push(msg.text());
  });
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL });
  await context.route("https://zalo.me/**", (route) => route.fulfill({ contentType: "text/html", body: "<title>Zalo</title>" }));

  await page.goto("/san-pham/ban-le-coi-16-ly");
  await page.getByRole("spinbutton", { name: "Số lượng (cái)" }).fill("50");
  await page.locator("main").getByRole("button", { name: "Thêm vào hỏi giá" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Đã thêm TH-BL03 vào danh sách hỏi giá." })).toBeVisible();
  await expect(page.locator("main").getByRole("button", { name: "Thêm vào hỏi giá" })).toBeVisible(); // nút giữ nguyên nhãn

  await page.goto("/san-pham/pano-dap-o-vuong");
  await page.locator("main").getByRole("button", { name: "Thêm vào hỏi giá" }).click();
  await page.getByRole("link", { name: "Xem danh sách hỏi giá" }).click();

  await expect(page).toHaveURL(/\/hoi-gia$/);
  await expect(page.locator("main li")).toHaveCount(2);
  await page.getByRole("spinbutton", { name: "Số lượng TH-PN01 (tấm)" }).fill("20");
  await page.reload();
  await expect(page.locator("main li")).toHaveCount(2); // reload không mất danh sách
  await expect(page.getByRole("spinbutton", { name: "Số lượng TH-PN01 (tấm)" })).toHaveValue("20");
  // Nút gửi xuất hiện sau khi hydrate: khi nó trong màn hình, nút trên header phải nhường, còn đúng một nút tô màu
  const visiblePrimaries = () =>
    page.$$eval("[data-primary-action]", (els) =>
      els.filter((el) => {
        const box = el.getBoundingClientRect();
        return box.width > 0 && box.bottom > 0 && box.top < window.innerHeight;
      }).length,
    );
  expect(await visiblePrimaries()).toBeLessThanOrEqual(1);
  await page.locator("main").getByRole("button", { name: "Hỏi giá qua Zalo" }).scrollIntoViewIfNeeded();
  await expect.poll(visiblePrimaries).toBe(1);

  await page.getByRole("textbox", { name: "Tên của anh chị" }).fill("Anh Tư");
  await page.getByRole("textbox", { name: "Giao tới đâu" }).fill("Thủ Đức");
  await expect(page.getByRole("radio", { name: "Mua sỉ" })).toBeChecked();
  const [zalo] = await Promise.all([
    context.waitForEvent("page"),
    page.locator("main").getByRole("button", { name: "Hỏi giá qua Zalo" }).click(),
  ]);
  await expect(page.getByText("Đã copy danh sách. Dán vào khung chat Zalo vừa mở.")).toBeVisible();
  expect(zalo.url()).toBe("https://zalo.me/0900000000");
  // Clipboard của Windows đổi xuống dòng thành CRLF khi đọc lại; nội dung phải giống từng chữ
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied.replace(/\r\n/g, "\n")).toBe(EXPECTED_MESSAGE);
  expect(hydrationErrors).toEqual([]);

  await expectPageBasics(page);
});

test("số lượng ngoài 1 đến 9999 báo lỗi dưới ô; bỏ hết mẫu thì có trạng thái rỗng", async ({ page }) => {
  await page.goto("/san-pham/ban-le-coi-16-ly");
  const qty = page.getByRole("spinbutton", { name: "Số lượng (cái)" });
  await qty.fill("10000");
  await expect(page.getByText("Số lượng từ 1 đến 9999.")).toBeVisible();
  await expect(qty).toHaveAttribute("aria-invalid", "true");
  await qty.fill("3");
  await page.locator("main").getByRole("button", { name: "Thêm vào hỏi giá" }).click();

  await page.goto("/hoi-gia");
  await page.getByRole("button", { name: "Bỏ mẫu này" }).click();
  await expect(page.getByText("Danh sách chưa có mẫu nào.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Xem catalogue" })).toHaveAttribute("href", "/san-pham");
});

test("số mẫu trên header tăng khi thêm (từ 1024px)", async ({ page, isMobile }) => {
  test.skip(isMobile, "link danh sách hỏi giá trên header chỉ có từ 1024px");
  await page.goto("/san-pham/ton-phang-1-ly");
  const link = page.getByRole("banner").getByRole("link", { name: /Danh sách hỏi giá/ });
  await expect(link).toHaveText("Danh sách hỏi giá");
  await page.locator("main").getByRole("button", { name: "Thêm vào hỏi giá" }).click();
  await expect(link).toHaveText(/Danh sách hỏi giá\s*1 mẫu/);
});

test("chụp trang hỏi giá cho người duyệt", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "chụp một lần");
  await page.goto("/san-pham/ban-le-coi-16-ly");
  await page.locator("main").getByRole("button", { name: "Thêm vào hỏi giá" }).click();
  await page.goto("/san-pham/mam-cau-thang-tron");
  await page.locator("main").getByRole("button", { name: "Thêm vào hỏi giá" }).click();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/hoi-gia");
    await expect(page.locator("main li")).toHaveCount(2);
    await page.screenshot({ path: `test-results/review/hoi-gia-${width}.png`, fullPage: true });
  }
});

test("trang hỏi giá không có thanh hành động dưới đáy (nút Zalo ở đó phải kèm copy danh sách)", async ({ page, isMobile }) => {
  test.skip(!isMobile, "thanh chỉ có dưới 640px");
  await page.goto("/hoi-gia");
  await expect(page.locator("[data-phone-bar]")).toHaveCount(0);
});

import { expectPageBasics } from "./checks";
import { expect, test } from "./test";

const columnsOf = (grid: import("@playwright/test").Locator) =>
  grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);

test("trang danh mục: đường dẫn, số mẫu, danh mục con, thẻ dẫn tới trang chi tiết", async ({ page }) => {
  await page.goto("/danh-muc/ban-le");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bản lề");
  await expect(page.getByRole("main").getByText("8 mẫu", { exact: true })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Đường dẫn" }).getByRole("link", { name: "Trang chủ" })).toBeVisible();

  const cards = page.getByRole("main").getByRole("listitem").filter({ has: page.locator("img") });
  await expect(cards).toHaveCount(8);
  await expect(cards.first().getByRole("link")).toHaveAttribute("href", /^\/san-pham\/[a-z0-9-]+$/);

  await page.getByRole("main").getByRole("link", { name: "Bản lề cối", exact: true }).click();
  await expect(page).toHaveURL(/\/danh-muc\/ban-le-coi$/);
  await expect(page.getByRole("navigation", { name: "Đường dẫn" }).getByRole("link", { name: "Bản lề" })).toBeVisible();
});

test("danh mục không có trong dữ liệu thì 404", async ({ page }) => {
  const response = await page.goto("/danh-muc/khong-co");
  expect(response?.status()).toBe(404);
});

test("lưới sản phẩm 2, 3, 4 cột theo khổ màn hình; không cuộn ngang ở 320px", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "chạy một lần, tự đổi khổ");
  for (const [width, columns] of [[320, 2], [390, 2], [768, 3], [1024, 3], [1280, 4], [1440, 4]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/san-pham");
    await expect(page.getByRole("main").getByText("22 mẫu", { exact: true })).toBeVisible();
    expect(await columnsOf(page.getByRole("main").getByRole("list").last()), `khổ ${width}`).toBe(columns);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `khổ ${width} cuộn ngang`).toBeLessThanOrEqual(0);
  }
  // Các thẻ cùng hàng cao bằng nhau
  const heights = await page.getByRole("main").getByRole("list").last().locator("> li").evaluateAll((items) =>
    items.slice(0, 4).map((item) => Math.round(item.getBoundingClientRect().height)),
  );
  expect(new Set(heights).size).toBe(1);
  await page.screenshot({ path: "test-results/review/san-pham-1440.png", fullPage: true });
});

for (const path of ["/san-pham", "/danh-muc/pano", "/danh-muc/ban-le-coi"]) {
  test(`${path}: axe sạch, không cuộn ngang, vùng chạm từ 44px`, async ({ page }) => {
    await page.goto(path);
    await expectPageBasics(page);
  });
}

import { readFileSync } from "node:fs";
import { expectPageBasics } from "./checks";
import { expect, test } from "./test";

const fixture = JSON.parse(readFileSync(new URL("../fixtures/products.json", import.meta.url), "utf8")) as {
  slug: string;
  images: unknown[];
}[];
const visibleSlugs = fixture.filter((p) => p.images.length > 0).map((p) => p.slug);
const cards = (page: import("@playwright/test").Page) => page.locator("main ul.grid > li");

test.describe("lọc và tìm trên /san-pham", () => {
  test.skip(({ isMobile }) => isMobile, "bộ lọc nằm trên lưới từ 1024px");

  test("lọc ghi lên URL, reload giữ nguyên, Xoá lọc trả về đủ", async ({ page }) => {
    await page.goto("/san-pham");
    await expect(cards(page)).toHaveCount(22);
    const filters = page.locator("main").getByRole("group", { name: "Vật liệu" });
    await filters.getByRole("checkbox", { name: /Thép SS400/ }).check();
    await expect(page).toHaveURL(/vl=thep-ss400/);
    await expect(cards(page)).toHaveCount(4);

    await page.locator("main").getByRole("group", { name: "Độ dày" }).getByRole("checkbox", { name: /3,0 mm/ }).check();
    await expect(page).toHaveURL(/day=3/);
    await expect(cards(page)).toHaveCount(2); // VÀ giữa nhóm: SS400 và dày 3,0 mm

    await page.reload();
    await expect(cards(page)).toHaveCount(2);
    await expect(filters.getByRole("checkbox", { name: /Thép SS400/ })).toBeChecked();

    await page.getByRole("link", { name: "Xoá lọc" }).click();
    await expect(page).toHaveURL(/\/san-pham$/);
    await expect(cards(page)).toHaveCount(22);
  });

  test("tìm không dấu theo mã; không khớp thì có dòng trạng thái rỗng", async ({ page }) => {
    await page.goto("/san-pham");
    await page.getByRole("searchbox", { name: "Tìm theo mã hoặc tên" }).fill("ban le coi");
    await expect(page).toHaveURL(/q=ban\+le\+coi/);
    await expect(cards(page)).toHaveCount(4);
    await page.getByRole("searchbox", { name: "Tìm theo mã hoặc tên" }).fill("zzz");
    await expect(page.getByText("Không có mẫu nào khớp với lọc này.")).toBeVisible();
  });

  test("vào trang chi tiết rồi Back thì lọc vẫn còn", async ({ page }) => {
    await page.goto("/san-pham?vl=inox-201&sx=gia");
    await expect(cards(page)).toHaveCount(2);
    await cards(page).first().getByRole("link").click();
    await expect(page).toHaveURL(/\/san-pham\/[a-z0-9-]+$/);
    await page.goBack();
    await expect(page).toHaveURL(/vl=inox-201&sx=gia/);
    await expect(cards(page)).toHaveCount(2);
    await expect(page.getByRole("combobox", { name: "Sắp xếp" })).toHaveValue("gia");
  });

  test("cột danh mục gạch chân mục đang xem, kèm số mẫu", async ({ page }) => {
    await page.goto("/danh-muc/ban-le-coi");
    const current = page.getByRole("navigation", { name: "Danh mục" }).locator('[aria-current="page"]');
    await expect(current).toHaveText(/Bản lề cối\s*4/);
  });
});

test("dưới 1024px, nút Lọc mẫu mở bảng lọc toàn màn hình", async ({ page, isMobile }) => {
  test.skip(!isMobile, "chỉ dưới 1024px");
  await page.goto("/san-pham");
  await page.getByRole("button", { name: "Lọc mẫu" }).click();
  const panel = page.getByRole("dialog", { name: "Lọc mẫu" });
  await expect(panel).toBeVisible();
  await panel.getByRole("checkbox", { name: /Inox 201/ }).check();
  await panel.getByRole("button", { name: /Xem 2 mẫu/ }).click();
  await expect(panel).toBeHidden();
  await expect(cards(page)).toHaveCount(2);
});

test.describe("trang chi tiết", () => {
  test("ở 1440×900, mọi trang chi tiết có bảng thông số từ 2 hàng trong màn hình đầu", async ({ page, isMobile }) => {
    test.skip(isMobile, "đo ở khổ desktop");
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const slug of visibleSlugs) {
      await page.goto(`/san-pham/${slug}`);
      const rows = await page.locator("main table tr").evaluateAll((list) => list.filter((tr) => tr.getBoundingClientRect().bottom <= 900).length);
      expect(rows, slug).toBeGreaterThanOrEqual(2);
    }
  });

  test("đổi ảnh bằng hàng ảnh nhỏ; cùng nhóm có 4 thẻ; mẫu vừa xem ghi lại mẫu trước", async ({ page }) => {
    await page.goto("/san-pham/ban-le-coi-16-ly");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bản lề cối 16 ly");
    const main = page.locator("main img").first();
    const before = await main.getAttribute("src");
    await page.getByRole("button", { name: "Xem ảnh 2" }).click();
    await expect(page.getByRole("button", { name: "Xem ảnh 2" })).toHaveAttribute("aria-pressed", "true");
    expect(await page.locator("main img").first().getAttribute("src")).not.toBe(before);

    const related = page.getByRole("region", { name: "Cùng nhóm bản lề" });
    await expect(related.locator("li")).toHaveCount(4);
    await expect(page.getByRole("region", { name: "Mẫu vừa xem" })).toHaveCount(0);

    await page.goto("/san-pham/pano-dap-o-vuong");
    await expect(page.getByRole("region", { name: "Mẫu vừa xem" }).getByText("TH-BL03")).toBeVisible();
    await expectPageBasics(page);
  });

  test("mã lạ trả 404", async ({ page }) => {
    const response = await page.goto("/san-pham/khong-co-ma-nay");
    expect(response?.status()).toBe(404);
  });
});

test("chụp chi tiết, cửa hàng có lọc cho người duyệt", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "chụp một lần");
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [name, path] of [
      ["chi-tiet", "/san-pham/ban-le-coi-16-ly"],
      ["san-pham-loc", "/san-pham?vl=thep-ct3"],
    ] as const) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `test-results/review/${name}-${width}.png`, fullPage: true });
    }
  }
});

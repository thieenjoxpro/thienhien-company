import type { Page } from "@playwright/test";
import { expectPageBasics } from "./checks";
import { expect, test } from "./test";

const visiblePrimaries = (page: Page) =>
  page.$$eval("[data-primary-action]", (buttons) =>
    buttons.filter((button) => {
      const box = button.getBoundingClientRect();
      return box.width > 0 && box.bottom > 0 && box.top < window.innerHeight;
    }).length,
  );

test("h1 gọi tên loại hàng và nơi chốn, chữ bằng Be Vietnam Pro tự host đủ subset tiếng Việt", async ({ page }) => {
  await page.goto("/");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("Xưởng pano và bản lề cửa sắt ở Bình Tân, TP.HCM");
  await expect(page.getByText(/^22 mẫu pano, bản lề, tôn và mâm cầu thang/)).toBeVisible();

  await page.evaluate(() => document.fonts.ready);
  const family = await heading.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family.startsWith('"Be Vietnam Pro"') || family.startsWith("Be Vietnam Pro")).toBe(true);
  const fonts = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((name) => name.includes(".woff2")),
  );
  expect(fonts.some((url) => url.includes("be-vietnam-pro-latin-400"))).toBe(true);
  expect(fonts.some((url) => url.includes("be-vietnam-pro-vietnamese-400"))).toBe(true);
  expect(fonts.every((url) => url.startsWith(new URL(page.url()).origin))).toBe(true);

  await expectPageBasics(page);
});

test.describe("trang chủ ở 1440×900 (mục 10, M3)", () => {
  test.skip(({ isMobile }) => isMobile, "đo ở khổ desktop");
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
  });

  test("đủ 5 khối đúng thứ tự, mỗi khối cao 900 hoặc 1800px", async ({ page }) => {
    const blocks = page.locator("main > section");
    await expect(blocks).toHaveCount(5);
    const headings = await blocks.evaluateAll((sections) => sections.map((s) => s.querySelector("h1, h2")?.textContent));
    expect(headings).toEqual([
      "Xưởng pano và bản lề cửa sắt ở Bình Tân, TP.HCM",
      "Bốn nhóm hàng",
      "Mẫu mới về",
      "Hàng dập tại xưởng",
      "Bình Tân, TP.HCM",
    ]);
    for (const height of await blocks.evaluateAll((sections) => sections.map((s) => s.getBoundingClientRect().height))) {
      const nearest = height > 1350 ? 1800 : 900;
      expect(Math.abs(height - nearest), `khối cao ${height}px`).toBeLessThanOrEqual(8);
    }
  });

  test("mỗi khối có đúng một tiêu đề, ảnh trong khối đã tải (trừ dải liên hệ là khoảnh khắc chữ)", async ({ page }) => {
    const blocks = await page.locator("main > section").all();
    for (const [index, block] of blocks.entries()) {
      await block.scrollIntoViewIfNeeded();
      await expect(block.locator("h1, h2")).toHaveCount(1);
      if (index === blocks.length - 1) continue;
      const images = block.locator("img");
      await expect(images.first()).toBeVisible();
      await expect
        .poll(() => images.evaluateAll((list) => list.every((img) => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)))
        .toBe(true);
    }
  });

  test("đúng một nút tô màu trong mỗi màn hình", async ({ page }) => {
    const tops = await page.locator("main > section").evaluateAll((sections) =>
      sections.map((s) => s.getBoundingClientRect().top + window.scrollY),
    );
    for (const top of tops) {
      await page.evaluate((y) => window.scrollTo(0, y), top);
      await expect.poll(() => visiblePrimaries(page), { message: `màn hình bắt đầu ở ${top}px` }).toBe(1);
    }
  });
});

test.describe("lưới sản phẩm", () => {
  test.skip(({ isMobile }) => isMobile, "tự đổi khổ màn hình");

  test("trang danh sách: 2 cột dưới 768px, 3 cột từ 768px (cạnh cột danh mục 3/12); không cuộn ngang ở 320px", async ({ page }) => {
    for (const [width, columns] of [
      [320, 2],
      [390, 2],
      [768, 3],
      [1024, 3],
      [1280, 3],
      [1440, 3],
    ] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/san-pham");
      const lefts = await page.locator("main ul.grid > li").evaluateAll((items) => new Set(items.map((li) => Math.round(li.getBoundingClientRect().left))).size);
      expect(lefts, `khổ ${width}`).toBe(columns);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `khổ ${width} cuộn ngang`).toBeLessThanOrEqual(0);
    }
  });
});

test("trang danh mục có breadcrumb, gồm hàng của danh mục con; danh mục lạ trả 404", async ({ page }) => {
  await page.goto("/danh-muc/ban-le");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bản lề");
  await expect(page.getByRole("navigation", { name: "Đường dẫn" }).getByRole("link", { name: "Trang chủ" })).toBeVisible();
  await expect(page.getByText("8 mẫu", { exact: true })).toBeVisible();
  await expect(page.locator("main ul.grid > li")).toHaveCount(8);

  await page.goto("/danh-muc/ban-le-coi");
  await expect(page.getByRole("navigation", { name: "Đường dẫn" }).getByRole("link", { name: "Bản lề" })).toBeVisible();

  const response = await page.goto("/danh-muc/khong-co");
  expect(response?.status()).toBe(404);
});

for (const path of ["/san-pham", "/danh-muc/pano"]) {
  test(`${path}: axe sạch, không cuộn ngang, vùng chạm từ 44px`, async ({ page }) => {
    await page.goto(path);
    await expectPageBasics(page);
  });
}

test("chụp trang chủ, cửa hàng cho người duyệt (test-results/review)", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "chụp một lần, tự đổi khổ");
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [name, path] of [
      ["home", "/"],
      ["san-pham", "/san-pham"],
    ]) {
      await page.goto(path ?? "/");
      await page.evaluate(() => document.fonts.ready);
      for (const img of await page.locator("main img").all()) await img.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `test-results/review/${name}-${width}.png`, fullPage: true });
    }
  }
});

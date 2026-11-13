import { expectPageBasics } from "./checks";
import { expect, test } from "./test";

test("trang chủ hiện chữ bằng Be Vietnam Pro tự host, đủ subset tiếng Việt", async ({ page }) => {
  await page.goto("/");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("Xưởng pano và bản lề cửa sắt ở Bình Tân, TP.HCM");
  // Con số ở màn hình đầu đếm từ dữ liệu: 22 mẫu có ảnh trong fixture
  await expect(page.getByText("22 mẫu pano, bản lề, tôn và mâm cầu thang")).toBeVisible();

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

test.describe("trang chủ ở 1440×900", () => {
  test.skip(({ isMobile }) => isMobile, "đo bố cục desktop, tự đặt khổ màn hình");
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
  });

  test("5 khối, mỗi khối một màn hình, tiêu đề đứng đầu khối, khối nào cũng có ảnh đã tải", async ({ page }) => {
    const blocks = page.locator("main > section");
    await expect(blocks).toHaveCount(5);
    const header = (await page.getByRole("banner").boundingBox())?.height ?? 0;

    for (let i = 0; i < 5; i++) {
      const block = blocks.nth(i);
      await block.scrollIntoViewIfNeeded();
      const height = (await block.boundingBox())?.height ?? 0;
      // Khối đầu cùng với header vừa một màn hình
      const expected = i === 0 ? 900 - header : 900;
      expect(Math.abs(height - expected), `khối ${i + 1} cao ${height}px`).toBeLessThanOrEqual(8);

      const firstHeading = await block.locator("h1, h2, h3").first().evaluate((el) => el.tagName);
      expect(firstHeading, `khối ${i + 1}`).toBe(i === 0 ? "H1" : "H2");

      // Dải liên hệ là khoảnh khắc chữ của trang, không có ảnh
      if (i < 4) {
        const image = block.locator("img").first();
        await expect(image).toBeVisible();
        await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      }
    }
  });

  test("mỗi màn hình đúng một nút tô màu", async ({ page }) => {
    const blocks = page.locator("main > section");
    for (let i = 0; i < 5; i++) {
      await blocks.nth(i).evaluate((el) => el.scrollIntoView({ block: "start" }));
      await expect
        .poll(() =>
          page.$$eval("[data-primary-action]", (buttons) =>
            buttons.filter((button) => {
              const box = button.getBoundingClientRect();
              const shown = getComputedStyle(button).visibility === "visible" && box.width > 0;
              return shown && box.bottom > 0 && box.top < window.innerHeight;
            }).length,
          ),
        )
        .toBe(1);
    }
  });

  test("ô nhóm hàng dẫn tới trang danh mục; ảnh trên trang không lặp", async ({ page }) => {
    const sources = await page.$$eval("main img", (images) =>
      images.map((img) => new URL((img as HTMLImageElement).currentSrc || (img as HTMLImageElement).src).searchParams.get("url")),
    );
    expect(new Set(sources).size).toBe(sources.length);

    await page.getByRole("link", { name: /Bản lề 8 mẫu, từ/ }).click();
    await expect(page).toHaveURL(/\/danh-muc\/ban-le$/);
  });
});

test("trang chủ: chụp cả trang cho người duyệt (test-results/review)", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "chụp một lần, tự đổi khổ");
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `test-results/review/home-${width}.png`, fullPage: true });
  }
});

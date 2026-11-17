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

test("h1 gọi tên loại hàng và người mua, tiêu đề bằng Barlow Condensed, chữ thường bằng Be Vietnam Pro, tự host", async ({ page }) => {
  await page.goto("/");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("Pano, bản lề, tôn, mâm cầu thang giá sỉ cho đại lý và thợ");
  await expect(page.getByText(/^22 mẫu có sẵn mã, kích thước và độ dày/)).toBeVisible();

  await page.evaluate(() => document.fonts.ready);
  // next/font đặt tên họ chữ riêng; họ đầu tiên phải là font tự host đã tải xong, không phải font dự phòng
  const loaded = await heading.evaluate((el) => {
    const first = getComputedStyle(el).fontFamily.split(",")[0]?.trim() ?? "";
    return document.fonts.check(`700 38px ${first}`, "Thiện Hiền") && !/fallback|sans-serif|arial/i.test(first);
  });
  expect(loaded).toBe(true);
  const fonts = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((name) => name.includes(".woff2")),
  );
  expect(fonts.some((url) => url.includes("barlow_condensed_vietnamese_700"))).toBe(true);
  expect(fonts.some((url) => url.includes("be_vietnam_pro_vietnamese_400"))).toBe(true);
  expect(fonts.every((url) => url.startsWith(new URL(page.url()).origin))).toBe(true);

  await expectPageBasics(page);
});

test.describe("trang chủ ở 1440×900 (design V2)", () => {
  test.skip(({ isMobile }) => isMobile, "đo ở khổ desktop");
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
  });

  test("đủ khối đúng thứ tự: hero, nhóm hàng, mẫu theo tab, 3 bước, ghé xưởng", async ({ page }) => {
    const headings = await page.locator("main > section").evaluateAll((sections) => sections.map((s) => s.querySelector("h1, h2")?.textContent));
    expect(headings).toEqual([
      "Pano, bản lề, tôn, mâm cầu thang giá sỉ cho đại lý và thợ",
      "Bốn nhóm hàng",
      "Mẫu đang có tại xưởng",
      "Hỏi giá sỉ trong 3 bước",
      "Ghé xưởng xem hàng",
    ]);
  });

  test("tab nhóm hàng: một nhóm hiện mỗi lúc, số trên tab đếm từ dữ liệu, đổi tab đổi thẻ", async ({ page }) => {
    const block = page.locator("#mau");
    const visible = block.locator("article").filter({ visible: true });
    await expect(block.getByRole("button", { name: /^Pano \(\d+\)$/ })).toHaveAttribute("aria-pressed", "true");
    await expect(visible.first()).toContainText("TH-PN");
    const tab = block.getByRole("button", { name: /^Bản lề \((\d+)\)$/ });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-pressed", "true");
    await expect(visible.first()).toContainText("TH-BL");
    await expect(visible).toHaveCount(6);
    await expect(block.getByRole("link", { name: /^Xem tất cả 8 mẫu bản lề/ })).toBeVisible();
  });

  test("mỗi khối có đúng một tiêu đề; ảnh trong các kệ hàng đã tải", async ({ page }) => {
    for (const block of await page.locator("main > section").all()) {
      await block.scrollIntoViewIfNeeded();
      await expect(block.locator("h1, h2")).toHaveCount(1);
      // Chỉ ảnh của tab đang mở: các tab ẩn chưa tải ảnh (lazy)
      const images = block.locator("article img").filter({ visible: true });
      if ((await images.count()) === 0) continue;
      await expect
        .poll(() => images.evaluateAll((list) => list.every((img) => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)))
        .toBe(true);
    }
  });

  test("nút Zalo của hero mở zalo.me; hai nút nổi Zalo và Gọi xưởng luôn ở góc phải dưới", async ({ page }) => {
    const hero = page.locator("main > section").first();
    await expect(hero.locator("[data-primary-action]")).toHaveCount(1);
    await expect(hero.getByRole("link", { name: "Hỏi giá qua Zalo" })).toHaveAttribute("href", "https://zalo.me/0900000000");
    await page.mouse.wheel(0, 2400);
    const zalo = page.getByRole("link", { name: "Nhắn Zalo cho xưởng" });
    await expect(zalo).toBeInViewport();
    await expect(page.getByRole("link", { name: "Gọi xưởng", exact: true }).last()).toHaveAttribute("href", "tel:0900000000");
    expect(await visiblePrimaries(page)).toBeLessThanOrEqual(1);
  });

  test("bấm Thêm vào hỏi giá trên thẻ thì số đếm trên header tăng, bấm lần nữa thì bỏ", async ({ page }) => {
    const button = page.getByRole("button", { name: /^Thêm vào hỏi giá\W+Pano dập hoa mai$/ });
    const count = page.getByRole("link", { name: /^Danh sách hỏi giá, \d+ mẫu$/ });
    await expect(count).toHaveAccessibleName("Danh sách hỏi giá, 0 mẫu");
    await button.click();
    await expect(page.getByRole("button", { name: /^Đã thêm vào hỏi giá\W+Pano dập hoa mai$/ })).toHaveAttribute("aria-pressed", "true");
    await expect(count).toHaveAccessibleName("Danh sách hỏi giá, 1 mẫu");
    await page.getByRole("button", { name: /^Đã thêm vào hỏi giá\W+Pano dập hoa mai$/ }).click();
    await expect(count).toHaveAccessibleName("Danh sách hỏi giá, 0 mẫu");
  });
});

test.describe("lưới sản phẩm", () => {
  test.skip(({ isMobile }) => isMobile, "tự đổi khổ màn hình");

  test("trang danh sách: 2 cột dưới 768px, 3 cột từ 768px, 4 cột từ 1280px (cạnh cột lọc); không cuộn ngang ở 320px", async ({ page }) => {
    for (const [width, columns] of [
      [320, 2],
      [390, 2],
      [768, 3],
      [1024, 3],
      [1280, 4],
      [1440, 4],
    ] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/san-pham");
      await expect(page.locator("main article").nth(columns), `khổ ${width} đã có đủ thẻ`).toBeVisible(); // lưới stream sau khung trang
      const lefts = await page.locator("main article").evaluateAll((items) => new Set(items.map((li) => Math.round(li.getBoundingClientRect().left))).size);
      expect(lefts, `khổ ${width}`).toBe(columns);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `khổ ${width} cuộn ngang`).toBeLessThanOrEqual(0);
    }
  });
});

test("trang danh mục có breadcrumb, gồm hàng của danh mục con; danh mục lạ trả 404", async ({ page }) => {
  await page.goto("/danh-muc/ban-le");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bản lề");
  await expect(page.getByRole("link", { name: /^Bản lề cối 4 mẫu$/ })).toHaveAttribute("href", "/danh-muc/ban-le-coi");
  await expect(page.getByRole("navigation", { name: "Đường dẫn" }).getByRole("link", { name: "Trang chủ" })).toBeVisible();
  await expect(page.getByText("8 mẫu", { exact: true })).toBeVisible();
  await expect(page.locator("main article")).toHaveCount(8);

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
  test.setTimeout(120_000);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [name, path] of [
      ["home", "/"],
      ["san-pham", "/san-pham"],
    ]) {
      await page.goto(path ?? "/");
      await page.evaluate(() => document.fonts.ready);
      // Cuộn dần xuống cuối để ảnh lười tải hết, rồi về đầu trang mới chụp
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
      });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `test-results/review/${name}-${width}.png`, fullPage: true });
    }
  }
});

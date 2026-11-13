import { expectPageBasics } from "./checks";
import { expect, test } from "./test";

test.describe("menu điện thoại", () => {
  test.skip(({ isMobile }) => !isMobile, "menu toàn màn hình chỉ có dưới 1024px");

  test("mở và đóng bằng bàn phím, giữ focus trong menu, Esc đóng", async ({ page }) => {
    await page.goto("/");
    const opener = page.getByRole("button", { name: "Mở menu" });
    const menu = page.getByRole("dialog", { name: "Menu" });

    await opener.focus();
    await page.keyboard.press("Enter");
    await expect(menu).toBeVisible();
    await expect(opener).toHaveAttribute("aria-expanded", "true");

    const focusInMenu = () => menu.evaluate((node) => node.contains(document.activeElement));
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      expect(await focusInMenu(), `Tab lần ${i + 1} thoát khỏi menu`).toBe(true);
    }
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Shift+Tab");
      expect(await focusInMenu(), `Shift+Tab lần ${i + 1} thoát khỏi menu`).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(opener).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(menu).toBeVisible();
    await page.getByRole("button", { name: "Đóng menu" }).focus();
    await page.keyboard.press("Enter");
    await expect(menu).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("bấm vào nhóm hàng trong menu thì menu đóng", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mở menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await menu.getByRole("link", { name: "Bản lề" }).click();
    await expect(page).toHaveURL(/\/danh-muc\/ban-le$/);
    await expect(menu).toBeHidden();
  });
});

test.describe("bảng nhóm hàng trên header", () => {
  test.skip(({ isMobile }) => isMobile, "chỉ có từ 1024px");

  test("rê chuột mở sau 150ms, có 3 mẫu kèm ảnh; rời chuột thì đóng", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("banner").getByRole("navigation", { name: "Điều hướng chính" });
    await nav.getByRole("link", { name: "Pano", exact: true }).hover();
    const panelLink = nav.getByRole("link", { name: /Tất cả 6 mẫu pano/ });
    await expect(panelLink).toBeVisible();
    await expect(nav.locator("img")).toHaveCount(3);
    await page.mouse.move(640, 700);
    await expect(panelLink).toBeHidden();
  });

  test("focus mở bảng, Tab đi vào bảng, Esc đóng và trả focus về tên nhóm", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("banner").getByRole("navigation", { name: "Điều hướng chính" });
    const group = nav.getByRole("link", { name: "Bản lề", exact: true });
    await group.focus();
    await expect(nav.getByRole("link", { name: "Bản lề cối", exact: true })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link", { name: "Bản lề cối", exact: true })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(nav.getByRole("link", { name: "Bản lề cối", exact: true })).toBeHidden();
    await expect(group).toBeFocused();
  });
});

test("hai lề của header, các khối và footer trùng nhau từng pixel ở 1440 và 390", async ({ page, isMobile }) => {
  test.skip(isMobile, "chạy một lần, tự đổi khổ màn hình");
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/dev/ui");
    const edges = await page.$$eval("header [data-frame], main [data-frame], footer [data-frame]", (frames) =>
      frames
        .filter((frame) => frame.getBoundingClientRect().width > 0)
        .map((frame) => {
          const box = frame.getBoundingClientRect();
          const style = getComputedStyle(frame);
          return [box.left + parseFloat(style.paddingLeft), box.right - parseFloat(style.paddingRight)];
        }),
    );
    expect(edges.length, `khổ ${width}: thiếu khung để đo`).toBeGreaterThanOrEqual(3);
    const [first] = edges;
    for (const edge of edges) expect(edge, `khổ ${width}: lề lệch`).toEqual(first);
    const expectedLeft = width >= 1024 ? Math.max(48, (width - 1280) / 2) : 16;
    expect(first?.[0], `khổ ${width}: lề trái`).toBe(expectedLeft);
  }
});

test("thanh hành động điện thoại chỉ hiện khi không còn nút chính nào trong màn hình", async ({ page, isMobile }) => {
  await page.goto("/dev/ui");
  const bar = page.locator("[data-phone-bar]");
  if (!isMobile) {
    await expect(bar).toBeHidden();
    return;
  }
  await expect(bar).toBeVisible(); // đầu trang: nút chính của header ẩn dưới 640px
  await page.getByRole("heading", { name: "Nút" }).scrollIntoViewIfNeeded();
  await page.locator("main [data-primary-action]").first().scrollIntoViewIfNeeded();
  await expect(bar).toBeHidden();
  await page.getByRole("heading", { name: "Ảnh và giá" }).scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 600);
  await expect(bar).toBeVisible();
  await expect(bar.getByRole("link", { name: "Gọi xưởng" })).toHaveAttribute("href", "tel:0900000000");
  // Nhãn không được rớt dòng: hai nút đúng 48px ở khổ 390
  for (const name of ["Hỏi giá qua Zalo", "Gọi xưởng"]) {
    expect((await bar.getByRole("link", { name }).boundingBox())?.height).toBe(48);
  }
  await page.screenshot({ path: "test-results/review/phone-bar-390.png" });
});

for (const path of ["/", "/dev/ui"]) {
  test(`${path}: axe sạch, không cuộn ngang, vùng chạm từ 44px`, async ({ page }) => {
    await page.goto(path);
    await expectPageBasics(page);
  });
}

test("/dev/ui: chụp cả trang cho người duyệt (test-results/review)", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "chụp một lần, tự đổi khổ");
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/dev/ui");
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `test-results/review/dev-ui-${width}.png`, fullPage: true });
  }
});

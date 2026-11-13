import { expect, test } from "@playwright/test";
import { expectPageBasics } from "./checks";

test("trang chủ hiện chữ bằng Be Vietnam Pro tự host, đủ subset tiếng Việt", async ({ page }) => {
  await page.goto("/");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("Thiện Hiền");

  await page.evaluate(() => document.fonts.ready);
  const family = await heading.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family.startsWith('"Be Vietnam Pro"') || family.startsWith("Be Vietnam Pro")).toBe(true);

  const fonts = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((name) => name.includes(".woff2")),
  );
  // "Thiện Hiền" cần cả subset latin và vietnamese; font phải đến từ chính site
  expect(fonts.some((url) => url.includes("be-vietnam-pro-latin-400"))).toBe(true);
  expect(fonts.some((url) => url.includes("be-vietnam-pro-vietnamese-400"))).toBe(true);
  expect(fonts.every((url) => url.startsWith(new URL(page.url()).origin))).toBe(true);

  await expectPageBasics(page);
});

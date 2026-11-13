import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test as base } from "@playwright/test";

const photos = join(dirname(fileURLToPath(import.meta.url)), "../fixtures/photos");
const PHOTO_PATH = /^\/(products|workshop)\/[^/]+\.webp$/;

/**
 * test của Playwright, thêm một việc: ảnh sản phẩm và ảnh xưởng (/products/*.webp, /workshop/*.webp,
 * qua /_next/image hoặc trực tiếp) được trả bằng ảnh xám trong tests/fixtures/photos.
 * public/ không bao giờ chứa ảnh thử.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(/\/_next\/image\?|\/(products|workshop)\/[^/]+\.webp/, async (route) => {
      const url = new URL(route.request().url());
      const target = url.pathname === "/_next/image" ? (url.searchParams.get("url") ?? "") : url.pathname;
      const file = join(photos, target.split("/").pop() ?? "");
      if (!PHOTO_PATH.test(target) || !existsSync(file)) return route.fulfill({ status: 404 });
      return route.fulfill({ path: file, contentType: "image/webp" });
    });
    await use(page);
  },
});

export { expect } from "@playwright/test";

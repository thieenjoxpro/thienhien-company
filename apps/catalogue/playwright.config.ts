import { defineConfig, devices } from "@playwright/test";

const port = 4310;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://localhost:${port}`, trace: "retain-on-failure" },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002 } },
  projects: [
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
  ],
  // E2E chạy trên bản build riêng (.next-fixtures) với dữ liệu, cấu hình xưởng thử trong tests/fixtures;
  // ảnh được tests/e2e/test.ts chặn và trả bằng ảnh xám của fixture. /dev/ui mở nhờ SHOW_DEV_UI.
  webServer: {
    command: `pnpm exec next build && pnpm exec next start --port ${port}`,
    env: { CATALOGUE_FIXTURES: "1", SHOW_DEV_UI: "1" },
    port,
    reuseExistingServer: false, // cổng trùng thì báo lỗi, không chạy nhầm sang app khác
    timeout: 300_000,
  },
});

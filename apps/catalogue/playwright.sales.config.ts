import { defineConfig, devices } from "@playwright/test";

const port = 4320;

// E2E khu bán hàng: bản build chế độ máy chủ riêng (.next-sales), database PGlite trong bộ nhớ (mỗi lần chạy là database mới),
// tài khoản quản trị thử. Chạy: pnpm test:e2e:sales. Chromium của Playwright vừa là trình duyệt test vừa chụp phiếu PDF, PNG.
export const SALES_ADMIN = { username: "e2e-ban-hang", password: "mat-khau-chi-de-test-e2e" };

export default defineConfig({
  testDir: "tests/e2e-sales",
  globalTeardown: "./tests/e2e/teardown.ts",
  fullyParallel: false,
  workers: 1, // một database chung: chạy lần lượt để số liệu nợ, khách quen không lẫn nhau
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never", outputFolder: "playwright-report-sales" }]] : "list",
  use: { baseURL: `http://localhost:${port}`, trace: "retain-on-failure" },
  projects: [
    { name: "dang-nhap", testMatch: /login\.setup\.ts/ },
    {
      name: "mobile",
      dependencies: ["dang-nhap"],
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, storageState: "test-results/sales-auth.json" },
    },
    {
      name: "desktop",
      dependencies: ["dang-nhap"],
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 }, storageState: "test-results/sales-auth.json" },
    },
  ],
  webServer: {
    command: `pnpm exec next build && pnpm exec next start --port ${port}`,
    env: {
      CATALOGUE_SERVER: "1",
      CATALOGUE_DIST_DIR: ".next-sales",
      DATABASE_URL: "pglite://memory",
      UPLOAD_DIR: ".data/e2e-sales-uploads",
      ADMIN_USERNAME: SALES_ADMIN.username,
      ADMIN_PASSWORD: SALES_ADMIN.password,
      ADMIN_COOKIE_INSECURE: "1",
      PORT: String(port),
    },
    port,
    reuseExistingServer: false,
    timeout: 300_000,
  },
});

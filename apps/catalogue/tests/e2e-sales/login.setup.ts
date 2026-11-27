import { expect, test } from "@playwright/test";
import { SALES_ADMIN } from "../../playwright.sales.config";

// Đăng nhập một lần, lưu cookie cho các project mobile, desktop
test("đăng nhập quản trị", async ({ page }) => {
  await page.goto("/dang-nhap");
  await page.getByLabel("Tên đăng nhập").fill(SALES_ADMIN.username);
  await page.getByLabel("Mật khẩu").fill(SALES_ADMIN.password);
  await page.getByRole("button", { name: /Đăng nhập/ }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.context().storageState({ path: "test-results/sales-auth.json" });
});

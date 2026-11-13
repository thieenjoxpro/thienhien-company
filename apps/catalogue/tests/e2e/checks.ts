import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** Kiểm chung cho mọi route (docs/PLAN.md mục 9.7): axe, không cuộn ngang, vùng chạm từ 44px. */
export async function expectPageBasics(page: Page) {
  const axe = await new AxeBuilder({ page }).analyze();
  const serious = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, "trang cuộn ngang").toBeLessThanOrEqual(0);

  // Link nằm trong dòng văn bản được miễn (WCAG 2.5.8)
  const small = await page.$$eval("a, button, input, select, textarea, [role='button']", (elements) =>
    elements
      .filter((el) => !el.closest("p, li > span, td"))
      .map((el) => ({ el, box: el.getBoundingClientRect() }))
      .filter(({ box }) => box.width > 0 && box.height > 0 && (box.width < 44 || box.height < 44))
      .map(({ el, box }) => `${el.tagName.toLowerCase()} "${el.textContent?.trim() ?? ""}" ${Math.round(box.width)}x${Math.round(box.height)}`),
  );
  expect(small, "vùng chạm nhỏ hơn 44px").toEqual([]);
}

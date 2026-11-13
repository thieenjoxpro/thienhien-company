import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** Kiểm chung cho mọi route (docs/PLAN.md mục 9.7): axe, không cuộn ngang, vùng chạm từ 44px. */
export async function expectPageBasics(page: Page) {
  const axe = await new AxeBuilder({ page }).analyze();
  const serious = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`)).toEqual([]);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, "trang cuộn ngang").toBeLessThanOrEqual(0);

  const small = await page.$$eval("a, button, input, select, textarea, [role='button']", (elements) =>
    elements.flatMap((el) => {
      // Link nằm trong dòng văn bản được miễn (WCAG 2.5.8)
      if (el.closest("p, td")) return [];
      // Checkbox, radio: vùng bấm là cả nhãn bọc ngoài
      const target = el.matches("input[type=checkbox], input[type=radio]") ? (el.closest("label") ?? el) : el;
      const box = target.getBoundingClientRect();
      // Bỏ phần tử ẩn (0px) và phần tử chỉ cho trình đọc màn hình (sr-only, 1px)
      if (box.width <= 1 || box.height <= 1) return [];
      if (box.width >= 44 && box.height >= 44) return [];
      return [`${el.tagName.toLowerCase()} "${el.textContent?.trim() ?? ""}" ${Math.round(box.width)}x${Math.round(box.height)}`];
    }),
  );
  expect(small, "vùng chạm nhỏ hơn 44px").toEqual([]);
}

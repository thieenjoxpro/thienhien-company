import { join } from "node:path";
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";
import { appRoot, readLintFixtures } from "./fixtures";

const eslint = new ESLint({ cwd: appRoot });

describe("ESLint chặn đúng từng file sai mẫu (tests/slop-fixtures/eslint)", () => {
  for (const fixture of readLintFixtures("eslint")) {
    const label = fixture.expect.length ? `${fixture.file} bị ${fixture.expect.join(", ")} chặn` : `${fixture.file} sạch`;
    it(label, async () => {
      const filePath = join(appRoot, fixture.path ?? `src/components/${fixture.file}`);
      const [result] = await eslint.lintText(fixture.code, { filePath });
      const messages = result?.messages ?? [];
      const summary = messages.map((m) => `${m.ruleId}: ${m.message}`);
      if (fixture.expect.length === 0) {
        expect(summary).toEqual([]);
        return;
      }
      for (const rule of fixture.expect) {
        const hits = messages.filter((m) => m.ruleId === rule);
        expect(hits.length, `không thấy ${rule}; có: ${summary.join(" | ")}`).toBeGreaterThan(0);
        if (fixture.message) {
          expect(hits.some((m) => m.message.includes(fixture.message ?? "")), `${rule} không nhắc "${fixture.message}"`).toBe(true);
        }
      }
    });
  }
});

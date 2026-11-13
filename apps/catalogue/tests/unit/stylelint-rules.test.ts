import { join } from "node:path";
import stylelint from "stylelint";
import { describe, expect, it } from "vitest";
import { appRoot, readLintFixtures } from "./fixtures";

describe("Stylelint chặn đúng từng file sai mẫu (tests/slop-fixtures/stylelint)", () => {
  for (const fixture of readLintFixtures("stylelint")) {
    const label = fixture.expect.length ? `${fixture.file} bị ${fixture.expect.join(", ")} chặn` : `${fixture.file} sạch`;
    it(label, async () => {
      const { results } = await stylelint.lint({
        code: fixture.code,
        codeFilename: join(appRoot, fixture.path ?? `src/components/${fixture.file}`),
        cwd: appRoot,
      });
      const rules = (results[0]?.warnings ?? []).map((w) => w.rule);
      if (fixture.expect.length === 0) {
        expect(rules).toEqual([]);
        return;
      }
      for (const rule of fixture.expect) expect(rules, `không thấy ${rule}; có: ${rules.join(", ")}`).toContain(rule);
    });
  }
});

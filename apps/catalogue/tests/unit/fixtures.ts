import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const fixtureDir = join(appRoot, "tests/slop-fixtures");

export interface LintFixture {
  file: string;
  code: string;
  /** Luật phải bắt được file này; rỗng nghĩa là file phải sạch. */
  expect: string[];
  message: string | null;
  path: string | null;
}

/** Đọc các dòng chú thích đầu file: "expect: <luật>", "expect-message: <chuỗi>", "path: <đường dẫn ảo>". */
export function readLintFixtures(kind: "eslint" | "stylelint"): LintFixture[] {
  const dir = join(fixtureDir, kind);
  return readdirSync(dir)
    .sort()
    .map((file) => {
      const code = readFileSync(join(dir, file), "utf8");
      const header = (key: string) =>
        code.match(new RegExp(String.raw`^\s*(?:\/\/|\/\*)\s*${key}:[ \t]*(.*?)[ \t]*(?:\*\/)?$`, "m"))?.[1] ?? "";
      const expected = header("expect");
      return {
        file,
        code,
        expect: expected === "none" ? [] : expected.split(",").map((s) => s.trim()).filter(Boolean),
        message: header("expect-message") || null,
        path: header("path") || null,
      };
    });
}

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { appRoot, fixtureDir } from "./fixtures";

const script = join(appRoot, "scripts/check-slop.mjs");
const cases = readdirSync(join(fixtureDir, "check-slop")).sort();

function run(root: string, production: boolean) {
  const args = [script, "--root", root, ...(production ? ["--production"] : [])];
  const result = spawnSync(process.execPath, args, { encoding: "utf8" });
  const rules = [...new Set([...result.stdout.matchAll(/\[([a-z-]+)\]/g)].map((m) => m[1]))].sort();
  return { status: result.status, rules, output: result.stdout + result.stderr };
}

describe("check-slop chặn đúng từng thư mục sai mẫu (tests/slop-fixtures/check-slop)", () => {
  for (const name of cases) {
    const dir = join(fixtureDir, "check-slop", name);
    const spec = JSON.parse(readFileSync(join(dir, "expect.json"), "utf8")) as { rules: string[]; production?: boolean };
    const label = spec.rules.length ? `${name}: chỉ luật ${spec.rules.join(", ")} báo lỗi` : `${name}: sạch`;
    it(label, () => {
      const { status, rules, output } = run(dir, spec.production ?? false);
      expect(rules, output).toEqual([...spec.rules].sort());
      expect(status, output).toBe(spec.rules.length ? 1 : 0);
    });
  }

  it("có ít nhất một thư mục sai mẫu cho mỗi luật trong 14 luật", () => {
    const covered = new Set(
      cases.flatMap((name) => (JSON.parse(readFileSync(join(fixtureDir, "check-slop", name, "expect.json"), "utf8")) as { rules: string[] }).rules),
    );
    expect(covered.size).toBe(14);
  });

  it("app thật sạch ở chế độ thường", () => {
    const { status, output } = run(appRoot, false);
    expect(status, output).toBe(0);
  });
});

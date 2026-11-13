import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { appRoot } from "./fixtures";

const tsx = join(appRoot, "node_modules/tsx/dist/cli.mjs");
const run = (...args: string[]) => {
  const result = spawnSync(process.execPath, [tsx, "scripts/validate-data.ts", ...args], { cwd: appRoot, encoding: "utf8" });
  return { status: result.status, output: result.stdout + result.stderr };
};

interface RawProduct {
  sku: string;
  categorySlug: string;
  images: { src: string; alt: string }[];
  specs: { label: string; value: string }[];
}

describe("check:data (scripts/validate-data.ts)", () => {
  const broken = mkdtempSync(join(tmpdir(), "th-data-"));
  afterAll(() => rmSync(broken, { recursive: true, force: true }));

  it("xanh trên fixture", () => {
    const { status, output } = run("--data-dir", "tests/fixtures", "--image-dir", "tests/fixtures/photos");
    expect(status, output).toBe(0);
  });

  it("--production trên dữ liệu thật fail vì chưa đủ 12 sản phẩm có ảnh", () => {
    const { status, output } = run("--production");
    expect(status, output).toBe(1);
    expect(output).toContain("cần ít nhất 12");
  });

  it("bắt mã trùng, danh mục không tồn tại, ảnh thiếu file, thiếu thông số kích thước", () => {
    const products = JSON.parse(readFileSync(join(appRoot, "tests/fixtures/products.json"), "utf8")) as RawProduct[];
    const [first, second, third, fourth, fifth] = products;
    if (!first || !second || !third || !fourth || !fifth) throw new Error("fixture thiếu sản phẩm");
    second.sku = first.sku;
    third.categorySlug = "khong-co";
    fourth.images = [{ src: `/products/${fourth.sku}-9.webp`, alt: "Ảnh không có file" }];
    fifth.specs = [
      { label: "Vật liệu", value: "Thép CT3" },
      { label: "Bề mặt", value: "Mộc" },
    ];
    cpSync(join(appRoot, "tests/fixtures/categories.json"), join(broken, "categories.json"));
    writeFileSync(join(broken, "products.json"), JSON.stringify(products));

    const { status, output } = run("--data-dir", broken, "--image-dir", "tests/fixtures/photos");
    expect(status, output).toBe(1);
    expect(output).toContain(`sku "${first.sku}" trùng`);
    expect(output).toContain('categorySlug "khong-co" không tồn tại');
    expect(output).toContain("không thấy file ảnh");
    expect(output).toContain('thiếu "Kích thước" hoặc "Độ dày"');
  });
});

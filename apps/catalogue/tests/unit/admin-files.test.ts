import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { checkUpload, readData, removePublic, renamePublic, saveUpload, writeData } from "../../src/lib/admin/files";

describe("lib/admin/files trên thư mục tạm", () => {
  const dir = mkdtempSync(join(tmpdir(), "th-admin-"));
  beforeAll(() => {
    process.env.ADMIN_DATA_DIR = dir;
    process.env.ADMIN_PUBLIC_DIR = dir;
  });
  afterAll(() => {
    delete process.env.ADMIN_DATA_DIR;
    delete process.env.ADMIN_PUBLIC_DIR;
    rmSync(dir, { recursive: true, force: true });
  });

  it("ghi JSON thụt 2 dấu cách, có xuống dòng cuối, không để lại file tạm; đọc lại qua schema", async () => {
    await writeData("x.json", [{ a: 1 }]);
    expect(readFileSync(join(dir, "x.json"), "utf8")).toBe('[\n  {\n    "a": 1\n  }\n]\n');
    expect(existsSync(join(dir, "x.json.tmp"))).toBe(false);
    expect(await readData("x.json", z.array(z.object({ a: z.number() })))).toEqual([{ a: 1 }]);
    await expect(readData("x.json", z.array(z.object({ a: z.string() })))).rejects.toThrow();
  });

  it("kiểm file tải lên: loại, cỡ, rỗng", () => {
    expect(checkUpload(null)).toContain("Chọn");
    expect(checkUpload(new File([], "a.webp", { type: "image/webp" }))).toContain("Chọn");
    expect(checkUpload(new File(["x"], "a.gif", { type: "image/gif" }))).toContain("webp");
    expect(checkUpload(new File([new Uint8Array(9 * 1024 * 1024)], "a.png", { type: "image/png" }))).toContain("8 MB");
    expect(checkUpload(new File(["x"], "a.jpg", { type: "image/jpeg" }))).toBeNull();
  });

  it("lưu ảnh với tên bắt đầu bằng mã, đổi tên và xoá được", async () => {
    const src = await saveUpload("products", "TH-BL03", new File(["anh"], "goc.jpg", { type: "image/jpeg" }));
    expect(src).toMatch(/^\/products\/TH-BL03-[a-z0-9]+\.jpg$/);
    expect(readFileSync(join(dir, src), "utf8")).toBe("anh");
    const moved = src.replace("TH-BL03", "TH-BL30");
    await renamePublic(src, moved);
    expect(existsSync(join(dir, moved))).toBe(true);
    await removePublic(moved);
    expect(existsSync(join(dir, moved))).toBe(false);
  });
});

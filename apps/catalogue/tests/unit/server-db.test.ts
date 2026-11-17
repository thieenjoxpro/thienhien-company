import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { connect, prepare, readContent, writeContent, type Db } from "../../src/lib/server/db";
import { hashPassword, verifyPassword } from "../../src/lib/server/password";
import { checkLogin, throttled } from "../../src/lib/server/session";

describe("mật khẩu scrypt", () => {
  it("băm có salt riêng, kiểm đúng sai, chuỗi lạ thì từ chối", async () => {
    const a = await hashPassword("mat-khau-thu");
    const b = await hashPassword("mat-khau-thu");
    expect(a).not.toBe(b);
    expect(a).not.toContain("mat-khau-thu");
    expect(await verifyPassword("mat-khau-thu", a)).toBe(true);
    expect(await verifyPassword("sai", a)).toBe(false);
    expect(await verifyPassword("mat-khau-thu", "khong-phai-hash")).toBe(false);
  });
});

describe("database (PGlite trong bộ nhớ)", () => {
  let db: Db;
  beforeAll(async () => {
    process.env.DATABASE_URL = "pglite://memory";
    process.env.ADMIN_USERNAME = "chu-xuong";
    process.env.ADMIN_PASSWORD = "mat-khau-thu-nghiem";
    db = await connect("pglite://memory");
    (globalThis as { __thDb?: Promise<Db> }).__thDb = Promise.resolve(db);
  });
  afterAll(async () => {
    delete (globalThis as { __thDb?: Promise<Db> }).__thDb;
    delete process.env.DATABASE_URL;
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_PASSWORD;
    await db.close();
  });

  it("database mới có sẵn bốn bộ dữ liệu từ JSON đi kèm", async () => {
    for (const name of ["products.json", "categories.json", "policies.json"]) expect(Array.isArray(await readContent(name))).toBe(true);
    expect(await readContent("site.json")).toHaveProperty("showPrice");
    await expect(readContent("khong-co.json")).rejects.toThrow();
  });

  it("ghi đè rồi đọc lại; prepare chạy lại không ghi đè dữ liệu đã sửa, không tạo trùng tài khoản", async () => {
    await writeContent("policies.json", [{ slug: "a" }]);
    await prepare(db, { ADMIN_USERNAME: "nguoi-khac", ADMIN_PASSWORD: "x" });
    expect(await readContent("policies.json")).toEqual([{ slug: "a" }]);
    expect(await db.query("SELECT username FROM admin_users")).toEqual([{ username: "chu-xuong" }]);
  });

  it("tài khoản đầu tiên tạo từ biến môi trường, mật khẩu lưu dạng băm", async () => {
    const [user] = await db.query<{ password_hash: string }>("SELECT password_hash FROM admin_users");
    expect(user?.password_hash.startsWith("scrypt$")).toBe(true);
    expect(await checkLogin("chu-xuong", "mat-khau-thu-nghiem")).toBeTypeOf("number");
    expect(await checkLogin("khong-co", "mat-khau-thu-nghiem")).toBeNull();
  });

  it("sai 5 lần thì khoá tên đó 10 phút", async () => {
    for (let i = 0; i < 5; i++) expect(await checkLogin("chu-xuong", "sai")).toBeNull();
    expect(throttled("chu-xuong")).toBe(true);
    expect(throttled("chu-xuong", Date.now() + 11 * 60 * 1000)).toBe(false);
  });

  it("transaction lỗi thì không ghi gì", async () => {
    await expect(
      db.transaction(async (tx) => {
        await tx.query("UPDATE content SET data = '[]'::jsonb WHERE name = 'policies.json'");
        throw new Error("hỏng giữa chừng");
      }),
    ).rejects.toThrow("hỏng");
    expect(await readContent("policies.json")).toEqual([{ slug: "a" }]);
  });
});

// Kết nối database cho chế độ máy chủ (CATALOGUE_SERVER=1, xem docs/DEPLOY.md).
// DATABASE_URL=postgres://... dùng PostgreSQL thật (Docker, VPS).
// DATABASE_URL=pglite://<thư mục> hoặc pglite://memory dùng PGlite (Postgres nhúng) để dev và test không cần Docker.
import { mkdir } from "node:fs/promises";
import categoriesJson from "@/data/categories.json";
import policiesJson from "@/data/policies.json";
import productsJson from "@/data/products.json";
import siteJson from "@/data/site.json";
import { hashPassword } from "./password";
import { SALES_SCHEMA } from "./sales/schema";

type Row = Record<string, unknown>;
export interface Db {
  query<T extends Row = Row>(sql: string, params?: unknown[]): Promise<T[]>;
  transaction<T>(run: (tx: Pick<Db, "query">) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS content (
  name text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS admin_users (
  id serial PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash text PRIMARY KEY,
  user_id integer NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);
${SALES_SCHEMA}
`;

/** Dữ liệu ban đầu của database mới: đúng các file JSON đi kèm bản build. */
const SEED: Record<string, unknown> = {
  "products.json": productsJson,
  "categories.json": categoriesJson,
  "policies.json": policiesJson,
  "site.json": siteJson,
};

async function connectPostgres(url: string): Promise<Db> {
  const { Pool } = await import("pg");
  const pool = new Pool({ connectionString: url, max: 5 });
  return {
    query: async (sql, params) => (await pool.query(sql, params)).rows,
    transaction: async (run) => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await run({ query: async (sql, params) => (await client.query(sql, params)).rows });
        await client.query("COMMIT");
        return result;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    close: () => pool.end(),
  };
}

async function connectPglite(url: string): Promise<Db> {
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = url.slice("pglite://".length);
  if (dir !== "memory") await mkdir(dir, { recursive: true });
  const lite = new PGlite(dir === "memory" ? undefined : dir);
  return {
    query: async (sql, params) => (await lite.query(sql, params)).rows as never,
    transaction: (run) => lite.transaction((tx) => run({ query: async (sql, params) => (await tx.query(sql, params)).rows as never })) as never,
    close: () => lite.close(),
  };
}

/** Tạo bảng, nạp dữ liệu ban đầu, tạo tài khoản quản trị đầu tiên từ ADMIN_USERNAME, ADMIN_PASSWORD. */
export async function prepare(db: Db, env: Record<string, string | undefined> = process.env): Promise<void> {
  for (const statement of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) await db.query(statement);
  for (const [name, data] of Object.entries(SEED)) {
    await db.query("INSERT INTO content (name, data) VALUES ($1, $2::jsonb) ON CONFLICT (name) DO NOTHING", [name, JSON.stringify(data)]);
  }
  const [{ count } = { count: 0 }] = await db.query<{ count: number }>("SELECT count(*)::int AS count FROM admin_users");
  if (count === 0 && env.ADMIN_USERNAME && env.ADMIN_PASSWORD) {
    await db.query("INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)", [env.ADMIN_USERNAME, await hashPassword(env.ADMIN_PASSWORD)]);
  }
}

export async function connect(url: string): Promise<Db> {
  const db = url.startsWith("pglite://") ? await connectPglite(url) : await connectPostgres(url);
  await prepare(db);
  return db;
}

// Một kết nối cho cả tiến trình; để trên globalThis vì Next có thể nạp module này ở nhiều bundle.
const shared = globalThis as { __thDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Chế độ máy chủ cần DATABASE_URL");
  shared.__thDb ??= connect(url).catch((error) => {
    delete shared.__thDb; // lần gọi sau thử lại, không giữ kết nối hỏng
    throw error;
  });
  return shared.__thDb;
}

export async function readContent(name: string): Promise<unknown> {
  const [row] = await (await getDb()).query<{ data: unknown }>("SELECT data FROM content WHERE name = $1", [name]);
  if (!row) throw new Error(`Không có dữ liệu "${name}" trong database`);
  return row.data;
}

export async function writeContent(name: string, data: unknown): Promise<void> {
  await (await getDb()).query(
    "INSERT INTO content (name, data) VALUES ($1, $2::jsonb) ON CONFLICT (name) DO UPDATE SET data = EXCLUDED.data, updated_at = now()",
    [name, JSON.stringify(data)],
  );
}

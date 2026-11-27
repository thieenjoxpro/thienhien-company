// Tồn kho theo SKU, mặt hàng bán chạy, ngữ cảnh của khách khi chọn ở màn bán hàng.
import type { CustomerContext } from "@/lib/sales/types";
import { getDb } from "../db";
import { debtOf } from "./customers";

export async function stockMap(): Promise<Record<string, number>> {
  const rows = await (await getDb()).query<{ sku: string; quantity: number }>("SELECT sku, quantity::float8 AS quantity FROM stock");
  return Object.fromEntries(rows.map((r) => [r.sku, r.quantity]));
}

export async function setStock(sku: string, quantity: number): Promise<void> {
  await (await getDb()).query(
    "INSERT INTO stock (sku, quantity) VALUES ($1, $2) ON CONFLICT (sku) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now()",
    [sku, quantity],
  );
}

/** Mặt hàng bán chạy theo tổng số lượng 60 ngày gần đây. */
export async function topSkus(limit = 8): Promise<string[]> {
  const rows = await (await getDb()).query<{ sku: string }>(
    `SELECT i.sku FROM order_items i JOIN orders o ON o.id = i.order_id
     WHERE o.cancelled_at IS NULL AND o.created_at > now() - interval '60 days'
     GROUP BY i.sku ORDER BY sum(i.quantity) DESC, max(o.created_at) DESC LIMIT $1`,
    [limit],
  );
  return rows.map((r) => r.sku);
}

export async function customerContext(customerId: number): Promise<CustomerContext> {
  const db = await getDb();
  const prices = await db.query<{ sku: string; price: number }>(
    `SELECT DISTINCT ON (i.sku) i.sku, i.unit_price::float8 AS price
     FROM order_items i JOIN orders o ON o.id = i.order_id
     WHERE o.customer_id = $1 AND o.cancelled_at IS NULL ORDER BY i.sku, o.created_at DESC`,
    [customerId],
  );
  const [last] = await db.query<{ id: number; createdAt: Date | string }>(
    `SELECT id, created_at AS "createdAt" FROM orders WHERE customer_id = $1 AND cancelled_at IS NULL ORDER BY created_at DESC, id DESC LIMIT 1`,
    [customerId],
  );
  const lines = last
    ? await db.query<{ sku: string; quantity: number; unitPrice: number }>(
        `SELECT sku, quantity::float8 AS quantity, unit_price::float8 AS "unitPrice" FROM order_items WHERE order_id = $1 ORDER BY line`,
        [last.id],
      )
    : [];
  return {
    debt: await debtOf(customerId, undefined, db),
    lastPrices: Object.fromEntries(prices.map((p) => [p.sku, p.price])),
    lastOrder: last ? { id: last.id, createdAt: new Date(last.createdAt).toISOString(), lines } : null,
  };
}


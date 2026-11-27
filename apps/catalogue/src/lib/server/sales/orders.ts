// Lưu, đọc, huỷ đơn. Tiền là số nguyên đồng; nợ cũ của đơn tính theo created_at < created_at của đơn.
import type { Product } from "@/lib/schema";
import { orderTotals, validateOrder, type OrderErrors, type OrderInput } from "@/lib/sales/order";
import { getDb } from "../db";
import { debtOf, getCustomer, type Customer } from "./customers";
import { iso } from "./sql";
import { stockMap } from "./stock";

export type CreateResult = { ok: true; id: number; warnings: string[] } | { ok: false; errors: OrderErrors };

/**
 * Lưu đơn trong một transaction: đơn, các dòng, trừ tồn, khoản trả ngay (cùng created_at với đơn).
 * Tổng tiền máy chủ tự tính; tên, đơn vị lấy từ catalogue. Bán vượt tồn vẫn lưu, trả cảnh báo.
 */
export async function createOrder(input: OrderInput, products: Product[], user: string | null, now = new Date()): Promise<CreateResult> {
  const errors = validateOrder(input);
  const bySku = new Map(products.map((p) => [p.sku, p]));
  const lines = input.lines.flatMap((line, i) => {
    const product = bySku.get(line.sku);
    if (!product) errors[`line-${i}-quantity`] ??= "Mặt hàng này không còn trong danh sách.";
    return product ? [{ ...line, product }] : [];
  });
  const db = await getDb();
  const customer = input.customerId ? await getCustomer(input.customerId) : null;
  if (input.customerId && !customer) errors.customer = "Không tìm thấy khách này.";
  if (!customer || Object.keys(errors).length) return { ok: false, errors };

  const { subtotal, total } = orderTotals(input.lines, input.discount, input.paid);
  const createdAt = now.toISOString();
  const stock = await stockMap();
  const warnings = lines.flatMap((line) => {
    const have = stock[line.sku] ?? 0;
    return line.quantity > have ? [`${line.product.name}: bán ${line.quantity}, kho chỉ còn ${have}.`] : [];
  });

  const id = await db.transaction(async (tx) => {
    const [order] = await tx.query<{ id: number }>(
      `INSERT INTO orders (customer_id, created_at, subtotal, discount, total, paid, note, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [customer.id, createdAt, subtotal, input.discount, total, input.paid, input.note?.trim() || null, user],
    );
    if (!order) throw new Error("Không tạo được đơn");
    const orderId = order.id;
    for (const [i, { product, ...line }] of lines.entries()) {
      await tx.query(
        "INSERT INTO order_items (order_id, line, sku, name, unit, quantity, unit_price, amount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [orderId, i + 1, line.sku, product.name, product.unit, line.quantity, line.unitPrice, Math.round(line.quantity * line.unitPrice)],
      );
      await tx.query(
        "INSERT INTO stock (sku, quantity) VALUES ($1, -$2::numeric) ON CONFLICT (sku) DO UPDATE SET quantity = stock.quantity - $2::numeric, updated_at = now()",
        [line.sku, line.quantity],
      );
    }
    if (input.paid > 0) {
      await tx.query("INSERT INTO payments (customer_id, order_id, amount, note, created_at) VALUES ($1, $2, $3, $4, $5)", [
        customer.id,
        orderId,
        input.paid,
        "Trả khi mua",
        createdAt,
      ]);
    }
    return orderId;
  });
  return { ok: true, id, warnings };
}

export interface OrderLine {
  line: number;
  sku: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface OrderDetail {
  id: number;
  createdAt: string;
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  note: string | null;
  createdBy: string | null;
  cancelledAt: string | null;
  customer: Customer;
  lines: OrderLine[];
  /** Nợ trước đơn này (chỉ tính phát sinh trước created_at của đơn). */
  debtBefore: number;
}

export async function getOrder(id: number): Promise<OrderDetail | null> {
  if (!Number.isInteger(id) || id <= 0 || id > 2_147_483_647) return null;
  const db = await getDb();
  const [row] = await db.query<Record<string, unknown>>(
    `SELECT o.id, o.created_at AS "createdAt", o.subtotal::float8 AS subtotal, o.discount::float8 AS discount, o.total::float8 AS total,
       o.paid::float8 AS paid, o.note, o.created_by AS "createdBy", o.cancelled_at AS "cancelledAt", o.customer_id AS "customerId"
     FROM orders o WHERE o.id = $1`,
    [id],
  );
  if (!row) return null;
  const customer = await getCustomer(row.customerId as number);
  const createdAt = iso(row.createdAt);
  if (!customer || !createdAt) return null;
  const lines = await db.query<OrderLine & Record<string, unknown>>(
    `SELECT line, sku, name, unit, quantity::float8 AS quantity, unit_price::float8 AS "unitPrice", amount::float8 AS amount
     FROM order_items WHERE order_id = $1 ORDER BY line`,
    [id],
  );
  return {
    id,
    createdAt,
    subtotal: row.subtotal as number,
    discount: row.discount as number,
    total: row.total as number,
    paid: row.paid as number,
    note: (row.note as string | null) ?? null,
    createdBy: (row.createdBy as string | null) ?? null,
    cancelledAt: iso(row.cancelledAt),
    customer,
    lines,
    debtBefore: await debtOf(customer.id, createdAt, db),
  };
}

/** Huỷ đơn: giữ lại để tra, không tính vào nợ, trả hàng về kho. Đã huỷ rồi thì thôi. */
export async function cancelOrder(id: number): Promise<boolean> {
  return (await getDb()).transaction(async (tx) => {
    const [row] = await tx.query<{ id: number }>("UPDATE orders SET cancelled_at = now() WHERE id = $1 AND cancelled_at IS NULL RETURNING id", [id]);
    if (!row) return false;
    await tx.query(
      `UPDATE stock s SET quantity = s.quantity + i.quantity, updated_at = now()
       FROM (SELECT sku, sum(quantity) AS quantity FROM order_items WHERE order_id = $1 GROUP BY sku) i WHERE s.sku = i.sku`,
      [id],
    );
    return true;
  });
}

// Bán hàng: khách, tồn kho, đơn, thanh toán, sổ nợ. Chỉ chạy khi có database (DATABASE_URL).
// Tiền là số nguyên đồng (bigint trong database); mọi câu SELECT ép về float8 để pg và PGlite cùng trả number.
// Nợ của khách = tổng tiền các đơn chưa huỷ - tổng tiền đã trả (trừ khoản trả ngay của đơn đã huỷ).
// Nợ cũ của một đơn tính theo created_at < created_at của đơn; khoản trả ngay có created_at bằng của đơn.
import type { OrderErrors } from "@/lib/sales/order";
import type { CustomerKind } from "@/lib/sales/types";
import { getDb } from "../db";
import { CUSTOMER_COLUMNS, LIVE_PAYMENTS, type Query } from "./sql";

export const salesEnabled = () => Boolean(process.env.DATABASE_URL);


export interface Customer {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  kind: CustomerKind;
  walkIn: boolean;
}

export interface CustomerWithDebt extends Customer {
  debt: number;
  orderCount: number;
}


/** Nợ của khách tính tới trước thời điểm `before` (không truyền: tới bây giờ). */
export async function debtOf(customerId: number, before?: string, q: Query | null = null): Promise<number> {
  const db = q ?? (await getDb());
  const params: unknown[] = [customerId];
  const cut = before ? (params.push(before), "AND created_at < $2") : "";
  const cutP = before ? "AND p.created_at < $2" : "";
  const [row] = await db.query<{ debt: number }>(
    `SELECT (
       COALESCE((SELECT sum(total) FROM orders WHERE customer_id = $1 AND cancelled_at IS NULL ${cut}), 0)
       - COALESCE((SELECT sum(p.amount) FROM ${LIVE_PAYMENTS} AND p.customer_id = $1 ${cutP}), 0)
     )::float8 AS debt`,
    params,
  );
  return row?.debt ?? 0;
}

export async function listCustomers(): Promise<CustomerWithDebt[]> {
  return (await getDb()).query<CustomerWithDebt & Record<string, unknown>>(
    `SELECT ${CUSTOMER_COLUMNS},
       (COALESCE(o.total, 0) - COALESCE(p.paid, 0))::float8 AS debt,
       COALESCE(o.n, 0)::int AS "orderCount"
     FROM customers c
     LEFT JOIN (SELECT customer_id, sum(total) AS total, count(*) AS n FROM orders WHERE cancelled_at IS NULL GROUP BY customer_id) o ON o.customer_id = c.id
     LEFT JOIN (SELECT p.customer_id, sum(p.amount) AS paid FROM ${LIVE_PAYMENTS} GROUP BY p.customer_id) p ON p.customer_id = c.id
     ORDER BY c.walk_in DESC, c.name`,
  );
}

/** Khách hay mua nhất theo số đơn 60 ngày gần đây; Khách lẻ luôn đứng đầu. Thiếu thì thêm khách mới tạo gần đây. */
export async function frequentCustomerIds(limit = 8): Promise<number[]> {
  const rows = await (await getDb()).query<{ id: number }>(
    `SELECT c.id FROM customers c
     LEFT JOIN (SELECT customer_id, count(*) AS n, max(created_at) AS last FROM orders
                WHERE cancelled_at IS NULL AND created_at > now() - interval '60 days' GROUP BY customer_id) o ON o.customer_id = c.id
     ORDER BY c.walk_in DESC, COALESCE(o.n, 0) DESC, o.last DESC NULLS LAST, c.created_at DESC
     LIMIT $1`,
    [limit],
  );
  return rows.map((r) => r.id);
}

export async function getCustomer(id: number): Promise<Customer | null> {
  const [row] = await (await getDb()).query<Customer & Record<string, unknown>>(`SELECT ${CUSTOMER_COLUMNS} FROM customers c WHERE c.id = $1`, [id]);
  return row ?? null;
}

export interface NewCustomer {
  name: string;
  phone: string | null;
  address: string | null;
  kind: CustomerKind;
}

export function checkCustomer(input: NewCustomer): OrderErrors {
  const errors: OrderErrors = {};
  if (input.name.trim().length < 2) errors.name = "Nhập tên khách, ít nhất 2 chữ.";
  if (input.phone && !/^[0-9 .+]{8,15}$/.test(input.phone)) errors.phone = "Số điện thoại chỉ gồm chữ số, 8 đến 15 số.";
  return errors;
}

export async function createCustomer(input: NewCustomer): Promise<number> {
  const [row] = await (await getDb()).query<{ id: number }>(
    "INSERT INTO customers (name, phone, address, kind) VALUES ($1, $2, $3, $4) RETURNING id",
    [input.name.trim(), input.phone?.trim() || null, input.address?.trim() || null, input.kind],
  );
  if (!row) throw new Error("Không tạo được khách");
  return row.id;
}

export async function updateCustomer(id: number, input: NewCustomer): Promise<void> {
  await (await getDb()).query("UPDATE customers SET name = $2, phone = $3, address = $4, kind = $5 WHERE id = $1 AND NOT walk_in", [
    id,
    input.name.trim(),
    input.phone?.trim() || null,
    input.address?.trim() || null,
    input.kind,
  ]);
}


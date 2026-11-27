// Danh sách đơn có lọc theo ngày (giờ Việt Nam), trạng thái, khách, chữ tìm.
import { matchCustomer } from "@/lib/sales/search";
import { getDb } from "../db";
import { iso } from "./sql";

export interface OrderFilter {
  q?: string;
  from?: string; // yyyy-mm-dd, giờ Việt Nam
  to?: string;
  status?: "" | "ok" | "huy";
  customerId?: number;
}

export interface OrderRow {
  id: number;
  createdAt: string;
  customerName: string;
  customerId: number;
  total: number;
  paid: number;
  lineCount: number;
  cancelled: boolean;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

type Params = Record<string, string | string[] | undefined> | URLSearchParams;

/** Bộ lọc từ query (?q=&from=&to=&status=): trang danh sách đơn và file Excel dùng cùng một cách đọc. */
export function orderFilterFrom(params: Params): Required<Pick<OrderFilter, "q" | "from" | "to" | "status">> {
  const get = (key: string) => {
    const value = params instanceof URLSearchParams ? params.get(key) : params[key];
    return typeof value === "string" ? value.trim() : "";
  };
  const status = get("status");
  return {
    q: get("q").slice(0, 60),
    from: DATE.test(get("from")) ? get("from") : "",
    to: DATE.test(get("to")) ? get("to") : "",
    status: status === "ok" || status === "huy" ? status : "",
  };
}

export async function listOrders(filter: OrderFilter = {}, limit = 500): Promise<OrderRow[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  const add = (sql: string, value: unknown) => {
    params.push(value);
    where.push(sql.replace("?", `$${params.length}`));
  };
  if (filter.from && DATE.test(filter.from)) add("o.created_at >= (?::date)::timestamp AT TIME ZONE 'Asia/Ho_Chi_Minh'", filter.from);
  if (filter.to && DATE.test(filter.to)) add("o.created_at < ((?::date) + 1)::timestamp AT TIME ZONE 'Asia/Ho_Chi_Minh'", filter.to);
  if (filter.status === "ok") where.push("o.cancelled_at IS NULL");
  if (filter.status === "huy") where.push("o.cancelled_at IS NOT NULL");
  if (filter.customerId) add("o.customer_id = ?", filter.customerId);
  params.push(limit);
  const rows = await (await getDb()).query<Record<string, unknown>>(
    `SELECT o.id, o.created_at AS "createdAt", c.name AS "customerName", c.id AS "customerId", c.phone,
       o.total::float8 AS total, o.paid::float8 AS paid, o.cancelled_at IS NOT NULL AS cancelled,
       (SELECT count(*)::int FROM order_items i WHERE i.order_id = o.id) AS "lineCount"
     FROM orders o JOIN customers c ON c.id = o.customer_id
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY o.created_at DESC, o.id DESC LIMIT $${params.length}`,
    params,
  );
  const q = filter.q?.trim() ?? "";
  return rows
    .filter((r) => !q || matchCustomer({ name: r.customerName as string, phone: r.phone as string | null }, q) || String(r.id) === q.replace(/\D/g, "").replace(/^0+/, ""))
    .map((r) => ({
      id: r.id as number,
      createdAt: iso(r.createdAt) ?? "",
      customerName: r.customerName as string,
      customerId: r.customerId as number,
      total: r.total as number,
      paid: r.paid as number,
      lineCount: r.lineCount as number,
      cancelled: Boolean(r.cancelled),
    }));
}


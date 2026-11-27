// Mảnh SQL dùng chung của phần bán hàng.
import type { Db } from "../db";

export type Query = Pick<Db, "query">;

export const CUSTOMER_COLUMNS = 'c.id, c.name, c.phone, c.address, c.kind, c.walk_in AS "walkIn"';

// Khoản thanh toán còn hiệu lực: trả nợ riêng, hoặc trả ngay của đơn chưa huỷ
export const LIVE_PAYMENTS = "payments p LEFT JOIN orders po ON po.id = p.order_id WHERE (p.order_id IS NULL OR po.cancelled_at IS NULL)";

export const iso = (value: unknown) => (value ? new Date(value as string).toISOString() : null);

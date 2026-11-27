// Thu nợ và sổ nợ luỹ kế của khách.
import { receiptCode } from "@/lib/sales/order";
import { getDb } from "../db";
import { LIVE_PAYMENTS } from "./sql";

export async function addPayment(customerId: number, amount: number, note: string | null, now = new Date()): Promise<void> {
  await (await getDb()).query("INSERT INTO payments (customer_id, amount, note, created_at) VALUES ($1, $2, $3, $4)", [
    customerId,
    amount,
    note?.trim() || null,
    now.toISOString(),
  ]);
}

export interface LedgerRow {
  date: string;
  text: string;
  orderId: number | null;
  /** Phát sinh nợ (tiền đơn). */
  debit: number;
  /** Đã trả. */
  credit: number;
  balance: number;
}

/** Sổ nợ luỹ kế của khách, cũ trước mới sau. Đơn đã huỷ không vào sổ. */
export async function ledger(customerId: number): Promise<LedgerRow[]> {
  const rows = await (await getDb()).query<{ date: Date | string; kind: string; orderId: number | null; amount: number; note: string | null }>(
    `SELECT created_at AS date, 'don' AS kind, id AS "orderId", total::float8 AS amount, NULL AS note
       FROM orders WHERE customer_id = $1 AND cancelled_at IS NULL
     UNION ALL
     SELECT p.created_at, 'tra', p.order_id, p.amount::float8, p.note FROM ${LIVE_PAYMENTS} AND p.customer_id = $1
     ORDER BY 1, 2`,
    [customerId],
  );
  let balance = 0;
  return rows.map((r) => {
    const isOrder = r.kind === "don";
    balance += isOrder ? r.amount : -r.amount;
    const code = r.orderId ? receiptCode(r.orderId) : "";
    return {
      date: new Date(r.date).toISOString(),
      text: isOrder ? `Mua hàng, phiếu ${code}` : r.orderId ? `Trả khi mua, phiếu ${code}` : (r.note ?? "Trả nợ"),
      orderId: r.orderId,
      debit: isOrder ? r.amount : 0,
      credit: isOrder ? 0 : r.amount,
      balance,
    };
  });
}

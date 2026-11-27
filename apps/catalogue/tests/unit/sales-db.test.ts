import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { ProductSchema } from "../../src/lib/schema";
import { connect, type Db } from "../../src/lib/server/db";
import { createCustomer, debtOf, frequentCustomerIds, listCustomers } from "../../src/lib/server/sales/customers";
import { addPayment, ledger } from "../../src/lib/server/sales/ledger";
import { listOrders } from "../../src/lib/server/sales/order-list";
import { cancelOrder, createOrder, getOrder } from "../../src/lib/server/sales/orders";
import { customerContext, setStock, stockMap, topSkus } from "../../src/lib/server/sales/stock";
import fixtureProducts from "../fixtures/products.json";

const products = z.array(ProductSchema).parse(fixtureProducts);
const [a, b, c] = products as [(typeof products)[number], (typeof products)[number], (typeof products)[number]];

describe("bán hàng trên database (PGlite)", () => {
  let db: Db;
  let walkIn: number;
  let hung: number;
  beforeAll(async () => {
    process.env.DATABASE_URL = "pglite://memory";
    db = await connect("pglite://memory");
    (globalThis as { __thDb?: Promise<Db> }).__thDb = Promise.resolve(db);
    const [row] = await db.query<{ id: number }>("SELECT id FROM customers WHERE walk_in");
    walkIn = row?.id ?? 0;
    hung = await createCustomer({ name: "Anh Hùng", phone: "0901 234 567", address: "Bình Tân", kind: "si" });
  });
  afterAll(async () => {
    delete (globalThis as { __thDb?: Promise<Db> }).__thDb;
    delete process.env.DATABASE_URL;
    await db.close();
  });

  it("database mới có sẵn đúng một Khách lẻ", async () => {
    const customers = await listCustomers();
    expect(customers.filter((x) => x.walkIn)).toHaveLength(1);
    expect(customers[0]).toMatchObject({ name: "Khách lẻ", kind: "le", debt: 0 });
  });

  it("máy chủ tự tính tổng, trừ tồn, ghi khoản trả ngay cùng thời điểm với đơn", async () => {
    await setStock(a.sku, 10);
    const t1 = new Date("2026-11-01T03:00:00Z");
    const result = await createOrder(
      { customerId: hung, lines: [{ sku: a.sku, quantity: 4, unitPrice: 250_000 }, { sku: b.sku, quantity: 1.5, unitPrice: 100_001 }], discount: 50_000, paid: 500_000 },
      products,
      "chu-xuong",
      t1,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings).toEqual([expect.stringContaining(b.name)]); // b chưa có tồn
    const order = await getOrder(result.id);
    expect(order).toMatchObject({ subtotal: 1_150_002, discount: 50_000, total: 1_100_002, paid: 500_000, debtBefore: 0 });
    expect(order?.lines.map((l) => [l.name, l.unit, l.quantity, l.amount])).toEqual([
      [a.name, a.unit, 4, 1_000_000],
      [b.name, b.unit, 1.5, 150_002],
    ]);
    expect(await stockMap()).toMatchObject({ [a.sku]: 6, [b.sku]: -1.5 });
    const [payment] = await db.query<{ created_at: Date }>("SELECT created_at FROM payments WHERE order_id = $1", [result.id]);
    expect(new Date(payment?.created_at ?? 0).toISOString()).toBe(t1.toISOString());
    expect(await debtOf(hung)).toBe(600_002);
  });

  it("nợ cũ của đơn sau tính đúng phát sinh trước nó, không gồm khoản trả ngay của chính đơn", async () => {
    const result = await createOrder({ customerId: hung, lines: [{ sku: c.sku, quantity: 2, unitPrice: 50_000 }], discount: 0, paid: 100_000 }, products, null, new Date("2026-11-02T03:00:00Z"));
    if (!result.ok) throw new Error("không lưu được");
    const order = await getOrder(result.id);
    expect(order?.debtBefore).toBe(600_002);
    expect(await debtOf(hung)).toBe(600_002);
  });

  it("lỗi kiểm đơn trả về theo ô, không ghi gì", async () => {
    const before = (await listOrders()).length;
    const result = await createOrder({ customerId: null, lines: [{ sku: "TH-XX99", quantity: 0, unitPrice: 1 }], discount: 0, paid: 0 }, products, null);
    expect(result).toEqual({ ok: false, errors: expect.objectContaining({ customer: expect.any(String), "line-0-quantity": "Số lượng phải lớn hơn 0." }) });
    expect(await listOrders()).toHaveLength(before);
  });

  it("ngữ cảnh khách: nợ, giá lần trước, đơn gần nhất", async () => {
    const ctx = await customerContext(hung);
    expect(ctx.debt).toBe(600_002);
    expect(ctx.lastPrices).toMatchObject({ [a.sku]: 250_000, [c.sku]: 50_000 });
    expect(ctx.lastOrder?.lines).toEqual([{ sku: c.sku, quantity: 2, unitPrice: 50_000 }]);
  });

  it("huỷ đơn: trả hàng về kho, không tính nợ, khoản trả ngay của đơn cũng bỏ", async () => {
    const result = await createOrder({ customerId: hung, lines: [{ sku: a.sku, quantity: 1, unitPrice: 300_000 }], discount: 0, paid: 100_000 }, products, null, new Date("2026-11-03T03:00:00Z"));
    if (!result.ok) throw new Error("không lưu được");
    expect(await debtOf(hung)).toBe(800_002);
    expect(await cancelOrder(result.id)).toBe(true);
    expect(await cancelOrder(result.id)).toBe(false);
    expect(await debtOf(hung)).toBe(600_002);
    expect((await stockMap())[a.sku]).toBe(6);
    expect((await listOrders({ status: "huy" })).map((o) => o.id)).toEqual([result.id]);
  });

  it("trả nợ riêng vào sổ, số dư luỹ kế đúng", async () => {
    await addPayment(hung, 200_002, "Trả nợ tiền mặt", new Date("2026-11-04T03:00:00Z"));
    const rows = await ledger(hung);
    expect(rows.map((r) => [r.debit, r.credit, r.balance])).toEqual([
      [1_100_002, 0, 1_100_002],
      [0, 500_000, 600_002],
      [100_000, 0, 700_002],
      [0, 100_000, 600_002],
      [0, 200_002, 400_000],
    ]);
    expect(rows.at(-1)?.text).toBe("Trả nợ tiền mặt");
    expect((await listCustomers()).find((x) => x.id === hung)?.debt).toBe(400_000);
  });

  it("lọc đơn theo ngày giờ Việt Nam và tìm theo tên không dấu, số điện thoại", async () => {
    // 2026-11-01T03:00Z là 10 giờ sáng 1/11 giờ Việt Nam
    expect(await listOrders({ from: "2026-11-01", to: "2026-11-01" })).toHaveLength(1);
    expect(await listOrders({ q: "anh hung", status: "ok" })).toHaveLength(2);
    expect(await listOrders({ q: "234567" })).toHaveLength(3);
    expect(await listOrders({ q: "khach le" })).toHaveLength(0);
  });

  it("khách quen và hàng bán chạy chỉ tính 60 ngày gần đây; Khách lẻ luôn đầu", async () => {
    const old = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const d = products[3] as (typeof products)[number];
    await createOrder({ customerId: walkIn, lines: [{ sku: d.sku, quantity: 100, unitPrice: 1000 }], discount: 0, paid: 100_000 }, products, null, old);
    await createOrder({ customerId: walkIn, lines: [{ sku: b.sku, quantity: 1, unitPrice: 10_000 }], discount: 0, paid: 10_000 }, products, null);
    expect((await frequentCustomerIds())[0]).toBe(walkIn);
    // a bán 4 (đơn huỷ không tính), b 1,5 + 1, c 2; d bán 100 nhưng đã 90 ngày
    expect(await topSkus()).toEqual([a.sku, b.sku, c.sku]);
  });
});

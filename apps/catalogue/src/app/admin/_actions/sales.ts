"use server";

// Server action của màn bán hàng. Mọi action kiểm phiên trước; máy chủ tự tính tổng tiền.
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin/guard";
import { loadProducts } from "@/lib/admin/repo";
import type { OrderErrors, OrderInput } from "@/lib/sales/order";
import type { CustomerContext, CustomerKind, SaleCustomer } from "@/lib/sales/types";
import { checkCustomer, createCustomer, salesEnabled } from "@/lib/server/sales/customers";
import { createOrder } from "@/lib/server/sales/orders";
import { customerContext } from "@/lib/server/sales/stock";
import { currentUser } from "@/lib/server/sales/user";

async function guard() {
  await assertAdmin();
  if (!salesEnabled()) throw new Error("Bán hàng cần database (DATABASE_URL)");
}

export async function loadCustomerContext(customerId: number): Promise<CustomerContext> {
  await guard();
  return customerContext(customerId);
}

export type SubmitResult = { ok: true; id: number; warnings: string[] } | { ok: false; errors: OrderErrors };

export async function submitOrder(input: OrderInput): Promise<SubmitResult> {
  await guard();
  // chỉ nhận đúng các trường cần, kiểu số; tổng tiền không nhận từ client
  const clean: OrderInput = {
    customerId: Number(input.customerId) || null,
    lines: (Array.isArray(input.lines) ? input.lines : []).slice(0, 200).map((l) => ({ sku: String(l.sku), quantity: Number(l.quantity), unitPrice: Number(l.unitPrice) })),
    discount: Number(input.discount) || 0,
    paid: Number(input.paid) || 0,
    note: typeof input.note === "string" ? input.note.slice(0, 200) : "",
  };
  const result = await createOrder(clean, await loadProducts(), await currentUser());
  if (result.ok) revalidatePath("/admin", "layout");
  return result;
}

export type NewCustomerResult = { ok: true; customer: SaleCustomer } | { ok: false; errors: OrderErrors };

/** Thêm khách ngay trên màn bán hàng, không rời màn. */
export async function addCustomer(input: { name: string; phone: string; kind: CustomerKind }): Promise<NewCustomerResult> {
  await guard();
  const data = { name: String(input.name ?? ""), phone: String(input.phone ?? "").trim() || null, address: null, kind: input.kind === "le" ? ("le" as const) : ("si" as const) };
  const errors = checkCustomer(data);
  if (Object.keys(errors).length) return { ok: false, errors };
  const id = await createCustomer(data);
  return { ok: true, customer: { id, name: data.name.trim(), phone: data.phone, kind: data.kind, walkIn: false } };
}

"use server";

// Server action của trang đơn, khách, kho: huỷ đơn, thu nợ, sửa khách, đặt tồn kho.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { failed, formValues, type FormState } from "@/lib/admin/form";
import { assertAdmin } from "@/lib/admin/guard";
import { parseMoney, parseQuantity } from "@/lib/sales/money";
import { checkCustomer, createCustomer, salesEnabled, updateCustomer, type NewCustomer } from "@/lib/server/sales/customers";
import { addPayment } from "@/lib/server/sales/ledger";
import { cancelOrder } from "@/lib/server/sales/orders";
import { setStock } from "@/lib/server/sales/stock";

async function guard() {
  await assertAdmin();
  if (!salesEnabled()) throw new Error("Bán hàng cần database (DATABASE_URL)");
}

export async function cancelOrderAction(formData: FormData): Promise<void> {
  await guard();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) await cancelOrder(id);
  revalidatePath("/admin", "layout");
  redirect(`/admin/don-hang/${id}`);
}

const customerFrom = (values: Record<string, string>): NewCustomer => ({
  name: values.name ?? "",
  phone: values.phone?.trim() || null,
  address: values.address?.trim() || null,
  kind: values.kind === "le" ? "le" : "si",
});

export async function saveCustomerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await guard();
  const values = formValues(formData);
  const data = customerFrom(values);
  const errors = checkCustomer(data);
  if (Object.keys(errors).length) return failed(errors, values);
  const id = Number(values.id);
  if (Number.isInteger(id) && id > 0) await updateCustomer(id, data);
  const target = Number.isInteger(id) && id > 0 ? id : await createCustomer(data);
  revalidatePath("/admin", "layout");
  redirect(`/admin/khach-hang/${target}?luu=1`);
}

export async function addPaymentAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await guard();
  const values = formValues(formData);
  const amount = parseMoney(values.amount ?? "");
  if (amount <= 0) return failed({ amount: "Nhập số tiền khách trả, lớn hơn 0." }, values);
  const id = Number(values.customerId);
  await addPayment(id, amount, values.note?.trim() || "Trả nợ");
  revalidatePath("/admin", "layout");
  redirect(`/admin/khach-hang/${id}?thu=1`);
}

export async function saveStockAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await guard();
  const values = formValues(formData);
  const quantity = parseQuantity(values.quantity ?? "");
  if (!Number.isFinite(quantity)) return failed({ [`q-${values.sku}`]: "Số tồn chưa đúng. Ví dụ: 120 hoặc 12,5." }, values);
  await setStock(String(values.sku), quantity);
  revalidatePath("/admin", "layout");
  redirect(`/admin/kho?luu=1#${values.sku}`);
}

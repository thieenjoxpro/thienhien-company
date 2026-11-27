"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { submitOrder } from "@/app/admin/_actions/sales";
import { Button } from "@/components/ui/Button";
import { draftKey } from "@/lib/sales/draft";
import { appendThousand, moneyText } from "@/lib/sales/money";
import { validateOrder, type OrderErrors } from "@/lib/sales/order";
import { saleNumbers, toOrderInput, type SaleState } from "@/lib/sales/sale-state";
import { suggestPrice, type SaleCustomer, type SaleProduct } from "@/lib/sales/types";
import { CustomerPicker } from "./CustomerPicker";
import { PaymentBox } from "./PaymentBox";
import { ProductPicker } from "./ProductPicker";
import { SaleBar } from "./SaleBar";
import { SaleLineRow } from "./SaleLineRow";
import { useCustomerContext, useSaleState } from "./use-sale";

interface Props {
  products: SaleProduct[];
  customers: SaleCustomer[];
  frequent: SaleCustomer[];
  top: SaleProduct[];
  user: string;
  /** Tạo lại từ đơn cũ (?tu=). */
  initial: SaleState | null;
}

/** Màn bán hàng: Khách, Hàng, Tiền, nút chốt. Một màn, không hộp thoại, không bước. */
export function SaleScreen({ products, customers: initialCustomers, frequent, top, user, initial }: Props) {
  const router = useRouter();
  const { state, dispatch, restored, discard, finish } = useSaleState(draftKey(user), initial);
  const [customers, setCustomers] = useState(initialCustomers);
  const [tried, setTried] = useState(false);
  const [serverErrors, setServerErrors] = useState<OrderErrors>({});
  const [saving, setSaving] = useState(false);
  const context = useCustomerContext(state.customerId);
  const bySku = new Map(products.map((p) => [p.sku, p]));
  const customer = customers.find((c) => c.id === state.customerId) ?? null;
  const numbers = saleNumbers(state);
  const errors = tried ? { ...validateOrder(toOrderInput(state)), ...serverErrors } : {};
  const priceOf = (p: SaleProduct) => suggestPrice(p, customer?.kind ?? null, context?.lastPrices ?? {});

  useEffect(() => setServerErrors({}), [state]);

  const pick = (c: SaleCustomer) => {
    if (!customers.some((x) => x.id === c.id)) setCustomers([...customers, c]);
    dispatch({ type: "customer", id: c.id, paidMode: c.kind === "le" ? "full" : "none" });
  };
  const repeat = () => {
    const lines = (context?.lastOrder?.lines ?? []).flatMap((l) => {
      const p = bySku.get(l.sku);
      return p ? [{ sku: l.sku, quantity: l.quantity, price: priceOf(p) }] : [];
    });
    dispatch({ type: "replace", lines });
  };
  const submit = async () => {
    const input = toOrderInput(state);
    setTried(true);
    if (Object.keys(validateOrder(input)).length) return scrollToError();
    setSaving(true);
    try {
      const result = await submitOrder(input);
      if (!result.ok) {
        setServerErrors(result.errors);
        return scrollToError();
      }
      finish();
      router.push(`/admin/don-hang/${result.id}?moi=1`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-sale">
      {restored ? (
        <div role="status" className="flex flex-col gap-3 rounded-card border-2 border-accent bg-warning-surface p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sale font-semibold">Đang tiếp tục đơn chưa xong.</p>
          <Button variant="outline" size="sale" onClick={discard}>
            Bỏ đơn này
          </Button>
        </div>
      ) : null}
      <CustomerPicker
        customers={customers}
        frequent={frequent}
        selected={customer}
        context={context}
        error={errors.customer}
        onPick={pick}
        onClear={() => dispatch({ type: "customer", id: null })}
        onRepeat={repeat}
      />
      <section aria-labelledby="buoc-hang" className="flex flex-col gap-6 rounded-card border border-line p-4 sm:p-6" data-error={errors.lines ? "" : undefined}>
        <h2 id="buoc-hang" className="text-sale-lg font-bold">
          Hàng
        </h2>
        <ProductPicker products={products} top={top} lines={state.lines} onAdd={(p) => dispatch({ type: "add", sku: p.sku, price: priceOf(p) })} />
        {errors.lines ? <p className="text-sale font-semibold text-danger">{errors.lines}</p> : null}
        {state.lines.length ? (
          <ol aria-label="Hàng trong đơn" className="flex flex-col border-t-2 border-ink pt-6">
            {state.lines.map((line, index) => (
              <SaleLineRow
                key={line.sku}
                index={index}
                line={line}
                product={bySku.get(line.sku)}
                lastPrice={context?.lastPrices[line.sku]}
                errors={errors}
                onQuantity={(text) => dispatch({ type: "quantity", index, text })}
                onStep={(delta) => dispatch({ type: "step", index, delta })}
                onPrice={(text) => dispatch({ type: "price", index, text })}
                onRemove={() => dispatch({ type: "remove", index })}
              />
            ))}
          </ol>
        ) : null}
      </section>
      <PaymentBox
        subtotal={numbers.subtotal}
        total={numbers.total}
        paid={numbers.paid}
        discountText={state.discount}
        paidText={state.paid}
        paidMode={state.paidMode}
        errors={errors}
        onDiscount={(text) => dispatch({ type: "discount", text })}
        onPaid={(text) => dispatch({ type: "paid", text })}
        onPaidMode={(mode) => dispatch({ type: "paidMode", mode })}
        onThousand={() => dispatch({ type: "paid", text: appendThousand(state.paidMode === "custom" ? state.paid : moneyText(numbers.paid)) })}
      />
      <div aria-hidden="true" className="h-48" />
      <SaleBar customerName={customer?.name ?? null} count={state.lines.length} total={numbers.total} paid={numbers.paid} saving={saving} onSubmit={submit} />
    </div>
  );
}

/** Cuộn tới lỗi đầu tiên và đặt con trỏ vào ô đó. */
function scrollToError() {
  window.requestAnimationFrame(() => {
    const first = document.querySelector<HTMLElement>("[data-error]");
    first?.scrollIntoView({ block: "center" });
    first?.querySelector<HTMLElement>("input, button")?.focus({ preventScroll: true });
  });
}

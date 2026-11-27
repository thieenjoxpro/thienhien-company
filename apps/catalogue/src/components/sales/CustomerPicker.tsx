"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { dateVN } from "@/lib/sales/dates";
import { matchCustomer } from "@/lib/sales/search";
import type { CustomerContext, SaleCustomer } from "@/lib/sales/types";
import { NewCustomerForm } from "./NewCustomerForm";
import { PickButton } from "./PickButton";
import { SearchField } from "./SearchField";

interface Props {
  customers: SaleCustomer[];
  frequent: SaleCustomer[];
  selected: SaleCustomer | null;
  context: CustomerContext | null;
  error?: string;
  onPick: (customer: SaleCustomer) => void;
  onClear: () => void;
  onRepeat: () => void;
}

export function CustomerPicker({ customers, frequent, selected, context, error, onPick, onClear, onRepeat }: Props) {
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const found = query.trim() ? customers.filter((c) => matchCustomer(c, query)).slice(0, 8) : [];

  return (
    <section aria-labelledby="buoc-khach" className="rounded-card border border-line p-4 sm:p-6" data-error={error ? "" : undefined}>
      <h2 id="buoc-khach" className="mb-4 text-sale-lg font-bold">
        Khách
      </h2>
      {selected ? (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sale-total font-bold">{selected.name}</p>
            <p className="text-sale text-ink-soft">
              {selected.walkIn ? "Khách vãng lai, trả đủ khi mua" : [selected.kind === "si" ? "Khách sỉ" : "Khách lẻ", selected.phone].filter(Boolean).join(" · ")}
            </p>
            {!selected.walkIn ? (
              <p className="mt-2 text-sale-lg font-semibold tabular-nums" aria-live="polite">
                {context === null ? "Đang xem nợ cũ" : context.debt > 0 ? `Nợ cũ: ${formatPrice(context.debt)}` : context.debt < 0 ? `Đang trả dư: ${formatPrice(-context.debt)}` : "Không nợ cũ"}
              </p>
            ) : null}
            {context?.lastOrder && !selected.walkIn ? (
              <p id="lan-truoc" className="text-sale text-ink-soft">
                Lần mua trước: ngày {dateVN(context.lastOrder.createdAt)}, {context.lastOrder.lines.length} món
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            {context?.lastOrder && !selected.walkIn ? (
              <Button variant="dark" size="sale" onClick={onRepeat} aria-describedby="lan-truoc">
                Bán giống lần trước
              </Button>
            ) : null}
            <Button variant="outline" size="sale" onClick={onClear}>
              Đổi khách
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Khách hay mua">
            {frequent.map((c) => (
              <li key={c.id}>
                <PickButton title={c.name} note={c.walkIn ? "Không ghi nợ" : (c.phone ?? (c.kind === "si" ? "Khách sỉ" : "Khách lẻ"))} onClick={() => onPick(c)} />
              </li>
            ))}
          </ul>
          <SearchField label="Tìm khách khác (tên không dấu hoặc số điện thoại)" value={query} onChange={setQuery} />
          {query.trim() ? (
            found.length ? (
              <ul className="grid gap-3 sm:grid-cols-2" aria-label="Khách tìm được">
                {found.map((c) => (
                  <li key={c.id}>
                    <PickButton title={c.name} note={c.phone ?? (c.kind === "si" ? "Khách sỉ" : "Khách lẻ")} onClick={() => onPick(c)} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sale">Không thấy khách nào tên hoặc số như vậy.</p>
            )
          ) : null}
          {adding ? (
            <NewCustomerForm initialName={/\d/.test(query) ? "" : query} initialPhone={/\d/.test(query) ? query : ""} onDone={(c) => (setAdding(false), onPick(c))} onCancel={() => setAdding(false)} />
          ) : (
            <div>
              <Button variant="outline" size="sale" onClick={() => setAdding(true)}>
                Thêm khách mới
              </Button>
            </div>
          )}
        </div>
      )}
      {error ? <p className="mt-4 text-sale font-semibold text-danger">{error}</p> : null}
    </section>
  );
}

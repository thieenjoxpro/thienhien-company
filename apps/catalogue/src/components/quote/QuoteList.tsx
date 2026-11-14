"use client";

import Link from "next/link";
import { useState } from "react";
import { type CardProduct } from "@/components/catalogue/ProductCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { buildQuoteMessage } from "@/lib/quote-message";
import { useQuoteStore } from "@/lib/quote-store";
import { QuoteRow } from "./QuoteRow";
import { SendQuote } from "./SendQuote";

interface QuoteListProps {
  products: CardProduct[];
  zalo: { wholesale: string; retail: string } | null;
}

/** Trang hỏi giá (mục 5.5): các mẫu đã chọn, thông tin khách tuỳ chọn, chọn sỉ hoặc lẻ, gửi qua Zalo. */
export function QuoteList({ products, zalo }: QuoteListProps) {
  const { items, hasHydrated } = useQuoteStore();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [channel, setChannel] = useState<"wholesale" | "retail">("wholesale");

  if (!hasHydrated) return <p>Đang mở danh sách hỏi giá.</p>;
  const rows = items.flatMap((item) => {
    const product = products.find((p) => p.sku === item.sku);
    return product ? [{ product, qty: item.qty }] : [];
  });
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6">
        <p>Danh sách chưa có mẫu nào.</p>
        <Button asChild variant="secondary">
          <Link href="/san-pham">Xem catalogue</Link>
        </Button>
      </div>
    );
  }

  const message = buildQuoteMessage(
    rows.map(({ product, qty }) => ({ sku: product.sku, name: product.name, qty, unit: product.unit })),
    { name, address },
  );
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
      <ul className="lg:col-span-7">
        {rows.map(({ product, qty }) => (
          <QuoteRow key={product.sku} product={product} qty={qty} />
        ))}
      </ul>
      <div className="flex flex-col gap-6 lg:col-span-5">
        <Input label="Tên của anh chị" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Giao tới đâu" autoComplete="address-level2" value={address} onChange={(e) => setAddress(e.target.value)} />
        <fieldset>
          <legend className="mb-2 text-label">Mua sỉ hay mua lẻ</legend>
          {(["wholesale", "retail"] as const).map((value) => (
            <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3">
              <input type="radio" name="kenh" value={value} checked={channel === value} onChange={() => setChannel(value)} className="size-5 accent-ink" />
              {value === "wholesale" ? "Mua sỉ" : "Mua lẻ"}
            </label>
          ))}
        </fieldset>
        {zalo ? <SendQuote message={message} zalo={zalo[channel]} /> : null}
      </div>
    </div>
  );
}

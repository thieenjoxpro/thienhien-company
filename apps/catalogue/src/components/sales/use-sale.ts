"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { loadCustomerContext } from "@/app/admin/_actions/sales";
import { clearDraft, readDraft, writeDraft } from "@/lib/sales/draft";
import { emptySale, hasContent, saleReducer, type SaleState } from "@/lib/sales/sale-state";
import type { CustomerContext } from "@/lib/sales/types";

/**
 * Trạng thái form bán hàng có tự lưu nháp: mở lại thì khôi phục (restored = true để hiện băng thông báo),
 * mỗi lần đổi thì ghi localStorage sau 500ms. `initial` (tạo lại từ đơn cũ) thắng nháp.
 */
export function useSaleState(key: string, initial: SaleState | null) {
  const [state, dispatch] = useReducer(saleReducer, initial ?? emptySale);
  const [restored, setRestored] = useState(false);
  const ready = useRef(false);
  const done = useRef(false); // đơn đã lưu: hẹn giờ ghi nháp còn treo không được ghi lại

  useEffect(() => {
    if (!initial) {
      const draft = readDraft(key);
      if (draft && hasContent(draft)) {
        dispatch({ type: "reset", state: { ...emptySale, ...draft } });
        setRestored(true);
      }
    }
    ready.current = true;
  }, [key, initial]);

  useEffect(() => {
    if (!ready.current || done.current) return;
    const timer = window.setTimeout(() => {
      if (done.current) return;
      if (hasContent(state)) writeDraft(key, state);
      else clearDraft(key);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [key, state]);

  const discard = () => {
    clearDraft(key);
    dispatch({ type: "reset" });
    setRestored(false);
  };
  const finish = () => {
    done.current = true;
    clearDraft(key);
  };
  return { state, dispatch, restored, discard, finish };
}

/** Nợ cũ, giá lần trước, đơn gần nhất của khách đang chọn; null khi đang tải hoặc chưa chọn khách. */
export function useCustomerContext(customerId: number | null): CustomerContext | null {
  const [loaded, setLoaded] = useState<{ id: number; context: CustomerContext } | null>(null);
  useEffect(() => {
    if (!customerId) return;
    let live = true;
    loadCustomerContext(customerId).then(
      (context) => live && setLoaded({ id: customerId, context }),
      () => live && setLoaded({ id: customerId, context: { debt: 0, lastPrices: {}, lastOrder: null } }),
    );
    return () => {
      live = false;
    };
  }, [customerId]);
  return loaded && loaded.id === customerId ? loaded.context : null;
}

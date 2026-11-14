"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site.config";

type Status = "idle" | "copied" | "manual";

/**
 * Nút "Hỏi giá qua Zalo" của trang hỏi giá (mục 5.5): copy tin nhắn vào clipboard, báo trạng thái,
 * rồi mở Zalo của xưởng ở tab mới. Clipboard lỗi thì hiện ô văn bản đã chọn sẵn để khách tự copy.
 */
export function SendQuote({ message, zalo }: { message: string; zalo: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const manual = useRef<HTMLTextAreaElement>(null);

  const send = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setStatus("copied");
    } catch {
      setStatus("manual");
      requestAnimationFrame(() => manual.current?.select());
    }
    window.open(zalo, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <Button variant="primary" onClick={() => void send()}>
        {site.mainAction}
      </Button>
      <div role="status" className="mt-3">
        {status === "copied" ? <p className="text-success">Đã copy danh sách. Dán vào khung chat Zalo vừa mở.</p> : null}
        {status === "manual" ? (
          <>
            <p className="mb-2">Copy đoạn này rồi dán vào Zalo.</p>
            <textarea
              ref={manual}
              readOnly
              aria-label="Tin nhắn hỏi giá"
              value={message}
              rows={message.split("\n").length + 1}
              className="w-full rounded-btn border border-ink-muted bg-surface p-4 font-mono text-spec"
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

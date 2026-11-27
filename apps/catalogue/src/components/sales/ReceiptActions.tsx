"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface Props {
  orderId: number;
  fileName: string;
}

type Status = { tone: "info" | "error"; text: string } | null;

/** In phiếu, gửi ảnh phiếu qua Zalo (chia sẻ file nếu máy hỗ trợ, không thì tải ảnh về), tải PDF. */
export function ReceiptActions({ orderId, fileName }: Props) {
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);

  const sendZalo = async () => {
    setBusy(true);
    setStatus({ tone: "info", text: "Đang làm ảnh phiếu" });
    try {
      const response = await fetch(`/api/orders/${orderId}/receipt.png`);
      if (!response.ok) throw new Error(await response.text());
      const blob = await response.blob();
      const file = new File([blob], `${fileName}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Phiếu bán hàng" });
        setStatus(null);
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = Object.assign(document.createElement("a"), { href: url, download: file.name });
      link.click();
      URL.revokeObjectURL(url);
      setStatus({ tone: "info", text: "Ảnh đã lưu, mở Zalo và gửi ảnh này cho khách." });
    } catch (error) {
      // người dùng tự đóng bảng chia sẻ thì không báo lỗi
      if (error instanceof DOMException && error.name === "AbortError") setStatus(null);
      else setStatus({ tone: "error", text: "Chưa làm được ảnh phiếu. Bấm In phiếu hoặc thử lại." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 print:hidden">
      <div className="grid gap-3 sm:grid-cols-3">
        <Button variant="dark" size="xl" onClick={() => window.print()}>
          In phiếu
        </Button>
        <Button variant="zalo" size="xl" onClick={sendZalo} disabled={busy}>
          Gửi Zalo
        </Button>
        <Button variant="outline" size="xl" asChild>
          <a href={`/api/orders/${orderId}/receipt.pdf?tai=1`} download={`${fileName}.pdf`}>
            Tải PDF
          </a>
        </Button>
      </div>
      {status ? (
        <p role={status.tone === "error" ? "alert" : "status"} className={status.tone === "error" ? "text-sale font-semibold text-danger" : "text-sale font-semibold"}>
          {status.text}
        </p>
      ) : null}
      <div>
        <Button variant="outline" size="sale" asChild>
          <Link href="/admin/ban-hang">Bán đơn mới</Link>
        </Button>
      </div>
    </div>
  );
}

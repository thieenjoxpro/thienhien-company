import type { NextRequest } from "next/server";
import { receiptResponse } from "@/lib/server/sales/receipt-route";

export const dynamic = "force-dynamic";

// Phiếu bán hàng dạng PNG, chụp từ trang /phieu/[id]. ?tai=1 thì tải về thay vì mở xem.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return receiptResponse((await params).id, "png", request.nextUrl.searchParams.has("tai"));
}

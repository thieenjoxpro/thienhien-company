// Phần chung của GET /api/orders/:id/receipt.pdf và receipt.png: 401 khi chưa đăng nhập, 404 khi không có đơn.
import { isAdminRequest } from "./access";
import { getOrder } from "./orders";
import { receiptFileName } from "./receipt";
import { renderReceipt } from "./render";

const TYPES = { pdf: "application/pdf", png: "image/png" } as const;

export async function receiptResponse(idText: string, kind: "pdf" | "png", download: boolean): Promise<Response> {
  if (!(await isAdminRequest())) return new Response("Chưa đăng nhập", { status: 401 });
  const id = Number(idText);
  const order = Number.isInteger(id) ? await getOrder(id) : null;
  if (!order) return new Response("Không có đơn này", { status: 404 });
  try {
    const file = await renderReceipt(id, kind);
    const name = receiptFileName(order, kind);
    return new Response(new Uint8Array(file), {
      headers: {
        "content-type": TYPES[kind],
        "content-disposition": `${download ? "attachment" : "inline"}; filename="${name}"`,
        "cache-control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Không chụp được phiếu", error);
    return new Response("Chưa tạo được file phiếu, thử lại sau ít phút.", { status: 503 });
  }
}

// Dữ liệu cho phiếu bán hàng: đơn, thông tin xưởng, mã VietQR (tự sinh, không gọi dịch vụ ngoài: phiếu in được khi VPS không ra mạng).
import { vietQrPayload } from "@thien-hien/shared";
import { readData } from "@/lib/admin/files";
import { slugify } from "@/lib/admin/form";
import { bankName } from "@/lib/sales/banks";
import { receiptCode } from "@/lib/sales/order";
import { SiteDataSchema, type SiteData } from "@/lib/site-schema";
import { getOrder, type OrderDetail } from "./orders";

interface ReceiptQr {
  svg: string;
  amount: number;
  bank: string;
  account: string;
  accountName: string | null;
}

export interface ReceiptData {
  order: OrderDetail;
  site: SiteData;
  qr: ReceiptQr | null;
}

/** Số tiền QR = phần còn phải trả của chính đơn này; đơn huỷ, trả đủ hoặc chưa cấu hình ngân hàng thì không có QR. */
async function makeQr(order: OrderDetail, site: SiteData): Promise<ReceiptQr | null> {
  const amount = order.total - order.paid;
  if (order.cancelledAt || amount <= 0 || !site.bankBin || !site.bankAccount) return null;
  const payload = vietQrPayload({ bankBin: site.bankBin, accountNumber: site.bankAccount, amount, message: receiptCode(order.id) });
  const QRCode = await import("qrcode");
  const svg = await QRCode.toString(payload, { type: "svg", margin: 0, width: 128, errorCorrectionLevel: "M" });
  return { svg, amount, bank: bankName(site.bankBin), account: site.bankAccount, accountName: site.bankAccountName };
}

export async function receiptData(id: number): Promise<ReceiptData | null> {
  const order = await getOrder(id);
  if (!order) return null;
  const site = await readData("site.json", SiteDataSchema);
  return { order, site, qr: await makeQr(order, site) };
}

/** Tên file tải về: phieu-PH000123-anh-hung.pdf */
export function receiptFileName(order: OrderDetail, ext: "pdf" | "png"): string {
  const name = slugify(order.customer.name);
  return `phieu-${receiptCode(order.id)}${name ? `-${name}` : ""}.${ext}`;
}

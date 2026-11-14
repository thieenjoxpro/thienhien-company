import { site } from "@/lib/site.config";

export interface QuoteLine {
  sku: string;
  name: string;
  qty: number;
  unit: string;
}

/**
 * Tin nhắn hỏi giá dán vào Zalo (mục 5.5). Dòng Tên, Giao tới chỉ có khi khách điền.
 *
 * Chào xưởng Thiện Hiền, tôi cần báo giá:
 * 1. TH-BL03 Bản lề cối 16 ly: 50 cái
 */
export function buildQuoteMessage(lines: QuoteLine[], contact: { name?: string; address?: string } = {}): string {
  const rows = lines.map((line, index) => `${index + 1}. ${line.sku} ${line.name}: ${line.qty} ${line.unit}`);
  const name = contact.name?.trim();
  const address = contact.address?.trim();
  return [
    `Chào xưởng ${site.name}, tôi cần báo giá:`,
    ...rows,
    ...(name ? [`Tên: ${name}`] : []),
    ...(address ? [`Giao tới: ${address}`] : []),
  ].join("\n");
}

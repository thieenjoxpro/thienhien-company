import { site } from "@/lib/site.config";

export interface QuoteLine {
  sku: string;
  name: string;
  /** Thông số chính, ví dụ "Ø16 × 100 mm". */
  spec: string;
  qty: number;
  unit: string;
}

/**
 * Tin nhắn hỏi giá dán vào Zalo (design V2). Dòng Ghi chú chỉ có khi khách điền.
 *
 * Chào xưởng Thiện Hiền, em cần báo giá sỉ:
 * 1. TH-BL03 · Bản lề cối 16 ly · Ø16 × 100 mm · SL: 50 cái
 * Ghi chú: giao Bình Chánh
 */
export function buildQuoteMessage(lines: QuoteLine[], note = ""): string {
  const rows = lines.map((line, index) => `${index + 1}. ${[line.sku, line.name, line.spec].filter(Boolean).join(" · ")} · SL: ${line.qty} ${line.unit}`);
  const trimmed = note.trim();
  return [`Chào xưởng ${site.name}, em cần báo giá sỉ:`, ...rows, ...(trimmed ? [`Ghi chú: ${trimmed}`] : [])].join("\n");
}

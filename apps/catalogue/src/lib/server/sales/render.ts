// Chụp phiếu thành PDF A5 và ảnh PNG bằng Chromium headless mở chính trang /phieu/[id], để in, ảnh, PDF khớp nhau.
// VPS 2 GB RAM: một trình duyệt dùng chung cả tiến trình, mỗi yêu cầu một trang rồi đóng, tối đa 2 yêu cầu cùng lúc,
// mỗi lần tối đa 20 giây. Docker đặt CHROMIUM_PATH tới Chromium của hệ điều hành; trên máy dev dùng Chromium của Playwright.
import type { Browser } from "playwright-core";
import { receiptHeader, receiptToken } from "./access";

const MAX_PARALLEL = 2;
const TIMEOUT_MS = 20_000;

const shared = globalThis as { __thBrowser?: Promise<Browser>; __thRenderSlots?: { busy: number; queue: (() => void)[] } };
const slots = (shared.__thRenderSlots ??= { busy: 0, queue: [] });

const launch = async (): Promise<Browser> => {
  const { chromium } = await import("playwright-core");
  return chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    // --no-sandbox: Chromium chạy trong container bằng user không phải root, không có namespace để dựng sandbox
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
  });
};

/** Gán promise trước mọi await: hai yêu cầu đầu tiên cùng lúc vẫn chỉ mở một Chromium. */
async function browser(): Promise<Browser> {
  const pending = (shared.__thBrowser ??= launch());
  const current = await pending.catch(() => null);
  if (current?.isConnected()) return current;
  if (shared.__thBrowser === pending) shared.__thBrowser = launch(); // trình duyệt chết hoặc mở lỗi: mở lại
  return shared.__thBrowser;
}

async function withSlot<T>(run: () => Promise<T>): Promise<T> {
  if (slots.busy >= MAX_PARALLEL) await new Promise<void>((resolve) => slots.queue.push(resolve));
  slots.busy += 1;
  try {
    return await run();
  } finally {
    slots.busy -= 1;
    slots.queue.shift()?.();
  }
}

/** Gốc để Chromium gọi thẳng Next trong cùng máy (không đi qua Caddy, không ra mạng). */
const origin = () => process.env.RECEIPT_ORIGIN ?? `http://127.0.0.1:${process.env.PORT ?? "4310"}`;

export async function renderReceipt(orderId: number, kind: "pdf" | "png"): Promise<Buffer> {
  return withSlot(async () => {
    const context = await (await browser()).newContext({
      viewport: { width: 560, height: 800 }, // 148 mm ở 96 dpi
      deviceScaleFactor: kind === "png" ? 2 : 1,
      extraHTTPHeaders: { [receiptHeader]: receiptToken(orderId) },
    });
    try {
      const page = await context.newPage();
      page.setDefaultTimeout(TIMEOUT_MS);
      const response = await page.goto(`${origin()}/phieu/${orderId}`, { waitUntil: "networkidle", timeout: TIMEOUT_MS });
      if (!response?.ok()) throw new Error(`Trang phiếu trả ${response?.status() ?? "không phản hồi"}`);
      await page.evaluate(() => document.fonts.ready);
      if (kind === "pdf") return await page.pdf({ preferCSSPageSize: true, printBackground: true });
      return await page.locator("[data-receipt]").screenshot({ type: "png" });
    } finally {
      await context.close();
    }
  });
}

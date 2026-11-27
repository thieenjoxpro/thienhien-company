import { describe, expect, it, vi } from "vitest";
import { checkReceiptToken, receiptToken } from "../../src/lib/server/sales/access";

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));

describe("token chụp phiếu", () => {
  it("đúng đơn, còn hạn thì nhận; sai đơn, hết hạn, sửa chữ ký thì từ chối", () => {
    const now = Date.now();
    const token = receiptToken(12, now);
    expect(checkReceiptToken(token, 12, now + 1000)).toBe(true);
    expect(checkReceiptToken(token, 13, now)).toBe(false);
    expect(checkReceiptToken(token, 12, now + 61_000)).toBe(false);
    expect(checkReceiptToken(`${token.slice(0, -1)}0`, 12, now)).toBe(token.endsWith("0"));
    expect(checkReceiptToken("", 12, now)).toBe(false);
    expect(checkReceiptToken(null, 12, now)).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { formatNumber, formatPrice } from "../../src/lib/format";

describe("format", () => {
  it('formatPrice(18000) === "18.000 đ"', () => {
    expect(formatPrice(18000)).toBe("18.000 đ");
  });

  it("formatNumber dùng dấu phẩy thập phân", () => {
    expect(formatNumber(0.8)).toBe("0,8");
  });
});

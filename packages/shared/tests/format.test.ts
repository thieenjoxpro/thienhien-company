import { describe, expect, it } from "vitest";
import { formatNumber, formatPrice } from "../src";

describe("formatPrice", () => {
  it("tách nghìn bằng dấu chấm và thêm đ", () => {
    expect(formatPrice(18000)).toBe("18.000 đ");
    expect(formatPrice(1250000)).toBe("1.250.000 đ");
  });

  it("làm tròn về đồng", () => {
    expect(formatPrice(6499.6)).toBe("6.500 đ");
  });
});

describe("formatNumber", () => {
  it("dùng dấu phẩy thập phân", () => {
    expect(formatNumber(2.5)).toBe("2,5");
    expect(formatNumber(0.8)).toBe("0,8");
    expect(formatNumber(16)).toBe("16");
  });
});

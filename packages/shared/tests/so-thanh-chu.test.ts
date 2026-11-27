import { describe, expect, it } from "vitest";
import { docSoThanhChu } from "../src";

describe("docSoThanhChu", () => {
  it.each([
    [0, "Không đồng"],
    [5, "Năm đồng"],
    [10, "Mười đồng"],
    [15, "Mười lăm đồng"],
    [21, "Hai mươi mốt đồng"],
    [25, "Hai mươi lăm đồng"],
    [101, "Một trăm linh một đồng"],
    [105, "Một trăm linh năm đồng"],
    [110, "Một trăm mười đồng"],
    [1000, "Một nghìn đồng"],
    [1_005_000, "Một triệu không trăm linh năm nghìn đồng"],
    [1_250_000, "Một triệu hai trăm năm mươi nghìn đồng"],
    [10_000_000, "Mười triệu đồng"],
    [1_000_000_000, "Một tỷ đồng"],
    [2_100_050_000, "Hai tỷ một trăm triệu không trăm năm mươi nghìn đồng"],
  ])("%d", (value, text) => {
    expect(docSoThanhChu(value)).toBe(text);
  });

  it("đọc 11, 31, 45, 50", () => {
    expect(docSoThanhChu(11)).toBe("Mười một đồng");
    expect(docSoThanhChu(31)).toBe("Ba mươi mốt đồng");
    expect(docSoThanhChu(45)).toBe("Bốn mươi lăm đồng");
    expect(docSoThanhChu(50)).toBe("Năm mươi đồng");
  });

  it("giữ chữ tỷ khi nhóm tỷ bằng 0 nhưng có nghìn tỷ", () => {
    expect(docSoThanhChu(1_000_500_000_000n)).toBe("Một nghìn tỷ năm trăm triệu đồng");
  });

  it("nhận bigint, làm tròn số lẻ, đọc số âm", () => {
    expect(docSoThanhChu(3_450_000n)).toBe("Ba triệu bốn trăm năm mươi nghìn đồng");
    expect(docSoThanhChu(999.6)).toBe("Một nghìn đồng");
    expect(docSoThanhChu(-20_000)).toBe("Âm hai mươi nghìn đồng");
  });
});

import { describe, expect, it } from "vitest";
import { normalizeVietnamese } from "../src";

describe("normalizeVietnamese", () => {
  it("bỏ dấu và viết thường", () => {
    expect(normalizeVietnamese("Bản lề CỐI 16 ly")).toBe("ban le coi 16 ly");
  });

  it("đổi đ và Đ thành d", () => {
    expect(normalizeVietnamese("Đồng thau đỏ")).toBe("dong thau do");
  });

  it("gộp khoảng trắng thừa", () => {
    expect(normalizeVietnamese("  Mâm   cầu\tthang ")).toBe("mam cau thang");
  });

  it("chuỗi đã dựng sẵn (NFC) và chuỗi tách dấu (NFD) cho cùng kết quả", () => {
    const nfc = "Pano dập ô vuông".normalize("NFC");
    const nfd = "Pano dập ô vuông".normalize("NFD");
    expect(normalizeVietnamese(nfc)).toBe(normalizeVietnamese(nfd));
  });
});

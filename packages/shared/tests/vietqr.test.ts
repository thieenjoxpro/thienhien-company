import { describe, expect, it } from "vitest";
import { crc16, transferMessage, vietQrPayload } from "../src";

/** Tách chuỗi TLV thành { id: value } (một cấp). */
function parse(tlv: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < tlv.length; ) {
    const id = tlv.slice(i, i + 2);
    const len = Number(tlv.slice(i + 2, i + 4));
    out[id] = tlv.slice(i + 4, i + 4 + len);
    i += 4 + len;
  }
  return out;
}

describe("crc16", () => {
  it("khớp giá trị kiểm chuẩn của CRC-16/CCITT-FALSE", () => {
    expect(crc16("123456789")).toBe("29B1");
  });
});

describe("vietQrPayload", () => {
  const payload = vietQrPayload({ bankBin: "970436", accountNumber: "0123456789", amount: 1_450_000, message: "Phiếu PH000123" });

  it("ra đúng chuỗi mẫu", () => {
    expect(payload).toBe(
      "000201010212" +
        "38540010A00000072701240006970436011001234567890208QRIBFTTA" +
        "5303704" +
        "54071450000" +
        "5802VN" +
        "62180814PHIEU PH000123" +
        "6304" +
        "3201", // CRC tính độc lập bằng binascii.crc_hqx(…, 0xFFFF) của Python
    );
  });

  it("có đủ trường và CRC đúng", () => {
    const top = parse(payload);
    expect(top["00"]).toBe("01");
    expect(top["01"]).toBe("12");
    expect(top["53"]).toBe("704");
    expect(top["54"]).toBe("1450000");
    expect(top["58"]).toBe("VN");
    const account = parse(top["38"]!);
    expect(account["00"]).toBe("A000000727");
    expect(account["02"]).toBe("QRIBFTTA");
    expect(parse(account["01"]!)).toEqual({ "00": "970436", "01": "0123456789" });
    expect(parse(top["62"]!)["08"]).toBe("PHIEU PH000123");
    expect(top["63"]).toBe(crc16(payload.slice(0, -4)));
    expect(top["63"]).toMatch(/^[0-9A-F]{4}$/);
  });

  it("không có số tiền thì là QR tĩnh, không có trường 54", () => {
    const top = parse(vietQrPayload({ bankBin: "970436", accountNumber: "0123456789" }));
    expect(top["01"]).toBe("11");
    expect(top["54"]).toBeUndefined();
  });

  it("từ chối BIN sai", () => {
    expect(() => vietQrPayload({ bankBin: "97043", accountNumber: "1" })).toThrow();
  });

  it("nội dung bỏ dấu, chữ hoa, tối đa 25 ký tự", () => {
    expect(transferMessage("Thanh toán đơn số 12 — anh Hùng, Quận Bình Tân")).toBe("THANH TOAN DON SO 12 ANH");
  });
});

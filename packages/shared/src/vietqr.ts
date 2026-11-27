// Chuỗi VietQR (chuẩn EMVCo MPM, dịch vụ chuyển nhanh NAPAS 247 tới tài khoản) tự sinh, không gọi dịch vụ ngoài.
// Thứ tự trường: 00 phiên bản, 01 kiểu QR, 38 tài khoản nhận, 53 tiền tệ, 54 số tiền, 58 quốc gia, 62 nội dung, 63 CRC.
import { normalizeVietnamese } from "./normalize";

const NAPAS_GUID = "A000000727";
const SERVICE_TO_ACCOUNT = "QRIBFTTA";

function field(id: string, value: string): string {
  if (value.length > 99) throw new Error(`Trường ${id} dài quá 99 ký tự`);
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

/** CRC-16/CCITT-FALSE (đa thức 0x1021, khởi tạo 0xFFFF), 4 ký tự hex viết hoa. */
export function crc16(input: string): string {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(input)) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export interface VietQrInput {
  /** Mã BIN ngân hàng, 6 chữ số (ví dụ 970436 là Vietcombank). */
  bankBin: string;
  accountNumber: string;
  /** Số tiền VND; bỏ trống thì người chuyển tự nhập. */
  amount?: number;
  /** Nội dung chuyển khoản; bỏ dấu, chỉ giữ chữ số và chữ cái, tối đa 25 ký tự. */
  message?: string;
}

/** Nội dung chuyển khoản an toàn cho mọi app ngân hàng: không dấu, chữ hoa, số, khoảng trắng. */
export function transferMessage(text: string): string {
  return normalizeVietnamese(text)
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 25)
    .trim();
}

export function vietQrPayload({ bankBin, accountNumber, amount, message }: VietQrInput): string {
  if (!/^\d{6}$/.test(bankBin)) throw new Error("Mã BIN ngân hàng phải có 6 chữ số");
  if (!/^[0-9A-Za-z]{1,19}$/.test(accountNumber)) throw new Error("Số tài khoản không hợp lệ");
  const dynamic = amount !== undefined && amount > 0;
  const beneficiary = field("00", bankBin) + field("01", accountNumber);
  const account = field("00", NAPAS_GUID) + field("01", beneficiary) + field("02", SERVICE_TO_ACCOUNT);
  const note = message ? transferMessage(message) : "";
  const body =
    field("00", "01") +
    field("01", dynamic ? "12" : "11") +
    field("38", account) +
    field("53", "704") +
    (dynamic ? field("54", String(Math.round(amount))) : "") +
    field("58", "VN") +
    (note ? field("62", field("08", note)) : "") +
    "6304";
  return body + crc16(body);
}

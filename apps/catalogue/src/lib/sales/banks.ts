// Tên ngắn của các ngân hàng hay dùng theo mã BIN (NAPAS), in dưới mã VietQR. Mã lạ thì in mã.
const BANKS: Record<string, string> = {
  "970436": "Vietcombank",
  "970415": "VietinBank",
  "970418": "BIDV",
  "970405": "Agribank",
  "970407": "Techcombank",
  "970422": "MB Bank",
  "970416": "ACB",
  "970432": "VPBank",
  "970423": "TPBank",
  "970403": "Sacombank",
  "970437": "HDBank",
  "970441": "VIB",
  "970443": "SHB",
  "970448": "OCB",
};

export const bankName = (bin: string): string => BANKS[bin] ?? `Ngân hàng mã ${bin}`;

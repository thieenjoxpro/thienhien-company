// Đọc số tiền thành chữ tiếng Việt cho phiếu bán hàng và dòng chữ dưới ô tiền.
// docSoThanhChu(1250000) === "Một triệu hai trăm năm mươi nghìn đồng"

const DIGITS = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const BILLION = 1_000_000_000n;

/**
 * Một nhóm ba chữ số (0..999). `full`: nhóm đứng sau nhóm khác nên phải đọc đủ "không trăm", "linh".
 */
function readGroup(n: number, full: boolean): string[] {
  const hundreds = Math.floor(n / 100);
  const tens = Math.floor(n / 10) % 10;
  const units = n % 10;
  const words: string[] = [];
  const hasHundreds = full || hundreds > 0;
  if (hasHundreds) words.push(DIGITS[hundreds]!, "trăm");
  if (tens === 0) {
    if (units > 0 && hasHundreds) words.push("linh");
  } else if (tens === 1) {
    words.push("mười");
  } else {
    words.push(DIGITS[tens]!, "mươi");
  }
  if (units === 1 && tens > 1) words.push("mốt");
  else if (units === 5 && tens > 0) words.push("lăm");
  else if (units > 0) words.push(DIGITS[units]!);
  return words;
}

/** Số dưới một tỷ: nhóm triệu, nghìn, đơn vị; nhóm bằng 0 thì bỏ. */
function readBelowBillion(n: number, full: boolean): string[] {
  const groups: [number, string][] = [
    [Math.floor(n / 1_000_000), "triệu"],
    [Math.floor(n / 1000) % 1000, "nghìn"],
    [n % 1000, ""],
  ];
  const words: string[] = [];
  let started = full;
  for (const [value, unit] of groups) {
    if (value === 0) continue;
    words.push(...readGroup(value, started));
    if (unit) words.push(unit);
    started = true;
  }
  return words;
}

function read(n: bigint, full: boolean): string[] {
  if (n < BILLION) return readBelowBillion(Number(n), full);
  const words = [...read(n / BILLION, full), "tỷ"];
  const rest = n % BILLION;
  if (rest > 0n) words.push(...readBelowBillion(Number(rest), true));
  return words;
}

/** Số tiền (đồng) thành chữ, viết hoa chữ đầu, kết thúc bằng "đồng". Số lẻ được làm tròn. */
export function docSoThanhChu(value: number | bigint): string {
  let n = typeof value === "bigint" ? value : BigInt(Math.round(value));
  const negative = n < 0n;
  if (negative) n = -n;
  const words = n === 0n ? ["không"] : read(n, false);
  if (negative) words.unshift("âm");
  const text = `${words.join(" ")} đồng`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

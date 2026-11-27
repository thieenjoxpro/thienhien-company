// Ô tiền và ô số lượng của màn bán hàng: tự chèn dấu chấm khi gõ, giữ đúng vị trí con trỏ.
// Không import thư viện: file này vào component client.

const MAX_DIGITS = 12; // tới 999 tỷ

/** Chỉ giữ chữ số, bỏ số 0 thừa ở đầu, tối đa 12 số. */
function digitsOnly(text: string): string {
  return text.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, MAX_DIGITS);
}

/** "1250000" -> "1.250.000" */
function groupDigits(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Số tiền trong ô ("1.250.000") thành số; rỗng là 0. */
export function parseMoney(text: string): number {
  return Number(digitsOnly(text) || "0");
}

export const moneyText = (value: number): string => (value > 0 ? groupDigits(String(Math.round(value))) : "");

/**
 * Định dạng lại ô tiền sau mỗi lần gõ. `caret`: vị trí con trỏ trong chuỗi vừa gõ.
 * Con trỏ đứng sau đúng số chữ số như trước khi định dạng, nên gõ giữa số không bị nhảy về cuối.
 */
export function formatMoneyInput(raw: string, caret: number): { text: string; caret: number } {
  const text = groupDigits(digitsOnly(raw));
  if (text === "0") return { text, caret: 1 };
  // chữ số có nghĩa đứng trước con trỏ (số 0 ở đầu bị bỏ nên không tính)
  let want = Math.min(raw.slice(0, caret).replace(/\D/g, "").replace(/^0+/, "").length, MAX_DIGITS);
  if (want === 0) return { text, caret: 0 };
  for (let i = 0; i < text.length; i += 1) {
    if (/\d/.test(text.charAt(i))) want -= 1;
    if (want === 0) return { text, caret: i + 1 };
  }
  return { text, caret: text.length };
}

/** Nút "000": thêm ba số 0 vào cuối. Ô rỗng thì giữ rỗng. */
export function appendThousand(text: string): string {
  const digits = digitsOnly(text);
  return digits ? groupDigits(digitsOnly(`${digits}000`)) : "";
}

/** Số lượng kiểu Việt: "1,5" hoặc "1.5" -> 1.5; rỗng hoặc sai -> NaN. Tối đa 3 số lẻ. */
export function parseQuantity(text: string): number {
  const raw = text.trim().replace(",", ".");
  if (!/^\d+(\.\d{1,3})?$/.test(raw)) return Number.NaN;
  return Number(raw);
}

/** 1.5 -> "1,5" cho ô số lượng. */
export const quantityText = (value: number): string => String(Math.round(value * 1000) / 1000).replace(".", ",");

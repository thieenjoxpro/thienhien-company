// Font tự host từ @fontsource 5.3.0 qua next/font/local: chỉ subset vietnamese + latin, swap.
// Be Vietnam Pro (400, 500, 600, 700) cho mọi chữ; Barlow Condensed 700 cho tiêu đề viết hoa và giá lớn.
// Mỗi subset một họ riêng có unicode-range, trình duyệt chỉ tải subset có ký tự trên trang.
// Họ latin tắt adjustFontFallback: next sinh họ "Fallback" phủ U+0-10FFFF đứng ngay sau, nếu để
// thì chữ có dấu (ệ, ỉ, ơ) rơi vào Arial trước khi tới họ vietnamese. Fallback đo cỡ chỉ đặt ở họ cuối.
// Đường dẫn và dải ký tự phải viết thẳng để next/font phân tích lúc build.
import localFont from "next/font/local";

const sansLatin = localFont({
  src: [
    { path: "../fonts/be-vietnam-pro-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/be-vietnam-pro-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/be-vietnam-pro-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/be-vietnam-pro-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--typeface-sans-latin",
  adjustFontFallback: false, // font fallback của next phủ mọi ký tự, đứng trước sẽ nuốt chữ Việt
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});

const sansVietnamese = localFont({
  src: [
    { path: "../fonts/be-vietnam-pro-vietnamese-400-normal.woff2", weight: "400" },
    { path: "../fonts/be-vietnam-pro-vietnamese-500-normal.woff2", weight: "500" },
    { path: "../fonts/be-vietnam-pro-vietnamese-600-normal.woff2", weight: "600" },
    { path: "../fonts/be-vietnam-pro-vietnamese-700-normal.woff2", weight: "700" },
  ],
  variable: "--typeface-sans-vietnamese",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB" }],
});

const displayLatin = localFont({
  src: [{ path: "../fonts/barlow-condensed-latin-700-normal.woff2", weight: "700" }],
  variable: "--typeface-display-latin",
  adjustFontFallback: false,
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});

const displayVietnamese = localFont({
  src: [{ path: "../fonts/barlow-condensed-vietnamese-700-normal.woff2", weight: "700" }],
  variable: "--typeface-display-vietnamese",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB" }],
});

/** Class đặt trên <html> khai báo bốn biến font; globals.css ghép chúng thành --font-sans, --font-display. */
export const fontVariables = [sansLatin, sansVietnamese, displayLatin, displayVietnamese].map((font) => font.variable).join(" ");

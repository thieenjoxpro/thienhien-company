// Font tự host từ @fontsource qua next/font/local: chỉ subset vietnamese + latin, weight 400 và 500, swap.
// next/font tự preload file chữ (Be Vietnam Pro) và tạo font dự phòng đã chỉnh cỡ, nên chữ hero không
// phải chờ CSS tải xong mới bắt đầu tải font (LCP). Mỗi subset một họ riêng có unicode-range, trình duyệt
// chỉ tải subset có ký tự trên trang. Đường dẫn phải là chuỗi cố định để next/font phân tích lúc build.
import localFont from "next/font/local";

// Dải ký tự của hai subset lấy từ @fontsource; next/font đòi giá trị viết thẳng (không qua hằng số)
const sansLatin = localFont({
  src: [
    { path: "../fonts/be-vietnam-pro-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/be-vietnam-pro-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--typeface-sans-latin",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});

const sansVietnamese = localFont({
  src: [
    { path: "../fonts/be-vietnam-pro-vietnamese-400-normal.woff2", weight: "400" },
    { path: "../fonts/be-vietnam-pro-vietnamese-500-normal.woff2", weight: "500" },
  ],
  variable: "--typeface-sans-vietnamese",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB" }],
});

// Chữ mono chỉ dùng cho mã, thông số, giá: không preload để nhường băng thông cho chữ chính
const monoLatin = localFont({
  src: [
    { path: "../fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--typeface-mono-latin",
  display: "swap",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});

const monoVietnamese = localFont({
  src: [
    { path: "../fonts/ibm-plex-mono-vietnamese-400-normal.woff2", weight: "400" },
    { path: "../fonts/ibm-plex-mono-vietnamese-500-normal.woff2", weight: "500" },
  ],
  variable: "--typeface-mono-vietnamese",
  display: "swap",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB" }],
});

/** Class đặt trên <html> để khai báo bốn biến font; globals.css ghép chúng thành --font-sans, --font-mono. */
export const fontVariables = [sansLatin, sansVietnamese, monoLatin, monoVietnamese].map((font) => font.variable).join(" ");

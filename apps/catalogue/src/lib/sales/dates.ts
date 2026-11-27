// Ngày giờ theo giờ Việt Nam: máy chủ trong container chạy giờ UTC.
const TZ = "Asia/Ho_Chi_Minh";
const dateFmt = new Intl.DateTimeFormat("vi-VN", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric" });
const timeFmt = new Intl.DateTimeFormat("vi-VN", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false });

/** "27/11/2026" */
export const dateVN = (iso: string): string => dateFmt.format(new Date(iso));

/** "08:57 27/11/2026" */
export const dateTimeVN = (iso: string): string => `${timeFmt.format(new Date(iso))} ${dateVN(iso)}`;

/** Ngày hôm nay theo giờ Việt Nam, dạng yyyy-mm-dd (tên file, ô chọn ngày). */
export const todayVN = (now = new Date()): string => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(now);

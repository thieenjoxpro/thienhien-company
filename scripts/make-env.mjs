// Tạo file .env cho docker compose với mật khẩu ngẫu nhiên. Không in mật khẩu ra màn hình.
//   node scripts/make-env.mjs [tên-miền]
import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const path = join(dirname(fileURLToPath(import.meta.url)), "..", ".env");
if (existsSync(path)) {
  console.log(`${path} đã có, giữ nguyên. Muốn tạo lại thì xoá file đó trước.`);
  process.exit(0);
}
const secret = (bytes) => randomBytes(bytes).toString("hex"); // chỉ chữ và số: an toàn trong URL kết nối
const domain = process.argv[2] ?? "localhost";
writeFileSync(
  path,
  [`SITE_DOMAIN=${domain}`, `POSTGRES_PASSWORD=${secret(24)}`, "ADMIN_USERNAME=admin", `ADMIN_PASSWORD=${secret(10)}`, ""].join("\n"),
  { mode: 0o600 },
);
console.log(`Đã tạo ${path} (tên miền ${domain}, tài khoản quản trị "admin"). Mật khẩu nằm trong file, mở ra để xem.`);

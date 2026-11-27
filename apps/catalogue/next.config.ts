import { join } from "node:path";
import type { NextConfig } from "next";

// CATALOGUE_FIXTURES=1: build riêng cho e2e (thư mục .next-fixtures) với dữ liệu và cấu hình xưởng thử
// trong tests/fixtures. Mã trong src/ không bao giờ import fixture; chỉ cấu hình build đổi đích.
const fixtures = process.env.CATALOGUE_FIXTURES === "1";

// CATALOGUE_SERVER=1: bản chạy trong Docker (docs/DEPLOY.md), dữ liệu trong database, /admin có đăng nhập.
const server = process.env.CATALOGUE_SERVER === "1";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@thien-hien/shared"],
  // playwright-core: Chromium chụp phiếu bán hàng thành PDF, PNG (src/lib/server/sales/render.ts)
  serverExternalPackages: ["pg", "@electric-sql/pglite", "playwright-core", "exceljs"],
  ...(server && { output: "standalone" as const, outputFileTracingRoot: join(import.meta.dirname, "../..") }),
  // /admin tải ảnh sản phẩm qua server action (tối đa 8 MB, src/lib/admin/files.ts)
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
  ...(fixtures && {
    distDir: ".next-fixtures",
    turbopack: {
      resolveAlias: {
        "@/data/categories.json": "./tests/fixtures/categories.json",
        "@/data/products.json": "./tests/fixtures/products.json",
        "@/data/policies.json": "./tests/fixtures/policies.json",
        "@/lib/site.config": "./tests/fixtures/site.config.ts",
      },
    },
  }),
};

export default config;

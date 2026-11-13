import type { NextConfig } from "next";

// CATALOGUE_FIXTURES=1: build riêng cho e2e (thư mục .next-fixtures) với dữ liệu và cấu hình xưởng thử
// trong tests/fixtures. Mã trong src/ không bao giờ import fixture; chỉ cấu hình build đổi đích.
const fixtures = process.env.CATALOGUE_FIXTURES === "1";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@thien-hien/shared"],
  ...(fixtures && {
    distDir: ".next-fixtures",
    turbopack: {
      resolveAlias: {
        "@/data/categories.json": "./tests/fixtures/categories.json",
        "@/data/products.json": "./tests/fixtures/products.json",
        "@/lib/site.config": "./tests/fixtures/site.config.ts",
      },
    },
  }),
};

export default config;

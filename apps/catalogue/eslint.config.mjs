// Lớp 2 của bộ luật chống AI slop (docs/PLAN.md mục 9.2). Chỗ lệch so với plan: docs/DEVIATIONS.md.
import { defineConfig, globalIgnores } from "eslint/config";
import next from "@next/eslint-plugin-next";
import jsxA11y from "eslint-plugin-jsx-a11y";
import betterTailwind from "eslint-plugin-better-tailwindcss";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores([
    ".next/**",
    ".next-fixtures/**",
    "out/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    ".lighthouseci/**",
    "next-env.d.ts",
    "tests/slop-fixtures/**", // file sai có chủ đích, chỉ test tự kiểm mới đọc
  ]),
  ...tseslint.configs.strict,
  jsxA11y.flatConfigs.strict,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "@next/next": next, "better-tailwindcss": betterTailwind },
    settings: { "better-tailwindcss": { entryPoint: "src/app/globals.css" } },
    rules: {
      ...next.configs["core-web-vitals"].rules,
      "@next/next/no-img-element": "error",

      // Class phải tồn tại trong @theme: chặn mọi màu/cỡ/bo/bóng ngoài token
      "better-tailwindcss/no-unknown-classes": "error",
      "better-tailwindcss/no-conflicting-classes": "error",
      "better-tailwindcss/no-duplicate-classes": "error",
      "better-tailwindcss/no-restricted-classes": [
        "error",
        {
          restrict: [
            "\\[.+\\]", // giá trị tuỳ ý: w-[37px], bg-[#123]
            "^(.*:)?bg-(gradient|linear|radial|conic)-.*",
            "^(.*:)?(from|via|to)-.*",
            "^(.*:)?backdrop-.*",
            "^(.*:)?blur(-.*)?$",
            "^(.*:)?animate-(?!none).*", // pulse, bounce, ping, spin
            "^(.*:)?(scale|rotate|skew|-?translate)-.*", // chuyển động chỉ qua m-lift, m-zoom, m-press, m-enter
            "^(.*:)?(transition|duration|ease|delay)(-.*)?$",
            "^(.*:)?font-(semibold|bold|extrabold|black|light|thin)$",
            "^(.*:)?(shadow|ring|drop-shadow)(-.*)?$",
            "^(.*:)?(rounded-full|sticky|fixed)$", // dính chỉ qua utility bar-top, bar-bottom
            "^(.*:)?(text|bg|border)-opacity-.*",
            "^(.*:)?(text|bg|border|ring)-[a-z-]+/\\d+$", // pha độ trong suốt
            "^(.*:)?text-(center|right|justify)$", // toàn site căn trái
            "^(.*:)?(uppercase|italic|tracking-.*)$", // không nhãn viết hoa; tracking nằm trong token chữ
            "^(.*:)?border-l-[2-9]$", // thẻ có vạch màu bên trái
          ],
        },
      ],

      "no-restricted-syntax": [
        "error",
        { selector: "JSXAttribute[name.name='style']", message: "Không inline style. Dùng class token." },
        { selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]", message: "Không viết mã màu hex ngoài globals.css." },
        { selector: "JSXText[value=/\\p{Extended_Pictographic}/u]", message: "Không dùng emoji trong giao diện." },
        { selector: "Literal[value=/\\p{Extended_Pictographic}/u]", message: "Không dùng emoji trong giao diện." },
        {
          selector:
            "JSXOpeningElement[name.name=/^h[1-6]$/] JSXAttribute[name.name='className'][value.value=/text-(body|sku|spec)/]",
          message: "Heading phải dùng kiểu chữ heading.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "react-icons*",
                "@heroicons/*",
                "@radix-ui/react-icons",
                "framer-motion",
                "motion",
                "gsap",
                "aos",
                "swiper*",
                "embla-carousel*",
              ],
              message: "Chỉ dùng lucide-react. Không thêm thư viện animation/carousel.",
            },
            { group: ["@/data/*"], message: "Chỉ đọc dữ liệu qua lib/catalog.ts." },
            { group: ["**/tests/fixtures/*"], message: "Fixture không được dùng trong src." },
          ],
        },
      ],
      "max-lines": ["error", { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },
  { files: ["src/lib/catalog.ts"], rules: { "no-restricted-imports": "off" } },
);

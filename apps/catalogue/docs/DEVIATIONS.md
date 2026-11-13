# Chỗ lệch so với plan

Mỗi mục: chỗ lệch, lý do, ngày. Plan: `../../../docs/PLAN.md`.

## M0 (13/11/2026)

1. **Không có monorepo và app quản lý có sẵn.** Thư mục `ecomerce` trống, không tìm thấy app quản lý trên máy. Đã tạo workspace pnpm mới (`apps/*`, `packages/*`). `normalizeVietnamese`, `formatNumber`, `formatPrice` viết mới trong `packages/shared` (có test). Khi có app quản lý thì đối chiếu lại hai hàm này và quy ước SKU.
2. **TypeScript 6.0.3**, không phải 7.x mới nhất: `typescript-eslint` 8.72 chỉ hỗ trợ `typescript <6.1`.
3. **ESLint 9.39** theo đúng plan dù đã có ESLint 10: `eslint-plugin-jsx-a11y` 6.10 chỉ hỗ trợ tới ESLint 9.
4. **Tên luật better-tailwindcss.** Bản 4.11 đổi `no-unregistered-classes` thành `no-unknown-classes`. Option `restrict` và setting `entryPoint` giữ nguyên tên.
5. **`defineConfig` và `globalIgnores` của `eslint/config`** thay cho `tseslint.config` (đã deprecated). Thêm global ignore cho `.next`, `out`, báo cáo test, `next-env.d.ts` và `tests/slop-fixtures` (các file sai có chủ đích).
6. **Stylelint miễn trừ trong `globals.css`:** `custom-property-pattern` (biến `--text-display--line-height` và `--color-*: initial` là cú pháp Tailwind), `nesting-selector-no-missing-scoping-root` và `no-descending-specificity` (lồng `&` trong `@utility`), `import-notation: string` (`@import "tailwindcss"`), `declaration-no-important` (khối `prefers-reduced-motion` của chính plan dùng `!important`). Mọi file CSS khác vẫn chịu đủ luật.
7. **Font.** File subset đơn của @fontsource (`vietnamese-400.css`, ...) không có `unicode-range`, nạp chung sẽ làm trình duyệt tải cả hai subset. Đã viết `src/app/fonts.css`: 8 `@font-face` (2 họ, 2 weight, 2 subset `vietnamese` + `latin`, chỉ woff2) với `unicode-range` lấy từ @fontsource, `font-display: swap`. Plan ghi "bốn file" là bốn mặt chữ; thực tế là 8 file nhỏ, trình duyệt chỉ tải subset có ký tự trên trang. `fonts.css` được miễn `declaration-strict-value` cho `font-family`.
8. **zod 4:** `z.string().date()` thành `z.iso.date()`.
9. **Media query:** `@media (width >= 1024px)` (cú pháp range, Stylelint đòi) thay cho `min-width`, cùng nghĩa.
10. **`bar-top`, `bar-bottom`** khai báo trong `globals.css` cạnh lớp chuyển động, z-index lấy từ `tokens.json` (`z-header` 40, `z-bar` 50).
11. **check-slop luật 7 (trùng khối):** mỗi khối xuất hiện quá một lần luôn bị chặn; thiếu khối chỉ bị chặn với `--production`, để trang chủ trống của M0 qua được `verify`.
12. **check-slop luật 8** gom thành một luật `class-scope`: `bg-accent`, `bg-ink`, `m-*`, `bar-top`, `bar-bottom` chỉ ở file được phép (mục 7).
13. **check-slop luật 11 (một nút chính)** áp cho mọi `app/**/page.tsx` và mọi `.tsx` trong `src/components/` (trừ `ui/Button.tsx`); bỏ qua `app/dev/**` vì trang `/dev/ui` (M2) bày mọi trạng thái.
14. **check-slop luật 12:** "`[`…`]`" hiểu là chữ giữ chỗ trong ngoặc vuông viết hoa (`[MẪU]`, `[TODO_OWNER]`) và `[…]`, `[...]`.
15. **check-slop luật 13:** `rules/button-verbs.json` có cả "xoá" và "xóa" (hai cách bỏ dấu). Nhãn nút là biểu thức động (`{label}`) thì không kiểm được bằng tĩnh và được bỏ qua.
16. **Thứ tự cài thư viện:** thư viện chạy (`zustand`, `lucide-react`, `clsx`, `tailwind-merge`, Testing Library) cài ở milestone dùng tới, để `knip` không báo thừa. `schema.ts` viết sớm ở M0 vì `validate-data.ts` cần nó.
17. **Vitest** (repo mới, không có test runner sẵn).
18. **`typecheck` chạy `next typegen` trước `tsc`** để có `next-env.d.ts` và kiểu route khi chưa build.
19. **pnpm 12** chặn script cài đặt của thư viện: cho phép `esbuild`, `lefthook` trong `allowBuilds` của `pnpm-workspace.yaml`.

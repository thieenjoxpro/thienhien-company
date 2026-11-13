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
20. **Ngân sách JS trang chủ: 160 KiB gzip thay vì 130 KB.** Trang `/` của M0 chưa có dòng JS client nào mà runtime Next 16 + React 19 đã là 137.000 byte (Turbopack; Lighthouse đo, 13/11/2026). Build webpack khoảng 132.500 byte không tính polyfill, sát mức trần, và sẽ vượt ngay khi có component client ở M2. Mức 130 KB không đạt được với stack của plan, nên `lighthouserc.json` chặn ở 163.840 byte: nền framework khoảng 134 KB cộng 26 KB cho code của app. Các ngưỡng khác giữ nguyên (M0 đo được: performance 0,99, accessibility 1, SEO 1, LCP 784 ms, CLS 0,0002, TBT 134 ms). Muốn giữ 130 KB thì phải bỏ React khỏi trang tĩnh, việc đó nằm ngoài plan.
21. **Cổng chạy thử 4310** (`pnpm dev`, `pnpm start`, Playwright, LHCI, giá trị mặc định của `site.url`): cổng 3100 đang có app khác chạy trên máy. Playwright không dùng lại server có sẵn (`reuseExistingServer: false`) để không test nhầm app khác.

## M1 (13/11/2026)

22. **`createCatalog(source)` trong `catalog.ts`.** Các hàm của mục 4.2 được dựng từ một factory nhận dữ liệu thô; bản export dùng `src/data`. Nhờ vậy unit test đưa fixture vào mà `src/` không bao giờ import fixture. Dữ liệu được parse bằng zod ngay lúc nạp, dữ liệu sai làm build fail.
23. **`getRelatedProducts`:** "cùng danh mục" hiểu theo tiêu đề khối ở mục 5.4 ("Cùng nhóm {tên nhóm}"): cùng nhóm hàng cấp 1, khác mã, mẫu cùng danh mục con xếp trước, rồi mới trước cũ.
24. **Danh mục không còn sản phẩm có ảnh** thì ẩn khỏi `getCategories`, `getCategoryTree`, `countByCategory`, và `getCategory` trả `null` (trang danh mục sẽ 404). Số mẫu của danh mục cha tính cả danh mục con.
25. **Fixture `tests/fixtures`:** 24 mẫu thử, trong đó 22 mẫu có ảnh và 2 mẫu (TH-TN05, TH-MC05) cố ý không có ảnh để kiểm luật ẩn. Có 6 danh mục: 4 nhóm cộng `ban-le-coi`, `ban-le-la` để kiểm `includeChildren`. Ảnh thử là WebP xám đặc 1200×1200, mỗi ảnh một độ xám, sinh một lần bằng sharp (đã có sẵn trong cây phụ thuộc của Next) bằng script nằm ngoài repo; không thêm thư viện.
26. **Mô tả 4 danh mục thật** trong `src/data/categories.json` chỉ nói hàng gì và trang có thông tin gì, không có lời khen hay số liệu. Chủ xưởng có thể viết lại.
27. **`packages/shared`** đổi sang import không đuôi `.ts`, để `tsc` của app kiểm được mã nguồn package mà không cần bật `allowImportingTsExtensions`.

## M2 (13/11/2026)

28. **Build fixture cho e2e.** `CATALOGUE_FIXTURES=1` build vào `.next-fixtures`; `turbopack.resolveAlias` đổi `@/data/categories.json`, `@/data/products.json`, `@/lib/site.config` sang bản trong `tests/fixtures` (cấu hình xưởng thử, số điện thoại giả). Ảnh sản phẩm do `tests/e2e/test.ts` chặn và trả bằng ảnh xám, nên `public/` không chứa ảnh thử. Hệ quả: mọi chỗ trong `src/` phải import cấu hình xưởng đúng bằng `@/lib/site.config`, không dùng đường dẫn tương đối.
29. **`/dev/ui`** chỉ mở khi `NODE_ENV` khác production, hoặc khi đặt `SHOW_DEV_UI=1` (e2e đặt cờ này); trang là `force-dynamic` để đọc cờ lúc chạy, và luôn `noindex, nofollow`. Ảnh chụp cho người duyệt nằm ở `test-results/review/` sau mỗi lần chạy e2e (gồm `dev-ui-1440.png`, `dev-ui-390.png`, `phone-bar-390.png`). Đây không phải test so pixel.
30. **`Section` không có prop `tone`.** Khối tối tự đặt `bg-ink` qua `className`, vì luật `class-scope` chỉ cho `bg-ink` nằm trong Footer, ContactBand, Button. Thêm hai utility `screen-1`, `screen-2` (cao tối thiểu một, hai màn hình từ 1024px) cho prop `screens`.
31. **Menu điện thoại dùng `<dialog>` gốc** (lớp trên cùng của trình duyệt) thay vì lớp phủ `position: fixed`, nên không cần thêm utility dính màn hình nào. Esc do trình duyệt xử lý; Tab được giữ vòng trong menu bằng một listener; đóng xong focus về nút mở.
32. **Thêm `"use client"`** cho `CategoryMenu` (độ trễ 150ms khi rê chuột) và `PhoneBar` (IntersectionObserver), ngoài danh sách ở mục 2. `CategoryMenu` bắt rê chuột và focus bằng một listener gắn trên `<nav>`, vì jsx-a11y strict cấm gắn handler lên `<li>`. Bàn phím vẫn đủ đường: focus vào tên nhóm thì bảng mở, Tab đi vào bảng, Esc đóng.
33. **Tên landmark:** nav trên header là "Điều hướng chính", nav ở footer là "Nhóm hàng", để không có hai landmark trùng tên.
34. **`Photo` giữ prop `priority`** như hợp đồng ở mục 8, bên trong chuyển thành `preload` vì Next 16 đã bỏ `priority`.
35. **`Price` viết sớm ở M2** vì bảng nhóm hàng trên header cần giá; unit test của nó vẫn để ở M3.
36. **Link gạch chân khi rê chuột, không có hiệu ứng vẽ từ trái** như design README tả, vì chuyển động chỉ được đi qua bốn lớp `m-*` của plan.
37. **Vùng chạm:** link ngắn (ví dụ "Tôn") có `min-w-11` để đủ 44×44px. Test vùng chạm của e2e bỏ qua link nằm trong dòng văn bản, phần tử chỉ dành cho trình đọc màn hình, và đo checkbox theo cả nhãn bọc ngoài.
38. **check-slop luật 3:** mẫu ảnh ngoài đổi từ `placehold` thành `placehold.` (placehold.co, placehold.it), để chữ "placeholder" trong code không bị báo nhầm. Fixture sạch có thêm ca này.
39. **Chưa có logo Zalo** (`public/brand/zalo.svg`): nút Zalo tạm chỉ có chữ. Logo phải lấy từ bộ nhận diện chính thức của Zalo, không vẽ lại.
40. **Việc để lại cho M3:** từ 640px, nút chính trên header và nút chính của hero cùng nằm trong màn hình đầu của trang chủ, trái với luật "mỗi màn hình một nút tô màu". Cách xử lý dự kiến: ẩn nút trên header khi nút của hero còn trong màn hình, dùng chung cách theo dõi với PhoneBar.

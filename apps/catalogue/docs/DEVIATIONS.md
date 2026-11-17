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

## M3 (13/11/2026)

41. **Làm M3 khi chưa có ảnh thật** (người làm yêu cầu, 13/11/2026): mọi khối chạy trên fixture với ảnh xám. Build thật vẫn bị `check:data --production` chặn tới khi có đủ ảnh thật.
42. **`site.config` thêm `photos` (`warehouse`, `workshop`, `storefront`) và `workshopText`**: ảnh xưởng và chữ của chủ xưởng cho hero, khối Xưởng, trang giới thiệu. Trường null thì phần tử bị bỏ.
43. **Hero chữ 7 cột, ảnh 5 cột** (plan ghi 6/6), để ảnh 4:5 cộng đệm trên dưới vừa đúng một màn hình ở 1440×900.
44. **Câu của hero bỏ vế "trong ngày"** vì chủ xưởng chưa xác nhận; 0 mẫu thì bỏ cả câu. Chưa có quận thì h1 bỏ vế "ở {district}".
45. **Mục 40 đã xử lý:** `HeaderAction` ẩn nút chính trên header khi nút chính của trang (hero, dải liên hệ) còn trong màn hình. Hook `usePrimaryInView` dùng chung với `PhoneBar`. E2E kiểm đúng một nút tô màu ở đầu mỗi khối.
46. **Dải liên hệ:** tên quận là `h2` cỡ display, để khối có tiêu đề cho trình đọc màn hình; chưa có quận thì bỏ cả dải. Ở khối Xưởng, `h2` đứng sau ảnh trong DOM (ảnh bên trái), nên e2e kiểm "mỗi khối đúng một tiêu đề" thay cho "h2 là phần tử đầu tiên của khối".
47. **Ô nhóm hàng:** ảnh lấy từ `category.image`, chưa có thì dùng ảnh mẫu đầu tiên của nhóm; "từ {giá}" là giá thấp nhất trong nhóm. Ô "Tất cả {n} mẫu" là link chữ.
48. **Thêm `ListingHeader`** (breadcrumb, h1, số mẫu) dùng chung cho `/san-pham` và trang danh mục; danh sách xếp mẫu mới trước.
49. **Viền focus trên nền ink** đổi sang `on-ink`, vì viền màu ink nằm trên nền ink thì không thấy.
50. **Unit test ProductCard** render bằng `react-dom/server` và mock `next/link`, `next/image`, `site.config`; không thêm Testing Library.
51. **Cổng taste-skill (mục 9.8) chưa chạy:** cần tải và chạy mã từ GitHub (`npx skills add ...`), chờ người làm đồng ý. Ảnh để người duyệt nằm ở `test-results/review/` (`home-*.png`, `san-pham-*.png`).

## M4 (14/11/2026)

52. **Ô số lượng và nút "Thêm vào hỏi giá" trên trang chi tiết để sang M5**, cùng với danh sách hỏi giá; M4 có link "Hỏi riêng mã {sku} qua Zalo".
53. **Cột thông tin dính theo cuộn** qua utility `stick-aside` (top 96px) khai trong `globals.css`, chỉ được dùng trong `ProductInfo.tsx` (luật `class-scope` của check-slop), vì class `sticky` bị ESLint cấm.
54. **Thêm `"use client"`** cho `ProductGallery`, `RecentlyViewed`, `ProductBrowser` ngoài danh sách ở mục 2. "Mẫu vừa xem" lưu đủ dữ liệu của thẻ trong localStorage (`th-recent-v1`, tối đa 8 mẫu, đọc ghi trong try/catch), đọc sau khi hydrate.
55. **Lưới trang danh sách 3 cột từ 768px** (nằm trong vùng 9 cột cạnh cột danh mục, theo mục 5.3), thay cho 4 cột từ 1280px ở design README; khối "Mẫu mới về" và "Cùng nhóm" vẫn 4 cột.
56. **Bộ lọc trên desktop và bảng lọc mobile là hai bản render** của cùng `FilterBar`; bản bị ẩn có `display: none` nên không vào cây trợ năng. Trạng thái lọc đổi ngay trên giao diện, URL (`router.replace`, không cuộn) theo sau; Back và reload đọc lại từ URL. Ô tìm đẩy lên URL sau 250ms.
57. **Trang đang lọc:** thẻ `<meta name="robots" content="noindex, follow">` do component client chèn (React 19 đưa lên `<head>`), để trang danh sách vẫn là trang tĩnh; canonical luôn là URL gốc. Thêm `metadataBase` từ `site.url`.
58. **Nhãn độ dày luôn có một chữ số thập phân** ("2,0 mm"), theo design README của SpecTable.
59. **E2E trên Windows:** `tests/e2e/teardown.ts` tắt server `next start` còn sót trên cổng 4310 sau mỗi lần chạy, chỉ tắt tiến trình có dòng lệnh nằm trong repo này.

## M5 (14/11/2026)

60. **Danh sách hỏi giá đọc localStorage sau khi hydrate** (`skipHydration` của zustand persist, `QuoteCount` trên header gọi `rehydrate` một lần). Trước khi đọc xong, trang `/hoi-gia` hiện dòng "Đang mở danh sách hỏi giá."; số trên header chỉ hiện khi lớn hơn 0.
61. **Store chỉ lưu mã và số lượng** (`th-quote-v1`); tên, ảnh, đơn vị lấy lại từ catalogue. Mã không còn trong catalogue thì bị bỏ qua khi hiển thị. `createQuoteStore(storage)` để unit test dùng storage trong bộ nhớ.
62. **Tin nhắn bỏ dòng "Tên", "Giao tới"** khi khách không điền (mẫu ở mục 5.5 in "..." làm chỗ trống).
63. **PhoneBar không hiện ở `/hoi-gia`:** nút Zalo của thanh chỉ mở Zalo, không copy danh sách; ở trang này hành động chính duy nhất là nút gửi.
64. **`usePrimaryInView` quét lại khi DOM đổi** (MutationObserver), vì nút gửi ở `/hoi-gia` chỉ xuất hiện sau khi hydrate; trước đó nút trên header không biết để nhường chỗ.
65. **Mở Zalo bằng `window.open` sau khi copy xong.** Trình duyệt vẫn coi là thao tác của người dùng vì chỉ cách cú bấm một lần ghi clipboard. Zalo web không nhận nội dung soạn sẵn, nên khách tự dán.

## M6 (14/11/2026)

66. **Chính sách lưu trong `src/data/policies.json`** (`slug`, `title`, `updatedAt`, `body` markdown tối giản: đoạn văn, `## `, `- `), thay cho thư mục `data/policies/*.md`: đọc bằng import nên build fixture đổi được qua alias, và không cần thư viện markdown. Nội dung render bằng React, không chèn HTML thô. Hiện chưa có chính sách thật nào (nội dung do chủ xưởng viết), nên chưa có trang và chưa có cột "Chính sách" ở footer.
67. **Bỏ `tailwind-merge`, `cn()` chỉ còn `clsx`:** tailwind-merge chiếm khoảng 8 KB gzip trong JS client của mọi trang, đẩy trang chủ vượt ngân sách (165.434 byte so với trần 163.840). Chỗ duy nhất cần ghi đè (padding nút PhoneBar) viết bằng `max-sm:px-4`.
68. **`site.config` thêm `aboutText`** cho trang giới thiệu. Trang `/gioi-thieu` luôn có (header trỏ tới), thiếu chữ hay ảnh thì chỉ còn tiêu đề và link liên hệ.
69. **Tiêu đề trang:** mẫu `%s | Thiện Hiền` ở layout. Trang chủ dùng h1 làm tiêu đề, trang chi tiết dùng "Tên Mã". `/hoi-gia` và trang 404 không có canonical và đặt `noindex`; `robots.txt` chặn `/hoi-gia` và `/dev/`.
70. **Ô tìm trên trang 404** là form GET tới `/san-pham?q=`. Nút ghi "Xem mẫu khớp" vì "tìm" không có trong `rules/button-verbs.json`.
71. **Font chuyển sang `next/font/local`** (thay mục 7): Lighthouse đo LCP 2.510 ms vì chữ hero chờ font, mà font chỉ được tải sau khi CSS về. `next/font` preload 4 file Be Vietnam Pro (latin, vietnamese; 400, 500) và tạo font dự phòng đã chỉnh cỡ; IBM Plex Mono không preload. Mỗi subset là một họ riêng có `unicode-range`, ghép trong `--font-sans`, `--font-mono`. Sau khi đổi: LCP 759 ms, performance 1. File woff2 chép từ @fontsource 5.3.0 vào `src/fonts/` kèm giấy phép OFL (Turbopack không dựng được `next/font/local` khi trỏ thẳng vào `node_modules`), và bỏ hai gói @fontsource. Bỏ `src/app/fonts.css` và ngoại lệ Stylelint của nó.

## Sau M6: dữ liệu demo và khu quản trị (16/11/2026)

72. **Dữ liệu demo trong `src/data`** (người dùng yêu cầu để xem thử catalogue khi chưa có hàng thật): 24 mẫu, 6 danh mục, 2 chính sách chép từ `tests/fixtures`; ảnh là hình vẽ nét có ghi "Ảnh demo", mã, tên, tạo bằng `pnpm demo:photos`. Đây là chỗ lệch có chủ ý với luật "không bịa ảnh, số liệu": ảnh tự ghi là demo, và `src/data/DEMO.md` làm chốt, `check:data --production` báo lỗi khi file còn. Thông tin xưởng (địa chỉ, Zalo, chữ giới thiệu) vẫn để null, không bịa.
73. **Khu quản trị `/admin`** (plan mục 2 ghi v1 không có CMS, không đăng nhập): người dùng chọn bản chạy trên máy. `/admin` chỉ mở khi `NODE_ENV=development` (`pnpm dev`), ghi thẳng vào `src/data/*.json` và `public/products`, `public/workshop`; muốn lên web thì commit và push. Bản build trả 404 cho mọi trang `/admin` và mọi server action từ chối, nên không cần đăng nhập. Có CRUD sản phẩm (kèm ảnh: tải lên, mô tả, đổi thứ tự, xoá), danh mục (đổi slug kéo theo sản phẩm và danh mục con, chặn xoá khi còn dùng), chính sách, thông tin xưởng và ba ảnh xưởng. Mọi form kiểm bằng cùng schema zod với site và các luật của `check:data`.
74. **Thông tin xưởng chuyển từ `site.config.ts` sang `src/data/site.json`** để admin sửa được; `site.config.ts` đọc file qua `SiteDataSchema`. Luật `required-null` của check-slop đọc cả hai chỗ.
75. **Trang công khai chuyển vào route group `src/app/(site)/`** (URL không đổi) để `/admin` có khung riêng, không header, footer, PhoneBar của site. Layout gốc chỉ còn `<html>`, `<body>`, font. 404 có hai bản: `(site)/not-found.tsx` cho `notFound()` trong trang công khai, `app/not-found.tsx` tự bọc `SiteChrome` cho URL không khớp route nào. check-slop bỏ `(site)/` khỏi đường dẫn khi so luật theo trang.
76. **Ảnh tải lên qua admin đặt tên `<mã>-<thời điểm>.<đuôi>`** (thay `<mã>-<số>.webp` của mục 4.3), để cache ảnh của Next không giữ ảnh cũ khi một tên bị dùng lại; vẫn bắt đầu bằng mã nên `check:data` chấp nhận. Nhận webp, jpg, png tới 8 MB (server action nâng `bodySizeLimit` lên 10 MB). Admin không tự nén hay đổi cỡ ảnh.
77. **Nhãn nút thêm động từ** "lưu", "tải", "đưa", "tạo", "huỷ" vào `rules/button-verbs.json` cho các nút của admin.

## Design 3: rebrand theo artifact design mới (16/11/2026)

78. **Thay hệ thiết kế** theo artifact "Thiện Hiền - Catalogue web (design mới)" (https://claude.ai/artifact/1KLzjUiUx8qMnmKigK88YJ), người dùng yêu cầu. Bỏ hệ "giấy xám, đồng thau, phẳng" của plan mục 7 và các luật đi kèm: nền trắng, xanh than `#1C2127`, vàng `#F5B301`, nút Zalo `#0068FF`; tiêu đề Barlow Condensed 700 viết hoa; thẻ viền bo 6px, nhãn "Mới", nút thêm vào hỏi giá trên thẻ. `design/README.md`, `design/tokens.json` viết lại; bỏ `design/components/`.
79. **Luật ESLint nới theo design**: cho `font-semibold`, `font-bold`, `uppercase`, `rounded-full`, `text-center`, và đúng một bóng `shadow-float`. Vẫn cấm gradient, blur, giá trị tuỳ ý, hex ngoài token, `sticky`/`fixed` ngoài utility, chuyển động ngoài bốn lớp m-*. Thang khoảng cách check-slop thêm 5, 10, 14, 16.
80. **Luật "một nút tô màu mỗi màn hình" đổi thành "mỗi file tối đa một nút Zalo"**: design có nút Zalo, nút tối, hộp vàng cùng lúc. Test e2e kiểm hero có đúng một nút Zalo và hai nút nổi.
81. **Trang chủ** đổi từ 5 khối cao một màn hình sang: hero tối hoa văn + cột mẫu mới và hộp "Mua sỉ theo mã", dải 3 bước (`#cach-hoi-gia`), danh mục, kệ "Hàng mới về" và một kệ cho mỗi nhóm hàng (6 thẻ, 4 trên điện thoại), "Ghé xưởng xem hàng". check-slop đòi 5 khối mới: Hero, QuoteSteps, CategoryGrid, ProductShelf, VisitWorkshop.
82. **Header không còn dính**: thanh trên cùng + hàng logo, ô tìm + thanh danh mục cao khoảng 190px. Lối liên hệ luôn có là hai nút nổi (từ 640px) và PhoneBar (dưới 640px).
83. **Ô chữ giữ chỗ của design** ([SĐT XƯỞNG], [GIỜ MỞ CỬA]) không đưa vào site: phần tử dùng dữ kiện còn null thì bỏ, như luật cũ. Hình vẽ minh hoạ sản phẩm của design (SVG trong `scripts/demo-art/`) thay ảnh demo cũ.
84. **Bỏ IBM Plex Mono**: design không dùng chữ mono. Thêm Be Vietnam Pro 600, 700 và Barlow Condensed 700 (latin, vietnamese) từ @fontsource 5.3.0, kèm giấy phép OFL.
85. **`site.config.ts` không parse zod nữa** (sửa lỗi của mục 74): file này vào component client nên zod (khoảng 31 KB nén) lên mọi trang. Giờ chỉ ép kiểu; `check:data` kiểm `site.json` bằng `SiteDataSchema`, admin kiểm khi ghi.
86. **Trần JS Lighthouse 160 KiB lên 168 KiB**: Lighthouse đếm cả JS Next tải trước cho các link trong màn hình (`/san-pham`, trang chi tiết, khoảng 8 KB). JS của riêng trang chủ khoảng 159 KB. Đo 16/11: performance 1, accessibility 1, LCP 914 ms, CLS 0.
87. **Hiện dần khi cuộn được phép (nới luật 7 của plan)** theo yêu cầu chủ xưởng 16/11: `m-reveal` dùng CSS scroll-driven animation (`animation-timeline: view()`), không JS, chỉ cho thẻ sản phẩm, ô danh mục và khối "Ghé xưởng"; hero và khối đầu trang không có. Trình duyệt chưa hỗ trợ (Firefox trước 159) hoặc bật giảm chuyển động thì hiện tĩnh.
88. **View transition giữa trang**: dùng `<ViewTransition>` có sẵn trong React 19.3 (Next 16.4 không cần cấu hình), không thêm thư viện. Ảnh thẻ biến sang ảnh chính trang chi tiết (tên `anh-{mã}`), lưới lọc chuyển mượt khi đổi kết quả. Tên chỉ đặt ở lưới mà mỗi mã xuất hiện một lần (kệ nhóm trang chủ, trang danh sách, "Cùng nhóm"), vì hai phần tử trùng tên thì trình duyệt bỏ cả hiệu ứng. Lệnh chặn import `motion`, `gsap`, `aos` giữ nguyên.
89. **`m-pop`**: số đếm hỏi giá trên header và dấu tick "Đã thêm" nảy 200 ms khi đổi.
90. **Chuyển trang có hướng** (theo hướng dẫn view transitions của Next 16.4): `PageSlide` bọc nội dung từng `page.tsx` (trang chủ, danh sách, danh mục, chi tiết) trong `<ViewTransition>`; không đặt ở `template.tsx` vì template dựng lại khi đổi tham số lọc, làm ô lọc mất trạng thái, link gắn `transitionTypes`. Thẻ sản phẩm, ô danh mục, ô danh mục con là `nav-forward` (trượt sang trái), breadcrumb là `nav-back` (trượt sang phải). Nút Back của trình duyệt và đổi tham số lọc không trượt. Header nằm ngoài khung nên đứng yên; không đặt `view-transition-name` cho header vì phần tử có tên mất cú bấm trong lúc hiệu ứng chạy. `FilterContext` bỏ qua URL do chính nó ghi, vì URL về trễ hơn state khi view transition đang chạy.
91. **Bảng lọc trên điện thoại trượt vào từ cạnh phải** (`m-drawer`, `@starting-style` và `transition-behavior: allow-discrete`). Viết `transition-*` tách lẻ vì luật stylelint cấm chữ `all` trong `transition` cũng bắt nhầm `allow-discrete`.
92. **Danh sách hỏi giá**: mỗi hàng là một `<ViewTransition>` đặt tên theo mã; mẫu bỏ trượt sang phải, mẫu mới trượt vào từ trái, hàng còn lại dồn lên. Danh sách đọc `useDeferredValue` vì store zustand đổi đồng bộ, không kích hoạt view transition.
93. **`m-reveal` mạnh hơn**: trượt 32px (trước 16px), so le theo vị trí trong nhóm 6 (`--lag` 0 đến 40% khoảng entry).
94. **Chế độ máy chủ (`CATALOGUE_SERVER=1`, Docker trên VPS)** theo yêu cầu chủ xưởng 16/11, thay cho hướng "v1 chỉ là site tĩnh": dữ liệu trong PostgreSQL (bảng `content`, mỗi bộ dữ liệu một dòng jsonb, vẫn kiểm bằng zod), `/admin` có đăng nhập (`admin_users`, `admin_sessions`), trang công khai render theo yêu cầu từ bản dữ liệu trong bộ nhớ (`src/lib/server/store.ts`). Không bật biến này thì mọi thứ như cũ: JSON trong `src/data`, trang tĩnh, `/admin` chỉ khi `pnpm dev`. Hướng dẫn: `docs/DEPLOY.md`.
95. **`site` là Proxy** (`site.config.ts`): ở chế độ máy chủ đọc thông tin xưởng từ store, để các file đang dùng `site.phone` không phải đổi sang async. Component client (`PhoneBar`, `MobileNav`) nhận `phone`, `zaloWholesale` qua props vì trên trình duyệt không có store. `metadata` phụ thuộc dữ kiện sửa được đổi thành `generateMetadata`.
96. **Ảnh tải lên ở chế độ máy chủ** nằm trong `UPLOAD_DIR` (volume), phục vụ qua route `/products/[file]`, `/workshop/[file]`; đường dẫn ảnh trong dữ liệu không đổi. Ảnh có sẵn trong `public/` vẫn do Next phục vụ trước.
97. **PGlite** (`@electric-sql/pglite`) là dependency để dev và unit test chạy được chế độ máy chủ không cần Docker (`DATABASE_URL=pglite://...`). Production dùng `pg`.
98. **Design V2** (artboard HomeV2, MobileHomeV2, HoiGia, HoiGiaMobile, Logo của artifact design, 17/11): năm kệ hàng gộp thành khối "Mẫu đang có tại xưởng" có tab theo nhóm (`ProductShowcase`, thẻ mọi nhóm render ở server, tab chỉ ẩn hiện); 3 bước hỏi giá xuống dưới khối mẫu; bỏ ô "Mới về" và hộp "Mua sỉ theo mã" ở hero, hero có hai nút Zalo và Gọi. Khối trang chủ cho `check:slop --production`: Hero, CategoryGrid, ProductShowcase, QuoteSteps, VisitWorkshop.
99. **Dữ kiện thật của xưởng** lấy từ design V2 (chủ xưởng ghi "là thật"): địa chỉ, giờ mở cửa, số chính có Zalo, hai số phụ, tên công ty, mã số thuế. Thêm vào `site.json` các trường `legalName`, `taxCode`, `contacts` (tối đa 4 người nghe máy), sửa ở /admin/xuong.
100. **Bật tắt giá theo từng sản phẩm** (`showPrice` trong products.json, mặc định bật; ô "Hiện giá" ở form sản phẩm). Tắt giá, hoặc chưa có giá, thì hiện "Liên hệ báo giá" thay cho "Giá theo số lượng".
101. **Logo A "Khối thép"** (`LogoMark`, SVG nội tuyến, màu qua token fill-*) thay ô vàng "TH"; `app/icon.svg` là favicon. Khối giảm chuyển động không xoá `transform` của phần tử trong SVG, vì logo dựng hình bằng transform.
102. **Danh sách hỏi giá là popup** (`QuoteDialog`, `<dialog>` gốc; điện thoại là tấm từ đáy). Mã popup tải lười khi mở lần đầu, dữ liệu mẫu lấy ở `/api/hoi-gia`, để không cộng JS vào mọi trang. Link tới `/hoi-gia` ở header, khối 3 bước, footer không tải sẵn (`prefetch={false}`): bấm là mở popup, trang `/hoi-gia` vẫn dùng chung `QuotePanel` cho lúc chưa có JS. Bỏ ô tên, nơi giao, chọn sỉ lẻ; thay bằng ô ghi chú. Nút trừ cộng: từ 100 mỗi lần 10. Nhãn nút "Copy danh sách, mở Zalo" (5 chữ, design viết 6).
103. **Bỏ bảng nhóm hàng khi rê chuột** (`CategoryMenu`): thanh nhóm hàng V2 chỉ là link. Footer không còn ký hiệu bản quyền (luật emoji bắt nhầm), ghi "{tên công ty}, {năm}".
104. **Ô tìm không điều khiển bằng state** (`SearchBox`, `defaultValue`): khách gõ trước khi trang gắn JS thì React không xoá chữ. `FilterContext` quay về `router.replace`: `history.replaceState` bị router của Next ghi đè lúc trang vừa tải.
105. **Bản đồ nhúng cuối footer** (`mapEmbedUrl`, chỉ nhận link `https://www.google.com/maps/embed`; ô admin nhận cả thẻ `<iframe>` và tự lấy src). iframe `loading="lazy"`, không tải tới khi cuộn gần footer. `mapUrl` là link địa điểm "Xưởng Sắt Thiện Hiền" chủ xưởng đưa, mọi nút Chỉ đường mở link này. Fixture e2e để `mapEmbedUrl` null để test không tải iframe của Google.

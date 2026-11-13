# Plan triển khai: Catalogue công khai Thiện Hiền (Next.js)

Cập nhật: 12/11/2026, bản 2 (đã soát theo taste-skill 2.5, xem mục 0b). Tài liệu này viết cho agent (Claude Code / Codex) tự chạy từ M0 đến M7, và cho người duyệt ở các cổng kiểm tra.

- Design system (nguồn sự thật về giao diện): https://claude.ai/artifact/EvgwiUbNiBofxQq6R46DPS
- Khảo sát thị trường: https://claude.ai/artifact/SPHye3PgH7HT8sWvmYMenH
- Site tham khảo bố cục: hammered.vn. Chỉ học cấu trúc; không lấy ảnh, chữ, màu, font, code của họ.

## 0. Cách agent làm việc với plan này

1. Làm tuần tự từng milestone. Không sang milestone sau khi `pnpm verify` của milestone hiện tại chưa xanh.
2. Mỗi milestone là một nhánh + một PR. Commit nhỏ, theo từng task.
3. Không tự thêm thư viện ngoài danh sách ở mục 2. Cần thêm thì ghi vào `docs/DEVIATIONS.md` kèm lý do rồi mới thêm.
4. Không tự bịa nội dung kinh doanh (số năm kinh nghiệm, địa chỉ, giá, chứng nhận). Giá trị chưa có để `null` trong `site.config.ts`; phần tử dùng giá trị đó không được render (không in chữ giữ chỗ lên trang), và script chặn build production khi trường bắt buộc còn `null`.
5. Gặp điểm mơ hồ: chọn phương án mặc định ghi ở mục 11, ghi vào `docs/DEVIATIONS.md`, làm tiếp. Không dừng lại hỏi, trừ khi việc đó không hoàn tác được.
6. Tên phiên bản thư viện và tên option của plugin trong tài liệu này viết theo hiểu biết tại thời điểm soạn. Trước khi cấu hình, đọc README của đúng phiên bản vừa cài và sửa cho khớp; ghi chỗ lệch vào `docs/DEVIATIONS.md`.

## 0b. Kết quả soát bản 1 theo taste-skill 2.5

Loại trang theo skill: **place** (xưởng có cửa mở cho khách tới, catalogue là phần hàng hoá), ngành **workshop**. Skill được đọc như tài liệu; các script của skill (dealer, copy-lint, consistency, gate) chưa chạy trong phiên soạn plan, nên agent phải chạy chúng ở mục 9.8.

| # | Lỗi ở bản 1 | Luật của skill | Sửa ở bản 2 |
|---|---|---|---|
| 1 | Hai màu tô (xanh tôn + vàng) cộng xanh Zalo | Một màu nhấn; mỗi màn hình đúng một nút tô màu | Bảng `paper-grey-brass` của skill: giấy xám, chữ gần đen, một màu đồng thau cho nút chính |
| 2 | Tiêu đề 40px, đậm 700 | h1 72/38, h2 48/30, weight 400, chữ khít; không 600+ | Thang chữ mới, chỉ 400 và 500 |
| 3 | Thẻ nền trắng có viền, bảng có khung | Một kiểu thẻ, không hộp lồng hộp; place: ảnh và thẻ vuông góc | Thẻ là ảnh + chữ trên trang; bảng là hàng mở; bo 0 và 2px |
| 4 | Ô giữ chỗ ghi mã thay ảnh, tiền tố `[MẪU]`, chữ `TODO_OWNER` | Mọi visual phải vẽ ra; không placeholder, không chữ giữ chỗ | Sản phẩm chưa có ảnh không lên trang; giá trị thiếu thì bỏ phần tử |
| 5 | Dải 4 ô icon "cam kết dịch vụ" | Không icon minh hoạ; không có bằng chứng thì bỏ | Bỏ khối này |
| 6 | Thanh hotline tối trên đầu, 3 nút tròn nổi có bóng | Chỉ header được dính; điện thoại dùng thanh hành động ở đáy | Bỏ cả hai; thêm `PhoneBar` |
| 7 | Cấm mọi chuyển động | Hero vào một lần; thẻ nhấc 2px, ảnh phóng 1,03, nút lún khi bấm; không fade khi cuộn | Lớp chuyển động nhỏ trong `globals.css` |
| 8 | Nhãn viết hoa, badge "Mới" tô vàng | Không nhãn viết hoa; accent chỉ cho nút chính | Nhãn viết thường; bỏ badge |
| 9 | Tagline hai mảnh làm h1; nút "+ Hỏi giá", "Đã thêm" | h1 gọi tên loại hàng + nơi chốn, một con số thật ở màn hình đầu; nút là động từ + thứ nhận được; hành động chính một cách viết | h1 và nhãn nút mới ở mục 5 |
| 10 | Chữ 13-14px trên thẻ | Chữ để đọc từ 16px | Dòng trên thẻ 16px |
| 11 | Trang chủ nhiều khối ngắn | Mỗi khối một hoặc hai màn hình, hai lề bằng nhau, ảnh dẫn trang | Trang chủ 5 khối, mỗi khối có ảnh thật |

Chỗ cố ý không theo skill: trang cửa hàng và danh mục là lưới tra cứu nên dài hơn hai màn hình; số điện thoại và địa chỉ thật của xưởng được in đầy đủ (skill chỉ cấm khi brief không cung cấp).

## 1. Phạm vi

**Có:** trang chủ, cửa hàng có tìm + lọc, trang danh mục, trang chi tiết sản phẩm, danh sách hỏi giá gửi qua Zalo, trang giới thiệu, liên hệ, chính sách, SEO, deploy.

**Không có ở v1:** giỏ hàng, thanh toán, đăng nhập, đánh giá sản phẩm, blog/tin tức, đa ngôn ngữ, chế độ tối, chat bot, CMS. Dữ liệu sản phẩm v1 là file trong repo; v2 mới đọc từ API NestJS.

## 2. Stack và vị trí trong repo

- App mới: `apps/catalogue` trong monorepo pnpm hiện có (nếu thư mục app trong repo đặt tên khác thì theo quy ước đang dùng).
- Next.js (cùng major với app quản lý, App Router, TypeScript strict), React Server Components mặc định; chỉ đánh `"use client"` cho: ô tìm kiếm, bộ lọc, nút hỏi giá, trang `/hoi-gia`, menu mobile.
- Tailwind CSS v4 (cấu hình bằng `@theme` trong CSS).
- `zod` (kiểm dữ liệu), `zustand` + `persist` (danh sách hỏi giá), `lucide-react` (chỉ glyph điều khiển), `@fontsource/be-vietnam-pro` (400, 500), `@fontsource/ibm-plex-mono` (400, 500), `clsx` + `tailwind-merge`.
- Kiểm tra: ESLint 9 flat config, `eslint-plugin-better-tailwindcss`, `eslint-plugin-jsx-a11y`, Stylelint + `stylelint-declaration-strict-value`, Vitest hoặc Jest (theo cái repo đang dùng) + Testing Library, Playwright + `@axe-core/playwright`, `@lhci/cli`, `knip`, `lefthook`, và taste-skill (`design-taste-frontend`) cài vào repo để chạy cổng ở mục 9.8.
- Tái dùng từ app quản lý: `normalizeVietnamese`, các hàm format tiền/số. Nếu chưa nằm trong package chung thì tách ra `packages/shared` ở M0.

## 3. Cấu trúc thư mục

```
apps/catalogue/
  AGENTS.md                      # luật cho agent (mục 9.6)
  docs/DEVIATIONS.md
  rules/banned-copy.json         # mục 9.4
  scripts/check-slop.mjs         # mục 9.4
  scripts/validate-data.ts       # mục 9.5
  public/products/<SKU>-<n>.webp
  public/brand/zalo.svg, logo.svg
  src/
    app/
      layout.tsx  globals.css  not-found.tsx  sitemap.ts  robots.ts
      page.tsx                               # trang chủ
      san-pham/page.tsx                      # cửa hàng
      san-pham/[slug]/page.tsx               # chi tiết
      danh-muc/[slug]/page.tsx
      hoi-gia/page.tsx
      gioi-thieu/page.tsx  lien-he/page.tsx
      chinh-sach/[slug]/page.tsx
    components/
      ui/        Button, Input, Checkbox, Container, Section, Photo
      layout/    Header, CategoryMenu, MobileNav, Footer, PhoneBar
      catalogue/ CategoryTile, CategoryGrid, ProductCard, ProductGrid, FilterBar,
                 CategorySidebar, SearchBox, SpecTable, ProductGallery, Price,
                 Breadcrumb, RelatedProducts, RecentlyViewed
      quote/     AddToQuoteButton, QuoteCount, QuoteList, SendQuote
      home/      Hero, NewProducts, WorkshopSplit, ContactBand
    data/        categories.json  products.json  policies/*.md
    lib/         catalog.ts  schema.ts  filters.ts  quote-store.ts  quote-message.ts
                 format.ts  seo.ts  site.config.ts  cn.ts
  tests/         unit/  e2e/
```

## 4. Dữ liệu

### 4.1 Schema (`src/lib/schema.ts`)

```ts
import { z } from "zod";

export const CategorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  parentSlug: z.string().nullable(),        // tối đa 2 cấp
  description: z.string().max(160),
  image: z.string().nullable(),
  order: z.number().int(),
});

export const ProductSchema = z.object({
  sku: z.string().regex(/^TH-[A-Z]{2}\d{2,3}$/),   // TH-BL03; trùng SKU app quản lý
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(4).max(80),
  categorySlug: z.string(),
  summary: z.string().min(20).max(200),            // 1-2 câu, có số liệu
  images: z.array(z.object({ src: z.string(), alt: z.string().min(8) })).max(6), // rỗng => sản phẩm không lên trang
  specs: z.array(z.object({ label: z.string(), value: z.string() })).min(2),
  mainSpec: z.string(),                            // "Ø16 × 100 mm", hiện trên thẻ
  filters: z.object({
    thicknessMm: z.number().positive().optional(),
    material: z.string().optional(),
    finish: z.string().optional(),
  }),
  unit: z.enum(["cái", "bộ", "tấm", "mét", "kg"]),
  priceFrom: z.number().int().positive().nullable(), // VND, giá lẻ khởi điểm
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  updatedAt: z.string().date(),
});
export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;
```

### 4.2 Lớp truy cập (`src/lib/catalog.ts`)

Mọi trang chỉ gọi các hàm này, không import JSON trực tiếp. Khi sang v2 chỉ thay phần thân hàm bằng `fetch` tới API.

```ts
getCategories(): Promise<Category[]>
getCategoryTree(): Promise<CategoryNode[]>
getCategory(slug): Promise<Category | null>
getProducts(): Promise<Product[]>
getProduct(slug): Promise<Product | null>
getProductsByCategory(slug, { includeChildren: true }): Promise<Product[]>
getRelatedProducts(product, limit = 4): Promise<Product[]>   // cùng danh mục, khác sku
getFeaturedProducts(limit = 8), getNewProducts(limit = 8)
countByCategory(): Promise<Record<string, number>>
```

### 4.3 Dữ liệu và ảnh

- Danh mục cấp 1: `pano`, `ban-le`, `ton`, `mam-cau-thang`. Cấp 2 chỉ tạo khi có từ 4 sản phẩm trở lên.
- Tiền tố mã: `PN` pano, `BL` bản lề, `TN` tôn, `MC` mâm cầu thang.
- `catalog.ts` chỉ trả về sản phẩm có ít nhất một ảnh. Danh mục không còn sản phẩm nào thì không hiện.
- **Việc của người, trước M3:** chụp tối thiểu 16 ảnh thật (mỗi nhóm 3 sản phẩm + 1 ảnh nhóm), cộng 3 ảnh xưởng (kho hàng, máy dập đang chạy, mặt tiền). Vuông 1:1 cho sản phẩm, cạnh dài từ 1600px. Agent không được thay bằng ảnh tải về hay ảnh tạo sinh.
- Cho tới khi có ảnh: unit test và e2e dùng `tests/fixtures/products.json` với ảnh thử trong `tests/fixtures/photos` (ảnh xám đặc, chỉ để máy kiểm bố cục). Fixture không bao giờ được import từ `src/`.

### 4.4 Cấu hình site (`src/lib/site.config.ts`)

```ts
export const site = {
  name: "Thiện Hiền",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  district: null as string | null,        // "Bình Tân, TP.HCM"   BẮT BUỘC khi production
  street: null as string | null,          // địa chỉ đầy đủ chủ xưởng đưa
  mapUrl: null as string | null,
  openingHours: null as string | null,    // "7:00 đến 17:30, thứ Hai đến thứ Bảy"
  phone: null as string | null,
  zaloWholesale: null as string | null,   // BẮT BUỘC khi production
  zaloRetail: null as string | null,      // null => dùng chung zaloWholesale
  showPrice: true,
  mainAction: "Hỏi giá qua Zalo",         // một cách viết, dùng ở nav, hero, dải liên hệ, PhoneBar
} as const;
```

Phần tử nào đọc trường `null` thì không render. Không có chuỗi giữ chỗ nào đi ra HTML.

## 5. Đặc tả từng trang

Thứ tự khối là bắt buộc. Mọi cỡ, màu, chữ lấy từ design system. Khung nội dung 1280px, lề 48px (điện thoại 16px), mọi khối bám hai lề đó.

### 5.1 Khung chung

1. **Header** (dính, nền `ground`, kẻ dưới `line`, không bóng, không co giãn khi cuộn): trái: chữ "Thiện Hiền" (`title`). Giữa: Pano, Bản lề, Tôn, Mâm cầu thang, Xưởng. Phải: nút glyph tìm, link "Danh sách hỏi giá" kèm `QuoteCount`, nút `primary` "Hỏi giá qua Zalo". Rê vào tên nhóm sau 150ms mở bảng phẳng toàn chiều rộng: cột link danh mục con + 3 ảnh sản phẩm có tên và giá từ. 640 đến 1023px: logo, nút chính, nút menu 44px. Dưới 640px: logo, tìm, menu; menu mở toàn màn hình.
2. **PhoneBar** (dưới 640px, dính đáy): hai nút cao 48px: `primary` "Hỏi giá qua Zalo" và `secondary` "Gọi xưởng" (ẩn nếu `phone` null). Chỉ hiện khi nút chính của hero đã cuộn khỏi màn hình và không có nút chính nào khác đang trong màn hình.
3. **Footer** (nền `ink`): 3 cột: xưởng (địa chỉ, giờ mở cửa, link "Chỉ đường tới xưởng"), nhóm hàng, chính sách. Hàng cuối `small`: tên xưởng, năm. Không form nhận tin, không icon mạng xã hội, không câu chào.

Không có thanh trên cùng, không có nút nổi, không có gì khác dính màn hình.

### 5.2 Trang chủ `/` (5 khối, khoảng 45 chữ mỗi màn hình)

1. **Hero** (đúng 1 màn hình, vào một lần khi tải). Lưới 12 cột: chữ 6 cột trái, ảnh 6 cột phải cao hết khối (ảnh kho hàng hoặc hàng xếp chồng, 4:5, `priority`). Chữ căn đáy trái:
   - h1 (`display`): "Xưởng pano và bản lề cửa sắt ở {district}"
   - một câu `body`, 15 đến 30 chữ, có con số đếm từ dữ liệu: "{n} mẫu pano, bản lề, tôn và mâm cầu thang, có sẵn mã và kích thước. Chọn mẫu, gửi danh sách, xưởng báo giá sỉ trong ngày." (bỏ vế "trong ngày" nếu chủ xưởng không xác nhận)
   - nút `primary` "Hỏi giá qua Zalo" + nút `secondary` "Xem catalogue"
2. **Bốn nhóm hàng** (1 màn hình): h2 "Bốn nhóm hàng". Lưới không đều: ô Pano rộng 6 cột cao 2 hàng; Bản lề, Tôn, Mâm cầu thang mỗi ô 3 cột (2 trên, 1 dưới cùng với một ô chữ "Tất cả {n} mẫu" là link). Mỗi `CategoryTile`: ảnh phủ kín ô, dưới ảnh trong cùng ô là tên (`h3`) và "{n} mẫu, từ {giá} đ" (`body`). Bốn ảnh khác nhau.
3. **Mẫu mới về** (1 màn hình): h2 "Mẫu mới về", link "Xem tất cả mẫu mới" ở cùng hàng bên phải. Một hàng 4 `ProductCard` (điện thoại: 2×2). Ẩn cả khối nếu dưới 4 sản phẩm `isNew`.
4. **Xưởng** (1 màn hình, composition khác khối 2 và 3): ảnh máy dập đang chạy 7 cột trái, chữ 5 cột phải: h2 "Hàng dập tại xưởng", 2 đến 3 câu do chủ xưởng viết (máy gì, thép gì, nhận làm theo mẫu hay không), nút `secondary` "Xem xưởng" tới `/gioi-thieu`. Chưa có chữ của chủ xưởng thì bỏ cả khối.
5. **Dải liên hệ** (nền `ink`, 1 màn hình, là khoảnh khắc chữ của trang): tên quận đặt cỡ `display` màu `on-ink`; bên dưới hai cột `body`: địa chỉ + giờ mở cửa | số điện thoại. Nút `primary` "Hỏi giá qua Zalo", link "Chỉ đường tới xưởng" (mở `mapUrl` ở tab mới). Không nhúng bản đồ.

Không có: carousel, dải icon, số liệu thống kê, lời chứng thực, logo đối tác, tin tức.

### 5.3 Cửa hàng `/san-pham` và danh mục `/danh-muc/[slug]`

- Breadcrumb (`small`) → h1 (`h2`): tên danh mục hoặc "Tất cả sản phẩm"; cạnh h1 một dòng `body` "{n} mẫu".
- Từ 1024px: `CategorySidebar` 3 cột trái (danh sách chữ, mục đang chọn gạch chân, kèm số lượng kiểu `sku`) | 9 cột phải: `FilterBar` + `ProductGrid` 3 cột. Dưới 1024px: nút `secondary` "Lọc mẫu" mở bảng lọc toàn màn hình; lưới 2 cột.
- **FilterBar**: ba nhóm (Độ dày, Vật liệu, Bề mặt), mỗi nhóm là danh sách checkbox có nhãn `body` và số lượng. Chỉ hiện giá trị có trong tập hiện tại. Sắp xếp bằng `<select>`: Mới nhất, Giá tăng dần, Mã A đến Z. Link "Xoá lọc" khi đang lọc. Không dùng chip tô màu.
- Trạng thái trên URL: `?q=&day=2,3&vl=thep-ct3&bm=ma-kem&sx=moi`; `router.replace` không cuộn. Trang có tham số lọc: `noindex, follow`, canonical về URL gốc.
- Lọc phía client (dưới 500 mẫu), logic thuần trong `lib/filters.ts`. Tìm không dấu trên `sku` + `name`.
- Rỗng: một dòng `body` "Không có mẫu nào khớp với lọc này." + link "Xoá lọc".
- Trên 48 thẻ: nút `secondary` "Hiện thêm 24 mẫu".

### 5.4 Chi tiết `/san-pham/[slug]`

1. Breadcrumb.
2. Lưới 12 cột: `ProductGallery` 7 cột trái (ảnh chính 1:1 + hàng ảnh nhỏ bấm để đổi; không zoom, không lightbox) | 5 cột phải, dính theo cuộn trên desktop, theo thứ tự: mã (`sku`) → h1 (`h2`) → `summary` (`body`) → `Price` → `SpecTable` → ô số lượng + nút `primary` "Thêm vào hỏi giá" → link "Hỏi riêng mã này qua Zalo".
3. `RelatedProducts`: h2 "Cùng nhóm {tên nhóm}", 4 thẻ.
4. `RecentlyViewed`: h2 "Mẫu vừa xem", tối đa 4 thẻ; ẩn khi rỗng.

Không tab, không đánh giá. `Price`: "từ 18.000 đ / cái" hoặc "Giá theo số lượng". Sau khi thêm: nút giữ nguyên nhãn, dòng trạng thái `success` bên dưới "Đã thêm {mã} vào danh sách hỏi giá." kèm link "Xem danh sách hỏi giá".

### 5.5 Danh sách hỏi giá `/hoi-gia`

- h1 (`h2`) "Danh sách hỏi giá". Mỗi mục là một hàng mở ngăn bằng `line`: ảnh 96px, mã, tên, thông số chính, ô số lượng kèm đơn vị, link "Bỏ mẫu này".
- Hai ô nhập tuỳ chọn có nhãn nhìn thấy: "Tên của anh chị", "Giao tới đâu".
- Hai radio "Mua sỉ" (mặc định), "Mua lẻ" → chọn số Zalo.
- Nút `primary` "Hỏi giá qua Zalo": tạo tin nhắn (`buildQuoteMessage`) → copy vào clipboard → dòng trạng thái `success` "Đã copy danh sách. Dán vào khung chat Zalo vừa mở." → mở `https://zalo.me/<số>` ở tab mới. Clipboard lỗi: hiện ô văn bản đã chọn sẵn và dòng "Copy đoạn này rồi dán vào Zalo."
- Rỗng: dòng `body` "Danh sách chưa có mẫu nào." + nút `secondary` "Xem catalogue".

Mẫu tin nhắn (`lib/quote-message.ts`, unit test snapshot):

```
Chào xưởng Thiện Hiền, tôi cần báo giá:
1. TH-BL03 Bản lề cối 16 ly: 50 cái
2. TH-PN01 Pano dập ô vuông: 20 tấm
Tên: ...
Giao tới: ...
```

Store (`lib/quote-store.ts`): `items: { sku, qty }[]`, `add`, `setQty` (1 đến 9999), `remove`, `clear`; `persist` key `th-quote-v1`; đọc/ghi trong try/catch; cờ `hasHydrated` để tránh lệch hydrate.

### 5.6 Trang phụ

- `/gioi-thieu`: h1 "Xưởng Thiện Hiền ở {district}", chữ của chủ xưởng, 3 ảnh xưởng khác nhau. `/lien-he`: địa chỉ, giờ, điện thoại, nút chính, link chỉ đường. `/chinh-sach/[slug]`: markdown từ `data/policies`.
- `not-found.tsx`: h1 "Không có trang này", ô tìm, bốn link nhóm hàng.

## 6. SEO và hiệu năng

- `generateStaticParams` cho sản phẩm, danh mục, chính sách. `generateMetadata`: title `"<Tên> <SKU> | Thiện Hiền"`, description = `summary`, canonical tuyệt đối, Open Graph dùng ảnh đầu tiên.
- JSON-LD: `Organization` + `LocalBusiness` (layout, chỉ khi `district` và `street` đã có), `BreadcrumbList` (danh mục, chi tiết), `Product` (chi tiết; chỉ thêm `offers` khi có giá).
- `sitemap.ts` (mọi trang tĩnh, `lastModified` từ `updatedAt`), `robots.ts`.
- Ảnh: `next/image`, `sizes` khai báo đúng theo lưới, ảnh hero `priority`, còn lại lazy. Nguồn WebP rộng tối đa 1200px.
- Font: tự host, chỉ nạp subset `vietnamese` + `latin`, weight 400 và 500 cho cả hai họ (bốn file), `font-display: swap`.
- Ngân sách (Lighthouse CI, mobile): Performance >= 90, Accessibility >= 95, SEO >= 95, LCP <= 2500ms, CLS <= 0.05, TBT <= 200ms, JS trang chủ <= 130KB gzip.

## 7. Token và chuyển động trong code (`src/app/globals.css`)

Xoá sạch thang mặc định của Tailwind rồi chỉ khai báo token của hệ. Class ngoài token không tồn tại và bị ESLint báo lỗi.

```css
@import "tailwindcss";

@theme {
  --color-*: initial;  --font-*: initial;  --text-*: initial;  --font-weight-*: initial;
  --radius-*: initial; --shadow-*: initial; --breakpoint-*: initial; --tracking-*: initial;

  --color-ground: #e8e8e3;   --color-surface: #dcdcd6;
  --color-ink: #181715;      --color-ink-muted: #5c5b55;
  --color-on-ink: #e8e8e3;   --color-on-ink-muted: #a9a9a2;
  --color-line: #c4c4bd;
  --color-accent: #bfb21a;   --color-accent-strong: #a89c12;  --color-on-accent: #181715;
  --color-danger: #a3271b;   --color-success: #1f6b3f;

  --font-sans: "Be Vietnam Pro", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
  --font-weight-normal: 400;  --font-weight-medium: 500;

  --text-display: 38px;  --text-display--line-height: 46px;  --text-display--letter-spacing: -0.03em;
  --text-h2: 30px;       --text-h2--line-height: 38px;       --text-h2--letter-spacing: -0.02em;
  --text-h3: 24px;       --text-h3--line-height: 32px;       --text-h3--letter-spacing: -0.01em;
  --text-title: 18px;    --text-title--line-height: 26px;    --text-title--font-weight: 500;
  --text-body: 16px;     --text-body--line-height: 26px;
  --text-small: 14px;    --text-small--line-height: 22px;
  --text-label: 13px;    --text-label--line-height: 18px;    --text-label--font-weight: 500;
  --text-button: 16px;   --text-button--line-height: 20px;   --text-button--font-weight: 500;
  --text-sku: 14px;      --text-sku--line-height: 20px;      --text-sku--font-weight: 500;
  --text-spec: 16px;     --text-spec--line-height: 26px;
  --text-price: 20px;    --text-price--line-height: 28px;    --text-price--font-weight: 500;

  --radius-none: 0px;  --radius-btn: 2px;

  --breakpoint-sm: 640px;  --breakpoint-md: 768px;  --breakpoint-lg: 1024px;  --breakpoint-xl: 1280px;
}

/* Cỡ desktop của bốn kiểu tiêu đề: một chỗ duy nhất, không lặp ở component */
@media (min-width: 1024px) {
  :root {
    --text-display: 72px; --text-display--line-height: 80px;
    --text-h2: 48px;      --text-h2--line-height: 56px;
    --text-h3: 28px;      --text-h3--line-height: 36px;
    --text-title: 20px;   --text-title--line-height: 28px;
  }
}

/* Lớp chuyển động: toàn bộ chuyển động của site nằm ở đây */
@utility m-lift  { transition: transform 200ms; &:hover { transform: translateY(-2px); } }
@utility m-zoom  { overflow: hidden; & > img { transition: transform 200ms; } .m-lift:hover & > img, &:hover > img { transform: scale(1.03); } }
@utility m-press { transition: background-color 150ms, color 150ms, transform 150ms; &:active { transform: translateY(1px); } }
@utility m-enter { animation: enter 600ms both; }
@keyframes enter { from { opacity: 0; transform: translateY(8px); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; transform: none !important; } }
```

Nếu Tailwind phiên bản cài không cho ghi đè biến `--text-*` trong `:root` theo media query, tạo utility riêng cho bốn kiểu tiêu đề và ghi vào `DEVIATIONS.md`.

- Bước spacing hợp lệ (1 = 4px): `0, 1, 2, 3, 4, 6, 8, 12, 24`.
- `m-enter` chỉ dùng trong `Hero`. `m-lift` và `m-zoom` chỉ dùng trong `ProductCard`, `CategoryTile`. `m-press` chỉ trong `Button`.
- Dính màn hình chỉ qua hai utility `bar-top` (Header) và `bar-bottom` (PhoneBar), khai báo cạnh lớp chuyển động; class `sticky`, `fixed` bị cấm trong JSX.
- `bg-accent` chỉ xuất hiện trong `Button.tsx` và `QuoteCount.tsx`.
- `bg-ink` chỉ xuất hiện trong `Footer.tsx`, `ContactBand.tsx` và trạng thái hover của nút phụ.
- `check-slop.mjs` so màu trong `globals.css` với `design/tokens.json`; lệch thì fail.

## 8. Component: hợp đồng chính

| Component | Props | Ghi chú |
|---|---|---|
| `Button` | `variant: primary/secondary`, `asChild` | Một chiều cao 48px, một bo góc. Theo README Button |
| `Photo` | `src`, `alt`, `ratio: 1/1, 4/5, 3/2`, `sizes`, `priority` | Bọc `next/image`; nền `surface` khi tải; vuông góc; không nhận chú thích |
| `ProductCard` | `product` | Cả thẻ là link; không nút, không badge. Theo README ProductCard |
| `CategoryTile` | `category`, `count`, `priceFrom`, `span` | Ảnh phủ ô, chữ dưới ảnh trong cùng ô |
| `SpecTable` | `specs` | Hàng mở, `th scope="row"` |
| `Price` | `priceFrom`, `unit` | Đọc `site.showPrice` |
| `FilterBar` | `facets`, `value`, `onChange` | Checkbox + select gốc của trình duyệt, có nhãn |
| `AddToQuoteButton` | `sku`, `unit` | Client; kèm dòng trạng thái `role="status"` |
| `SendQuote` | `channel` | Client; clipboard + mở Zalo |
| `PhoneBar` | (không) | Client; IntersectionObserver theo nút chính đang hiện |
| `Container` / `Section` | `as`, `heading`, `screens: 1/2`, `tone: paper/ink` | Giữ hai lề và chiều cao khối; trang không tự đặt padding ngang |

Quy ước: một component một file, không quá 150 dòng; chỉ `ui/` nhận `className`. Mỗi route render đúng một `Button variant="primary"` trong mỗi màn hình.

## 9. Bộ luật chống AI slop

Nguyên tắc: thứ gì máy kiểm được thì để máy chặn, không dựa vào lời dặn. Bốn lớp, tất cả chạy trong `pnpm verify`.

### 9.1 Lớp 1: token đóng (Tailwind `@theme`)

Mục 7. Vì `--color-*: initial`, các class như `bg-purple-500`, `text-gray-400`, `rounded-2xl`, `shadow-xl`, `text-5xl` không còn tồn tại.

### 9.2 Lớp 2: ESLint (`eslint.config.mjs`)

```js
import next from "@next/eslint-plugin-next";
import jsxA11y from "eslint-plugin-jsx-a11y";
import betterTailwind from "eslint-plugin-better-tailwindcss";
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...tseslint.configs.strict,
  jsxA11y.flatConfigs.strict,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "@next/next": next, "better-tailwindcss": betterTailwind },
    settings: { "better-tailwindcss": { entryPoint: "src/app/globals.css" } },
    rules: {
      ...next.configs["core-web-vitals"].rules,
      "@next/next/no-img-element": "error",

      // Class phải tồn tại trong @theme => chặn mọi màu/cỡ/bo/bóng ngoài token
      "better-tailwindcss/no-unregistered-classes": "error",
      "better-tailwindcss/no-conflicting-classes": "error",
      "better-tailwindcss/no-duplicate-classes": "error",
      "better-tailwindcss/no-restricted-classes": ["error", { restrict: [
        "\\[.+\\]",                                   // giá trị tuỳ ý: w-[37px], bg-[#123]
        "^(.*:)?bg-(gradient|linear|radial|conic)-.*", "^(.*:)?(from|via|to)-.*",
        "^(.*:)?backdrop-.*", "^(.*:)?blur(-.*)?$",
        "^(.*:)?animate-(?!none).*",                  // pulse, bounce, ping, spin
        "^(.*:)?(scale|rotate|skew|-?translate)-.*",  // chuyển động chỉ qua m-lift, m-zoom, m-press, m-enter
        "^(.*:)?(transition|duration|ease|delay)(-.*)?$",
        "^(.*:)?font-(semibold|bold|extrabold|black|light|thin)$",
        "^(.*:)?(shadow|ring|drop-shadow)(-.*)?$",
        "^(.*:)?(rounded-full|sticky|fixed)$",        // dính chỉ qua utility bar-top, bar-bottom
        "^(.*:)?(text|bg|border)-opacity-.*", "^(.*:)?(text|bg|border|ring)-[a-z-]+/\\d+$", // pha độ trong suốt
        "^(.*:)?text-(center|right|justify)$",        // toàn site căn trái
        "^(.*:)?(uppercase|italic|tracking-.*)$",     // không nhãn viết hoa; tracking nằm trong token chữ
        "^(.*:)?border-l-[2-9]$",                     // thẻ có vạch màu bên trái
      ] }],

      "no-restricted-syntax": ["error",
        { selector: "JSXAttribute[name.name='style']", message: "Không inline style. Dùng class token." },
        { selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]", message: "Không viết mã màu hex ngoài globals.css." },
        { selector: "JSXText[value=/\\p{Extended_Pictographic}/u]", message: "Không dùng emoji trong giao diện." },
        { selector: "Literal[value=/\\p{Extended_Pictographic}/u]", message: "Không dùng emoji trong giao diện." },
        { selector: "JSXOpeningElement[name.name=/^h[1-6]$/] JSXAttribute[name.name='className'][value.value=/text-(body|sku|spec)/]", message: "Heading phải dùng kiểu chữ heading." },
      ],
      "no-restricted-imports": ["error", { patterns: [
        { group: ["react-icons*", "@heroicons/*", "@radix-ui/react-icons", "framer-motion", "motion", "gsap", "aos", "swiper*", "embla-carousel*"],
          message: "Chỉ dùng lucide-react. Không thêm thư viện animation/carousel." },
        { group: ["@/data/*"], message: "Chỉ đọc dữ liệu qua lib/catalog.ts." },
        { group: ["**/tests/fixtures/*"], message: "Fixture không được dùng trong src." },
      ] }],
      "max-lines": ["error", { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },
  { files: ["src/lib/catalog.ts"], rules: { "no-restricted-imports": "off" } },
);
```

Nếu `no-unregistered-classes` hoặc tên option `restrict` khác ở phiên bản cài được, giữ nguyên ý đồ và sửa theo README của plugin (xem luật 0.6).

### 9.3 Lớp 3: Stylelint (`.stylelintrc.json`)

```json
{
  "extends": ["stylelint-config-standard"],
  "plugins": ["stylelint-declaration-strict-value"],
  "rules": {
    "scale-unlimited/declaration-strict-value": [
      ["/color$/", "fill", "stroke", "background", "border-radius", "box-shadow", "font-size", "font-family"],
      { "ignoreValues": ["transparent", "inherit", "currentColor", "none", "0"] }
    ],
    "declaration-property-value-disallowed-list": {
      "/^background(-image)?$/": ["/gradient/"],
      "/^(backdrop-)?filter$/": ["/blur/"],
      "transition": ["/all/"]
    },
    "declaration-no-important": true,
    "at-rule-no-unknown": [true, { "ignoreAtRules": ["theme", "utility", "variant", "source"] }]
  },
  "overrides": [{ "files": ["src/app/globals.css"], "rules": { "scale-unlimited/declaration-strict-value": null } }]
}
```

### 9.4 Lớp 4: `scripts/check-slop.mjs` (không phụ thuộc thư viện)

Quét `src/**/*.{ts,tsx,md,json}` và fail (exit 1) kèm đường dẫn + dòng khi gặp:

1. **Cụm từ cấm** trong `rules/banned-copy.json` (so khớp không dấu, không phân biệt hoa thường):
   ```json
   ["chất lượng vượt trội", "hàng đầu", "uy tín số 1", "giải pháp toàn diện", "nâng tầm", "đẳng cấp",
    "tận tâm", "chuyên nghiệp", "không ngừng", "sứ mệnh", "đồng hành cùng", "kiến tạo", "tối ưu hoá trải nghiệm",
    "khám phá ngay", "tìm hiểu thêm", "xem thêm", "đọc tiếp", "đang cập nhật", "lorem ipsum",
    "seamless", "elevate", "unlock", "empower", "cutting-edge", "world-class", "welcome to"]
   ```
2. **Số liệu khoe không có nguồn**: regex `\b\d+\+?\s*(năm kinh nghiệm|khách hàng|dự án|đại lý|sản phẩm đã bán)` ngoài `site.config.ts`.
3. **Ảnh ngoài**: chuỗi chứa `unsplash.`, `pexels.`, `pixabay.`, `picsum.`, `placehold`, `placeholder.com`, `hammered.vn`, hoặc `http(s)://` trong `src=`.
4. **Spacing ngoài thang**: class `(p|m|gap|space)[xytrbl]?-N` với N không thuộc `0,1,2,3,4,6,8,12,24`.
5. **Tên sản phẩm viết hoa toàn bộ** trong `products.json`.
6. **Dấu gạch dài** (`—`) và ba chấm trang trí trong chuỗi giao diện.
7. **Trùng khối**: trong `app/page.tsx`, mỗi component cấp khối (`Hero`, `CategoryGrid`, `NewProducts`, `WorkshopSplit`, `ContactBand`) xuất hiện đúng một lần.
8. **Accent và dải tối**: `bg-accent` chỉ có trong `Button.tsx`, `QuoteCount.tsx`; `bg-ink` chỉ trong `Footer.tsx`, `ContactBand.tsx`, `Button.tsx`. Lớp chuyển động `m-*` chỉ ở các file nêu ở mục 7.
9. **Lệch token**: giá trị màu trong `globals.css` khác `design/tokens.json`.
10. **Trường bắt buộc còn `null`** trong `site.config.ts` (`district`, `zaloWholesale`) khi chạy với cờ `--production`.
11. **Một nút chính**: mỗi file trong `app/**/page.tsx` và mỗi component cấp khối chứa tối đa một `variant="primary"`.
12. **Chú thích ảnh và chữ giữ chỗ**: không `<figcaption>`; không chuỗi `TODO`, `[`…`]`, "mẫu thử", "đang cập nhật", "sắp có" trong `src/`.
13. **Nhãn nút**: mọi chuỗi con của `<Button>` phải bắt đầu bằng một động từ trong `rules/button-verbs.json` (hỏi, thêm, xem, gọi, gửi, lọc, xoá, hiện, chỉ, bỏ, copy) và dài 1 đến 5 chữ.
14. **Ảnh lặp**: một `src` ảnh không xuất hiện hai lần trong cùng một file trang.


### 9.5 Lớp dữ liệu: `scripts/validate-data.ts`

Parse `categories.json`, `products.json` bằng zod; kiểm thêm: `sku` và `slug` không trùng; `categorySlug` tồn tại; mọi file trong `images` có thật trong `public/products` và tên bắt đầu bằng `sku`; `specs` có đủ "Kích thước" hoặc "Độ dày"; mọi ảnh có `alt` từ 8 ký tự; với `--production`: có ít nhất 12 sản phẩm có ảnh và cả bốn nhóm đều có hàng.

### 9.6 `AGENTS.md` (luật ngắn cho agent, đặt ở gốc app)

```
- Đọc design/README.md và design/tokens.json trước khi viết UI. Không tự đặt màu, cỡ chữ, bo góc.
- Trang phẳng: không thẻ có nền/viền/bóng, không hộp lồng hộp, không gradient, không badge, không icon minh hoạ, không emoji.
- Mỗi màn hình: một ảnh thật, một nút tô màu, khoảng 45 chữ. Căn trái. Hai lề bằng nhau.
- Tiêu đề weight 400. Không dùng 600 trở lên. Không viết hoa toàn bộ.
- h1 gọi tên loại hàng và nơi chốn. Tiêu đề khối là danh từ. Nút là động từ + thứ nhận được.
- Hành động chính luôn viết "Hỏi giá qua Zalo".
- Không bịa: số liệu, lời khen, logo đối tác, ảnh. Thiếu dữ kiện thì bỏ phần tử, không in chữ giữ chỗ.
- Chuyển động chỉ qua m-enter, m-lift, m-zoom, m-press. Không fade khi cuộn.
- Trạng thái rỗng, lỗi, đang tải có cho mọi danh sách và form; mỗi lỗi nằm dưới ô của nó.
- Chạy `pnpm verify` trước mỗi commit. Không eslint-disable; cần ngoại lệ thì ghi DEVIATIONS.md.
```

### 9.7 Lệnh và cổng kiểm tra

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "lint:css": "stylelint \"src/**/*.css\"",
    "typecheck": "tsc --noEmit",
    "check:slop": "node scripts/check-slop.mjs",
    "check:data": "tsx scripts/validate-data.ts",
    "check:dead": "knip",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "lhci": "lhci autorun",
    "verify": "pnpm lint && pnpm lint:css && pnpm typecheck && pnpm check:slop && pnpm check:data && pnpm check:dead && pnpm test",
    "verify:full": "pnpm verify && pnpm build && pnpm test:e2e && pnpm lhci"
  }
}
```

- `lefthook` pre-commit: `lint`, `check:slop`, `typecheck`. Pre-push: `verify`.
- CI (GitHub Actions) trên mọi PR: `verify:full` + `check:slop --production` và `check:data --production` chỉ trên nhánh `main`.
- Playwright: mỗi route chạy ở 390×844 và 1280×800; kiểm axe không có lỗi serious/critical, không cuộn ngang, mọi vùng chạm >= 44px; ảnh chụp `toHaveScreenshot` cho trang chủ, cửa hàng, chi tiết, hỏi giá (ngưỡng lệch 0,2%).
- Cổng người duyệt (sau M3, M4, M6): xem ảnh chụp Playwright ở 1440 và 390 cạnh design system; mọi chỗ lệch phải sửa trước khi sang milestone kế.

### 9.8 Cổng taste-skill (chạy thật trong repo, sau M3, M4, M6)

1. Cài: `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"`. Cần Node 22+ và Chrome.
2. Build tĩnh (`output: "export"`) ra `out/`.
3. Theo đúng bước 6 trong `SKILL.md` của skill, với `--kind place`, `--category "pano, bản lề cửa sắt, tôn, mâm cầu thang"`, `--primary "Hỏi giá qua Zalo"`, `--root out`, lần lượt cho `out/index.html`, một trang danh mục, một trang chi tiết: `copy-lint.mjs`, `consistency.mjs` (1440, 1024, 820, 768, 390), `assets/layout/check.mjs`, `perf.mjs`, rồi `gate.mjs`.
4. Sửa mọi FAIL, tối đa ba vòng, tới khi dòng cuối là `GATE: PASS` hoặc `GATE: OPEN`.
5. FAIL nào do cố ý lệch (mục 0b: lưới tra cứu dài, số điện thoại và địa chỉ thật, site dùng token riêng thay cho `system.css` của kit) thì ghi vào `.taste-skill/waivers.json` kèm lý do. Không sửa file của kit, không giấu phần tử khỏi checker.
6. Dán dòng `GATE:` và danh sách waiver vào mô tả PR.

## 10. Milestone

Mỗi milestone: danh sách task → tiêu chí nghiệm thu. "Xong" nghĩa là `pnpm verify` xanh và tiêu chí đạt.

### M0. Nền tảng và hàng rào (làm trước mọi UI)

1. Tạo `apps/catalogue` (Next.js, TS strict, Tailwind v4), thêm vào workspace.
2. Tách `normalizeVietnamese` và format tiền vào package dùng chung nếu chưa có.
3. Viết `globals.css` theo mục 7; nạp font tự host trong `layout.tsx`.
4. Cấu hình ESLint, Stylelint, knip, lefthook, Vitest, Playwright, LHCI theo mục 9.
5. Viết `check-slop.mjs`, `banned-copy.json`, `validate-data.ts`, `AGENTS.md`, `DEVIATIONS.md`.
6. Chép `README.md` và `tokens.json` của design system vào `apps/catalogue/design/`.
7. Viết bộ fixture vi phạm trong `tests/slop-fixtures/` (mỗi luật một file sai).

Nghiệm thu: `pnpm verify` xanh trên app trống; chạy lint + check-slop trên từng fixture đều fail đúng luật (có test tự động kiểm việc này); trang `/` hiển thị một dòng chữ đúng font.

### M1. Dữ liệu

1. `schema.ts`, `catalog.ts`, `site.config.ts`, `format.ts`.
2. `categories.json` (4 nhóm), `products.json` (rỗng cho tới khi có hàng thật) và `tests/fixtures/products.json` (24 mẫu thử kèm ảnh thử).
3. Unit test: schema từ chối dữ liệu sai; `getProductsByCategory` gồm cả danh mục con; `countByCategory`; `formatPrice(18000) === "18.000 đ"`.

Nghiệm thu: `check:data` xanh trên fixture; `check:data --production` fail vì chưa đủ 12 sản phẩm có ảnh (đúng ý).

### M2. Khung trang và UI nền

1. `ui/`: Button, Input, Checkbox, Container, Section, Photo.
2. `layout/`: Header, CategoryMenu, MobileNav, Footer, PhoneBar.
3. Trang `/dev/ui` (chỉ ở môi trường dev, `noindex`) bày mọi component và trạng thái.
4. E2E: menu mobile mở/đóng bằng bàn phím, focus bị giữ trong menu, Esc đóng.

Nghiệm thu: ảnh chụp `/dev/ui` khớp các preview trong design system; axe sạch; ở 1440 và 390 hai lề của header, một khối mẫu và footer trùng nhau từng pixel (test đo `getBoundingClientRect`).

### M3. Trang chủ và danh mục

0. Điều kiện: đã có ảnh thật theo mục 4.3. Chưa có thì dừng ở đây và báo người làm.
1. `home/` và `catalogue/` phần hiển thị: Hero, CategoryTile, CategoryGrid, NewProducts, WorkshopSplit, ContactBand, ProductCard, ProductGrid, Price, Breadcrumb.
2. `/`, `/danh-muc/[slug]`, `/san-pham` (chưa lọc).
3. Unit test ProductCard: không có `priceFrom` hiện "Giá theo số lượng"; `showPrice=false` cũng vậy. Test `catalog.ts`: sản phẩm không ảnh bị loại.
4. E2E trang chủ ở 1440×900: mỗi khối cao 900 hoặc 1800px (sai số 8px), h2 là phần tử đầu của khối, mỗi khối có ít nhất một `<img>` đã tải, đúng một nút `primary` trong mỗi màn hình.

Nghiệm thu: lưới 2/3/4 cột đúng breakpoint; không cuộn ngang ở 320px; cổng taste-skill lần 1 (mục 9.8); cổng người duyệt 1.

### M4. Chi tiết, tìm kiếm, lọc

1. `/san-pham/[slug]` đầy đủ mục 5.4; `RelatedProducts`, `RecentlyViewed`.
2. `lib/filters.ts` + `FilterBar`, `CategorySidebar`, `SearchBox`; đồng bộ URL.
3. Unit test filters: lọc nhiều giá trị là OR trong một nhóm, AND giữa các nhóm; tìm không dấu; sắp xếp. E2E: lọc → reload → kết quả giữ nguyên; nút Back khôi phục lọc.

Nghiệm thu: mọi trang chi tiết có SpecTable từ 2 hàng trong màn hình đầu ở 1440×900; cổng taste-skill lần 2; cổng người duyệt 2.

### M5. Danh sách hỏi giá

1. `quote-store.ts`, `quote-message.ts`, `quote/*`, trang `/hoi-gia`, QuoteCount.
2. Unit test: snapshot tin nhắn; `setQty` kẹp 1..9999; persist. E2E: thêm 2 mẫu từ hai trang chi tiết → `/hoi-gia` → sửa số lượng → bấm gửi → clipboard chứa đúng nội dung và có tab mới tới `zalo.me`.

Nghiệm thu: luồng trên chạy được trên mobile viewport; reload không mất danh sách; không có cảnh báo hydrate.

### M6. Trang phụ, SEO, hiệu năng

1. `/gioi-thieu`, `/lien-he`, `/chinh-sach/[slug]`, `not-found`.
2. Metadata, JSON-LD, sitemap, robots theo mục 6.
3. Test: mỗi route có đúng một h1, title và canonical duy nhất; JSON-LD parse được.

Nghiệm thu: `pnpm lhci` đạt ngân sách mục 6; cổng taste-skill lần 3; cổng người duyệt 3.

### M7. Nội dung thật và deploy

1. Người làm: chụp đủ ảnh, nhập `products.json` thật (hoặc script xuất từ app quản lý), điền các trường `null` trong `site.config.ts`, viết chữ cho khối Xưởng và trang giới thiệu.
2. `check:slop --production` và `check:data --production` xanh.
3. Deploy: Vercel (mặc định) hoặc `output: "export"` rồi để Caddy trên VPS phục vụ; trỏ domain; gửi sitemap lên Google Search Console.
4. Kiểm tay trên 2 điện thoại thật (Android tầm trung, iPhone) với mạng 4G.

Nghiệm thu: site chạy trên domain thật, gửi thử một danh sách hỏi giá tới Zalo của xưởng thành công.

### Sau v1 (không làm trong đợt này)

API đọc sản phẩm từ NestJS (`showOnWeb`, `publicPrice`), revalidate theo tag khi sửa hàng trong app quản lý, xuất catalogue PDF, form hỏi giá gửi về Telegram.

## 11. Quyết định mặc định khi chưa có trả lời

| Câu hỏi | Mặc định |
|---|---|
| Có hiện giá lẻ khởi điểm không? | Có (`showPrice: true`); đổi một cờ là tắt toàn site |
| Zalo nào nhận sỉ / lẻ? | `null`; nút Zalo không render ở dev, build production bị chặn tới khi điền |
| Tên miền | Biến môi trường `NEXT_PUBLIC_SITE_URL` |
| Logo | Chữ "Thiện Hiền" bằng Be Vietnam Pro 500 cho tới khi có file logo |
| Tôn bán theo mét hay kg | Theo `unit` của từng sản phẩm |
| Ảnh chưa có | Sản phẩm đó không lên trang; M3 không bắt đầu khi chưa có bộ ảnh tối thiểu |
| Analytics | Không cài ở v1 |

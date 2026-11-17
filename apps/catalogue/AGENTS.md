# Luật cho agent: catalogue Thiện Hiền

Plan đầy đủ: `../../docs/PLAN.md`. Chỗ lệch so với plan: `docs/DEVIATIONS.md`.

- Đọc design/README.md và design/tokens.json trước khi viết UI (design 3, artifact https://claude.ai/artifact/1KLzjUiUx8qMnmKigK88YJ). Không tự đặt màu, cỡ chữ, bo góc ngoài token.
- Tiêu đề: `font-display` (Barlow Condensed 700) viết hoa, kèm vạch accent qua `SectionHeading` hoặc `PageTitle`. Chữ thường Be Vietnam Pro 400 đến 700.
- Nút qua `<Button>`: `zalo` cho mọi nút mở Zalo, `dark` cho thêm vào hỏi giá, `outline`, `outlineLight`. Mỗi file tối đa một `variant="zalo"`.
- Thẻ sản phẩm, hộp: viền `line` bo `card`. Không gradient, không blur, không bóng ngoài `shadow-float` của hai nút nổi, không emoji.
- Hành động chính luôn viết "Hỏi giá qua Zalo". Nút là động từ + thứ nhận được, tối đa 5 chữ.
- Không bịa: địa chỉ, số điện thoại, giờ mở cửa, lời giới thiệu chỉ lấy từ site.json. Thiếu dữ kiện thì bỏ phần tử, không in chữ giữ chỗ.
- Mọi phần tử bấm được cao và rộng từ 44px. Trạng thái rỗng, lỗi có cho mọi danh sách và form; mỗi lỗi nằm dưới ô của nó.
- `site.config.ts` vào cả component client: không import zod hay thư viện nặng vào đó.
- Chạy `pnpm verify` trước mỗi commit. Không eslint-disable; cần ngoại lệ thì ghi DEVIATIONS.md.

## Lệnh

| Lệnh | Làm gì |
|---|---|
| `pnpm dev` | Chạy dev server; khu quản trị ở http://localhost:4310/admin (chỉ khi dev) |
| `pnpm demo:photos` | Render ảnh demo từ hình vẽ trong `scripts/demo-art/` theo `src/data/products.json` |
| `pnpm verify` | lint, lint:css, typecheck, check:slop, check:data, knip, unit test |
| `pnpm verify:full` | verify + build + e2e + Lighthouse CI |
| `pnpm check:slop --production` | Thêm luật chỉ bật khi lên production (trường bắt buộc, đủ 5 khối trang chủ) |
| `pnpm check:data --production` | Đủ 12 sản phẩm có ảnh, đủ bốn nhóm hàng |

## Khu quản trị và dữ liệu

- `/admin` ghi thẳng vào `src/data/*.json` và `public/`. Chỉ chạy khi dev; bản build trả 404. Lên web bằng commit và push.
- Chế độ máy chủ (`CATALOGUE_SERVER=1`, Docker, xem `../../docs/DEPLOY.md`): dữ liệu trong PostgreSQL, `/admin` đăng nhập ở `/dang-nhap`, sửa là lên ngay. Mã chỉ dành cho chế độ này nằm trong `src/lib/server/`; không import nó vào component client.
- Dữ kiện sửa được của xưởng (`site.phone`, `site.district`, số Zalo) không dùng ở cấp module và không dùng trong component client: đọc trong hàm của component server rồi truyền props.
- Trang công khai nằm trong `src/app/(site)/`; `/admin` có layout riêng.
- `src/data/DEMO.md` còn nghĩa là dữ liệu và ảnh đang là demo; xoá khi đã thay hàng thật.

## Hàng rào tự kiểm

Mỗi luật chặn có một file sai mẫu trong `tests/slop-fixtures/` (`eslint/`, `stylelint/`, `check-slop/`).
`tests/unit/*-rules.test.ts` chạy luật trên từng file mẫu và đòi luật đó phải bắt được.
Thêm hoặc sửa luật thì thêm file mẫu tương ứng.

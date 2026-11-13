# Luật cho agent: catalogue Thiện Hiền

Plan đầy đủ: `../../docs/PLAN.md`. Chỗ lệch so với plan: `docs/DEVIATIONS.md`.

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

## Lệnh

| Lệnh | Làm gì |
|---|---|
| `pnpm dev` | Chạy dev server |
| `pnpm verify` | lint, lint:css, typecheck, check:slop, check:data, knip, unit test |
| `pnpm verify:full` | verify + build + e2e + Lighthouse CI |
| `pnpm check:slop --production` | Thêm luật chỉ bật khi lên production (trường bắt buộc, đủ 5 khối trang chủ) |
| `pnpm check:data --production` | Đủ 12 sản phẩm có ảnh, đủ bốn nhóm hàng |

## Hàng rào tự kiểm

Mỗi luật chặn có một file sai mẫu trong `tests/slop-fixtures/` (`eslint/`, `stylelint/`, `check-slop/`).
`tests/unit/*-rules.test.ts` chạy luật trên từng file mẫu và đòi luật đó phải bắt được.
Thêm hoặc sửa luật thì thêm file mẫu tương ứng.

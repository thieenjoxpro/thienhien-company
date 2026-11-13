Nút có đúng hai dạng: chính (tô `accent`) và phụ (viền `ink`), cùng chiều cao, cùng bo góc.

| Dạng | Nền / chữ | Dùng cho |
|---|---|---|
| `primary` | `accent` / `on-accent`, viền 1px `ink` | Hành động chính của màn hình. Mỗi màn hình đúng một nút: "Hỏi giá qua Zalo" hoặc "Thêm vào hỏi giá" |
| `secondary` | trong suốt / `ink`, viền 1px `ink` | Mọi hành động khác: "Xem pano", "Gọi xưởng", "Xoá lọc" |
| link | chữ `ink` gạch chân | Trong dòng văn bản |

Quy tắc:
- Cao 48px, padding ngang `space-6`, bo `radius-btn`, kiểu chữ `button`. Trên điện thoại nút rộng hết cột.
- Nhãn là động từ kèm thứ nhận được, 1 đến 5 chữ. Không "Xem thêm", "Tìm hiểu", "Khám phá".
- Hover: `primary` sang `accent-strong`; `secondary` đảo thành nền `ink`, chữ `on-ink`. Bấm: lún 1px. 150ms.
- Focus: viền ngoài 2px `ink`, lệch 2px.
- Không có nút bóng, nút viên thuốc, nút chỉ có icon (trừ tìm, menu, đóng, có `aria-label`).
- Người dùng cung cấp: nhãn, đích đến hoặc hành động, glyph 20px bên trái nếu là Zalo hoặc gọi.

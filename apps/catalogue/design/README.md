# Thiện Hiền

Hệ thiết kế cho catalogue của xưởng Thiện Hiền: pano cửa sắt, bản lề, tôn, mâm cầu thang. Người xem là thợ, đại lý và chủ nhà, phần lớn dùng điện thoại.

Bản 3 (16/11/2026), theo artifact "Thiện Hiền - Catalogue web (design mới)": https://claude.ai/artifact/1KLzjUiUx8qMnmKigK88YJ. Token ở `tokens.json`, khai trong `src/app/globals.css`.

## Hệ này trông thế nào

Trang bán sỉ vật liệu: nền trắng, chữ xanh than, tiêu đề Barlow Condensed đậm viết hoa với vạch vàng bên dưới. Hàng nằm trong thẻ viền mảnh bo 6px: ô ảnh nền xám nhạt, mã, tên, thông số, giá lớn, nút "Thêm vào hỏi giá" ngay trên thẻ. Vàng `accent` là màu thương hiệu (logo, nhãn Mới, số bước, vạch tiêu đề). Xanh `zalo` dành riêng cho nút mở Zalo. Nút tối `ink` cho thêm vào hỏi giá.

## Khung trang

- Thanh trên cùng nền ink (từ 768px): nơi chốn, giờ mở cửa, hotline, Zalo. Trường nào chưa có thì bỏ, cả thanh trống thì không render.
- Header trắng: logo (ô vàng TH + THIỆN HIỀN + dòng nhóm hàng), ô tìm viền ink nút đen, gọi xưởng, Danh sách hỏi giá có số đếm vàng.
- Thanh danh mục nền surface (từ 1024px): ô tối "Danh mục sản phẩm" mở menu, các nhóm hàng, Hàng mới về, Giới thiệu xưởng, bên phải link Cách hỏi giá sỉ.
- Footer nền ink bốn cột: xưởng, sản phẩm, hỗ trợ khách, liên hệ; hàng bản quyền.
- Từ 640px: hai nút tròn nổi góc phải dưới (Zalo, Gọi xưởng). Dưới 640px: thanh Zalo + Gọi xưởng dính đáy.

## Thành phần

- **Tiêu đề khối**: h2 `font-display text-h2 uppercase` + vạch `accent` 56×4, kẻ `line` dưới cả hàng, link "Xem tất cả … ›" màu `link` bên phải.
- **Thẻ sản phẩm**: viền `line`, bo `card`, hover viền `ink`. Ô ảnh vuông nền `photo`, ảnh `contain` 90%. Nhãn "Mới" nền accent góc trái trên. "Mã TH-…" `tag` muted, tên `base` 600, thông số `label` muted, giá `font-display text-price` với "từ" và "/đơn vị" nhỏ; không giá thì "Giá theo số lượng" màu link. Nút viền ink "+ Thêm vào hỏi giá", đã thêm thì nền ink chữ trắng.
- **Nút**: cao 48 hoặc 52px, bo `btn`, chữ 600 đến 700. `zalo` (nền zalo), `dark` (nền ink), `outline` (viền ink 1.5px), `outline-light` (viền trắng trên nền tối).
- **Hộp**: viền `line` bo `card`; hộp tối dùng `bg-pattern` (hoa văn pano trên ink).

## Giọng viết

- Nút là động từ + thứ nhận được. Hành động chính: **Hỏi giá qua Zalo**.
- Không bịa: địa chỉ, số điện thoại, giờ mở cửa, lời giới thiệu chỉ hiện khi chủ xưởng đã nhập (admin). Thiếu thì bỏ phần tử, không in chữ giữ chỗ.
- Ảnh chưa chụp thì dùng hình vẽ minh hoạ (dữ liệu demo); khi có ảnh thật chụp nền sáng, vuông 1:1.

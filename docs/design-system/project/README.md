# Thiện Hiền

Hệ thiết kế cho trang catalogue của xưởng cơ khí Thiện Hiền: pano cửa sắt, bản lề, tôn, mâm cầu thang. Người xem là thợ cơ khí, đại lý và chủ nhà, phần lớn dùng điện thoại.

Bản 2, soát theo taste-skill 2.5 (loại trang: place, ngành: workshop). Bảng màu lấy từ thư viện của skill: `paper-grey-brass`.

## Hệ này trông thế nào

Một trang giấy xám, chữ gần đen, ảnh thật vuông góc và lớn. Không có thẻ nổi, không viền hộp, không bóng. Thứ duy nhất có màu là nút hành động chính, màu vàng đồng thau. Tiêu đề to và mảnh (72px, weight 400), không đậm. Mã và kích thước đặt bằng chữ mono để đọc qua điện thoại không nhầm.

## Ba nguyên tắc

1. **Ảnh thật dẫn trang.** Mỗi màn hình có ít nhất một ảnh thật của hàng hoặc của xưởng. Sản phẩm chưa có ảnh thì chưa lên trang. Không có ô giữ chỗ, không có hình vẽ thay ảnh, không có chú thích dưới ảnh.
2. **Một màu nhấn, một nút tô màu mỗi màn hình.** `accent` chỉ dành cho hành động chính. Mọi nút khác là viền `ink` trên nền giấy.
3. **Một hệ, không ngoại lệ.** Một kiểu nút, một kiểu thẻ, một thang chữ, một thang bo góc (0 và 2px), hai lề trái phải bằng nhau.

## Giọng viết

- h1 của trang chủ gọi tên loại hàng và nơi chốn, 2 đến 8 chữ chính: "Xưởng pano và bản lề cửa sắt ở <quận>". Không khẩu hiệu, không câu hỏi, không dấu chấm than.
- Màn hình đầu có một con số thật: số mẫu đang có (đếm từ dữ liệu), hoặc giá từ.
- Tiêu đề khối là danh từ gọi tên thứ bên dưới: "Bốn nhóm hàng", "Mẫu mới về", "Đường tới xưởng".
- Nút là động từ kèm thứ người bấm nhận được: "Hỏi giá qua Zalo", "Thêm vào hỏi giá", "Xem pano", "Gọi xưởng". Hành động chính viết đúng một kiểu ở mọi nơi: **Hỏi giá qua Zalo**.
- Câu ngắn, có số: "Thép dày 2 ly, dập nguội". Không tính từ khen: chất lượng, uy tín, chuyên nghiệp, tận tâm, hàng đầu.
- Không bịa: không số năm kinh nghiệm, số khách, lời khen, logo đối tác. Thứ gì chủ xưởng chưa đưa thì bỏ hẳn phần tử đó khỏi trang, không ghi "đang cập nhật".
- Nhãn viết thường ("Độ dày"), không viết hoa toàn bộ. Tên sản phẩm viết hoa chữ đầu.
- Khoảng 45 chữ mỗi màn hình trên trang chủ. Chữ dài chuyển sang trang con.

## Màu

| Vai trò | Token |
|---|---|
| Nền trang | `ground` |
| Khung ảnh, ô nhập | `surface` |
| Chữ, viền nút phụ, dải tối | `ink` |
| Chữ phụ, viền ô nhập | `ink-muted` |
| Chữ trên dải tối | `on-ink`, `on-ink-muted` |
| Kẻ ngang | `line` |
| Nút chính | `accent`, `accent-strong`, `on-accent` |
| Trạng thái | `danger`, `success` |

- Trang phẳng: không gradient, không nền tô nhạt cho từng khối, không độ trong suốt.
- Nhịp sáng tối: trang giấy, rồi tối đa một dải `ink` (dải liên hệ), rồi footer `ink`.
- `accent` không bao giờ là màu chữ trên nền sáng (1,8:1). Link là chữ `ink` gạch chân.
- Logo Zalo giữ màu gốc của nó, chỉ ở dạng icon 20px trong nút; nút không tô xanh.
- Chỉ có giao diện sáng.

## Chữ

- Hai họ, mỗi họ một việc: **Be Vietnam Pro** (400, 500) cho mọi chữ; **IBM Plex Mono** (400, 500) cho mã, kích thước, giá. Bốn file font, tự host.
- Không dùng weight 600 trở lên. Tiêu đề 400 với chữ khít (`display` -3%, `h2` -2%).
- Thang cỡ desktop / điện thoại: `display` 72/38, `h2` 48/30, `h3` 28/24, `title` 20/18, `body` 16, `small` 14, `label` 13.
- Chữ để đọc luôn từ 16px. `small` chỉ cho breadcrumb và hàng pháp lý.
- Căn trái toàn bộ.

## Lưới và khoảng cách

- Khung nội dung 1280px, lề trái phải bằng nhau: `space-12` desktop, `space-4` điện thoại. Mọi khối bám hai lề này.
- Trang chủ: mỗi khối cao đúng một hoặc hai màn hình (ở 1440×900), tiêu đề khối nằm trên cùng, không khối nào ló tiêu đề vào khối trước.
- Từ tiêu đề tới nội dung: `space-12` (điện thoại `space-8`). Giữa các thẻ: `space-6` (điện thoại `space-3`).
- Lưới sản phẩm: 2 cột trên điện thoại, 3 cột từ 768px, 4 cột từ 1280px. Các thẻ cùng hàng cao bằng nhau.
- Vùng chạm tối thiểu 44px.

## Hình khối

- Ảnh và thẻ vuông góc (`radius-none`). Nút và ô nhập `radius-btn` 2px.
- Thẻ sản phẩm là ảnh và chữ đặt thẳng trên trang: không nền, không viền, không bóng. Không lồng hộp trong hộp.
- Hệ không có bóng đổ.

## Chuyển động

- Hero vào một lần khi tải trang: chữ và ảnh hiện dần trong 600ms. Không gì khác hiện dần khi cuộn.
- Thẻ có link: nhấc 2px khi hover. Ảnh trong thẻ: phóng 1,03 bên trong khung. Nút: đổi sang `accent-strong` khi hover, lún 1px khi bấm. Link: gạch chân vẽ từ trái.
- Thời lượng 150 đến 200ms. Không nghiêng, không carousel, không parallax, không đếm số.
- Trang chủ có một khoảnh khắc chữ: tên quận của xưởng đặt cỡ `display` trong dải liên hệ.
- `prefers-reduced-motion`: mọi thứ đứng yên và không gì bị ẩn.

## Ảnh

- Ảnh thật do xưởng chụp: hàng trên nền sáng, hàng trong kho, hàng đã lắp ở công trình, tay thợ đang làm. Tỉ lệ 1:1 trên thẻ, 4:5 hoặc 3:2 ở hero và ô danh mục.
- Mỗi khối một ảnh khác nhau; không dùng một ảnh hai lần trên một trang.
- Hàng chiếm phần lớn khung ảnh.
- Không ảnh stock, không ảnh do AI tạo, không ảnh lấy từ website khác.
- `alt` mô tả hàng: "Bản lề cối 16 ly, thép mộc". Không chú thích hiển thị dưới ảnh.

## Glyph

Lucide, nét 1,5, 20px, chỉ cho điều khiển giao diện: tìm, menu, đóng, danh sách, mũi tên. Không dùng icon để minh hoạ ý tưởng hay trang trí khối nội dung. Không emoji.

## Thành phần

Tab Components: `Button`, `ProductCard`, `SpecTable`. Preview của ProductCard dùng khung `surface` thay ảnh vì xưởng chưa giao ảnh; trên trang thật khung đó luôn là ảnh.

## Hệ này không có

Thẻ có viền hoặc bóng, dải icon bốn cột, thanh hotline màu tối trên đầu trang, nút liên hệ tròn nổi ở góc, badge "Mới" hay "Bán chạy" tô màu, nhãn viết hoa, chữ đậm, bo góc lớn, gradient, ô giữ chỗ, chú thích ảnh, màu tím.

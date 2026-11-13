Bảng thông số là các hàng mở ngăn bằng kẻ ngang, nằm ngay dưới tên và giá trên trang chi tiết.

Quy tắc:
- Hai cột: nhãn (`label`, viết thường, `ink-muted`, rộng 40%) và giá trị (`spec`, mono, `ink`).
- Kẻ 1px `line` trên mỗi hàng và dưới hàng cuối. Không khung ngoài, không nền, không tô xen kẽ.
- Padding dọc `space-3`; không padding ngang, chữ bám lề cột.
- Tối thiểu 2 hàng. Thứ tự cố định: Mã, Kích thước, Độ dày, Vật liệu, Bề mặt, Khối lượng, Đơn vị tính, Quy cách đóng gói. Hàng không có dữ liệu thì bỏ.
- Số kiểu Việt (`2,0 mm`), dấu `×` giữa các kích thước, đơn vị cách số một khoảng trắng.
- `<table>` thật với `<th scope="row">`.
- Người dùng cung cấp: mảng `{ label, value }`.

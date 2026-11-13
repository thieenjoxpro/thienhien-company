Thẻ sản phẩm là một ảnh vuông và bốn dòng chữ đặt thẳng trên trang, không nền, không viền.

Thứ tự, từ trên xuống:
1. Ảnh 1:1, vuông góc, hàng chiếm phần lớn khung.
2. Mã (`sku`, `ink-muted`).
3. Tên (`title`), tối đa 2 dòng.
4. Thông số chính (`spec`), một dòng: `Ø16 × 100 mm`.
5. Giá: "từ 18.000 đ / cái" (số kiểu `price`, chữ kiểu `body`). Không có giá thì dòng này là "Giá theo số lượng".

Quy tắc:
- Cả thẻ là một link tới trang chi tiết. Thẻ không có nút riêng; nút "Thêm vào hỏi giá" nằm ở trang chi tiết.
- Hover: thẻ nhấc 2px, ảnh phóng 1,03 trong khung, 200ms. Focus: viền ngoài 2px `ink`.
- Giữa ảnh và chữ `space-4`; giữa các dòng chữ `space-1`.
- Các thẻ cùng hàng cao bằng nhau. Một kiểu thẻ cho toàn site.
- Không badge, không sao đánh giá, không % giảm giá, không chú thích ảnh.
- Sản phẩm chưa có ảnh thì không có thẻ.
- Người dùng cung cấp: `sku`, `name`, `image`, `alt`, `mainSpec`, `unit`, `priceFrom` (tuỳ chọn).

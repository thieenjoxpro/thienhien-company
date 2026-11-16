# Dữ liệu demo

Thư mục này đang chứa dữ liệu demo để xem thử catalogue khi chưa có hàng thật:

- `products.json`, `categories.json`, `policies.json`: chép từ `tests/fixtures/` (24 mẫu hàng, giá và thông số là số giả).
- `public/products/*.webp`, `public/workshop/*.webp`: ảnh vẽ nét có ghi "Ảnh demo", tạo bằng `node scripts/demo-photos.mjs`.

Khi có hàng và ảnh thật (M7): thay ba file JSON, thay ảnh, rồi xoá file này.
`pnpm check:data --production` báo lỗi khi file này còn, nên dữ liệu demo không lên production được.

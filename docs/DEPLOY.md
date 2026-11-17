# Chạy catalogue trên VPS bằng Docker

Bản này khác bản Vercel ở ba điểm: dữ liệu nằm trong PostgreSQL, `/admin` chạy ngay trên web thật và phải đăng nhập, sửa xong là site đổi ngay (không cần commit hay build lại).

## Thành phần (`docker-compose.yml`)

| Dịch vụ | Việc |
|---|---|
| `db` | PostgreSQL 17. Dữ liệu ở volume `pgdata`. |
| `web` | Next.js (`CATALOGUE_SERVER=1`). Ảnh tải lên ở volume `uploads`. |
| `caddy` | Nhận cổng 80, 443, tự xin chứng chỉ HTTPS cho `SITE_DOMAIN`, chuyển vào `web`. |

## Lần đầu

1. VPS cài Docker (có sẵn `docker compose`), trỏ bản ghi DNS A của tên miền về IP của VPS, mở cổng 80 và 443.
2. Lấy mã nguồn về VPS: `git clone` repo này.
3. Tạo cấu hình, thay tên miền thật:
   ```bash
   node scripts/make-env.mjs tenmien.vn
   ```
   Lệnh tạo `.env` với mật khẩu PostgreSQL và mật khẩu quản trị ngẫu nhiên. VPS không có Node thì chép `.env.example` thành `.env` rồi tự điền.
4. Chạy:
   ```bash
   docker compose up -d --build
   ```
5. Mở `https://tenmien.vn/dang-nhap`, đăng nhập bằng `ADMIN_USERNAME` và `ADMIN_PASSWORD` trong `.env`.

Database mới được nạp sẵn dữ liệu trong `apps/catalogue/src/data/*.json` của bản build. Từ đó về sau database là bản chính; sửa các file JSON không còn ảnh hưởng tới site đang chạy.

## Cập nhật mã

```bash
git pull
docker compose up -d --build
```

Dữ liệu và ảnh nằm trong volume nên không mất khi build lại.

## Sao lưu

```bash
docker compose exec db pg_dump -U thienhien thienhien > sao-luu.sql
docker run --rm -v ecomerce_uploads:/data -v "$PWD":/out alpine tar czf /out/anh.tgz -C /data .
```

Tên volume có tiền tố là tên thư mục chứa `docker-compose.yml` (xem bằng `docker volume ls`).

## Đổi mật khẩu quản trị

`ADMIN_USERNAME`, `ADMIN_PASSWORD` chỉ có tác dụng khi database chưa có tài khoản. Để đặt lại: sửa `ADMIN_PASSWORD` trong `.env`, rồi

```bash
docker compose exec db psql -U thienhien -d thienhien -c "DELETE FROM admin_users"
docker compose up -d --force-recreate web
```

## Chạy chế độ máy chủ trên máy, không cần Docker

`DATABASE_URL=pglite://<thư mục>` dùng PGlite (PostgreSQL nhúng trong Node):

```bash
cd apps/catalogue
CATALOGUE_SERVER=1 pnpm build
CATALOGUE_SERVER=1 DATABASE_URL=pglite://.data/pg UPLOAD_DIR=.data/uploads ADMIN_USERNAME=admin ADMIN_PASSWORD=<mật khẩu thử> ADMIN_COOKIE_INSECURE=1 pnpm start
```

`ADMIN_COOKIE_INSECURE=1` chỉ dùng khi chạy thử qua `http://localhost`; sau Caddy (HTTPS) thì không đặt.

## Bảo mật đã có

- Mật khẩu băm bằng scrypt có salt; database không lưu mật khẩu gốc.
- Phiên đăng nhập là token ngẫu nhiên trong cookie `httpOnly`, `SameSite=Lax`, `Secure`; database chỉ lưu SHA-256 của token; hết hạn sau 14 ngày.
- Sai mật khẩu 5 lần thì khoá tên đăng nhập đó 10 phút.
- Mọi server action của `/admin` kiểm phiên trước khi ghi.
- PostgreSQL không mở cổng ra ngoài, chỉ `web` trong mạng nội bộ của compose gọi được.

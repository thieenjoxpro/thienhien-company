// Khi chưa có database: khu bán hàng không chạy được, nói rõ cách bật thay vì lỗi.
export function SalesOff() {
  return (
    <div className="max-w-prose text-sale">
      <h1 className="mb-6 text-h2">Bán hàng</h1>
      <p className="mb-4">Phần bán hàng cần database để lưu đơn, khách và sổ nợ.</p>
      <p>
        Trên máy chạy: đặt <code>DATABASE_URL=pglite://.data/pg</code> rồi chạy lại <code>pnpm dev</code>. Trên VPS: chạy bằng Docker như trong docs/DEPLOY.md.
      </p>
    </div>
  );
}

// Mẫu chữ lấy nguyên từ design/tokens.json (trường sample)
const samples = [
  { token: "display", className: "text-display", text: "Xưởng pano và bản lề cửa sắt" },
  { token: "h2", className: "text-h2", text: "Bốn nhóm hàng" },
  { token: "h3", className: "text-h3", text: "Bản lề cối" },
  { token: "title", className: "text-title", text: "Bản lề cối 16 ly" },
  { token: "body", className: "text-body", text: "Thép dày 2 ly, dập nguội, giao mộc chưa sơn." },
  { token: "small", className: "text-small", text: "Trang chủ / Bản lề / Bản lề cối" },
  { token: "label", className: "text-label", text: "Độ dày" },
  { token: "button", className: "text-button", text: "Hỏi giá qua Zalo" },
  { token: "sku", className: "font-mono text-sku", text: "TH-BL03" },
  { token: "spec", className: "font-mono text-spec", text: "Ø16 × 100 mm" },
  { token: "price", className: "font-mono text-price", text: "18.000 đ" },
];

export function TypeSamples() {
  return (
    <dl>
      {samples.map((sample) => (
        <div key={sample.token} className="grid gap-2 border-t border-line py-4 md:grid-cols-12 md:gap-6">
          <dt className="font-mono text-sku text-ink-muted md:col-span-2">{sample.token}</dt>
          <dd className={`md:col-span-10 ${sample.className}`}>{sample.text}</dd>
        </div>
      ))}
    </dl>
  );
}

import { Button } from "@/components/ui/Button";

export default function Page() {
  return (
    <main className="px-4 py-12 lg:px-12">
      <h1 className="text-display">Xưởng pano và bản lề cửa sắt ở Bình Tân</h1>
      <p className="text-body">24 mẫu pano, bản lề, tôn và mâm cầu thang, có sẵn mã và kích thước.</p>
      <Button variant="primary">Hỏi giá qua Zalo</Button>
      <Button variant="secondary" onClick={() => window.scrollTo(0, 0)}>Xem catalogue</Button>
    </main>
  );
}

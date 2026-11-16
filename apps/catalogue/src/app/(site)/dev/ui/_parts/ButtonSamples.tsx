import { Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Bốn dạng nút của design 3 và link trong dòng
export function ButtonSamples() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="zalo">Hỏi giá qua Zalo</Button>
        <Button variant="dark">Thêm vào hỏi giá</Button>
        <Button variant="outline">Xem pano</Button>
        <Button variant="outline">
          <Phone size={20} strokeWidth={1.5} aria-hidden />
          Gọi xưởng
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="rounded-card bg-ink p-6">
          <Button asChild variant="outlineLight">
            <Link href="/san-pham">Xem catalogue</Link>
          </Button>
        </div>
        <p>
          Link trong dòng: <Link href="/san-pham" className="underline underline-offset-4">xem bảng thông số</Link>.
        </p>
      </div>
    </div>
  );
}

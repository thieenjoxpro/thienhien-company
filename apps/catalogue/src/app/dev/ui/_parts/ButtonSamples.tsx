import { Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Theo preview Button của design system: một nút chính, nút phụ, link trong dòng
export function ButtonSamples() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary">Hỏi giá qua Zalo</Button>
        <Button variant="secondary">Xem pano</Button>
        <Button variant="secondary">
          <Phone size={20} strokeWidth={1.5} aria-hidden />
          Gọi xưởng
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button asChild variant="secondary">
          <Link href="/san-pham">Xem catalogue</Link>
        </Button>
        <p>
          Link trong dòng: <Link href="/san-pham" className="underline underline-offset-4">xem bảng thông số</Link>.
        </p>
      </div>
    </div>
  );
}

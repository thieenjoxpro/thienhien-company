import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { zaloLink } from "@/lib/contact";
import { site } from "@/lib/site.config";

/**
 * Hộp "Không thấy mẫu cần tìm?": gửi ảnh hoặc kích thước qua Zalo. `dashed` nằm cuối lưới hàng,
 * `dark` nằm cột trái trang danh sách. Chưa có số Zalo thì không render.
 */
export function HelpBox({ tone, topic = "" }: { tone: "dashed" | "dark"; topic?: string }) {
  const zalo = zaloLink(site.zaloRetail ?? site.zaloWholesale);
  if (!zalo) return null;
  return (
    <div
      className={cn(
        "flex h-full flex-col justify-center gap-3 rounded-card p-5",
        tone === "dark" ? "bg-pattern text-on-ink" : "border-2 border-dashed border-line-strong bg-surface",
      )}
    >
      <p className={tone === "dark" ? "font-display text-h3" : "text-lead font-bold"}>Không thấy mẫu cần tìm?</p>
      <p className={cn("text-small", tone === "dark" ? "text-on-ink-muted" : "text-ink-muted")}>
        Gửi ảnh hoặc kích thước{topic ? ` ${topic}` : ""} qua Zalo, xưởng xem rồi trả lời.
      </p>
      <Button asChild variant="zalo" size="md" className="sm:self-start">
        <a href={zalo} target="_blank" rel="noopener noreferrer">
          Gửi ảnh qua Zalo
        </a>
      </Button>
    </div>
  );
}

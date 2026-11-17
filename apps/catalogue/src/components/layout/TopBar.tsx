import { Container } from "@/components/ui/Container";
import { telLink } from "@/lib/contact";
import { site } from "@/lib/site.config";

/** Thanh tối trên cùng (từ 768px, design V2): địa chỉ, giờ mở cửa; bên phải số gọi xưởng. Trường nào chưa có thì bỏ. */
export function TopBar() {
  const tel = telLink(site.phone);
  const left = [site.street ?? site.district, site.openingHours && `Mở cửa ${site.openingHours}`].filter(Boolean);
  if (!left.length && !tel) return null;
  return (
    <div className="hidden bg-ink text-label text-on-ink-muted md:block">
      <Container className="flex min-h-11 flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <p className="flex flex-wrap gap-x-5">
          {left.map((text) => (
            <span key={String(text)}>{text}</span>
          ))}
        </p>
        {tel ? (
          <a href={tel} className="flex min-h-11 items-center font-semibold text-on-ink hover:underline">
            Gọi xưởng: {site.phone}
          </a>
        ) : null}
      </Container>
    </div>
  );
}

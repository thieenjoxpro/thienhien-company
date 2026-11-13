import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getMenuGroups } from "@/lib/menu";
import { site } from "@/lib/site.config";

const footerLink = "flex min-h-11 min-w-11 items-center underline underline-offset-4";

/**
 * Footer nền ink (mục 5.1): cột xưởng, cột nhóm hàng; hàng cuối tên xưởng và năm.
 * Cột nào chưa có dữ kiện thì không render. Cột chính sách thêm ở M6 cùng data/policies.
 */
export async function Footer() {
  const groups = await getMenuGroups();
  const hasWorkshop = Boolean(site.street ?? site.openingHours ?? site.mapUrl);

  return (
    <footer className="bg-ink py-12 text-on-ink lg:py-24">
      <Container>
        <div className="grid gap-12 md:grid-cols-3">
          {hasWorkshop ? (
            <section aria-labelledby="footer-xuong">
              <h2 id="footer-xuong" className="mb-4 text-label text-on-ink-muted">
                Xưởng
              </h2>
              {site.street ? <p>{site.street}</p> : null}
              {site.openingHours ? <p>{site.openingHours}</p> : null}
              {site.mapUrl ? (
                <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className={footerLink}>
                  Chỉ đường tới xưởng
                </a>
              ) : null}
            </section>
          ) : null}
          {groups.length ? (
            <nav aria-labelledby="footer-nhom-hang">
              <h2 id="footer-nhom-hang" className="mb-4 text-label text-on-ink-muted">
                Nhóm hàng
              </h2>
              <ul>
                {groups.map((group) => (
                  <li key={group.slug}>
                    <Link href={`/danh-muc/${group.slug}`} className={footerLink}>
                      {group.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        <p className="mt-12 text-small text-on-ink-muted">
          {site.name}, {new Date().getFullYear()}
        </p>
      </Container>
    </footer>
  );
}

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getMenuGroups } from "@/lib/menu";
import { getPolicies } from "@/lib/policies";
import { site } from "@/lib/site.config";
import { Logo } from "./Logo";

const footerLink = "flex min-h-11 items-center text-small text-on-ink-muted hover:text-on-ink";
const columnTitle = "mb-3 text-eyebrow text-on-ink uppercase";

/**
 * Footer nền ink bốn cột (design 3): xưởng, sản phẩm, hỗ trợ khách, liên hệ xưởng; hàng bản quyền.
 * Dòng liên hệ nào chưa có dữ kiện thì không render, cả cột trống thì bỏ cột.
 */
export async function Footer() {
  const [groups, policies] = await Promise.all([getMenuGroups(), getPolicies()]);
  const contact = [
    site.street && ["Địa chỉ", site.street],
    site.phone && ["Hotline", site.phone],
    site.zaloWholesale && ["Zalo sỉ", site.zaloWholesale],
    site.openingHours && ["Giờ mở cửa", site.openingHours],
  ].filter((row): row is [string, string] => Boolean(row));

  return (
    <footer className="mt-14 bg-ink text-on-ink-muted">
      <Container className="grid gap-x-12 gap-y-8 py-12 md:grid-cols-2 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-4">
          <Logo tone="dark" />
          <p className="max-w-xs text-small">
            Catalogue pano, bản lề, tôn và mâm cầu thang của xưởng {site.name}
            {site.district ? ` ở ${site.district}` : ""}.
          </p>
        </div>
        {groups.length ? (
          <nav aria-labelledby="footer-san-pham" className="lg:col-span-2">
            <h2 id="footer-san-pham" className={columnTitle}>
              Sản phẩm
            </h2>
            <ul>
              {groups.flatMap((group) => [group, ...group.children]).map((category) => (
                <li key={category.slug}>
                  <Link href={`/danh-muc/${category.slug}`} className={footerLink}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        <nav aria-labelledby="footer-ho-tro" className="lg:col-span-2">
          <h2 id="footer-ho-tro" className={columnTitle}>
            Hỗ trợ khách
          </h2>
          <ul>
            <li>
              <Link href="/#cach-hoi-gia" className={footerLink}>
                Cách hỏi giá sỉ
              </Link>
            </li>
            <li>
              <Link href="/hoi-gia" className={footerLink}>
                Danh sách hỏi giá
              </Link>
            </li>
            {policies.map((policy) => (
              <li key={policy.slug}>
                <Link href={`/chinh-sach/${policy.slug}`} className={footerLink}>
                  {policy.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {contact.length || site.mapUrl ? (
          <section aria-labelledby="footer-lien-he" className="lg:col-span-4">
            <h2 id="footer-lien-he" className={columnTitle}>
              Liên hệ xưởng
            </h2>
            <dl className="flex flex-col gap-2 text-small">
              {contact.map(([label, value]) => (
                <div key={label}>
                  <dt className="inline">{label}: </dt>
                  <dd className="inline text-on-ink">{value}</dd>
                </div>
              ))}
            </dl>
            {site.mapUrl ? (
              <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className={`${footerLink} underline underline-offset-4`}>
                Chỉ đường tới xưởng
              </a>
            ) : null}
          </section>
        ) : null}
      </Container>
      <div className="border-t border-ink-line">
        <Container className="flex flex-wrap justify-between gap-3 py-4 text-label text-on-ink-faint">
          <p>
            Xưởng {site.name}, {new Date().getFullYear()}
          </p>
          {site.district ? <p>{site.district}</p> : null}
        </Container>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { telLink } from "@/lib/contact";
import { getMenuGroups } from "@/lib/menu";
import { getPolicies } from "@/lib/policies";
import { site } from "@/lib/site.config";
import { Logo } from "./Logo";

const footerLink = "flex min-h-11 items-center text-small text-on-ink-muted hover:text-on-ink";
const columnTitle = "mb-3 text-eyebrow text-on-ink uppercase";

/** "0947 111 191 (Hạnh, có Zalo)": tên và ghi chú gọn trong ngoặc. */
const contactLabel = (contact: (typeof site.contacts)[number]) => {
  const extra = [contact.name, contact.zalo ? "có Zalo" : contact.note].filter(Boolean).join(", ");
  return extra ? `${contact.phone} (${extra})` : contact.phone;
};

/**
 * Footer nền ink bốn cột (design V2): pháp nhân (tên công ty, mã số thuế, địa chỉ), nhóm hàng,
 * hỗ trợ khách, các số liên hệ và giờ mở cửa. Dòng nào chưa có dữ kiện thì không render.
 */
export async function Footer() {
  const [groups, policies] = await Promise.all([getMenuGroups(), getPolicies()]);
  const legal = [site.legalName, site.taxCode && `Mã số thuế: ${site.taxCode}`, site.street].filter(Boolean);
  const directions = site.mapUrl ?? (site.street ? "/#xuong" : null);
  return (
    <footer className="mt-14 bg-ink text-on-ink-muted">
      <Container className="grid gap-x-12 gap-y-8 py-12 md:grid-cols-2 lg:grid-cols-12">
        <div className="flex flex-col gap-3 text-small lg:col-span-4">
          <Logo tone="dark" />
          {legal.map((line) => (
            <p key={String(line)}>{line}</p>
          ))}
        </div>
        {groups.length ? (
          <nav aria-labelledby="footer-san-pham" className="lg:col-span-2">
            <h2 id="footer-san-pham" className={columnTitle}>
              Sản phẩm
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
        <nav aria-labelledby="footer-ho-tro" className="lg:col-span-3">
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
              <Link href="/hoi-gia" prefetch={false} className={footerLink}>
                Danh sách hỏi giá
              </Link>
            </li>
            {directions ? (
              <li>
                <a href={directions} className={footerLink} {...(site.mapUrl && { target: "_blank", rel: "noopener noreferrer" })}>
                  Chỉ đường tới xưởng
                </a>
              </li>
            ) : null}
            {policies.map((policy) => (
              <li key={policy.slug}>
                <Link href={`/chinh-sach/${policy.slug}`} className={footerLink}>
                  {policy.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {site.contacts.length || site.openingHours ? (
          <section aria-labelledby="footer-lien-he" className="lg:col-span-3">
            <h2 id="footer-lien-he" className={columnTitle}>
              Liên hệ
            </h2>
            <ul>
              {site.contacts.map((contact) => (
                <li key={contact.phone}>
                  <a href={telLink(contact.phone) ?? undefined} className={footerLink}>
                    {contactLabel(contact)}
                  </a>
                </li>
              ))}
            </ul>
            {site.openingHours ? <p className="mt-2 text-small">{site.openingHours}</p> : null}
          </section>
        ) : null}
      </Container>
      {site.mapEmbedUrl ? (
        <Container as="section" aria-labelledby="footer-ban-do" className="pb-12">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-x-6">
            <h2 id="footer-ban-do" className={columnTitle}>
              Bản đồ tới xưởng
            </h2>
            {site.mapUrl ? (
              <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className={`${footerLink} underline underline-offset-4`}>
                Mở chỉ đường trên Google Maps
              </a>
            ) : null}
          </div>
          {/* lazy: chỉ tải bản đồ khi cuộn gần tới footer, không làm chậm trang */}
          <iframe
            src={site.mapEmbedUrl}
            title={`Bản đồ đường tới xưởng ${site.name}${site.street ? `, ${site.street}` : ""}`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="block h-72 w-full rounded-card border-0 bg-ink-soft lg:h-80"
          />
        </Container>
      ) : null}
      <div className="border-t border-ink-line">
        <Container className="py-4 text-label text-on-ink-faint">
          <p>
            {site.legalName ?? `Xưởng ${site.name}`}, {new Date().getFullYear()}
          </p>
        </Container>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Price } from "@/components/catalogue/Price";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import type { MenuGroup } from "@/lib/menu";

const OPEN_DELAY = 150;
const CLOSE_DELAY = 100;
const navLink = "flex min-h-13 items-center px-4 text-base font-semibold hover:text-link";
const panelLink = "flex min-h-11 items-center hover:text-link";

/**
 * Nhóm hàng trên thanh danh mục từ 1024px. Rê vào tên nhóm 150ms thì mở bảng toàn chiều rộng.
 * Bàn phím: focus vào tên nhóm là mở, Tab đi tiếp vào bảng, Esc đóng và trả focus về tên nhóm.
 */
export function CategoryMenu({ groups }: { groups: MenuGroup[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);

  // Rê chuột và focus được bắt chung trên <nav>, mỗi <li> mang data-group
  useEffect(() => {
    const node = nav.current;
    if (!node) return;
    let timer: number | undefined;
    const groupOf = (target: EventTarget | null) =>
      target instanceof Element ? (target.closest<HTMLElement>("[data-group]")?.dataset.group ?? null) : null;
    const schedule = (slug: string | null) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setOpen(slug), slug ? OPEN_DELAY : CLOSE_DELAY);
    };
    const onOver = (event: MouseEvent) => schedule(groupOf(event.target));
    const onLeave = () => schedule(null);
    const onFocusIn = (event: FocusEvent) => {
      window.clearTimeout(timer);
      setOpen(groupOf(event.target));
    };
    const onFocusOut = (event: FocusEvent) => {
      if (groupOf(event.relatedTarget) === null) setOpen(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const slug = groupOf(document.activeElement);
      if (slug) node.querySelector<HTMLAnchorElement>(`[data-group="${slug}"] > a`)?.focus();
      setOpen(null);
    };
    node.addEventListener("mouseover", onOver);
    node.addEventListener("mouseleave", onLeave);
    node.addEventListener("focusin", onFocusIn);
    node.addEventListener("focusout", onFocusOut);
    node.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      node.removeEventListener("mouseover", onOver);
      node.removeEventListener("mouseleave", onLeave);
      node.removeEventListener("focusin", onFocusIn);
      node.removeEventListener("focusout", onFocusOut);
      node.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <nav ref={nav} aria-label="Điều hướng chính">
      <ul className="flex items-center">
        {groups.map((group) => (
          <li key={group.slug} data-group={group.slug}>
            <Link href={`/danh-muc/${group.slug}`} className={navLink}>
              {group.name}
            </Link>
            {open === group.slug ? <MenuPanel group={group} /> : null}
          </li>
        ))}
        <li>
          <Link href="/san-pham?sx=moi" className={navLink}>
            Hàng mới về
          </Link>
        </li>
        <li>
          <Link href="/gioi-thieu" className={navLink}>
            Giới thiệu xưởng
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function MenuPanel({ group }: { group: MenuGroup }) {
  return (
    <div className="absolute inset-x-0 top-full z-40 border-y border-line bg-ground">
      <Container className="grid grid-cols-12 gap-8 py-8">
        <ul className="col-span-3">
          <li className="mb-2 font-display text-h3 uppercase">{group.name}</li>
          {group.children.map((child) => (
            <li key={child.slug}>
              <Link href={`/danh-muc/${child.slug}`} className={panelLink}>
                {child.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href={`/danh-muc/${group.slug}`} className={`${panelLink} font-semibold text-link`}>
              Xem tất cả {group.count} mẫu
            </Link>
          </li>
        </ul>
        <ul className="col-span-9 grid grid-cols-3 gap-4">
          {group.products.map((product) => (
            <li key={product.sku}>
              <Link href={`/san-pham/${product.slug}`} className="flex items-center gap-4 rounded-card border border-line p-3 hover:border-ink">
                <Photo src={product.image.src} alt={product.image.alt} ratio="1/1" sizes="96px" className="w-24 shrink-0" />
                <span className="flex flex-col gap-1">
                  <span className="text-tag text-ink-muted">Mã {product.sku}</span>
                  <span className="text-base font-semibold">{product.name}</span>
                  <Price priceFrom={product.priceFrom} unit={product.unit} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

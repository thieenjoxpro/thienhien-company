"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { telLink, zaloLink } from "@/lib/contact";
import type { MenuGroup } from "@/lib/menu";
import { site } from "@/lib/site.config";

const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex='-1'])";
const menuLink = "flex min-h-11 min-w-11 items-center";

/**
 * Menu dưới 1024px, mở toàn màn hình bằng <dialog> gốc (lớp trên cùng, không cần position: fixed).
 * Tab bị giữ trong menu, Esc đóng, đóng xong focus về nút mở.
 */
export function MobileNav({ groups }: { groups: MenuGroup[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const zalo = zaloLink(site.zaloWholesale);
  const tel = telLink(site.phone);

  const open = () => {
    dialog.current?.showModal();
    setIsOpen(true);
  };
  const close = () => dialog.current?.close();

  // Giữ Tab trong menu: qua phần tử cuối thì về phần tử đầu và ngược lại (Esc do <dialog> tự xử lý)
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const keepFocusInside = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    node.addEventListener("keydown", keepFocusInside);
    return () => node.removeEventListener("keydown", keepFocusInside);
  }, []);

  return (
    <>
      <button
        ref={opener}
        type="button"
        aria-label="Mở menu"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={open}
        className="flex size-11 items-center justify-center lg:hidden"
      >
        <Menu size={20} strokeWidth={1.5} aria-hidden />
      </button>
      <dialog
        ref={dialog}
        aria-label="Menu"
        onClose={() => {
          setIsOpen(false);
          opener.current?.focus();
        }}
        className="m-0 size-full max-h-none max-w-none bg-ground p-0 text-ink"
      >
        <Container className="flex h-18 items-center justify-between border-b border-line">
          <Link href="/" onClick={close} className="flex min-h-11 items-center text-title">
            {site.name}
          </Link>
          <button type="button" aria-label="Đóng menu" onClick={close} className="flex size-11 items-center justify-center">
            <X size={20} strokeWidth={1.5} aria-hidden />
          </button>
        </Container>
        <Container as="nav" aria-label="Menu chính" className="py-8">
          <ul className="mb-8">
            {groups.map((group) => (
              <li key={group.slug}>
                <Link href={`/danh-muc/${group.slug}`} onClick={close} className={`${menuLink} text-h3`}>
                  {group.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/gioi-thieu" onClick={close} className={`${menuLink} text-h3`}>
                Xưởng
              </Link>
            </li>
          </ul>
          <ul className="mb-8">
            <li>
              <Link href="/san-pham" onClick={close} className={menuLink}>
                Tìm mẫu
              </Link>
            </li>
            <li>
              <Link href="/hoi-gia" onClick={close} className={menuLink}>
                Danh sách hỏi giá
              </Link>
            </li>
          </ul>
          <div className="flex flex-col gap-3">
            {zalo ? (
              <Button asChild variant="primary">
                <a href={zalo} target="_blank" rel="noopener noreferrer">
                  {site.mainAction}
                </a>
              </Button>
            ) : null}
            {tel ? (
              <Button asChild variant="secondary">
                <a href={tel}>Gọi xưởng</a>
              </Button>
            ) : null}
          </div>
        </Container>
      </dialog>
    </>
  );
}

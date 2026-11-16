import type { ReactNode } from "react";

/** h1 của trang phụ (design 3): condensed viết hoa, vạch vàng 56×4 bên dưới. */
export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-2 lg:mb-10">
      <h1 className="font-display text-h1 uppercase">{children}</h1>
      <span aria-hidden className="block h-1 w-14 bg-accent" />
    </div>
  );
}

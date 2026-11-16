import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

/** Ô tìm trên header: form GET tới /san-pham?q=, chạy cả khi chưa có JS. */
export function HeaderSearch({ id, className }: { id: string; className?: string }) {
  return (
    <form role="search" action="/san-pham" className={cn("flex min-w-0", className)}>
      <label htmlFor={id} className="sr-only">
        Tìm sản phẩm theo mã hoặc tên
      </label>
      <input
        id={id}
        name="q"
        type="search"
        autoComplete="off"
        placeholder="Tìm theo mã hoặc tên, ví dụ TH-BL03, bản lề cối"
        className="h-12 min-w-0 grow rounded-l-btn border-2 border-r-0 border-ink bg-ground px-4 text-base text-ink placeholder:text-ink-muted"
      />
      <button type="submit" aria-label="Tìm" className="flex h-12 w-14 shrink-0 items-center justify-center rounded-r-btn bg-ink text-on-ink">
        <Search size={20} strokeWidth={2.2} aria-hidden />
      </button>
    </form>
  );
}

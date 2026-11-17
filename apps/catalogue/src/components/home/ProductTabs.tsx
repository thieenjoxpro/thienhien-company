"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TabPanel {
  slug: string;
  label: string;
  /** Lưới thẻ của nhóm, dựng sẵn ở server. */
  content: ReactNode;
}

/**
 * Nút chọn nhóm hàng cho khối "Mẫu đang có tại xưởng". Thẻ của mọi nhóm đã render ở server,
 * ở đây chỉ ẩn hiện, nên đổi tab không tải gì thêm và tắt JS vẫn thấy nhóm đầu.
 */
export function ProductTabs({ panels }: { panels: TabPanel[] }) {
  const [active, setActive] = useState(panels[0]?.slug);
  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {panels.map((panel) => (
          <button
            key={panel.slug}
            type="button"
            aria-pressed={panel.slug === active}
            aria-controls={`tab-${panel.slug}`}
            onClick={() => setActive(panel.slug)}
            className={cn(
              "flex h-11 items-center rounded-btn border-2 border-ink px-4 text-small font-semibold",
              panel.slug === active ? "bg-ink text-on-ink" : "bg-ground text-ink hover:bg-surface",
            )}
          >
            {panel.label}
          </button>
        ))}
      </div>
      {panels.map((panel) => (
        <div key={panel.slug} id={`tab-${panel.slug}`} hidden={panel.slug !== active}>
          {panel.content}
        </div>
      ))}
    </>
  );
}

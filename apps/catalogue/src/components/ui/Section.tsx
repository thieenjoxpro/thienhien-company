import { useId, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

interface SectionProps {
  as?: ElementType;
  /** Tiêu đề khối (h2), là phần tử đầu của khối. */
  heading?: string;
  /** Link nằm cùng hàng với tiêu đề, bên phải. */
  headingAside?: ReactNode;
  /** Cao tối thiểu một hoặc hai màn hình từ 1024px (trang chủ, mục 5.2). */
  screens?: 1 | 2;
  className?: string;
  children: ReactNode;
}

export function Section({ as: Tag = "section", heading, headingAside, screens, className, children }: SectionProps) {
  const headingId = useId();
  return (
    <Tag
      aria-labelledby={heading ? headingId : undefined}
      className={cn("py-12 lg:py-24", screens && "lg:grid", screens === 1 && "lg:screen-1", screens === 2 && "lg:screen-2", className)}
    >
      {/* Lớp bọc là ô lưới được kéo giãn hết chiều cao khối; nhờ đó nội dung có thể dùng lg:flex-1 để lấp đầy màn hình */}
      <div>
        <Container className={screens ? "lg:flex lg:h-full lg:flex-col" : undefined}>
        {heading ? (
          <div className="mb-8 flex items-baseline justify-between gap-6 lg:mb-12">
            <h2 id={headingId} className="text-h2">
              {heading}
            </h2>
            {headingAside}
          </div>
        ) : null}
          {children}
        </Container>
      </div>
    </Tag>
  );
}

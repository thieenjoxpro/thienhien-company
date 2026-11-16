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
  const content = (
    <Container>
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
  );
  return (
    <Tag
      aria-labelledby={heading ? headingId : undefined}
      className={cn(
        "py-12 lg:py-24",
        // Khối cao một, hai màn hình: nội dung đứng giữa theo chiều dọc, không dồn lên trên để lại khoảng trống dưới
        screens && "lg:flex lg:flex-col lg:justify-center",
        screens === 1 && "lg:screen-1",
        screens === 2 && "lg:screen-2",
        className,
      )}
    >
      {/* Trong flex, Container có mx-auto sẽ co lại: bọc một div giãn hết chiều ngang */}
      {screens ? <div>{content}</div> : content}
    </Tag>
  );
}

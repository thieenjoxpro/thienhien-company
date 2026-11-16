import { useId, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";

interface SectionProps {
  as?: ElementType;
  id?: string;
  /** Tiêu đề khối (h2 condensed viết hoa, vạch vàng), là phần tử đầu của khối. */
  heading?: string;
  /** Link nằm cùng hàng với tiêu đề, bên phải. */
  headingAside?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Một khối trong khung 1248px, cách khối trên 48px (design 3). */
export function Section({ as: Tag = "section", id, heading, headingAside, className, children }: SectionProps) {
  const headingId = useId();
  return (
    <Tag id={id} aria-labelledby={heading ? headingId : undefined} className={cn("pt-10 lg:pt-12", className)}>
      <Container>
        {heading ? (
          <SectionHeading id={headingId} aside={headingAside}>
            {heading}
          </SectionHeading>
        ) : null}
        {children}
      </Container>
    </Tag>
  );
}

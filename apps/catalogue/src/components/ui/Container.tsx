import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

/**
 * Khung nội dung 1280px, lề 48px từ 1024px, 16px trên điện thoại. Mọi khối bám hai lề này;
 * trang không tự đặt padding ngang. data-frame để e2e đo hai lề.
 */
export function Container({ as: Tag = "div", className, ...rest }: ContainerProps) {
  return <Tag data-frame="" className={cn("mx-auto box-content max-w-7xl px-4 lg:px-12", className)} {...rest} />;
}

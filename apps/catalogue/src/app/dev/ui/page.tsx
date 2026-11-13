import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { ButtonSamples } from "./_parts/ButtonSamples";
import { FieldSamples } from "./_parts/FieldSamples";
import { PhotoSamples } from "./_parts/PhotoSamples";
import { TypeSamples } from "./_parts/TypeSamples";

// Trang bày mọi thành phần nền và trạng thái (M2). Chỉ mở ở môi trường dev,
// hoặc khi chạy e2e với SHOW_DEV_UI=1; không bao giờ được index.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thành phần giao diện",
  robots: { index: false, follow: false },
};

export default function DevUiPage() {
  if (process.env.NODE_ENV === "production" && process.env.SHOW_DEV_UI !== "1") notFound();
  return (
    <>
      <Section>
        <h1 className="text-h2">Thành phần giao diện</h1>
      </Section>
      <Section heading="Chữ">
        <TypeSamples />
      </Section>
      <Section heading="Nút">
        <ButtonSamples />
      </Section>
      <Section heading="Ô nhập và lọc">
        <FieldSamples />
      </Section>
      <Section heading="Ảnh và giá">
        <PhotoSamples />
      </Section>
    </>
  );
}

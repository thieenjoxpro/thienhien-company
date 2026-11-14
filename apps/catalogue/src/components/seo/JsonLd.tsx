/** Dữ liệu có cấu trúc schema.org; "<" được thoát để chuỗi trong dữ liệu không đóng được thẻ script. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

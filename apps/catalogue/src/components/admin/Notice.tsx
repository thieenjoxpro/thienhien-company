/** Dòng báo kết quả sau khi lưu hoặc xoá (đọc từ query ?luu=1 ...). */
export function Notice({ text }: { text: string | null }) {
  return text ? (
    <p role="status" className="mb-8 text-body text-success">
      {text}
    </p>
  ) : null;
}

type Search = Promise<Record<string, string | string[] | undefined>>;

const TEXTS: Record<string, string> = { luu: "Đã lưu.", xoa: "Đã xoá.", anh: "Đã lưu ảnh." };

export async function noticeFrom(searchParams: Search): Promise<string | null> {
  const params = await searchParams;
  const key = Object.keys(TEXTS).find((k) => params[k] !== undefined);
  return key ? (TEXTS[key] ?? null) : null;
}

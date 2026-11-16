import { Container } from "@/components/ui/Container";

const STEPS = [
  { title: "Chọn mẫu theo mã", text: "Mỗi mẫu có mã TH, kích thước và độ dày." },
  { title: "Thêm vào danh sách hỏi giá", text: "Ghi số lượng cho từng mã, danh sách lưu trên máy." },
  { title: "Gửi qua Zalo, xưởng báo giá", text: "Danh sách được copy sẵn, chỉ cần dán vào Zalo." },
];

/** Dải "Hỏi giá trong 3 bước" ngay dưới hero; footer và thanh danh mục trỏ tới #cach-hoi-gia. */
export function QuoteSteps() {
  return (
    <Container as="section" id="cach-hoi-gia" aria-labelledby="buoc" className="mt-6 scroll-mt-6">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-card border border-line px-6 py-5">
        <h2 id="buoc" className="font-display text-h3 uppercase sm:w-44">
          Hỏi giá trong 3 bước
        </h2>
        <ol className="flex grow flex-wrap gap-x-8 gap-y-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex grow basis-64 items-start gap-4">
              <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-tag bg-accent font-display text-h3 text-on-accent">
                {index + 1}
              </span>
              <span className="flex flex-col">
                <span className="text-base font-semibold">{step.title}</span>
                <span className="text-small text-ink-muted">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Container>
  );
}

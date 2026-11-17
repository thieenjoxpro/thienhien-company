import { OpenQuoteButton } from "@/components/quote/OpenQuoteButton";
import { Container } from "@/components/ui/Container";

const STEPS = [
  { title: "Chọn mẫu theo mã", text: "Mỗi mẫu có mã TH, kích thước và độ dày." },
  { title: "Ghi số lượng từng mã", text: "Bấm Thêm vào hỏi giá, rồi ghi số lượng trong danh sách hỏi giá." },
  { title: "Gửi Zalo hoặc gọi xưởng", text: "Bấm gửi qua Zalo: danh sách tự copy, Zalo mở ra, chỉ cần dán và gửi." },
];

/** Khối "Hỏi giá sỉ trong 3 bước" (design V2) dưới khối mẫu; footer trỏ tới #cach-hoi-gia. */
export function QuoteSteps() {
  return (
    <Container as="section" id="cach-hoi-gia" aria-labelledby="buoc" className="mt-14 scroll-mt-6">
      <div className="flex flex-col gap-6 rounded-card border border-line bg-surface p-6 lg:flex-row lg:items-center lg:gap-10 lg:p-8">
        <div className="flex flex-col gap-3 lg:basis-1/3">
          <h2 id="buoc" className="font-display text-h2 uppercase">
            Hỏi giá sỉ trong 3 bước
          </h2>
          <p className="text-small text-ink-soft">Không cần tài khoản. Danh sách lưu ngay trên máy của anh chị.</p>
          <OpenQuoteButton />
        </div>
        <ol className="grid grow gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-2 rounded-card border border-line bg-ground p-5">
              <span aria-hidden className="flex size-10 items-center justify-center rounded-tag bg-accent font-display text-h3 text-on-accent">
                {index + 1}
              </span>
              <span className="text-base font-bold">{step.title}</span>
              <span className="text-small text-ink-muted">{step.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </Container>
  );
}

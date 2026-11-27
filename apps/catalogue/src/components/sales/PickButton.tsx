// Ô chọn to trong lưới khách quen và lưới mặt hàng: chạm một lần là chọn. Cao tối thiểu 72px, chữ 18px trở lên.
interface Props {
  title: string;
  note?: string | null;
  /** Dòng phụ thứ hai, ví dụ "Đã chọn: 3". */
  badge?: string | null;
  onClick: () => void;
}

export function PickButton({ title, note, badge, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-18 w-full flex-col items-start justify-center rounded-card border-2 border-ink-muted bg-ground px-4 py-3 text-left text-ink hover:bg-surface active:bg-surface"
    >
      <span className="text-sale font-semibold">{title}</span>
      {note ? <span className="text-sale text-ink-soft">{note}</span> : null}
      {badge ? <span className="mt-1 rounded-tag bg-ink px-2 text-sale font-semibold text-on-ink">{badge}</span> : null}
    </button>
  );
}

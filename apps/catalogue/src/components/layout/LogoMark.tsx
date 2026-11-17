import { cn } from "@/lib/cn";

// Logo A "Khối thép" đã chốt trong design: chữ T và H trên hai mặt một khối lập phương nhìn đẳng cự,
// mặt trên vàng. Hình lục giác như đầu bu lông, đọc được tới cỡ 20px. Bản nền tối đảo hai mặt bên.
const FACE = "M0.035 0.035H0.965V0.965H0.035Z";

export function LogoMark({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const side = tone === "dark" ? "fill-on-ink" : "fill-ink";
  const letter = tone === "dark" ? "fill-ink" : "fill-on-ink";
  return (
    <svg viewBox="0 0 120 120" aria-hidden className={cn("shrink-0", className)}>
      <g transform="translate(60 60)">
        <path transform="matrix(46.77 -27 46.77 27 -46.77 -27)" d={FACE} className="fill-accent" />
        <g transform="matrix(46.77 27 0 54 -46.77 -27)">
          <path d={FACE} className={side} />
          <path d="M.14 .16H.86V.36H.6V.84H.4V.36H.14Z" className={letter} />
        </g>
        <g transform="matrix(46.77 -27 0 54 0 0)">
          <path d={FACE} className={side} />
          <path d="M.16 .16H.36V.4H.64V.16H.84V.84H.64V.6H.36V.84H.16Z" className={letter} />
        </g>
      </g>
    </svg>
  );
}

// expect: none
export function Fixture({ name, sku }: { name: string; sku: string }) {
  return (
    <div className="rounded-card border border-line hover:border-ink">
      <p className="text-tag text-ink-muted">Mã {sku}</p>
      <h3 className="text-base font-semibold">{name}</h3>
      <h2 className="font-display text-h2 uppercase">Hàng mới về</h2>
      <a className="flex size-14 items-center justify-center rounded-full bg-zalo text-on-ink shadow-float" href="/hoi-gia">
        Zalo
      </a>
    </div>
  );
}

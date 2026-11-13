// expect: none
export function Fixture({ name, sku }: { name: string; sku: string }) {
  return (
    <a className="m-lift m-zoom block" href={`/san-pham/${sku}`}>
      <p className="font-mono text-sku text-ink-muted">{sku}</p>
      <h3 className="text-title">{name}</h3>
      <p className="mt-1 font-mono text-spec">Ø16 × 100 mm</p>
    </a>
  );
}

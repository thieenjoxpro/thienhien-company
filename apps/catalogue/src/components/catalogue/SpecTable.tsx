// design/components/SpecTable/README.md: hàng mở, kẻ ngang, thứ tự cố định, <th scope="row">
const ORDER = ["Mã", "Kích thước", "Độ dày", "Vật liệu", "Bề mặt", "Khối lượng", "Đơn vị tính", "Quy cách đóng gói"];
const rank = (label: string) => (ORDER.includes(label) ? ORDER.indexOf(label) : ORDER.length);

export function SpecTable({ sku, specs }: { sku: string; specs: { label: string; value: string }[] }) {
  const rows = [{ label: "Mã", value: sku }, ...specs.filter((s) => s.value.trim())].toSorted((a, b) => rank(a.label) - rank(b.label));
  return (
    <table className="w-full border-collapse">
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-t border-line last:border-b">
            <th scope="row" className="w-2/5 py-3 text-left align-baseline text-label text-ink-muted">
              {row.label}
            </th>
            <td className="py-3 align-baseline font-mono text-spec">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

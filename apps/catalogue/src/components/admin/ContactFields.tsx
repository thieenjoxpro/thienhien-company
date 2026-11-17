import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import type { SiteContact } from "@/lib/site-schema";

const ROWS = [0, 1, 2, 3];

/** Bốn hàng người nghe máy (tên, ghi chú, số, có Zalo); hàng để trống số thì không lưu. */
export function ContactFields({ contacts, values }: { contacts: SiteContact[]; values?: Record<string, string> }) {
  const val = (key: string, i: number, fallback: string) => values?.[`${key}${i}`] ?? fallback;
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-2 text-label font-semibold">Người nghe máy (hiện ở khối Ghé xưởng và footer, theo thứ tự)</legend>
      {ROWS.map((i) => {
        const contact = contacts[i];
        return (
          <div key={i} className="grid items-end gap-4 border-b border-line pb-4 sm:grid-cols-4">
            <Input label={`Tên ${i + 1}`} name={`contactName${i}`} defaultValue={val("contactName", i, contact?.name ?? "")} />
            <Input label="Ghi chú" name={`contactNote${i}`} defaultValue={val("contactNote", i, contact?.note ?? "")} hint="Ví dụ: số chính" />
            <Input label="Số điện thoại" name={`contactPhone${i}`} inputMode="tel" defaultValue={val("contactPhone", i, contact?.phone ?? "")} />
            <Checkbox label="Có Zalo" name={`contactZalo${i}`} defaultChecked={values ? values[`contactZalo${i}`] === "on" : Boolean(contact?.zalo)} />
          </div>
        );
      })}
    </fieldset>
  );
}

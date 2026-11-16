import { Input } from "@/components/ui/Input";
import { SPEC_ROWS } from "@/lib/admin/product-form";
import type { Values } from "@/lib/admin/form";
import { GroupError } from "./Field";

interface Props {
  specs: { label: string; value: string }[];
  values?: Values;
  error?: string;
}

/** Bảng thông số: các dòng đang có cộng dòng trống, tổng SPEC_ROWS dòng; dòng trống bị bỏ khi lưu. Không cần JS. */
export function SpecFields({ specs, values, error }: Props) {
  const rows = Math.min(SPEC_ROWS, Math.max(specs.length + 3, 5));
  return (
    <fieldset>
      <legend className="mb-2 text-title">Thông số</legend>
      <p className="mb-4 text-ink-muted">Cần dòng tên &quot;Kích thước&quot; hoặc &quot;Độ dày&quot;. Dòng để trống sẽ bị bỏ.</p>
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <Input label={`Tên dòng ${i + 1}`} name={`spec-${i}-label`} defaultValue={values?.[`spec-${i}-label`] ?? specs[i]?.label ?? ""} />
            <Input label={`Giá trị dòng ${i + 1}`} name={`spec-${i}-value`} defaultValue={values?.[`spec-${i}-value`] ?? specs[i]?.value ?? ""} />
          </div>
        ))}
      </div>
      <GroupError message={error} />
    </fieldset>
  );
}

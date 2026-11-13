import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";

export function FieldSamples() {
  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <Input label="Tên của anh chị" name="ten" autoComplete="name" />
        <Input label="Giao tới đâu" name="giao-toi" hint="Ghi quận hoặc tỉnh để xưởng tính phí chở." />
        <Input label="Số lượng" name="so-luong" inputMode="numeric" defaultValue="0" error="Số lượng từ 1 đến 9999." />
      </div>
      <fieldset>
        <legend className="mb-2 text-label">Độ dày</legend>
        <Checkbox label="0,8 mm" count={4} name="day" value="0.8" />
        <Checkbox label="1,0 mm" count={7} name="day" value="1" defaultChecked />
        <Checkbox label="2,0 mm" count={9} name="day" value="2" />
      </fieldset>
    </div>
  );
}

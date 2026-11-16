"use client";

import { useActionState } from "react";
import { saveSite } from "@/app/admin/_actions/content";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import type { FormState } from "@/lib/admin/form";
import type { SiteData } from "@/lib/site-schema";
import { Textarea } from "./Field";

const FIELDS = [
  { name: "district", label: "Quận, thành phố", hint: "Bắt buộc trước khi lên web. Ví dụ: Bình Tân, TP.HCM." },
  { name: "street", label: "Địa chỉ đầy đủ", hint: "Hiện ở trang liên hệ và footer." },
  { name: "mapUrl", label: "Link Google Maps", hint: "Bắt đầu bằng https://." },
  { name: "openingHours", label: "Giờ mở cửa", hint: "Ví dụ: 7:00 đến 17:30, thứ Hai đến thứ Bảy." },
  { name: "phone", label: "Số điện thoại", hint: "Để trống thì không hiện nút gọi." },
  { name: "zaloWholesale", label: "Số Zalo khách sỉ", hint: "Bắt buộc trước khi lên web; nút Hỏi giá qua Zalo dùng số này." },
  { name: "zaloRetail", label: "Số Zalo khách lẻ", hint: "Để trống thì dùng chung số Zalo sỉ." },
] as const;

export function SiteForm({ site }: { site: SiteData }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSite, null);
  const val = (name: keyof SiteData) => state?.values[name] ?? (typeof site[name] === "string" ? String(site[name]) : "");
  return (
    <form key={state?.nonce} action={action} noValidate className="flex max-w-3xl flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <Input key={field.name} label={field.label} name={field.name} defaultValue={val(field.name)} error={state?.errors[field.name]} hint={field.hint} />
        ))}
      </div>
      <Textarea label="Chữ cho khối Xưởng ở trang chủ" name="workshopText" rows={3} defaultValue={val("workshopText")} hint="2 đến 3 câu chủ xưởng tự viết, có số liệu thật. Để trống thì bỏ khối." />
      <Textarea label="Đoạn giới thiệu" name="aboutText" rows={5} defaultValue={val("aboutText")} hint="Hiện ở trang Giới thiệu. Để trống thì trang chỉ có ảnh và liên hệ." />
      <Checkbox label="Hiện giá lẻ trên site" name="showPrice" defaultChecked={state ? state.values.showPrice === "on" : site.showPrice} />
      <div>
        <Button variant="primary" type="submit" disabled={pending}>
          {pending ? "Đang lưu" : "Lưu thông tin xưởng"}
        </Button>
      </div>
    </form>
  );
}

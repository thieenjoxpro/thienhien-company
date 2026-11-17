"use client";

import { useActionState } from "react";
import { saveSite } from "@/app/admin/_actions/content";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import type { FormState } from "@/lib/admin/form";
import type { SiteData } from "@/lib/site-schema";
import { ContactFields } from "./ContactFields";
import { Textarea } from "./Field";

const FIELDS = [
  { name: "district", label: "Quận, thành phố", hint: "Bắt buộc trước khi lên web. Ví dụ: Bình Tân, TP.HCM." },
  { name: "street", label: "Địa chỉ đầy đủ", hint: "Hiện ở trang liên hệ và footer." },
  { name: "mapUrl", label: "Link Google Maps", hint: "Link của địa điểm xưởng; nút Chỉ đường mở link này." },
  { name: "mapEmbedUrl", label: "Bản đồ nhúng", hint: "Google Maps › Chia sẻ › Nhúng bản đồ, dán cả đoạn <iframe>. Hiện cuối footer." },
  { name: "openingHours", label: "Giờ mở cửa", hint: "Ví dụ: 7:00 đến 17:30, thứ Hai đến thứ Bảy." },
  { name: "phone", label: "Số điện thoại", hint: "Để trống thì không hiện nút gọi." },
  { name: "zaloWholesale", label: "Số Zalo khách sỉ", hint: "Bắt buộc trước khi lên web; nút Hỏi giá qua Zalo dùng số này." },
  { name: "zaloRetail", label: "Số Zalo khách lẻ", hint: "Để trống thì dùng chung số Zalo sỉ." },
  { name: "legalName", label: "Tên công ty", hint: "Như trên giấy phép, hiện ở footer." },
  { name: "taxCode", label: "Mã số thuế", hint: "Hiện ở footer." },
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
      <ContactFields contacts={site.contacts} values={state?.values} />
      <Textarea label="Chữ cho khối Xưởng ở trang chủ" name="workshopText" rows={3} defaultValue={val("workshopText")} hint="2 đến 3 câu chủ xưởng tự viết, có số liệu thật. Để trống thì bỏ khối." />
      <Textarea label="Đoạn giới thiệu" name="aboutText" rows={5} defaultValue={val("aboutText")} hint="Hiện ở trang Giới thiệu. Để trống thì trang chỉ có ảnh và liên hệ." />
      <Checkbox label="Hiện giá trên site (tắt: mọi mẫu hiện Liên hệ báo giá)" name="showPrice" defaultChecked={state ? state.values.showPrice === "on" : site.showPrice} />
      <div>
        <Button variant="dark" type="submit" disabled={pending}>
          {pending ? "Đang lưu" : "Lưu thông tin xưởng"}
        </Button>
      </div>
    </form>
  );
}

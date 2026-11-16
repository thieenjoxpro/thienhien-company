"use client";

import { useActionState } from "react";
import { saveProduct } from "@/app/admin/_actions/products";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import type { FormState } from "@/lib/admin/form";
import type { Category, Product } from "@/lib/schema";
import { Select, Textarea } from "./Field";
import { SpecFields } from "./SpecFields";

const UNITS = ["cái", "bộ", "tấm", "mét", "kg"] as const;

interface Props {
  product: Product | null;
  categories: Category[];
}

export function ProductForm({ product, categories }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProduct, null);
  const err = (name: string) => state?.errors[name];
  // Gửi lỗi thì điền lại đúng chữ vừa gõ, không thì giá trị đang lưu
  const val = (name: string, saved: string | number | null | undefined) => state?.values[name] ?? (saved === null || saved === undefined ? "" : String(saved));
  const checked = (name: string, saved: boolean | undefined) => (state ? state.values[name] === "on" : Boolean(saved));
  const tops = categories.filter((c) => !c.parentSlug).toSorted((a, b) => a.order - b.order);

  return (
    <form key={state?.nonce} action={action} noValidate className="flex max-w-3xl flex-col gap-6">
      <input type="hidden" name="originalSku" value={product?.sku ?? ""} />
      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="Mã hàng" name="sku" defaultValue={val("sku", product?.sku)} error={err("sku")} hint="Dạng TH-BL03, trùng mã trong app quản lý." className="font-mono" />
        <Select label="Danh mục" name="categorySlug" defaultValue={val("categorySlug", product?.categorySlug)} error={err("categorySlug")}>
          <option value="">Chọn danh mục</option>
          {tops.map((top) => [
            <option key={top.slug} value={top.slug}>
              {top.name}
            </option>,
            ...categories
              .filter((c) => c.parentSlug === top.slug)
              .map((child) => (
                <option key={child.slug} value={child.slug}>
                  {`${top.name} / ${child.name}`}
                </option>
              )),
          ])}
        </Select>
      </div>
      <Input label="Tên" name="name" defaultValue={val("name", product?.name)} error={err("name")} />
      <Input label="Đường dẫn" name="slug" defaultValue={val("slug", product?.slug)} error={err("slug")} hint="Để trống thì tạo từ tên." />
      <Textarea label="Mô tả ngắn" name="summary" defaultValue={val("summary", product?.summary)} error={err("summary")} hint="1 đến 2 câu, có số đo, 20 đến 200 ký tự." rows={3} />
      <div className="grid gap-6 sm:grid-cols-3">
        <Input label="Thông số chính" name="mainSpec" defaultValue={val("mainSpec", product?.mainSpec)} error={err("mainSpec")} hint="Hiện trên thẻ, ví dụ Ø16 × 100 mm." className="sm:col-span-2" />
        <Select label="Đơn vị tính" name="unit" defaultValue={val("unit", product?.unit ?? "cái")} error={err("unit")}>
          {UNITS.map((unit) => (
            <option key={unit}>{unit}</option>
          ))}
        </Select>
      </div>
      <SpecFields specs={product?.specs ?? []} values={state?.values} error={err("specs")} />
      <fieldset className="grid gap-6 sm:grid-cols-3">
        <legend className="mb-4 text-title">Bộ lọc</legend>
        <Input label="Độ dày (mm)" name="thicknessMm" inputMode="decimal" defaultValue={val("thicknessMm", product?.filters.thicknessMm?.toString().replace(".", ","))} error={err("filters")} />
        <Input label="Vật liệu" name="material" defaultValue={val("material", product?.filters.material)} />
        <Input label="Bề mặt" name="finish" defaultValue={val("finish", product?.filters.finish)} />
      </fieldset>
      <Input label="Giá lẻ từ (đồng)" name="priceFrom" inputMode="numeric" defaultValue={val("priceFrom", product?.priceFrom)} error={err("priceFrom")} hint="Để trống thì không hiện giá." />
      <div className="flex flex-wrap gap-x-8">
        <Checkbox label="Hàng mới" name="isNew" defaultChecked={checked("isNew", product?.isNew)} />
        <Checkbox label="Đưa lên trang chủ" name="isFeatured" defaultChecked={checked("isFeatured", product?.isFeatured)} />
      </div>
      {state ? (
        <p role="alert" className="text-body text-danger">
          Chưa lưu: sửa các ô báo đỏ rồi bấm lưu lại.
        </p>
      ) : null}
      <div>
        <Button variant="primary" type="submit" disabled={pending}>
          {pending ? "Đang lưu" : product ? "Lưu thay đổi" : "Lưu sản phẩm"}
        </Button>
      </div>
    </form>
  );
}

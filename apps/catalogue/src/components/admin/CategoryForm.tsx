"use client";

import { useActionState } from "react";
import { deleteCategory, saveCategory } from "@/app/admin/_actions/content";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { FormState } from "@/lib/admin/form";
import type { Category } from "@/lib/schema";
import { ConfirmButton } from "./ConfirmButton";
import { GroupError, Select, Textarea } from "./Field";

export function CategoryForm({ category, categories }: { category: Category | null; categories: Category[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCategory, null);
  const [deleteState, deleteAction] = useActionState<FormState, FormData>(deleteCategory, null);
  const err = (name: string) => state?.errors[name];
  const val = (name: string, saved: string | number | null | undefined) => state?.values[name] ?? (saved === null || saved === undefined ? "" : String(saved));
  const parents = categories.filter((c) => !c.parentSlug && c.slug !== category?.slug);
  return (
    <>
      <form key={state?.nonce} action={action} noValidate className="flex max-w-3xl flex-col gap-6">
        <input type="hidden" name="originalSlug" value={category?.slug ?? ""} />
        <Input label="Tên" name="name" defaultValue={val("name", category?.name)} error={err("name")} />
        <Input label="Đường dẫn" name="slug" defaultValue={val("slug", category?.slug)} error={err("slug")} hint="Để trống thì tạo từ tên. Đổi đường dẫn thì sản phẩm thuộc danh mục đi theo." />
        <Select label="Nhóm cha" name="parentSlug" defaultValue={val("parentSlug", category?.parentSlug)} error={err("parentSlug")} hint="Để trống nếu đây là nhóm hàng cấp đầu. Tối đa 2 cấp.">
          <option value="">Không có, cấp đầu</option>
          {parents.map((parent) => (
            <option key={parent.slug} value={parent.slug}>
              {parent.name}
            </option>
          ))}
        </Select>
        <Textarea label="Mô tả" name="description" rows={2} defaultValue={val("description", category?.description)} error={err("description")} hint="Một câu, tối đa 160 ký tự; hiện dưới tiêu đề trang danh mục." />
        <Input label="Thứ tự" name="order" inputMode="numeric" defaultValue={val("order", category?.order ?? categories.length + 1)} error={err("order")} hint="Số nhỏ đứng trước." className="max-w-xs" />
        <div>
          <Button variant="primary" type="submit" disabled={pending}>
            {pending ? "Đang lưu" : "Lưu danh mục"}
          </Button>
        </div>
      </form>
      {category ? (
        <form action={deleteAction} className="mt-24 max-w-3xl border-t border-line pt-8">
          <input type="hidden" name="slug" value={category.slug} />
          <ConfirmButton question={`Xoá danh mục ${category.name}?`}>Xoá danh mục</ConfirmButton>
          <GroupError message={deleteState?.errors.delete} />
        </form>
      ) : null}
    </>
  );
}

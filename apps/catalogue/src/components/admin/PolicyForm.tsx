"use client";

import { useActionState } from "react";
import { savePolicy } from "@/app/admin/_actions/content";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { FormState } from "@/lib/admin/form";
import type { Policy } from "@/lib/policies";
import { Textarea } from "./Field";

export function PolicyForm({ policy }: { policy: Policy | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePolicy, null);
  const err = (name: string) => state?.errors[name];
  const val = (name: string, saved: string | undefined) => state?.values[name] ?? saved ?? "";
  return (
    <form key={state?.nonce} action={action} noValidate className="flex max-w-3xl flex-col gap-6">
      <input type="hidden" name="originalSlug" value={policy?.slug ?? ""} />
      <Input label="Tiêu đề" name="title" defaultValue={val("title", policy?.title)} error={err("title")} />
      <Input label="Đường dẫn" name="slug" defaultValue={val("slug", policy?.slug)} error={err("slug")} hint="Để trống thì tạo từ tiêu đề." />
      <Textarea
        label="Nội dung"
        name="body"
        rows={16}
        defaultValue={val("body", policy?.body)}
        error={err("body")}
        hint='Cách nhau một dòng trống giữa các đoạn. Dòng bắt đầu bằng "## " là tiêu đề nhỏ, "- " là gạch đầu dòng.'
      />
      <div>
        <Button variant="primary" type="submit" disabled={pending}>
          {pending ? "Đang lưu" : "Lưu chính sách"}
        </Button>
      </div>
    </form>
  );
}

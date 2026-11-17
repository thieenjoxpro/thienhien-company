"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signIn, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, null);
  return (
    <form action={action} noValidate className="flex flex-col gap-6">
      <Input label="Tên đăng nhập" name="username" autoComplete="username" autoCapitalize="none" defaultValue={state?.username} />
      <Input label="Mật khẩu" name="password" type="password" autoComplete="current-password" error={state?.error} />
      <Button type="submit" variant="dark" disabled={pending}>
        Đăng nhập quản trị
      </Button>
    </form>
  );
}

// Đổi số trong site.config thành link. Trường null thì trả null để phần tử không render.

export function zaloLink(number: string | null): string | null {
  return number ? `https://zalo.me/${number.replace(/\D/g, "")}` : null;
}

export function telLink(phone: string | null): string | null {
  return phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;
}

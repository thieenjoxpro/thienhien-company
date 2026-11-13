import { Button } from "@/components/ui/Button";

export function NewProducts() {
  return (
    <section>
      <Button variant="secondary">Tìm hiểu</Button>
      <Button variant="secondary" onClick={() => undefined}>Xem toàn bộ các mẫu mới về trong tuần</Button>
    </section>
  );
}

import Image from "next/image";

export default function Page() {
  return (
    <main>
      <Image src="/workshop/may-dap.webp" alt="Máy dập đang chạy trong xưởng" width={800} height={600} />
      <Image src="/workshop/may-dap.webp" alt="Máy dập đang chạy, góc khác" width={800} height={600} />
    </main>
  );
}

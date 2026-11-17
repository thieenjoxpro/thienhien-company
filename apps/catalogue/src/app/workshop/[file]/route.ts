import { serveUpload } from "@/lib/server/uploads";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  return serveUpload("workshop", (await params).file);
}

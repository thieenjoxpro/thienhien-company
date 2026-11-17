// Trang chính sách (mục 5.6). Nội dung do chủ xưởng viết; chưa có thì không có trang nào.
import { z } from "zod";
import policiesJson from "@/data/policies.json";
import { PolicySchema, type Policy } from "./policy-schema";
import { liveData } from "./server/mode";

export type { Policy };

const policies = z.array(PolicySchema).parse(policiesJson);

/** Chế độ máy chủ đọc bản trong bộ nhớ nạp từ database; còn lại là file JSON đi kèm bản build. */
export async function getPolicies(): Promise<Policy[]> {
  if (!liveData()) return policies;
  return (await (await import("./server/store")).ensureStore()).policies;
}

export async function getPolicy(slug: string): Promise<Policy | null> {
  return (await getPolicies()).find((policy) => policy.slug === slug) ?? null;
}

export type Block = { kind: "h2"; text: string } | { kind: "p"; text: string } | { kind: "ul"; items: string[] };

/** Tách markdown tối giản thành khối để render bằng React (không chèn HTML thô). */
export function parseBlocks(body: string): Block[] {
  return body
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      if (chunk.startsWith("## ")) return { kind: "h2", text: chunk.slice(3).trim() };
      const lines = chunk.split("\n");
      if (lines.every((line) => line.startsWith("- "))) return { kind: "ul", items: lines.map((line) => line.slice(2).trim()) };
      return { kind: "p", text: lines.join(" ") };
    });
}

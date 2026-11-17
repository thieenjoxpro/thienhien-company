import { z } from "zod";

export const PolicySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(2),
  updatedAt: z.iso.date(),
  /** Markdown tối giản: đoạn văn, "## " tiêu đề, "- " danh sách. */
  body: z.string().min(1),
});

export type Policy = z.infer<typeof PolicySchema>;

// Bản dữ liệu trong bộ nhớ của chế độ máy chủ: nạp từ database lúc khởi động, nạp lại sau mỗi lần /admin ghi.
// Trang công khai đọc từ đây nên không chạm database ở mỗi lượt xem.
// Để trên globalThis vì Next nạp module ở nhiều bundle; site.config.ts cũng đọc globalThis.__thStore (đồng bộ).
import { z } from "zod";
import { createCatalog } from "@/lib/catalog";
import { PolicySchema, type Policy } from "@/lib/policy-schema";
import { SiteDataSchema, type SiteData } from "@/lib/site-schema";
import { readContent } from "./db";

interface Store {
  catalog: ReturnType<typeof createCatalog>;
  policies: Policy[];
  site: SiteData;
}

const shared = globalThis as { __thStore?: Store; __thStoreLoading?: Promise<Store> };

async function load(): Promise<Store> {
  const [products, categories, policies, site] = await Promise.all(
    ["products.json", "categories.json", "policies.json", "site.json"].map(readContent),
  );
  const store: Store = {
    catalog: createCatalog({ categories, products }),
    policies: z.array(PolicySchema).parse(policies),
    site: SiteDataSchema.parse(site),
  };
  shared.__thStore = store;
  return store;
}

/** Bản dữ liệu hiện tại; lần đầu thì nạp từ database. */
export function ensureStore(): Promise<Store> {
  if (shared.__thStore) return Promise.resolve(shared.__thStore);
  shared.__thStoreLoading ??= load().finally(() => delete shared.__thStoreLoading);
  return shared.__thStoreLoading;
}

/** Gọi sau khi /admin ghi database. */
export const refreshStore = (): Promise<Store> => load();

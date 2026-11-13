// expect: no-restricted-imports
// expect-message: lib/catalog.ts
// path: src/app/page.tsx
import products from "@/data/products.json";

export const count = products.length;

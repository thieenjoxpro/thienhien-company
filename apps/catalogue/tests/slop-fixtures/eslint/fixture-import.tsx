// expect: no-restricted-imports
// expect-message: Fixture
// path: src/lib/catalog-helpers.ts
import products from "../../tests/fixtures/products.json";

export const count = products.length;

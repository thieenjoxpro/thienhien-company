import { describe, expect, it } from "vitest";
import { categoryFromForm, categoryInUse, policyFromForm, renameCategory, siteFromForm } from "../../src/lib/admin/content-forms";
import { parseNumber, slugify } from "../../src/lib/admin/form";
import { move, productFromForm, upsert } from "../../src/lib/admin/product-form";
import { CategorySchema, ProductSchema } from "../../src/lib/schema";
import fixtureCategories from "../fixtures/categories.json";
import fixtureProducts from "../fixtures/products.json";

const products = fixtureProducts.map((p) => ProductSchema.parse(p));
const categories = fixtureCategories.map((c) => CategorySchema.parse(c));
const ctx = { products, categories, originalSku: null };

const valid = {
  sku: "th-bl09",
  name: "Bản lề cối 22 ly",
  categorySlug: "ban-le-coi",
  summary: "Bản lề cối Ø20 × 120 mm, thép CT3 dày 2,5 mm, bề mặt mộc.",
  mainSpec: "Ø20 × 120 mm",
  unit: "cái",
  priceFrom: "24.000",
  thicknessMm: "2,5",
  material: "Thép CT3",
  finish: "",
  "spec-0-label": "Kích thước",
  "spec-0-value": "Ø20 × 120 mm",
  "spec-1-label": "Độ dày",
  "spec-1-value": "2,5 mm",
  isNew: "on",
};

describe("productFromForm", () => {
  it("đổi chữ trong form thành Product: mã in hoa, slug từ tên, số kiểu Việt, bỏ ô trống", () => {
    const result = productFromForm(valid, ctx);
    if (!result.ok) throw new Error(JSON.stringify(result.errors));
    expect(result.data).toMatchObject({
      sku: "TH-BL09",
      slug: "ban-le-coi-22-ly",
      priceFrom: 24000,
      filters: { thicknessMm: 2.5, material: "Thép CT3" },
      isNew: true,
      isFeatured: false,
      images: [],
    });
    expect(result.data.filters).not.toHaveProperty("finish");
  });

  it("lỗi theo từng ô, lời tiếng Việt", () => {
    const result = productFromForm({ ...valid, sku: "BL09", summary: "ngắn", priceFrom: "-5" }, ctx);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).toSorted()).toEqual(["priceFrom", "sku", "summary"]);
    expect(result.errors.sku).toContain("TH-BL03");
  });

  it("bắt mã và slug trùng, danh mục không có, thiếu dòng Kích thước/Độ dày", () => {
    const taken = productFromForm({ ...valid, sku: "TH-BL03", name: "Bản lề cối 16 ly" }, ctx);
    expect(taken.ok ? {} : taken.errors).toMatchObject({ sku: expect.any(String), slug: expect.any(String) });
    expect(productFromForm({ ...valid, categorySlug: "khong-co" }, ctx)).toMatchObject({ ok: false, errors: { categorySlug: expect.any(String) } });
    const noSize = productFromForm({ ...valid, "spec-0-label": "Vật liệu", "spec-1-label": "Bề mặt" }, ctx);
    expect(noSize.ok ? null : noSize.errors.specs).toContain("Kích thước");
  });

  it("sửa sản phẩm giữ ảnh; đổi mã thì đổi tên file ảnh theo", () => {
    const original = products.find((p) => p.sku === "TH-BL03");
    if (!original) throw new Error("fixture thiếu TH-BL03");
    const result = productFromForm({ ...valid, sku: "TH-BL30", name: original.name, slug: original.slug }, { ...ctx, originalSku: "TH-BL03" });
    if (!result.ok) throw new Error(JSON.stringify(result.errors));
    expect(result.data.images.map((i) => i.src)).toEqual(original.images.map((i) => i.src.replace("TH-BL03", "TH-BL30")));
  });
});

describe("hàm phụ", () => {
  it("slugify, parseNumber, upsert, move", () => {
    expect(slugify("Mâm cầu thang Ø300 (đúc)")).toBe("mam-cau-thang-300-duc");
    expect(parseNumber("0,8")).toBe(0.8);
    expect(parseNumber("18.000", true)).toBe(18000);
    expect(parseNumber(" ")).toBeUndefined();
    expect(upsert([1, 2, 3], 9, (n) => n === 2)).toEqual([1, 9, 3]);
    expect(upsert([1, 2], 9, () => false)).toEqual([1, 2, 9]);
    expect(move(["a", "b", "c"], 2, -1)).toEqual(["a", "c", "b"]);
    expect(move(["a", "b"], 0, -1)).toEqual(["a", "b"]);
  });
});

describe("danh mục, chính sách, thông tin xưởng", () => {
  it("danh mục: tối đa 2 cấp, nhóm cha phải là cấp đầu", () => {
    expect(categoryFromForm({ name: "Bản lề inox", parentSlug: "ban-le", order: "3", description: "" }, categories, null)).toMatchObject({
      ok: true,
      data: { slug: "ban-le-inox", parentSlug: "ban-le", order: 3 },
    });
    expect(categoryFromForm({ name: "Cấp ba", parentSlug: "ban-le-coi" }, categories, null)).toMatchObject({ ok: false, errors: { parentSlug: expect.any(String) } });
    expect(categoryFromForm({ name: "Bản lề", parentSlug: "pano" }, categories, "ban-le")).toMatchObject({ ok: false });
  });

  it("đổi slug danh mục kéo theo sản phẩm và danh mục con; xoá bị chặn khi còn dùng", () => {
    const renamed = renameCategory(products, categories, "ban-le", "ban-le-cua");
    expect(renamed.categories.filter((c) => c.parentSlug === "ban-le-cua")).toHaveLength(2);
    expect(categoryInUse("ban-le", products, categories)).toContain("danh mục con");
    expect(categoryInUse("ban-le-coi", products, categories)).toContain("sản phẩm");
  });

  it("chính sách: slug từ tiêu đề, chuẩn hoá xuống dòng", () => {
    const result = policyFromForm({ title: "Bảo hành", body: "## Thời hạn\r\n\r\n12 tháng." }, [], null);
    expect(result).toMatchObject({ ok: true, data: { slug: "bao-hanh", body: "## Thời hạn\n\n12 tháng." } });
  });

  it("thông tin xưởng: ô trống thành null, link bản đồ phải là URL", () => {
    const current = { district: null, street: null, mapUrl: null, openingHours: null, phone: null, zaloWholesale: null, zaloRetail: null, photos: { warehouse: null, workshop: null, storefront: null }, workshopText: null, aboutText: null, showPrice: true, legalName: null, taxCode: null, bankBin: null, bankAccount: null, bankAccountName: null, contacts: [], mapEmbedUrl: null };
    expect(siteFromForm({ district: " Bình Tân, TP.HCM ", phone: "" }, current)).toMatchObject({ ok: true, data: { district: "Bình Tân, TP.HCM", phone: null, showPrice: false } });
    expect(siteFromForm({ mapUrl: "ban do" }, current)).toMatchObject({ ok: false, errors: { mapUrl: expect.any(String) } });
    // tài khoản nhận tiền cho VietQR trên phiếu bán hàng
    expect(siteFromForm({ bankBin: "970436", bankAccount: "0123456789", bankAccountName: "NGUYEN VAN A" }, current)).toMatchObject({ ok: true, data: { bankBin: "970436", bankAccount: "0123456789" } });
    expect(siteFromForm({ bankBin: "97043" }, current)).toMatchObject({ ok: false, errors: { bankBin: expect.any(String) } });
  });

  it("thông tin xưởng: bản đồ nhúng nhận cả thẻ iframe (lấy src), từ chối link không phải Google Maps embed", () => {
    const current = { district: null, street: null, mapUrl: null, mapEmbedUrl: null, openingHours: null, phone: null, zaloWholesale: null, zaloRetail: null, photos: { warehouse: null, workshop: null, storefront: null }, workshopText: null, aboutText: null, showPrice: true, legalName: null, taxCode: null, bankBin: null, bankAccount: null, bankAccountName: null, contacts: [] };
    const iframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m18&amp;x=1" width="600" height="450" loading="lazy"></iframe>';
    expect(siteFromForm({ mapEmbedUrl: iframe }, current)).toMatchObject({ ok: true, data: { mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18&x=1" } });
    expect(siteFromForm({ mapEmbedUrl: "https://evil.example/embed" }, current)).toMatchObject({ ok: false, errors: { mapEmbedUrl: expect.any(String) } });
  });

  it("thông tin xưởng: hàng liên hệ trống số thì bỏ, giữ thứ tự, ô Có Zalo thành boolean", () => {
    const current = { district: null, street: null, mapUrl: null, openingHours: null, phone: null, zaloWholesale: null, zaloRetail: null, photos: { warehouse: null, workshop: null, storefront: null }, workshopText: null, aboutText: null, showPrice: true, legalName: null, taxCode: null, bankBin: null, bankAccount: null, bankAccountName: null, contacts: [], mapEmbedUrl: null };
    const result = siteFromForm(
      { contactName0: "Hạnh", contactNote0: "số chính", contactPhone0: " 0947 111 191 ", contactZalo0: "on", contactName1: "Bỏ", contactPhone1: " ", contactName2: "Hiền", contactPhone2: "0942 959 688", taxCode: "0319260193" },
      current,
    );
    expect(result).toMatchObject({
      ok: true,
      data: {
        taxCode: "0319260193",
        contacts: [
          { name: "Hạnh", note: "số chính", phone: "0947 111 191", zalo: true },
          { name: "Hiền", note: "", phone: "0942 959 688", zalo: false },
        ],
      },
    });
  });
});

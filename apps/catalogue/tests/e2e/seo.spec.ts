import { expectPageBasics } from "./checks";
import { expect, test } from "./test";

const ORIGIN = "http://localhost:4310";
const ROUTES = [
  "/",
  "/san-pham",
  "/danh-muc/pano",
  "/danh-muc/ban-le-coi",
  "/san-pham/ban-le-coi-16-ly",
  "/san-pham/ton-chan-mang-xoi-khong-co",
  "/hoi-gia",
  "/gioi-thieu",
  "/lien-he",
  "/chinh-sach/giao-hang",
  "/chinh-sach/doi-tra",
];

test("mỗi route có đúng một h1, title và canonical không trùng nhau, JSON-LD parse được", async ({ page, isMobile }) => {
  test.skip(isMobile, "metadata giống nhau ở mọi khổ");
  test.setTimeout(90_000);
  const titles = new Map<string, string>();
  const canonicals = new Map<string, string>();
  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.locator("h1"), route).toHaveCount(1);
    const title = await page.title();
    expect(titles.get(title), `title "${title}" trùng giữa ${route} và ${titles.get(title)}`).toBeUndefined();
    titles.set(title, route);

    // Đọc thẳng từ DOM: trang không có canonical thì trả null ngay, không chờ hết thời gian
    const canonical = await page.evaluate(() => document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null);
    if (canonical) {
      expect(canonical.startsWith(ORIGIN), `${route}: canonical phải tuyệt đối`).toBe(true);
      expect(canonicals.get(canonical), `canonical trùng: ${route}`).toBeUndefined();
      canonicals.set(canonical, route);
    }
    for (const json of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      expect(() => JSON.parse(json), `${route}: JSON-LD hỏng`).not.toThrow();
    }
  }
  // Trang công khai có canonical; trang hỏi giá và 404 thì không cần
  expect([...canonicals.values()].toSorted()).toEqual(ROUTES.filter((r) => !["/hoi-gia", "/san-pham/ton-chan-mang-xoi-khong-co"].includes(r)).toSorted());
});

test("JSON-LD: LocalBusiness ở layout, BreadcrumbList và Product (có offers khi có giá) ở trang chi tiết", async ({ page }) => {
  await page.goto("/san-pham/ban-le-coi-16-ly");
  const blocks = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((json) => JSON.parse(json));
  const types = blocks.map((b) => [b["@type"]].flat().join("+"));
  expect(types).toEqual(expect.arrayContaining(["Organization+LocalBusiness", "BreadcrumbList", "Product"]));
  const product = blocks.find((b) => b["@type"] === "Product");
  expect(product).toMatchObject({ sku: "TH-BL03", offers: { price: 18000, priceCurrency: "VND" } });
  expect(blocks.find((b) => b["@type"] === "BreadcrumbList").itemListElement).toHaveLength(4);

  await page.goto("/san-pham/ban-le-la-5-phan"); // chưa có giá
  const noPrice = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((json) => JSON.parse(json));
  expect(noPrice.find((b) => b["@type"] === "Product")).not.toHaveProperty("offers");
});

test("sitemap có trang sản phẩm, danh mục, chính sách, không có /hoi-gia; robots trỏ tới sitemap", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/", "/san-pham/ban-le-coi-16-ly", "/danh-muc/ban-le-coi", "/chinh-sach/doi-tra", "/gioi-thieu"]) {
    expect(sitemap).toContain(`<loc>${ORIGIN}${path === "/" ? "" : path}`);
  }
  expect(sitemap).not.toContain("/hoi-gia");
  expect(sitemap).not.toContain("/dev/");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  expect(robots).toContain("Disallow: /hoi-gia");
});

test("trang chính sách hiện tiêu đề con và danh sách; footer có cột Chính sách", async ({ page }) => {
  await page.goto("/chinh-sach/giao-hang");
  await expect(page.getByRole("heading", { level: 2, name: "Thời gian" })).toBeVisible();
  await expect(page.locator("main article li")).toHaveCount(2);
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Đổi trả" })).toHaveAttribute("href", "/chinh-sach/doi-tra");
});

test("404 có ô tìm gửi tới /san-pham và các nhóm hàng", async ({ page }) => {
  const response = await page.goto("/khong-co-trang-nay");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Không có trang này");
  await page.getByRole("searchbox", { name: "Tìm theo mã hoặc tên" }).fill("bl03");
  await page.getByRole("button", { name: "Xem mẫu khớp" }).click();
  await expect(page).toHaveURL(/\/san-pham\?q=bl03/);
  await expect(page.locator("main ul.grid > li")).toHaveCount(1);
});

for (const path of ["/gioi-thieu", "/lien-he", "/chinh-sach/doi-tra", "/hoi-gia"]) {
  test(`${path}: axe sạch, không cuộn ngang, vùng chạm từ 44px`, async ({ page }) => {
    await page.goto(path);
    await expectPageBasics(page);
  });
}

import Link from "next/link";
import { dataFileExists } from "@/lib/admin/files";
import { loadCategories, loadPolicies, loadProducts, loadSite } from "@/lib/admin/repo";

// Tổng quan: đếm và danh sách việc còn thiếu trước khi lên web (giống check:data, check:slop --production)
export default async function AdminHome() {
  const [products, categories, policies, site] = await Promise.all([loadProducts(), loadCategories(), loadPolicies(), loadSite()]);
  const withImages = products.filter((p) => p.images.length > 0).length;
  const todo = [
    dataFileExists("DEMO.md") && "Dữ liệu và ảnh đang là demo: thay hàng thật rồi xoá src/data/DEMO.md.",
    withImages < 12 && `Mới có ${withImages} sản phẩm có ảnh; cần ít nhất 12.`,
    products.length > withImages && `${products.length - withImages} sản phẩm chưa có ảnh nên chưa hiện trên site.`,
    !site.district && "Chưa có quận (Thông tin xưởng).",
    !site.zaloWholesale && "Chưa có số Zalo sỉ (Thông tin xưởng).",
  ].filter((item): item is string => Boolean(item));

  const counts = [
    { href: "/admin/san-pham", label: "Sản phẩm", value: products.length },
    { href: "/admin/danh-muc", label: "Danh mục", value: categories.length },
    { href: "/admin/chinh-sach", label: "Chính sách", value: policies.length },
  ];
  return (
    <>
      <h1 className="mb-8 text-h2 lg:mb-12">Quản trị catalogue</h1>
      <dl className="mb-12 flex flex-wrap gap-x-12 gap-y-6">
        {counts.map((count) => (
          <div key={count.href}>
            <dt className="text-label text-ink-muted">{count.label}</dt>
            <dd>
              <Link href={count.href} className="text-h3 underline underline-offset-4">
                {count.value}
              </Link>
            </dd>
          </div>
        ))}
      </dl>
      <h2 className="mb-4 text-h3">Trước khi lên web</h2>
      {todo.length ? (
        <ul className="max-w-3xl list-disc pl-6">
          {todo.map((item) => (
            <li key={item} className="py-1">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p>Đủ dữ kiện bắt buộc. Chạy pnpm verify:full rồi deploy.</p>
      )}
    </>
  );
}

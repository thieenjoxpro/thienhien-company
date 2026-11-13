import { Breadcrumb, type Crumb } from "./Breadcrumb";

/** Đầu trang danh sách (mục 5.3): breadcrumb, h1 kiểu h2, cạnh đó một dòng "{n} mẫu". */
export function ListingHeader({ crumbs, title, count }: { crumbs: Crumb[]; title: string; count: number }) {
  return (
    <div className="mb-8 lg:mb-12">
      <Breadcrumb items={crumbs} />
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <h1 className="text-h2">{title}</h1>
        <p className="text-ink-muted">{count} mẫu</p>
      </div>
    </div>
  );
}

// Phiếu bán hàng khổ A5: template duy nhất cho xem trước, in (window.print), ảnh PNG và PDF (Chromium chụp /phieu/[id]).
// Chữ từ 16px (12pt). Khách lẻ không in phần nợ. Đơn huỷ có dấu ĐÃ HUỶ chéo.
import { docSoThanhChu } from "@thien-hien/shared";
import { LogoMark } from "@/components/layout/LogoMark";
import { formatNumber, formatPrice } from "@/lib/format";
import { dateTimeVN } from "@/lib/sales/dates";
import { receiptCode } from "@/lib/sales/order";
import type { ReceiptData } from "@/lib/server/sales/receipt";
import { site as brand } from "@/lib/site.config";

const Row = ({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) => (
  <div className={strong ? "flex justify-between gap-4 font-bold" : "flex justify-between gap-4"}>
    <dt>{label}</dt>
    <dd className="num-end">{value}</dd>
  </div>
);

export function Receipt({ data }: { data: ReceiptData }) {
  const { order, site, qr } = data;
  const { customer } = order;
  const showDebt = customer.kind === "si" && !customer.walkIn;
  const newDebt = order.total - order.paid;
  return (
    <article className="receipt-page relative mx-auto w-full max-w-a5 bg-ground p-6 text-body text-ink print:p-0" aria-label={`Phiếu ${receiptCode(order.id)}`} data-receipt>
      {order.cancelledAt ? (
        <p aria-label="Đơn đã huỷ" className="stamp-cancelled pointer-events-none absolute top-1/2 left-1/2 rounded-card border-4 border-danger px-6 font-display text-hero text-danger uppercase">
          Đã huỷ
        </p>
      ) : null}
      <header className="flex items-start gap-3 border-b-2 border-ink pb-3">
        <LogoMark className="size-12" />
        <div>
          <p className="font-display text-h3 uppercase">{site.legalName ?? brand.name}</p>
          {site.street ? <p>{site.street}</p> : null}
          {site.phone ? <p>Điện thoại: {site.phone}</p> : null}
        </div>
      </header>
      <div className="mt-3 text-center">
        <h2 className="font-display text-h2 uppercase">Phiếu bán hàng</h2>
        <p>(không phải hoá đơn GTGT)</p>
        <p>
          Số {receiptCode(order.id)} · {dateTimeVN(order.createdAt)}
        </p>
      </div>
      <dl className="mt-3">
        <div className="flex gap-2">
          <dt>Khách:</dt>
          <dd className="font-semibold">{customer.name}</dd>
        </div>
        {customer.phone ? (
          <div className="flex gap-2">
            <dt>Điện thoại:</dt>
            <dd>{customer.phone}</dd>
          </div>
        ) : null}
        {customer.address ? (
          <div className="flex gap-2">
            <dt>Địa chỉ:</dt>
            <dd>{customer.address}</dd>
          </div>
        ) : null}
      </dl>
      <table className="mt-3 w-full border-collapse">
        <thead>
          <tr className="border-y border-ink text-left">
            <th scope="col" className="py-1 pr-2 font-semibold">STT</th>
            <th scope="col" className="py-1 pr-2 font-semibold">Tên hàng</th>
            <th scope="col" className="py-1 pr-2 font-semibold">ĐVT</th>
            <th scope="col" className="num-end py-1 pr-2 font-semibold">SL</th>
            <th scope="col" className="num-end py-1 pr-2 font-semibold">Đơn giá</th>
            <th scope="col" className="num-end py-1 font-semibold">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((line) => (
            <tr key={line.line} className="border-b border-line align-top">
              <td className="py-1 pr-2">{line.line}</td>
              <td className="py-1 pr-2">{line.name}</td>
              <td className="py-1 pr-2">{line.unit}</td>
              <td className="num-end py-1 pr-2">{formatNumber(line.quantity)}</td>
              <td className="num-end py-1 pr-2">{formatNumber(line.unitPrice)}</td>
              <td className="num-end py-1">{formatNumber(line.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="mt-3 flex flex-col gap-1">
        {order.discount > 0 ? (
          <>
            <Row label="Tiền hàng" value={formatPrice(order.subtotal)} />
            <Row label="Giảm giá" value={`- ${formatPrice(order.discount)}`} />
          </>
        ) : null}
        <Row label="Tổng tiền" value={formatPrice(order.total)} strong />
      </dl>
      <p className="mt-1">Bằng chữ: {docSoThanhChu(order.total)}</p>
      <dl className="mt-2 flex flex-col gap-1">
        <Row label="Khách trả" value={formatPrice(order.paid)} />
        {showDebt ? (
          <>
            <Row label="Nợ cũ" value={formatPrice(order.debtBefore)} />
            <Row label="Nợ mới (đơn này)" value={formatPrice(newDebt)} />
            <Row label="Tổng nợ" value={formatPrice(order.debtBefore + newDebt)} strong />
          </>
        ) : null}
      </dl>
      {qr ? (
        <div className="mt-4 flex items-center gap-4 border-t border-line pt-3">
          {/* SVG do thư viện qrcode sinh từ chuỗi VietQR của chính máy chủ, không có dữ liệu người dùng gõ */}
          <div className="size-32 shrink-0" dangerouslySetInnerHTML={{ __html: qr.svg }} aria-label={`Mã VietQR chuyển khoản ${formatPrice(qr.amount)}`} role="img" />
          <div>
            <p className="font-semibold">Quét mã để chuyển khoản {formatPrice(qr.amount)}</p>
            <p>
              {qr.bank} · {qr.account}
            </p>
            {qr.accountName ? <p>{qr.accountName}</p> : null}
            <p>Nội dung: {receiptCode(order.id)}</p>
          </div>
        </div>
      ) : null}
      <div className="mt-6 grid grid-cols-2 text-center">
        <p className="font-semibold">Người mua</p>
        <p className="font-semibold">Người bán</p>
        <p className="h-16" aria-hidden="true" />
      </div>
    </article>
  );
}

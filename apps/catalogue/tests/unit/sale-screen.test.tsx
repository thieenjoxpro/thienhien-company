// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SaleScreen } from "../../src/components/sales/SaleScreen";
import type { CustomerContext, SaleCustomer, SaleProduct } from "../../src/lib/sales/types";

const server = vi.hoisted(() => ({
  context: { debt: 1_200_000, lastPrices: { "TH-BL03": 17_000 }, lastOrder: { id: 9, createdAt: "2026-11-20T03:00:00Z", lines: [{ sku: "TH-BL03", quantity: 5, unitPrice: 17_000 }, { sku: "TH-PN04", quantity: 2, unitPrice: 115_000 }] } } as CustomerContext,
  submit: vi.fn(),
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: server.push }) }));
vi.mock("next/link", () => ({ default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a> }));
vi.mock("../../src/app/admin/_actions/sales", () => ({
  loadCustomerContext: vi.fn(async () => server.context),
  submitOrder: server.submit,
  addCustomer: vi.fn(),
}));

const products: SaleProduct[] = [
  { sku: "TH-BL03", name: "Bản lề cối 16 ly", unit: "cái", price: 18_000, stock: 100 },
  { sku: "TH-PN04", name: "Pano dập trống đồng", unit: "tấm", price: 120_000, stock: 1 },
  { sku: "TH-TN02", name: "Tôn phẳng 1 ly", unit: "tấm", price: 520_000, stock: 50 },
];
const walkIn: SaleCustomer = { id: 1, name: "Khách lẻ", phone: null, kind: "le", walkIn: true };
const hung: SaleCustomer = { id: 2, name: "Anh Hùng", phone: "0901 234 567", kind: "si", walkIn: false };

const renderScreen = () =>
  render(<SaleScreen products={products} customers={[walkIn, hung]} frequent={[walkIn, hung]} top={products} user="chu-xuong" initial={null} />);

const flush = () => act(async () => {});

describe("màn bán hàng", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    server.submit.mockReset();
    server.push.mockReset();
    window.requestAnimationFrame = (cb) => (cb(0), 0);
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("chọn khách từ lưới khách quen: hiện tên to, nợ cũ, nút Bán giống lần trước", async () => {
    renderScreen();
    fireEvent.click(within(screen.getByRole("list", { name: "Khách hay mua" })).getByText("Anh Hùng"));
    await flush();
    expect(screen.getByText("Nợ cũ: 1.200.000 đ")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Bán giống lần trước" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Đổi khách" })).toBeTruthy();
  });

  it("Bán giống lần trước điền đúng dòng, giá theo giá gợi ý, hiện Lần trước bán", async () => {
    renderScreen();
    fireEvent.click(screen.getByText("Anh Hùng"));
    await flush();
    fireEvent.click(screen.getByRole("button", { name: "Bán giống lần trước" }));
    const lines = within(screen.getByRole("list", { name: "Hàng trong đơn" })).getAllByRole("listitem");
    expect(lines).toHaveLength(2);
    expect(within(lines[0] as HTMLElement).getByLabelText("Số lượng")).toHaveProperty("value", "5");
    expect(within(lines[0] as HTMLElement).getByLabelText("Đơn giá")).toHaveProperty("value", "17.000");
    expect(within(lines[0] as HTMLElement).getByText("Lần trước bán: 17.000 đ")).toBeTruthy();
    // pano không có trong lastPrices của khách: dùng giá bảng
    expect(within(lines[1] as HTMLElement).getByLabelText("Đơn giá")).toHaveProperty("value", "120.000");
    // pano bán 2 tấm, kho còn 1: cảnh báo vàng, không chặn
    expect(within(lines[1] as HTMLElement).getByText(/Kho chỉ còn 1 tấm/)).toBeTruthy();
  });

  it("nút cộng trừ đổi số lượng và thành tiền ngay", () => {
    renderScreen();
    fireEvent.click(within(screen.getByRole("list", { name: "Mặt hàng hay bán" })).getByText("Bản lề cối 16 ly"));
    fireEvent.click(screen.getByRole("button", { name: "Thêm 1 cái" }));
    fireEvent.click(screen.getByRole("button", { name: "Thêm 1 cái" }));
    expect(screen.getByLabelText("Số lượng")).toHaveProperty("value", "3");
    fireEvent.click(screen.getByRole("button", { name: "Bớt 1 cái" }));
    expect(screen.getByLabelText("Số lượng")).toHaveProperty("value", "2");
    expect(screen.getByText("Thành tiền: 36.000 đ")).toBeTruthy();
  });

  it("số bằng chữ hiện ngay dưới ô tiền và dưới tổng tiền", () => {
    renderScreen();
    fireEvent.click(screen.getByText("Khách lẻ"));
    fireEvent.click(screen.getByText("Tôn phẳng 1 ly"));
    fireEvent.change(screen.getByLabelText("Giảm giá (nếu có)"), { target: { value: "20000", selectionStart: 5 } });
    expect(screen.getByLabelText("Giảm giá (nếu có)")).toHaveProperty("value", "20.000");
    expect(screen.getByText("Hai mươi nghìn đồng")).toBeTruthy();
    expect(screen.getAllByText("Năm trăm nghìn đồng").length).toBeGreaterThanOrEqual(1);
    fireEvent.click(screen.getByRole("button", { name: "Chưa trả" }));
    expect(screen.getByText("Còn nợ thêm: 500.000 đ")).toBeTruthy();
  });

  it("tự lưu nháp và khôi phục khi mở lại, có nút Bỏ đơn này", async () => {
    const first = renderScreen();
    fireEvent.click(screen.getByText("Khách lẻ"));
    fireEvent.click(screen.getByText("Tôn phẳng 1 ly"));
    await act(async () => vi.advanceTimersByTime(600));
    first.unmount();
    expect(window.localStorage.getItem("th-ban-hang-nhap:chu-xuong")).toContain("TH-TN02");
    renderScreen();
    await flush();
    expect(screen.getByText("Đang tiếp tục đơn chưa xong.")).toBeTruthy();
    expect(within(screen.getByRole("list", { name: "Hàng trong đơn" })).getByText(/Tôn phẳng 1 ly/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Bỏ đơn này" }));
    expect(screen.queryByRole("list", { name: "Hàng trong đơn" })).toBeNull();
  });

  it("lỗi hiện cạnh trường, không tự mất, hết khi đã sửa; không gọi máy chủ khi còn lỗi", async () => {
    renderScreen();
    fireEvent.click(screen.getByRole("button", { name: "Xong, in phiếu" }));
    await flush();
    expect(screen.getByText("Chưa chọn khách.")).toBeTruthy();
    expect(screen.getByText("Chưa chọn hàng nào.")).toBeTruthy();
    expect(server.submit).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(10_000));
    expect(screen.getByText("Chưa chọn hàng nào.")).toBeTruthy();
    fireEvent.click(screen.getByText("Khách lẻ"));
    expect(screen.queryByText("Chưa chọn khách.")).toBeNull();
    fireEvent.click(screen.getByText("Bản lề cối 16 ly"));
    fireEvent.change(screen.getByLabelText("Số lượng"), { target: { value: "0" } });
    expect(screen.getByText("Số lượng phải lớn hơn 0.")).toBeTruthy();
  });

  it("lưu xong thì sang màn phiếu và xoá nháp", async () => {
    server.submit.mockResolvedValue({ ok: true, id: 42, warnings: [] });
    renderScreen();
    fireEvent.click(screen.getByText("Khách lẻ"));
    fireEvent.click(screen.getByText("Bản lề cối 16 ly"));
    await act(async () => vi.advanceTimersByTime(600));
    fireEvent.click(screen.getByRole("button", { name: "Xong, in phiếu" }));
    await flush();
    expect(server.submit).toHaveBeenCalledWith({ customerId: 1, lines: [{ sku: "TH-BL03", quantity: 1, unitPrice: 18_000 }], discount: 0, paid: 18_000, note: "" });
    expect(server.push).toHaveBeenCalledWith("/admin/don-hang/42?moi=1");
    expect(window.localStorage.getItem("th-ban-hang-nhap:chu-xuong")).toBeNull();
  });
});

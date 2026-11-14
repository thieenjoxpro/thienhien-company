import { describe, expect, it } from "vitest";
import { parseBlocks } from "../../src/lib/policies";

describe("parseBlocks", () => {
  it("tách tiêu đề, danh sách, đoạn văn; gộp dòng trong một đoạn", () => {
    expect(parseBlocks("## Phạm vi\n\nGiao nội thành\nbằng xe tải.\n\n- Sỉ: hẹn ngày\n- Lẻ: lấy tại xưởng")).toEqual([
      { kind: "h2", text: "Phạm vi" },
      { kind: "p", text: "Giao nội thành bằng xe tải." },
      { kind: "ul", items: ["Sỉ: hẹn ngày", "Lẻ: lấy tại xưởng"] },
    ]);
  });

  it("chữ có ký tự HTML vẫn là chữ thường (React tự thoát khi render)", () => {
    expect(parseBlocks("<script>x</script>")).toEqual([{ kind: "p", text: "<script>x</script>" }]);
  });
});

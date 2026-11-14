import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");

/**
 * Trên Windows, Playwright tắt tiến trình cha của webServer nhưng `next start` (tiến trình con) vẫn giữ cổng,
 * làm lần chạy sau báo cổng bận. Chỉ tắt server Next đang nghe cổng 4310 mà dòng lệnh nằm trong repo này.
 */
export default function teardown() {
  if (process.platform !== "win32") return;
  const script = [
    "Get-NetTCPConnection -LocalPort 4310 -State Listen -ErrorAction SilentlyContinue | ForEach-Object {",
    "  $p = Get-CimInstance Win32_Process -Filter \"ProcessId=$($_.OwningProcess)\";",
    `  if ($p.CommandLine -like '*${repoRoot.replace(/'/g, "''")}*start-server.js*') { Stop-Process -Id $p.ProcessId -Force }`,
    "}",
  ].join("\n");
  try {
    execFileSync("powershell", ["-NoProfile", "-NonInteractive", "-Command", script], { stdio: "ignore" });
  } catch {
    // Không dọn được thì lần sau Playwright báo cổng bận, không có gì hỏng thêm
  }
}

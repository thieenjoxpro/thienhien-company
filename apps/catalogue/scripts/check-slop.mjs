#!/usr/bin/env node
// Lớp 4 của bộ luật chống AI slop (docs/PLAN.md mục 9.4). Không phụ thuộc thư viện.
//
//   node scripts/check-slop.mjs [--production] [--root <thư mục app>]
//
// Quét <root>/src/**/*.{ts,tsx,md,json}; mỗi lỗi in "đường-dẫn:dòng [luật] lời nhắn"; có lỗi thì exit 1.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const production = args.includes("--production");
const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rootIndex = args.indexOf("--root");
const root = rootIndex >= 0 && args[rootIndex + 1] ? resolve(args[rootIndex + 1]) : appRoot;

const ALLOWED_SPACING = new Set(["0", "1", "2", "3", "4", "6", "8", "12", "24"]);
const BLOCKS = ["Hero", "CategoryGrid", "NewProducts", "WorkshopSplit", "ContactBand"];
const IMAGE_HOSTS = ["unsplash.", "pexels.", "pixabay.", "picsum.", "placehold", "placeholder.com", "hammered.vn"];
// Class chỉ được dùng trong đúng các file này (mục 7)
const SCOPED_CLASSES = [
  { cls: "bg-accent(?:-strong)?", files: ["Button.tsx", "QuoteCount.tsx"] },
  { cls: "bg-ink", files: ["Footer.tsx", "ContactBand.tsx", "Button.tsx"] },
  { cls: "m-enter", files: ["Hero.tsx"] },
  { cls: "m-(?:lift|zoom)", files: ["ProductCard.tsx", "CategoryTile.tsx"] },
  { cls: "m-press", files: ["Button.tsx"] },
  { cls: "bar-top", files: ["Header.tsx"] },
  { cls: "bar-bottom", files: ["PhoneBar.tsx"] },
];
const REQUIRED_IN_PRODUCTION = ["district", "zaloWholesale"];

/** Bỏ dấu, đ -> d, viết thường: so khớp không dấu, không phân biệt hoa thường. */
const fold = (s) => s.normalize("NFD").replace(/\p{M}/gu, "").replace(/[đĐ]/g, "d").toLowerCase();
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

const bannedCopy = readJson(join(appRoot, "rules/banned-copy.json")).map(fold);
const buttonVerbs = new Set(readJson(join(appRoot, "rules/button-verbs.json")).map(fold));
const placeholderWords = ["mẫu thử", "đang cập nhật", "sắp có"].map(fold);

const problems = [];
const report = (file, line, rule, message) => problems.push({ file: relative(root, file).split("\\").join("/"), line, rule, message });
const lineOf = (text, index) => text.slice(0, index).split("\n").length;

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "node_modules" ? [] : walk(path);
    return /\.(tsx?|md|json)$/.test(entry.name) ? [path] : [];
  });
}

const srcDir = join(root, "src");
const files = walk(srcDir);
const rel = (file) => relative(srcDir, file).split("\\").join("/");
const isCode = (file) => /\.tsx?$/.test(file);
const isPage = (file) => /^app\/(.+\/)?page\.tsx$/.test(rel(file));

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  const name = file.split(/[\\/]/).pop();

  lines.forEach((line, i) => {
    const n = i + 1;
    const folded = fold(line);

    // 1. Cụm từ cấm
    for (const phrase of bannedCopy) {
      if (new RegExp(`(^|[^a-z0-9])${escapeRe(phrase)}([^a-z0-9]|$)`).test(folded)) {
        report(file, n, "banned-copy", `cụm từ cấm "${phrase}"`);
      }
    }
    // 2. Số liệu khoe không có nguồn
    if (name !== "site.config.ts" && /(^|[^0-9])\d+\+?\s*(nam kinh nghiem|khach hang|du an|dai ly|san pham da ban)/.test(folded)) {
      report(file, n, "unsourced-number", "số liệu khoe không có nguồn; số thật đặt trong site.config.ts");
    }
    // 3. Ảnh ngoài
    const lower = line.toLowerCase();
    const host = IMAGE_HOSTS.find((h) => lower.includes(h));
    if (host || /\bsrc\s*=\s*\{?\s*["'`]https?:\/\//.test(line) || /"src"\s*:\s*"https?:\/\//.test(line)) {
      report(file, n, "external-image", `ảnh ngoài${host ? ` (${host})` : ""}; chỉ dùng ảnh thật trong public/`);
    }
    // 4. Spacing ngoài thang
    if (isCode(file)) {
      const spacing = /(?<![\w:/-])(?:[a-z0-9-]+:)*-?(?:p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy])-(\d+(?:\.\d+)?)(?![\w.%/-])/g;
      for (const match of line.matchAll(spacing)) {
        if (!ALLOWED_SPACING.has(match[1])) report(file, n, "spacing-scale", `"${match[0]}" ngoài thang 0, 1, 2, 3, 4, 6, 8, 12, 24`);
      }
    }
    // 6. Dấu gạch dài và ba chấm trang trí
    if (line.includes("\u2014")) report(file, n, "dash-ellipsis", "dấu gạch dài; dùng dấu phẩy, hai chấm hoặc tách câu");
    if (line.includes("\u2026") || /\p{L}\.\.\./u.test(line)) report(file, n, "dash-ellipsis", "ba chấm trang trí");
    // 8. Accent, dải tối, chuyển động, dính màn hình chỉ ở file được phép
    if (isCode(file)) {
      for (const { cls, files: allowed } of SCOPED_CLASSES) {
        const match = line.match(new RegExp(`(?<![\\w-])(?:[a-z0-9-]+:)*(${cls})(?![\\w-])`));
        if (match && !allowed.includes(name)) report(file, n, "class-scope", `"${match[1]}" chỉ được dùng trong ${allowed.join(", ")}`);
      }
    }
    // 12. Chú thích ảnh và chữ giữ chỗ
    if (/<figcaption/i.test(line)) report(file, n, "placeholder", "không dùng <figcaption>: ảnh không có chú thích");
    if (line.includes("TODO")) report(file, n, "placeholder", "chuỗi TODO trong src/");
    if (/\[(?=[^\]]*\p{Lu})[\p{Lu}_ ]{2,}\]|\[(\u2026|\.\.\.)\]/u.test(line)) report(file, n, "placeholder", "chữ giữ chỗ trong ngoặc vuông");
    for (const word of placeholderWords) {
      if (new RegExp(`(^|[^a-z0-9])${escapeRe(word)}([^a-z0-9]|$)`).test(folded)) report(file, n, "placeholder", `chữ giữ chỗ "${word}"`);
    }
  });

  // 5. Tên sản phẩm viết hoa toàn bộ
  if (rel(file) === "data/products.json") checkProductNames(file, text);
  // 7. Trùng khối trên trang chủ
  if (rel(file) === "app/page.tsx") {
    for (const block of BLOCKS) {
      const hits = [...text.matchAll(new RegExp(`<${block}[\\s/>]`, "g"))];
      if (hits.length > 1) report(file, lineOf(text, hits[1].index), "duplicate-block", `<${block}> xuất hiện ${hits.length} lần`);
      if (hits.length === 0 && production) report(file, 1, "duplicate-block", `thiếu khối <${block}>`);
    }
  }
  // 11. Một nút chính mỗi trang / mỗi component
  const primaryScope = (isPage(file) && !rel(file).startsWith("app/dev/")) || (rel(file).startsWith("components/") && name !== "Button.tsx");
  if (primaryScope && file.endsWith(".tsx")) {
    const hits = [...text.matchAll(/variant=\{?\s*["'`]primary["'`]/g)];
    if (hits.length > 1) report(file, lineOf(text, hits[1].index), "one-primary", `${hits.length} nút variant="primary" trong một file`);
  }
  // 13. Nhãn nút
  if (file.endsWith(".tsx")) checkButtonLabels(file, text);
  // 14. Ảnh lặp trong một trang
  if (isPage(file)) {
    const seen = new Map();
    for (const match of text.matchAll(/\bsrc=\{?\s*["'`]([^"'`]+)["'`]/g)) {
      if (seen.has(match[1])) report(file, lineOf(text, match.index), "duplicate-image", `ảnh "${match[1]}" dùng hai lần (lần đầu dòng ${seen.get(match[1])})`);
      else seen.set(match[1], lineOf(text, match.index));
    }
  }
}

checkTokenDrift();
checkRequiredConfig();

function checkProductNames(file, text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return report(file, 1, "caps-name", "products.json không parse được");
  }
  const products = Array.isArray(data) ? data : (data.products ?? []);
  for (const product of products) {
    const productName = String(product?.name ?? "");
    const letters = productName.replace(/[^\p{L}]/gu, "");
    if (letters.length >= 4 && productName === productName.toUpperCase() && productName !== productName.toLowerCase()) {
      const index = text.indexOf(JSON.stringify(productName));
      report(file, index >= 0 ? lineOf(text, index) : 1, "caps-name", `tên "${productName}" viết hoa toàn bộ; chỉ viết hoa chữ đầu`);
    }
  }
}

function checkButtonLabels(file, text) {
  for (const open of text.matchAll(/<Button\b/g)) {
    // Tìm dấu > đóng thẻ mở, bỏ qua > nằm trong {...} hoặc trong chuỗi
    let i = open.index + open[0].length;
    let depth = 0;
    let quote = null;
    for (; i < text.length; i++) {
      const ch = text[i];
      if (quote) {
        if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'" || ch === "`") quote = ch;
      else if (ch === "{") depth++;
      else if (ch === "}") depth--;
      else if (ch === ">" && depth === 0) break;
    }
    if (text[i - 1] === "/") continue; // <Button ... /> tự đóng: nhãn nằm trong prop, không kiểm được
    const close = text.indexOf("</Button>", i);
    if (close < 0) continue;
    let inner = text.slice(i + 1, close);
    while (/\{[^{}]*\}/.test(inner)) inner = inner.replace(/\{[^{}]*\}/g, " ");
    const label = inner.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (!label) continue; // nhãn động: không kiểm được bằng tĩnh
    const words = label.split(" ");
    const line = lineOf(text, open.index);
    if (!buttonVerbs.has(fold(words[0]))) report(file, line, "button-label", `nhãn "${label}" không bắt đầu bằng động từ trong rules/button-verbs.json`);
    if (words.length > 5) report(file, line, "button-label", `nhãn "${label}" dài ${words.length} chữ (tối đa 5)`);
  }
}

function checkTokenDrift() {
  const cssPath = join(root, "src/app/globals.css");
  if (!existsSync(cssPath)) return;
  const tokensPath = join(root, "design/tokens.json");
  if (!existsSync(tokensPath)) return report(cssPath, 1, "token-drift", "thiếu design/tokens.json để đối chiếu màu");
  const tokens = readJson(tokensPath);
  const firstTheme = tokens.color?.themes?.[0]?.id;
  const expected = new Map(
    (tokens.color?.tokens ?? []).map((t) => [t.name, String(typeof t.value === "object" ? t.value[firstTheme] : t.value).toLowerCase()]),
  );
  const css = readFileSync(cssPath, "utf8");
  const found = new Set();
  for (const match of css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\b/g)) {
    const [, tokenName, value] = match;
    found.add(tokenName);
    const want = expected.get(tokenName);
    if (!want) report(cssPath, lineOf(css, match.index), "token-drift", `--color-${tokenName} không có trong design/tokens.json`);
    else if (want !== value.toLowerCase()) report(cssPath, lineOf(css, match.index), "token-drift", `--color-${tokenName} là ${value}, tokens.json ghi ${want}`);
  }
  for (const tokenName of expected.keys()) {
    if (!found.has(tokenName)) report(cssPath, 1, "token-drift", `thiếu --color-${tokenName} có trong design/tokens.json`);
  }
}

function checkRequiredConfig() {
  if (!production) return;
  const configPath = join(root, "src/lib/site.config.ts");
  if (!existsSync(configPath)) return report(configPath, 1, "required-null", "thiếu src/lib/site.config.ts");
  const text = readFileSync(configPath, "utf8");
  for (const field of REQUIRED_IN_PRODUCTION) {
    const match = text.match(new RegExp(`\\b${field}\\s*:\\s*null\\b`));
    if (match) report(configPath, lineOf(text, match.index), "required-null", `${field} còn null; bắt buộc khi production`);
  }
}

if (problems.length) {
  for (const p of problems) console.log(`${p.file}:${p.line} [${p.rule}] ${p.message}`);
  console.log(`\ncheck-slop: ${problems.length} lỗi${production ? " (--production)" : ""}`);
  process.exit(1);
}
console.log(`check-slop: sạch, ${files.length} file${production ? " (--production)" : ""}`);

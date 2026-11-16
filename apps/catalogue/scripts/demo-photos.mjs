// Vẽ ảnh demo cho catalogue khi chưa có ảnh thật (M7). Mỗi ảnh ghi rõ "Ảnh demo", mã và tên hàng,
// kèm hình vẽ nét đơn giản theo nhóm hàng. Chạy bằng Chromium của Playwright, xuất webp qua canvas.
//
//   node scripts/demo-photos.mjs            vẽ lại toàn bộ ảnh demo vào public/products và public/workshop
//
// Khi có ảnh thật: xoá src/data/DEMO.md và thay ảnh; check:data --production chặn build khi DEMO.md còn.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const products = JSON.parse(readFileSync(join(root, "src/data/products.json"), "utf8"));
const categories = JSON.parse(readFileSync(join(root, "src/data/categories.json"), "utf8"));
const parentOf = new Map(categories.map((c) => [c.slug, c.parentSlug]));
const topOf = (slug) => (parentOf.get(slug) ? topOf(parentOf.get(slug)) : slug);
const font = (file) => readFileSync(join(root, "src/fonts", file)).toString("base64");

const jobs = [];
for (const product of products) {
  product.images.forEach((image, index) => {
    jobs.push({
      out: join(root, "public", image.src),
      width: 1600,
      height: 1600,
      shape: topOf(product.categorySlug),
      angle: index,
      code: product.sku,
      title: product.name,
      note: product.mainSpec,
    });
  });
}
jobs.push(
  { out: join(root, "public/workshop/kho-hang.webp"), width: 1600, height: 2000, shape: "kho", code: "Kho hàng", title: "Ảnh xưởng thật thay vào đây", note: "Tỉ lệ 4:5" },
  { out: join(root, "public/workshop/may-dap.webp"), width: 2400, height: 1600, shape: "may", code: "Máy dập", title: "Ảnh xưởng thật thay vào đây", note: "Tỉ lệ 3:2" },
  { out: join(root, "public/workshop/mat-tien.webp"), width: 2400, height: 1600, shape: "mat-tien", code: "Mặt tiền", title: "Ảnh xưởng thật thay vào đây", note: "Tỉ lệ 3:2" },
);

// Chạy trong trang: vẽ một ảnh lên canvas, trả về data URL webp
function draw(job) {
  const { width: w, height: h } = job;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d");
  const ink = "#181715";
  const muted = "#5c5b55";
  const line = "#a9a9a2";
  g.fillStyle = "#dcdcd6";
  g.fillRect(0, 0, w, h);
  g.strokeStyle = line;
  g.lineWidth = 4;
  g.lineJoin = "round";

  // Hình vẽ nét ở nửa trên, căn giữa
  const cx = w / 2;
  const cy = h * 0.42;
  const s = Math.min(w, h) * 0.3;
  g.save();
  g.translate(cx, cy);
  if (job.angle) g.rotate(-0.12);
  g.strokeStyle = ink;
  g.lineWidth = 6;
  if (job.shape === "pano") {
    g.strokeRect(-s * 0.7, -s, s * 1.4, s * 2);
    g.lineWidth = 3;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) g.strokeRect(-s * 0.6 + c * s * 0.42, -s * 0.9 + r * s * 0.46, s * 0.34, s * 0.38);
  } else if (job.shape === "ban-le") {
    g.strokeRect(-s * 0.18, -s, s * 0.36, s * 2);
    g.lineWidth = 3;
    for (let i = 1; i < 4; i++) {
      g.beginPath();
      g.moveTo(-s * 0.18, -s + (i * s * 2) / 4);
      g.lineTo(s * 0.18, -s + (i * s * 2) / 4);
      g.stroke();
    }
    g.strokeRect(s * 0.18, -s * 0.85, s * 0.7, s * 0.5);
    g.strokeRect(-s * 0.88, s * 0.35, s * 0.7, s * 0.5);
  } else if (job.shape === "ton") {
    for (let row = 0; row < 3; row++) {
      g.beginPath();
      for (let x = -s; x <= s; x += 4) g.lineTo(x, -s * 0.6 + row * s * 0.6 + Math.sin((x / s) * Math.PI * 4) * s * 0.12);
      g.stroke();
    }
  } else if (job.shape === "mam-cau-thang") {
    g.beginPath();
    g.arc(0, 0, s, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.arc(0, 0, s * 0.18, 0, Math.PI * 2);
    g.stroke();
    g.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      g.beginPath();
      g.moveTo(Math.cos(a) * s * 0.18, Math.sin(a) * s * 0.18);
      g.lineTo(Math.cos(a) * s, Math.sin(a) * s);
      g.stroke();
    }
  } else if (job.shape === "kho") {
    for (let i = 0; i < 6; i++) g.strokeRect(-s, s * 0.8 - i * s * 0.3, s * 2, s * 0.24);
  } else if (job.shape === "may") {
    g.strokeRect(-s * 0.9, -s * 0.8, s * 1.8, s * 0.4);
    g.strokeRect(-s * 0.15, -s * 0.4, s * 0.3, s * 0.7);
    g.strokeRect(-s * 1.1, s * 0.3, s * 2.2, s * 0.25);
    g.strokeRect(-s * 0.9, s * 0.55, s * 0.25, s * 0.45);
    g.strokeRect(s * 0.65, s * 0.55, s * 0.25, s * 0.45);
  } else {
    g.strokeRect(-s * 1.2, -s * 0.6, s * 2.4, s * 1.6);
    g.beginPath();
    g.moveTo(-s * 1.3, -s * 0.6);
    g.lineTo(0, -s * 1.1);
    g.lineTo(s * 1.3, -s * 0.6);
    g.stroke();
    g.strokeRect(-s * 0.4, s * 0.1, s * 0.8, s * 0.9);
  }
  g.restore();

  // Chữ ở phần dưới, căn trái theo lề 6%
  const left = w * 0.06;
  const unit = Math.min(w, h) / 1600;
  g.textBaseline = "alphabetic";
  g.fillStyle = muted;
  g.font = `500 ${40 * unit}px Mono`;
  g.fillText("Ảnh demo", left, h * 0.08);
  g.fillStyle = ink;
  g.font = `500 ${72 * unit}px Mono`;
  g.fillText(job.code, left, h - 200 * unit);
  g.font = `400 ${56 * unit}px Sans`;
  g.fillText(job.title, left, h - 120 * unit);
  g.fillStyle = muted;
  g.font = `400 ${44 * unit}px Sans`;
  g.fillText(job.note, left, h - 56 * unit);
  return canvas.toDataURL("image/webp", 0.82);
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<style>
@font-face{font-family:Sans;src:url(data:font/woff2;base64,${font("be-vietnam-pro-latin-400-normal.woff2")});font-weight:400}
@font-face{font-family:Sans;src:url(data:font/woff2;base64,${font("be-vietnam-pro-vietnamese-400-normal.woff2")});font-weight:400;unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB}
@font-face{font-family:Mono;src:url(data:font/woff2;base64,${font("ibm-plex-mono-latin-500-normal.woff2")});font-weight:500}
@font-face{font-family:Mono;src:url(data:font/woff2;base64,${font("ibm-plex-mono-vietnamese-500-normal.woff2")});font-weight:500;unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB}
</style><p style="font-family:Sans">ẢẢ</p><p style="font-family:Mono;font-weight:500">ẢẢ</p>`);
await page.evaluate(async () => {
  await Promise.all([document.fonts.load("400 20px Sans", "Ảnh"), document.fonts.load("500 20px Mono", "Ảnh")]);
});
for (const job of jobs) {
  const dataUrl = await page.evaluate(draw, job);
  mkdirSync(dirname(job.out), { recursive: true });
  writeFileSync(job.out, Buffer.from(dataUrl.split(",")[1], "base64"));
}
await browser.close();
console.log(`demo-photos: ${jobs.length} ảnh`);

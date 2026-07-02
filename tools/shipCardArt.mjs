/**
 * Ship card-art ingestion tool. Crops the ship illustration out of the user's
 * card designs (fraction-space rects), normalises each to a 400x250 cover crop,
 * and emits WebP data-URIs into src/game/render/chassisRaster.ts so the art
 * bundles for offline builds.
 *
 * Usage: node tools/shipCardArt.mjs   (run from the repo root)
 * Add new ships to CARDS as more designs arrive.
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";

const UP = "/root/.claude/uploads/6fe53591-d27f-58c8-a1aa-d825a9c564ae";

/** chassis id → [file, x0, y0, x1, y1] crop as fractions of the card image. */
const CARDS = {
  skiff: [`${UP}/7fcb4e40-Untitled_design.jpeg`, 0.14, 0.06, 0.86, 0.5],
  corsair: [`${UP}/9da5b43a-Untitled_design.jpeg`, 0.1, 0.11, 0.9, 0.44],
  scout: [`${UP}/6fd3ba6c-Untitled_design.jpeg`, 0.12, 0.145, 0.89, 0.445],
  warpstrike: [`${UP}/4128e6ba-Untitled_design.jpeg`, 0.1, 0.12, 0.9, 0.5],
  dreadnought: [`${UP}/96477dc5-Untitled_design.jpeg`, 0.1, 0.14, 0.9, 0.48],
  carrier: [`${UP}/0c5f464f-Untitled_design.jpeg`, 0.13, 0.12, 0.88, 0.46],
  bulwark: [`${UP}/a335bcd7-Untitled_design.jpeg`, 0.1, 0.12, 0.9, 0.55],
  monolith: [`${UP}/4cd4e434-Untitled_design.jpeg`, 0.115, 0.14, 0.885, 0.56],
  gunship: [`${UP}/a5a60ebf-Untitled_design.jpeg`, 0.115, 0.2, 0.885, 0.55], // "FIGHTER" card → Infiltrator
};

const W = 400;
const H = 250;

const b = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const p = await b.newPage();
const srcs = {};
for (const id in CARDS) {
  srcs[id] = "data:image/jpeg;base64," + readFileSync(CARDS[id][0]).toString("base64");
}
const out = await p.evaluate(
  async ({ srcs, CARDS, W, H }) => {
    const results = {};
    for (const id in CARDS) {
      const [, fx0, fy0, fx1, fy1] = CARDS[id];
      const im = new Image();
      await new Promise((res, rej) => {
        im.onload = res;
        im.onerror = rej;
        im.src = srcs[id];
      });
      const sx = im.width * fx0;
      const sy = im.height * fy0;
      const sw = im.width * (fx1 - fx0);
      const sh = im.height * (fy1 - fy0);
      // Cover-crop the region to the W:H aspect, centred.
      const want = W / H;
      let cw = sw;
      let ch = sh;
      if (sw / sh > want) cw = sh * want;
      else ch = sw / want;
      const cx = sx + (sw - cw) / 2;
      const cy = sy + (sh - ch) / 2;
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(im, cx, cy, cw, ch, 0, 0, W, H);
      results[id] = c.toDataURL("image/webp", 0.85);
    }
    return results;
  },
  { srcs, CARDS, W, H },
);
let ts = `/**
 * Painted ship card illustrations (user-supplied card designs, cropped in-repo
 * by tools/shipCardArt.mjs). WebP data-URIs so they bundle for offline builds.
 * Ships without an entry fall back to the parametric SVG art.
 */
export const CHASSIS_RASTER: Record<string, string> = {\n`;
let total = 0;
for (const id in out) {
  ts += `  ${id}:\n    "${out[id]}",\n`;
  total += out[id].length;
}
ts += `};\n`;
writeFileSync("src/game/render/chassisRaster.ts", ts);
console.log("written", Object.keys(out).length, "ships,", Math.round(total / 1024) + "KB");
await b.close();

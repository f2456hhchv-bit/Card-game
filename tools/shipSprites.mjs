/**
 * In-game ship sprite extraction. Cuts each painted ship out of its card design
 * with a TRANSPARENT background (the sprite rotates over the battlefield):
 *
 *  1. Tight crop around the ship (fraction-space rect per card).
 *  2. Flood-fill from the crop borders across dark "space" pixels — enclosed
 *     dark areas inside the ship survive because bright linework seals them.
 *  3. Connected-component cleanup drops isolated leftovers (stars, nebula).
 *  4. Rotate nose-up (per-ship angle), trim, centre on a 256px square.
 *
 * Emits WebP data-URIs into src/game/render/chassisSprites.ts.
 * Usage: node tools/shipSprites.mjs   (from the repo root)
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";

const UP = "/root/.claude/uploads/6fe53591-d27f-58c8-a1aa-d825a9c564ae";

/** id → [file, x0, y0, x1, y1, rotateDeg (clockwise → nose up), lumThreshold] */
const SHIPS = {
  skiff: [`${UP}/7fcb4e40-Untitled_design.jpeg`, 0.28, 0.1, 0.75, 0.44, 0, 70],
  corsair: [`${UP}/9da5b43a-Untitled_design.jpeg`, 0.13, 0.12, 0.87, 0.42, -45, 60],
  scout: [`${UP}/6fd3ba6c-Untitled_design.jpeg`, 0.3, 0.16, 0.79, 0.43, -38, 70],
  warpstrike: [`${UP}/4128e6ba-Untitled_design.jpeg`, 0.12, 0.13, 0.88, 0.5, 100, 70],
  dreadnought: [`${UP}/96477dc5-Untitled_design.jpeg`, 0.12, 0.16, 0.9, 0.47, 128, 70],
  carrier: [`${UP}/0c5f464f-Untitled_design.jpeg`, 0.15, 0.13, 0.87, 0.45, 105, 70],
  bulwark: [`${UP}/a335bcd7-Untitled_design.jpeg`, 0.17, 0.13, 0.83, 0.55, 0, 70],
  monolith: [`${UP}/4cd4e434-Untitled_design.jpeg`, 0.25, 0.15, 0.75, 0.53, 0, 45],
  gunship: [`${UP}/a5a60ebf-Untitled_design.jpeg`, 0.25, 0.21, 0.76, 0.52, 0, 60],
};

const b = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const p = await b.newPage();
const srcs = {};
for (const id in SHIPS) {
  srcs[id] = "data:image/jpeg;base64," + readFileSync(SHIPS[id][0]).toString("base64");
}
const out = await p.evaluate(
  async ({ srcs, SHIPS }) => {
    const results = {};
    for (const id in SHIPS) {
      const [, fx0, fy0, fx1, fy1, rot, lumT] = SHIPS[id];
      const im = new Image();
      await new Promise((res, rej) => {
        im.onload = res;
        im.onerror = rej;
        im.src = srcs[id];
      });
      const sx = Math.round(im.width * fx0);
      const sy = Math.round(im.height * fy0);
      const sw = Math.round(im.width * (fx1 - fx0));
      const sh = Math.round(im.height * (fy1 - fy0));
      const c = document.createElement("canvas");
      c.width = sw;
      c.height = sh;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(im, sx, sy, sw, sh, 0, 0, sw, sh);
      const d = ctx.getImageData(0, 0, sw, sh);
      const px = d.data;
      const n = sw * sh;
      const lum = (i) => 0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2];

      // 2) Flood-fill background from the borders across dark pixels.
      const bg = new Uint8Array(n); // 1 = background
      const stack = [];
      const pushIf = (x, y) => {
        if (x < 0 || y < 0 || x >= sw || y >= sh) return;
        const i = y * sw + x;
        if (!bg[i] && lum(i) < lumT) {
          bg[i] = 1;
          stack.push(i);
        }
      };
      for (let x = 0; x < sw; x++) {
        pushIf(x, 0);
        pushIf(x, sh - 1);
      }
      for (let y = 0; y < sh; y++) {
        pushIf(0, y);
        pushIf(sw - 1, y);
      }
      while (stack.length) {
        const i = stack.pop();
        const x = i % sw;
        const y = (i / sw) | 0;
        pushIf(x + 1, y);
        pushIf(x - 1, y);
        pushIf(x, y + 1);
        pushIf(x, y - 1);
      }

      // 3) Connected components over non-background; keep big ones only
      //    (stars/nebula specks the flood skirted around get dropped).
      const label = new Int32Array(n).fill(-1);
      const areas = [];
      for (let i = 0; i < n; i++) {
        if (bg[i] || label[i] !== -1) continue;
        const L = areas.length;
        let area = 0;
        const q = [i];
        label[i] = L;
        while (q.length) {
          const j = q.pop();
          area++;
          const x = j % sw;
          const y = (j / sw) | 0;
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= sw || ny >= sh) continue;
            const k = ny * sw + nx;
            if (!bg[k] && label[k] === -1) {
              label[k] = L;
              q.push(k);
            }
          }
        }
        areas.push(area);
      }
      // Track each component's lowest pixel so floaters can be culled by
      // position too (nebula wisps hug the crop's top band; every ship part
      // either reaches lower or belongs to the main body component).
      const compMaxY = new Int32Array(areas.length);
      for (let i = 0; i < n; i++) {
        if (bg[i] || label[i] === -1) continue;
        const y = (i / sw) | 0;
        if (y > compMaxY[label[i]]) compMaxY[label[i]] = y;
      }
      const maxArea = Math.max(...areas, 1);
      let mainComp = 0;
      for (let a = 0; a < areas.length; a++) if (areas[a] === maxArea) mainComp = a;
      for (let i = 0; i < n; i++) {
        if (bg[i]) { px[i * 4 + 3] = 0; continue; }
        const L = label[i];
        const tooSmall = areas[L] < maxArea * 0.05;
        const topFloater = L !== mainComp && compMaxY[L] < sh * 0.24;
        if (tooSmall || topFloater) px[i * 4 + 3] = 0;
      }
      ctx.putImageData(d, 0, 0);

      // Trim to content.
      let minX = sw, minY = sh, maxX = 0, maxY = 0;
      for (let y = 0; y < sh; y++)
        for (let x = 0; x < sw; x++)
          if (px[(y * sw + x) * 4 + 3] > 16) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
      const bw = maxX - minX + 1;
      const bh = maxY - minY + 1;

      // 4) Rotate nose-up on a square stage, then trim + fit to 256.
      const diag = Math.ceil(Math.hypot(bw, bh)) + 4;
      const rc = document.createElement("canvas");
      rc.width = diag;
      rc.height = diag;
      const rctx = rc.getContext("2d", { willReadFrequently: true });
      rctx.translate(diag / 2, diag / 2);
      rctx.rotate((rot * Math.PI) / 180);
      rctx.drawImage(c, minX, minY, bw, bh, -bw / 2, -bh / 2, bw, bh);
      // Trim the rotated stage.
      const rd = rctx.getImageData(0, 0, diag, diag).data;
      let rminX = diag, rminY = diag, rmaxX = 0, rmaxY = 0;
      for (let y = 0; y < diag; y++)
        for (let x = 0; x < diag; x++)
          if (rd[(y * diag + x) * 4 + 3] > 16) {
            if (x < rminX) rminX = x;
            if (x > rmaxX) rmaxX = x;
            if (y < rminY) rminY = y;
            if (y > rmaxY) rmaxY = y;
          }
      const rbw = rmaxX - rminX + 1;
      const rbh = rmaxY - rminY + 1;
      const S = 256;
      const fill = S * 0.84;
      const k = fill / Math.max(rbw, rbh);
      const oc = document.createElement("canvas");
      oc.width = S;
      oc.height = S;
      const octx = oc.getContext("2d");
      octx.imageSmoothingQuality = "high";
      octx.drawImage(rc, rminX, rminY, rbw, rbh, (S - rbw * k) / 2, (S - rbh * k) / 2, rbw * k, rbh * k);
      // Design radius from the drawn content's geometric mean: square-ish hulls
      // land ~105 (classic size) while long thin hulls get a smaller radius and
      // therefore render larger, keeping every ship readable in-game.
      const gm = Math.sqrt(rbw * k * (rbh * k));
      const radius = Math.round(Math.max(72, Math.min(115, gm * 0.49)));
      results[id] = { uri: oc.toDataURL("image/webp", 0.86), radius };
    }
    return results;
  },
  { srcs, SHIPS },
);
let ts = `/**
 * In-game ship sprites (user card art, background removed, nose-up).
 * Generated by tools/shipSprites.mjs — WebP data-URIs, bundled for offline.
 */
export const CHASSIS_SPRITES: Record<string, string> = {\n`;
let total = 0;
for (const id in out) {
  ts += `  ${id}:\n    "${out[id].uri}",\n`;
  total += out[id].uri.length;
}
ts += `};\n\n/** Per-ship design radius (see tool docs — long hulls draw larger). */\nexport const CHASSIS_SPRITE_RADII: Record<string, number> = {\n`;
for (const id in out) ts += `  ${id}: ${out[id].radius},\n`;
ts += `};\n`;
writeFileSync("src/game/render/chassisSprites.ts", ts);
console.log("written", Object.keys(out).length, "sprites,", Math.round(total / 1024) + "KB");

// Review montage.
const montage = await p.evaluate(async ({ out }) => {
  const keys = Object.keys(out);
  const S = 170;
  const c = document.createElement("canvas");
  c.width = S * 5;
  c.height = S * 2;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#101226";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.font = "13px sans-serif";
  ctx.textAlign = "center";
  for (let i = 0; i < keys.length; i++) {
    const im = new Image();
    await new Promise((r) => {
      im.onload = r;
      im.src = out[keys[i]].uri;
    });
    const x = (i % 5) * S;
    const y = Math.floor(i / 5) * S;
    ctx.drawImage(im, x + 10, y + 6, S - 20, S - 20);
    ctx.fillStyle = "#cdd3ee";
    ctx.fillText(keys[i], x + S / 2, y + S - 4);
  }
  return c.toDataURL("image/png");
}, { out });
writeFileSync(
  "/tmp/claude-0/-home-user-Card-game/6fe53591-d27f-58c8-a1aa-d825a9c564ae/scratchpad/sprites-montage.png",
  Buffer.from(montage.split(",")[1], "base64"),
);
await b.close();

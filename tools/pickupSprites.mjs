/**
 * Pickup sprite extraction from the user's crystal/pickup sheet. Chroma-flood
 * keys the near-black backdrop from the borders (like enemySprites.mjs), then
 * drops small disconnected sparkle specks so each pickup reads clean at tiny
 * on-field sizes. 96px output + per-sprite body radii.
 *
 * Emits src/game/render/pickupRaster.ts. Usage: node tools/pickupSprites.mjs
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";

const SHEET =
  "/root/.claude/uploads/6fe53591-d27f-58c8-a1aa-d825a9c564ae/c204a9c4-a_stunningrystal.png";

/** key → [col, row] in the 3×3 sheet. */
const CELLS = {
  xp: [0, 0], // cyan light shard
  xpBig: [1, 0], // purple crystal (elite / boss shards)
  magnet: [0, 1], // blue magnet
  bomb: [1, 2], // orange starburst
  heal: [2, 2], // green heart flask
  mote: [2, 0], // gold octagon medal (Light Mote currency)
  alloy: [2, 1], // gold diamond (Alloy currency)
};

const b = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const p = await b.newPage();
const src = "data:image/png;base64," + readFileSync(SHEET).toString("base64");
const out = await p.evaluate(
  async ({ src, CELLS }) => {
    const im = new Image();
    await new Promise((res, rej) => {
      im.onload = res;
      im.onerror = rej;
      im.src = src;
    });
    const results = {};
    for (const key in CELLS) {
      const [c0, r0] = CELLS[key];
      const inset = 0.012;
      const sx = Math.round(im.width * (c0 / 3 + inset));
      const sy = Math.round(im.height * (r0 / 3 + inset));
      const sw = Math.round(im.width * (1 / 3 - 2 * inset));
      const sh = Math.round(im.height * (1 / 3 - 2 * inset));
      const c = document.createElement("canvas");
      c.width = sw;
      c.height = sh;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(im, sx, sy, sw, sh, 0, 0, sw, sh);
      const d = ctx.getImageData(0, 0, sw, sh);
      const px = d.data;
      const n = sw * sh;

      // Backdrop = border median; flood it in from the edges by chroma.
      const samples = [];
      const push = (x, y) => {
        const i = (y * sw + x) * 4;
        samples.push([px[i], px[i + 1], px[i + 2]]);
      };
      for (let t = 0; t < 40; t++) {
        const x = 2 + Math.floor((sw - 4) * (t / 39));
        const y = 2 + Math.floor((sh - 4) * (t / 39));
        push(x, 2);
        push(x, sh - 3);
        push(2, y);
        push(sw - 3, y);
      }
      const med = (arr) => arr.slice().sort((q, w) => q - w)[Math.floor(arr.length / 2)];
      const bgc = [0, 1, 2].map((ch) => med(samples.map((s2) => s2[ch])));
      const chroma = (i) => {
        const dr = px[i * 4] - bgc[0];
        const dg = px[i * 4 + 1] - bgc[1];
        const db = px[i * 4 + 2] - bgc[2];
        return Math.sqrt(dr * dr + dg * dg + db * db);
      };
      const bg = new Uint8Array(n);
      const stack = [];
      const pushIf = (x, y) => {
        if (x < 0 || y < 0 || x >= sw || y >= sh) return;
        const i = y * sw + x;
        if (!bg[i] && chroma(i) < 34) {
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

      // Components: keep only chunks ≥8% of the biggest (drops sparkle specks).
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
      const maxArea = Math.max(...areas, 1);
      for (let i = 0; i < n; i++) {
        if (bg[i] || areas[label[i]] < maxArea * 0.08) px[i * 4 + 3] = 0;
      }
      ctx.putImageData(d, 0, 0);

      // Trim + centre on 96px, body filling ~86%.
      let minX = sw,
        minY = sh,
        maxX = 0,
        maxY = 0;
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
      const S = 96;
      const fill = S * 0.86;
      const k = fill / Math.max(bw, bh);
      const oc = document.createElement("canvas");
      oc.width = S;
      oc.height = S;
      const octx = oc.getContext("2d");
      octx.imageSmoothingQuality = "high";
      octx.drawImage(c, minX, minY, bw, bh, (S - bw * k) / 2, (S - bh * k) / 2, bw * k, bh * k);
      const radius = Math.round(Math.sqrt(bw * k * (bh * k)) / 2);
      results[key] = { uri: oc.toDataURL("image/webp", 0.9), radius };
    }
    return results;
  },
  { src, CELLS },
);
let ts = `/**
 * Painted pickup sprites (user crystal sheet, keyed in-repo).
 * Generated by tools/pickupSprites.mjs — WebP data-URIs, bundled for offline.
 */
export const PICKUP_RASTER: Record<string, string> = {\n`;
let total = 0;
for (const id in out) {
  ts += `  ${id}:\n    "${out[id].uri}",\n`;
  total += out[id].uri.length;
}
ts += `};\n\n/** Per-sprite body radius in image px. */\nexport const PICKUP_RASTER_RADII: Record<string, number> = {\n`;
for (const id in out) ts += `  ${id}: ${out[id].radius},\n`;
ts += `};\n`;
writeFileSync("src/game/render/pickupRaster.ts", ts);
console.log("written", Object.keys(out).length, "pickups,", Math.round(total / 1024) + "KB");

const montage = await p.evaluate(async ({ out }) => {
  const keys = Object.keys(out);
  const S = 120;
  const c = document.createElement("canvas");
  c.width = S * keys.length;
  c.height = S;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#101226";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  for (let i = 0; i < keys.length; i++) {
    const im = new Image();
    await new Promise((r) => {
      im.onload = r;
      im.src = out[keys[i]].uri;
    });
    ctx.drawImage(im, i * S + 15, 4, S - 30, S - 30);
    ctx.fillStyle = "#cdd3ee";
    ctx.fillText(keys[i], i * S + S / 2, S - 6);
  }
  return c.toDataURL("image/png");
}, { out });
writeFileSync(
  "/tmp/claude-0/-home-user-Card-game/6fe53591-d27f-58c8-a1aa-d825a9c564ae/scratchpad/pickups-montage.png",
  Buffer.from(montage.split(",")[1], "base64"),
);
await b.close();

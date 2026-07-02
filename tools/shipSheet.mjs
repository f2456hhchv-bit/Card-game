/**
 * Flyable ship sprites from the user's top-down hull sheet (5×3 grid, flat
 * near-black backdrop, ships already nose-up — no rotation needed). Keyed by
 * border-median chroma flood (like enemySprites.mjs) so dark panel lines
 * inside a hull survive. 192px output + per-ship body radii.
 *
 * Emits src/game/render/chassisSprites.ts. Usage: node tools/shipSheet.mjs
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";

const SHEET =
  "/root/.claude/uploads/6fe53591-d27f-58c8-a1aa-d825a9c564ae/f1ad0485-a_stunninghull_s.png";

/** chassis id → [col, row] in the 5×3 sheet (cell 0,0 is a stray gem — unused). */
const SHIPS = {
  skiff: [1, 0], // slim green arrowhead — the nimble starter
  corsair: [2, 0], // crimson twin-cannon raider
  monolith: [3, 0], // tall crimson slab
  bulwark: [0, 1], // orange plated heavy
  warpstrike: [4, 1], // white swept blade
  carrier: [3, 1], // long grey-violet cruiser
  scout: [1, 2], // light yellow twin-pod fighter
  gunship: [2, 2], // grey triple-barrel gun platform
  dreadnought: [4, 2], // green armoured twin-hull juggernaut
};

const b = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const p = await b.newPage();
const src = "data:image/png;base64," + readFileSync(SHEET).toString("base64");
const out = await p.evaluate(
  async ({ src, SHIPS }) => {
    const im = new Image();
    await new Promise((res, rej) => {
      im.onload = res;
      im.onerror = rej;
      im.src = src;
    });
    const results = {};
    for (const id in SHIPS) {
      const [c0, r0] = SHIPS[id];
      const inset = 0.006;
      const sx = Math.round(im.width * (c0 / 5 + inset));
      const sy = Math.round(im.height * (r0 / 3 + inset));
      const sw = Math.round(im.width * (1 / 5 - 2 * inset));
      const sh = Math.round(im.height * (1 / 3 - 2 * inset));
      const c = document.createElement("canvas");
      c.width = sw;
      c.height = sh;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(im, sx, sy, sw, sh, 0, 0, sw, sh);
      const d = ctx.getImageData(0, 0, sw, sh);
      const px = d.data;
      const n = sw * sh;

      // Backdrop = border median; flood it in from the edges by chroma so the
      // ships' own dark panel lines are never eaten from inside.
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
        if (!bg[i] && chroma(i) < 30) {
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
      for (let i = 0; i < n; i++) if (bg[i]) px[i * 4 + 3] = 0;
      ctx.putImageData(d, 0, 0);

      // Trim, centre on 192px with the hull filling ~90%.
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
      const S = 192;
      const fill = S * 0.9;
      const k = fill / Math.max(bw, bh);
      const oc = document.createElement("canvas");
      oc.width = S;
      oc.height = S;
      const octx = oc.getContext("2d");
      octx.imageSmoothingQuality = "high";
      octx.drawImage(c, minX, minY, bw, bh, (S - bw * k) / 2, (S - bh * k) / 2, bw * k, bh * k);
      // Body radius = half the geometric mean of the drawn extents so long
      // hulls aren't shrunk by a square fit (the Monolith lesson).
      const radius = Math.round(Math.sqrt(bw * k * (bh * k)) / 2);
      results[id] = { uri: oc.toDataURL("image/webp", 0.9), radius };
    }
    return results;
  },
  { src, SHIPS },
);
let ts = `/**
 * Flyable per-chassis ship sprites (user hull sheet, keyed in-repo, nose-up).
 * Generated by tools/shipSheet.mjs — WebP data-URIs, bundled for offline.
 */
export const CHASSIS_SPRITES: Record<string, string> = {\n`;
let total = 0;
for (const id in out) {
  ts += `  ${id}:\n    "${out[id].uri}",\n`;
  total += out[id].uri.length;
}
ts += `};\n\n/** Per-ship body radius in image px (geometric-mean half-extent). */\nexport const CHASSIS_SPRITE_RADII: Record<string, number> = {\n`;
for (const id in out) ts += `  ${id}: ${out[id].radius},\n`;
ts += `};\n`;
writeFileSync("src/game/render/chassisSprites.ts", ts);
console.log("written", Object.keys(out).length, "ships,", Math.round(total / 1024) + "KB");

// Review montage.
const montage = await p.evaluate(async ({ out }) => {
  const keys = Object.keys(out);
  const S = 150;
  const c = document.createElement("canvas");
  c.width = S * 5;
  c.height = S * 2;
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
    const x = (i % 5) * S;
    const y = Math.floor(i / 5) * S;
    ctx.drawImage(im, x + 15, y + 6, S - 30, S - 30);
    ctx.fillStyle = "#cdd3ee";
    ctx.fillText(keys[i], x + S / 2, y + S - 6);
  }
  return c.toDataURL("image/png");
}, { out });
writeFileSync(
  "/tmp/claude-0/-home-user-Card-game/6fe53591-d27f-58c8-a1aa-d825a9c564ae/scratchpad/ships-montage.png",
  Buffer.from(montage.split(",")[1], "base64"),
);
await b.close();

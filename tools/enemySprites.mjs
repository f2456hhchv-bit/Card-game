/**
 * Small-enemy sprite extraction from the user's creature sheets. Like
 * tools/shipSprites.mjs but keyed by CHROMA distance to the sheet's flat navy
 * backdrop (flood-filled from the borders, so dark linework inside a creature
 * survives), no rotation (enemies bob/spin in-engine), 128px output.
 *
 * Emits WebP data-URIs + per-sprite body radii into
 * src/game/render/enemyRaster.ts. Usage: node tools/enemySprites.mjs
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";

const UP = "/root/.claude/uploads/6fe53591-d27f-58c8-a1aa-d825a9c564ae";
const A = `${UP}/aa53c3f5-a_stunninghape_u.png`; // 3x3 inked creatures
const B = `${UP}/21366b0e-a_stunning_jagge.png`; // 4x4 pixel creatures

/** Grid-cell helper → [file, x0, y0, x1, y1] with a small inset. */
const cell = (file, cols, rows, c, r, inset = 0.015) => [
  file,
  c / cols + inset,
  r / rows + inset,
  (c + 1) / cols - inset,
  (r + 1) / rows - inset,
];

/** enemy id → crop (mapped to each creature's identity). */
const ENEMIES = {
  drifter: cell(A, 3, 3, 0, 0), // placid teal floater with eyes
  mote: cell(A, 3, 3, 1, 0), // tiny eyed droplet
  lunger: cell(A, 3, 3, 2, 0), // crescent blade (charger)
  wisp: cell(A, 3, 3, 0, 1), // hooked crescent (orbiter)
  spore: cell(A, 3, 3, 1, 1), // pink egg (splitter)
  shard: cell(A, 3, 3, 2, 1), // teal crystal star (ice)
  husk: cell(A, 3, 3, 0, 2), // hollow-faced bug
  caster: cell(A, 3, 3, 1, 2), // eye sigil (ranged)
  seer: cell(B, 4, 4, 1, 0), // one-eyed legged watcher
  cinder: cell(B, 4, 4, 1, 2), // pink spiky virus (fast)
  revenant: cell(B, 4, 4, 2, 2), // armoured gear-ring ball (tanky ranged)
  colossus: cell(B, 4, 4, 0, 3), // heavy grey gear orb
  lancer: cell(B, 4, 4, 3, 3), // winged dart insect
};

const b = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const p = await b.newPage();
const srcs = {
  [A]: "data:image/png;base64," + readFileSync(A).toString("base64"),
  [B]: "data:image/png;base64," + readFileSync(B).toString("base64"),
};
const out = await p.evaluate(
  async ({ srcs, ENEMIES }) => {
    const imgs = {};
    for (const f in srcs) {
      const im = new Image();
      await new Promise((res, rej) => {
        im.onload = res;
        im.onerror = rej;
        im.src = srcs[f];
      });
      imgs[f] = im;
    }
    const results = {};
    for (const id in ENEMIES) {
      const [file, fx0, fy0, fx1, fy1] = ENEMIES[id];
      const im = imgs[file];
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

      // Backdrop colour = median of border samples (flat navy fill).
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

      // Flood the backdrop in from the borders (chroma-near-bg only), so the
      // creature's dark outline never gets eaten from inside.
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

      // Trim, then centre on a 128px square with the body filling ~84%.
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
      const S = 128;
      const fill = S * 0.84;
      const k = fill / Math.max(bw, bh);
      const oc = document.createElement("canvas");
      oc.width = S;
      oc.height = S;
      const octx = oc.getContext("2d");
      octx.imageSmoothingQuality = "high";
      octx.drawImage(c, minX, minY, bw, bh, (S - bw * k) / 2, (S - bh * k) / 2, bw * k, bh * k);
      // Body radius = half the drawn geometric mean (matches SVG semantics:
      // design radius == body radius, glow/limbs may extend past it).
      const radius = Math.round(Math.sqrt(bw * k * (bh * k)) / 2);
      results[id] = { uri: oc.toDataURL("image/webp", 0.9), radius };
    }
    return results;
  },
  { srcs, ENEMIES },
);
let ts = `/**
 * Painted small-enemy sprites (user creature sheets, keyed in-repo).
 * Generated by tools/enemySprites.mjs — WebP data-URIs, bundled for offline.
 */
export const ENEMY_RASTER: Record<string, string> = {\n`;
let total = 0;
for (const id in out) {
  ts += `  ${id}:\n    "${out[id].uri}",\n`;
  total += out[id].uri.length;
}
ts += `};\n\n/** Per-sprite body radius in image px (see tool docs). */\nexport const ENEMY_RASTER_RADII: Record<string, number> = {\n`;
for (const id in out) ts += `  ${id}: ${out[id].radius},\n`;
ts += `};\n`;
writeFileSync("src/game/render/enemyRaster.ts", ts);
console.log("written", Object.keys(out).length, "enemies,", Math.round(total / 1024) + "KB");

// Review montage.
const montage = await p.evaluate(async ({ out }) => {
  const keys = Object.keys(out);
  const S = 130;
  const c = document.createElement("canvas");
  c.width = S * 7;
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
    const x = (i % 7) * S;
    const y = Math.floor(i / 7) * S;
    ctx.drawImage(im, x + 15, y + 6, S - 30, S - 30);
    ctx.fillStyle = "#cdd3ee";
    ctx.fillText(keys[i], x + S / 2, y + S - 6);
  }
  return c.toDataURL("image/png");
}, { out });
writeFileSync(
  "/tmp/claude-0/-home-user-Card-game/6fe53591-d27f-58c8-a1aa-d825a9c564ae/scratchpad/enemies-montage.png",
  Buffer.from(montage.split(",")[1], "base64"),
);
await b.close();

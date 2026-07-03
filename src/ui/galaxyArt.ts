/**
 * Procedural galaxy emblems — a unique, hand-inked celestial body for every one
 * of the 100 Galaxies. Deterministic per index and tinted by the Galaxy's
 * palette, so no two look alike and none is a flat perfect sphere: the
 * silhouettes are irregular lumps with a rough ink outline, and the surface is
 * cratered rock, banded gas, ringed worlds, lava, ice or swirling nebulae.
 *
 * Baked once to a transparent-PNG data-URI and memoised (offline, no assets).
 */
const TAU = Math.PI * 2;
const cache = new Map<string, string>();

/** A galaxy body icon (transparent PNG data-URI), memoised by index. */
export function galaxyArt(index: number, hues: number[], size = 132): string {
  const key = `${index}:${size}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  drawBody(ctx, index, hues, size);
  const uri = c.toDataURL("image/png");
  cache.set(key, uri);
  return uri;
}

/** Small deterministic PRNG so each Galaxy's body is stable across renders. */
function rng(seed: number): () => number {
  let s = (seed * 2654435761 + 0x9e3779b9) >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

const INK = "#0b0813";
const hsl = (h: number, s: number, l: number, a = 1): string =>
  `hsla(${((h % 360) + 360) % 360}, ${s}%, ${l}%, ${a})`;

type Kind = "nebula" | "cratered" | "gas" | "ringed" | "shattered";

/** Pick a body kind for a Galaxy — the first three match the designed mock. */
function bodyKind(index: number, r: () => number): { kind: Kind; variant: string } {
  if (index === 0) return { kind: "nebula", variant: "" };
  if (index === 1) return { kind: "cratered", variant: "rock" };
  if (index === 2) return { kind: "cratered", variant: "ice" };
  const roll = r();
  if (roll < 0.28) return { kind: "cratered", variant: r() < 0.5 ? "rock" : r() < 0.5 ? "ice" : "lava" };
  if (roll < 0.5) return { kind: "gas", variant: "" };
  if (roll < 0.68) return { kind: "ringed", variant: "" };
  if (roll < 0.82) return { kind: "shattered", variant: "" };
  return { kind: "nebula", variant: "" };
}

/**
 * An irregular closed silhouette: a circle whose radius wobbles with a couple of
 * harmonics plus jitter, smoothed through segment midpoints. `lump` controls how
 * far from a perfect sphere it drifts.
 */
function blobPoints(
  r: () => number,
  cx: number,
  cy: number,
  rad: number,
  lump: number,
): [number, number][] {
  const N = 46;
  const f1 = 2 + Math.floor(r() * 2);
  const f2 = 4 + Math.floor(r() * 3);
  const p1 = r() * TAU;
  const p2 = r() * TAU;
  const a1 = lump * (0.4 + r() * 0.5);
  const a2 = lump * (0.2 + r() * 0.35);
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * TAU;
    const wob = 1 + a1 * Math.sin(a * f1 + p1) + a2 * Math.sin(a * f2 + p2) + (r() - 0.5) * lump * 0.5;
    pts.push([cx + Math.cos(a) * rad * wob, cy + Math.sin(a) * rad * wob]);
  }
  return pts;
}

function tracePath(ctx: CanvasRenderingContext2D, pts: [number, number][]): void {
  const n = pts.length;
  const mid = (a: [number, number], b: [number, number]): [number, number] => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
  ];
  ctx.beginPath();
  const m0 = mid(pts[n - 1], pts[0]);
  ctx.moveTo(m0[0], m0[1]);
  for (let i = 0; i < n; i++) {
    const mp = mid(pts[i], pts[(i + 1) % n]);
    ctx.quadraticCurveTo(pts[i][0], pts[i][1], mp[0], mp[1]);
  }
  ctx.closePath();
}

/** Soft coloured halo behind gas/nebula bodies. */
function halo(ctx: CanvasRenderingContext2D, cx: number, cy: number, rad: number, hue: number): void {
  const g = ctx.createRadialGradient(cx, cy, rad * 0.7, cx, cy, rad * 1.35);
  g.addColorStop(0, hsl(hue, 80, 60, 0.35));
  g.addColorStop(1, hsl(hue, 80, 60, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, rad * 1.35, 0, TAU);
  ctx.fill();
}

/** Light from the upper-left: a rim crescent and a lower-right terminator. */
function shade(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
  cx: number,
  cy: number,
  rad: number,
): void {
  ctx.save();
  tracePath(ctx, pts);
  ctx.clip();
  // Terminator shadow, lower-right.
  const sg = ctx.createRadialGradient(
    cx - rad * 0.45,
    cy - rad * 0.45,
    rad * 0.2,
    cx + rad * 0.35,
    cy + rad * 0.4,
    rad * 1.5,
  );
  sg.addColorStop(0, "rgba(0,0,0,0)");
  sg.addColorStop(0.72, "rgba(0,0,0,0)");
  sg.addColorStop(1, "rgba(4,3,10,0.62)");
  ctx.fillStyle = sg;
  ctx.fillRect(cx - rad * 1.5, cy - rad * 1.5, rad * 3, rad * 3);
  // Rim light, upper-left.
  const rg = ctx.createRadialGradient(
    cx - rad * 0.5,
    cy - rad * 0.55,
    rad * 0.1,
    cx - rad * 0.5,
    cy - rad * 0.55,
    rad * 1.1,
  );
  rg.addColorStop(0, "rgba(255,255,255,0.22)");
  rg.addColorStop(0.5, "rgba(255,255,255,0.05)");
  rg.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = rg;
  ctx.fillRect(cx - rad * 1.5, cy - rad * 1.5, rad * 3, rad * 3);
  ctx.restore();
}

/** Rough dark ink outline around the silhouette. */
function outline(ctx: CanvasRenderingContext2D, pts: [number, number][], w: number): void {
  tracePath(ctx, pts);
  ctx.strokeStyle = INK;
  ctx.lineWidth = w;
  ctx.lineJoin = "round";
  ctx.stroke();
}

function drawBody(ctx: CanvasRenderingContext2D, index: number, hues: number[], size: number): void {
  const r = rng(index + 1);
  const cx = size / 2;
  const cy = size / 2;
  const rad = size * 0.36;
  const h0 = hues[0] ?? 240;
  const h1 = hues[1] ?? h0;
  const h2 = hues[2] ?? h0;
  const { kind, variant } = bodyKind(index, r);
  const ow = size * 0.028;

  if (kind === "nebula") {
    halo(ctx, cx, cy, rad, h0);
    const pts = blobPoints(r, cx, cy, rad, 0.08); // nearly round, faintly organic
    tracePath(ctx, pts);
    ctx.fillStyle = hsl(h0, 60, 7);
    ctx.fill();
    ctx.save();
    tracePath(ctx, pts);
    ctx.clip();
    // Nebula wisps.
    for (let i = 0; i < 7; i++) {
      const hx = [h0, h1, h2][i % 3];
      const bx = cx + (r() - 0.5) * rad * 1.4;
      const by = cy + (r() - 0.5) * rad * 1.4;
      const br = rad * (0.5 + r() * 0.7);
      const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      g.addColorStop(0, hsl(hx, 75, 60, 0.5));
      g.addColorStop(1, hsl(hx, 75, 55, 0));
      ctx.fillStyle = g;
      ctx.fillRect(cx - rad * 1.4, cy - rad * 1.4, rad * 2.8, rad * 2.8);
    }
    // Bright core.
    const core = ctx.createRadialGradient(cx - rad * 0.15, cy - rad * 0.1, 0, cx, cy, rad * 0.7);
    core.addColorStop(0, hsl(h1, 85, 82, 0.7));
    core.addColorStop(1, hsl(h1, 85, 70, 0));
    ctx.fillStyle = core;
    ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
    // Stars.
    const stars = 26 + Math.floor(r() * 20);
    for (let i = 0; i < stars; i++) {
      const a = r() * TAU;
      const d = Math.sqrt(r()) * rad * 0.95;
      const sx = cx + Math.cos(a) * d;
      const sy = cy + Math.sin(a) * d;
      ctx.fillStyle = `rgba(255,255,255,${0.4 + r() * 0.6})`;
      ctx.beginPath();
      ctx.arc(sx, sy, r() * 1.3 + 0.4, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
    outline(ctx, pts, ow);
    return;
  }

  if (kind === "gas") {
    halo(ctx, cx, cy, rad, h0);
    const pts = blobPoints(r, cx, cy, rad, 0.1);
    tracePath(ctx, pts);
    const base = ctx.createLinearGradient(0, cy - rad, 0, cy + rad);
    base.addColorStop(0, hsl(h0, 55, 60));
    base.addColorStop(1, hsl(h1, 50, 34));
    ctx.fillStyle = base;
    ctx.fill();
    ctx.save();
    tracePath(ctx, pts);
    ctx.clip();
    // Horizontal bands.
    const bands = 5 + Math.floor(r() * 4);
    for (let i = 0; i < bands; i++) {
      const y = cy - rad + (i + r() * 0.5) * ((rad * 2) / bands);
      const bh = (rad * 2) / bands * (0.5 + r() * 0.6);
      ctx.fillStyle = hsl(i % 2 ? h1 : h2, 45 + r() * 20, 30 + r() * 35, 0.45);
      ctx.beginPath();
      ctx.ellipse(cx, y, rad * 1.2, bh * 0.5, 0, 0, TAU);
      ctx.fill();
    }
    // Storm spot.
    if (r() < 0.8) {
      const sx = cx + (r() - 0.5) * rad;
      const sy = cy + (r() - 0.3) * rad * 0.6;
      ctx.fillStyle = hsl(h2, 70, 55, 0.9);
      ctx.beginPath();
      ctx.ellipse(sx, sy, rad * 0.28, rad * 0.18, 0, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
    shade(ctx, pts, cx, cy, rad);
    outline(ctx, pts, ow);
    return;
  }

  if (kind === "ringed") {
    const tilt = (r() - 0.5) * 0.7;
    const rr = rad * (1.55 + r() * 0.4);
    const ry = rr * (0.28 + r() * 0.14);
    const ringHue = h2;
    const pts = blobPoints(r, cx, cy, rad * 0.9, 0.08);
    // Back half of the ring.
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tilt);
    ctx.strokeStyle = hsl(ringHue, 60, 62, 0.85);
    ctx.lineWidth = rad * 0.16;
    ctx.beginPath();
    ctx.ellipse(0, 0, rr, ry, 0, Math.PI, TAU);
    ctx.stroke();
    ctx.restore();
    // Planet.
    tracePath(ctx, pts);
    const pg = ctx.createRadialGradient(cx - rad * 0.3, cy - rad * 0.3, rad * 0.1, cx, cy, rad);
    pg.addColorStop(0, hsl(h0, 55, 62));
    pg.addColorStop(1, hsl(h1, 55, 32));
    ctx.fillStyle = pg;
    ctx.fill();
    shade(ctx, pts, cx, cy, rad * 0.9);
    outline(ctx, pts, ow);
    // Front half of the ring.
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tilt);
    ctx.strokeStyle = hsl(ringHue, 65, 70, 0.95);
    ctx.lineWidth = rad * 0.16;
    ctx.beginPath();
    ctx.ellipse(0, 0, rr, ry, 0, 0, Math.PI);
    ctx.stroke();
    ctx.strokeStyle = INK;
    ctx.lineWidth = rad * 0.03;
    ctx.beginPath();
    ctx.ellipse(0, 0, rr, ry, 0, 0, Math.PI);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (kind === "shattered") {
    // A main lump plus a few smaller drifting chunks.
    const chunks = 3 + Math.floor(r() * 3);
    for (let i = 0; i < chunks; i++) {
      const a = r() * TAU;
      const d = rad * (0.9 + r() * 0.5);
      const chx = cx + Math.cos(a) * d;
      const chy = cy + Math.sin(a) * d;
      const cr = rad * (0.12 + r() * 0.16);
      const cp = blobPoints(r, chx, chy, cr, 0.4);
      tracePath(ctx, cp);
      ctx.fillStyle = hsl(h0, 22, 44);
      ctx.fill();
      shade(ctx, cp, chx, chy, cr);
      outline(ctx, cp, ow * 0.7);
    }
    crateredRock(ctx, r, cx, cy, rad, h0, "rock", ow);
    return;
  }

  // cratered (rock / ice / lava)
  crateredRock(ctx, r, cx, cy, rad, variant === "ice" ? h0 : variant === "lava" ? h0 : h0, variant, ow);
}

/** A lumpy rocky/icy/lava body pitted with craters. */
function crateredRock(
  ctx: CanvasRenderingContext2D,
  r: () => number,
  cx: number,
  cy: number,
  rad: number,
  hue: number,
  variant: string,
  ow: number,
): void {
  const ice = variant === "ice";
  const lava = variant === "lava";
  const sat = ice ? 18 : lava ? 30 : 22;
  const litL = ice ? 74 : lava ? 30 : 52;
  const darkL = ice ? 44 : lava ? 12 : 28;
  const pts = blobPoints(r, cx, cy, rad, 0.24); // clearly non-spherical
  tracePath(ctx, pts);
  const g = ctx.createRadialGradient(cx - rad * 0.35, cy - rad * 0.4, rad * 0.15, cx, cy, rad * 1.05);
  g.addColorStop(0, hsl(hue, sat, litL));
  g.addColorStop(1, hsl(hue, sat + 6, darkL));
  ctx.fillStyle = g;
  ctx.fill();

  ctx.save();
  tracePath(ctx, pts);
  ctx.clip();

  // Mottled surface patches.
  for (let i = 0; i < 7; i++) {
    const a = r() * TAU;
    const d = Math.sqrt(r()) * rad * 0.8;
    const px = cx + Math.cos(a) * d;
    const py = cy + Math.sin(a) * d;
    ctx.fillStyle = hsl(hue, sat, darkL + r() * 14, 0.35);
    ctx.beginPath();
    ctx.ellipse(px, py, rad * (0.14 + r() * 0.2), rad * (0.1 + r() * 0.16), r() * TAU, 0, TAU);
    ctx.fill();
  }

  if (lava) {
    // Glowing cracks.
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = hsl((hue + 20) % 360, 95, 60, 0.9);
      ctx.lineWidth = rad * (0.04 + r() * 0.03);
      ctx.beginPath();
      let lx = cx + (r() - 0.5) * rad * 1.4;
      let ly = cy + (r() - 0.5) * rad * 1.4;
      ctx.moveTo(lx, ly);
      for (let k = 0; k < 3; k++) {
        lx += (r() - 0.5) * rad * 0.7;
        ly += (r() - 0.5) * rad * 0.7;
        ctx.lineTo(lx, ly);
      }
      ctx.stroke();
    }
  }

  // Craters.
  const craters = 5 + Math.floor(r() * 6);
  for (let i = 0; i < craters; i++) {
    const a = r() * TAU;
    const d = Math.sqrt(r()) * rad * 0.78;
    const px = cx + Math.cos(a) * d;
    const py = cy + Math.sin(a) * d;
    const cr = rad * (0.08 + r() * 0.16);
    // Bowl shadow.
    ctx.fillStyle = hsl(hue, sat, darkL - 6, 0.85);
    ctx.beginPath();
    ctx.ellipse(px, py, cr, cr * 0.86, 0, 0, TAU);
    ctx.fill();
    // Sun-side inner light (upper-left).
    ctx.strokeStyle = hsl(hue, sat, litL + 12, 0.7);
    ctx.lineWidth = cr * 0.32;
    ctx.beginPath();
    ctx.arc(px, py, cr * 0.72, Math.PI * 0.7, Math.PI * 1.7);
    ctx.stroke();
    // Rim.
    ctx.strokeStyle = hsl(hue, sat, darkL, 0.6);
    ctx.lineWidth = cr * 0.16;
    ctx.beginPath();
    ctx.ellipse(px, py, cr, cr * 0.86, 0, 0, TAU);
    ctx.stroke();
  }

  if (ice) {
    // Fracture lines.
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = hsl(hue, 25, 88, 0.5);
      ctx.lineWidth = rad * 0.02;
      ctx.beginPath();
      let lx = cx + (r() - 0.5) * rad * 1.2;
      let ly = cy + (r() - 0.5) * rad * 1.2;
      ctx.moveTo(lx, ly);
      for (let k = 0; k < 3; k++) {
        lx += (r() - 0.5) * rad * 0.8;
        ly += (r() - 0.5) * rad * 0.8;
        ctx.lineTo(lx, ly);
      }
      ctx.stroke();
    }
  }
  ctx.restore();

  shade(ctx, pts, cx, cy, rad);
  outline(ctx, pts, ow);
}

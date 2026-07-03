/**
 * Baked mini-icons for the UI, in the same shape language as in-game
 * projectiles — so the loadout bar and draft cards show a weapon's actual
 * silhouette (not a 2-letter abbreviation). Icons are baked once to a data-URI
 * and memoised. Relics get a faceted gem tinted to their hue.
 *
 * Kept decoupled from GameRenderer on purpose: these are static, icon-oriented
 * (shapes point "up"), and belong to the UI layer.
 */
const TAU = Math.PI * 2;
const cache = new Map<string, string>();

/** A weapon projectile-shape icon (transparent PNG data-URI), memoised. */
export function weaponIcon(style: string, hue: number, size = 52): string {
  const key = `w:${style}:${hue}:${size}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  drawWeaponShape(ctx, style, hue, size / 2, size / 2, size * 0.3);
  const uri = c.toDataURL("image/png");
  cache.set(key, uri);
  return uri;
}

/**
 * An illustrated gear-slot icon (transparent PNG data-URI), memoised. Drawn in
 * a hand-inked, painterly style — dark outline, shaded metal/paint fills, a
 * soft top highlight — so the Hangar reads as illustrated kit, not flat emoji.
 */
export function gearIcon(slot: string, size = 56): string {
  const key = `g:${slot}:${size}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  drawGearIcon(ctx, slot, size / 2, size / 2, size * 0.37);
  const uri = c.toDataURL("image/png");
  cache.set(key, uri);
  return uri;
}

/**
 * An illustrated boss-signature relic icon (transparent PNG data-URI). Each
 * relic has its own hand-inked subject (heart, chorus note, flame, anvil plate,
 * ice lens, void core, crown) rather than a flat emoji, matching the Hangar's
 * illustrated card art.
 */
export function signatureIcon(id: string, hue: number, size = 56): string {
  const key = `s:${id}:${hue}:${size}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  drawSignatureIcon(ctx, id, hue, size / 2, size / 2, size * 0.36);
  const uri = c.toDataURL("image/png");
  cache.set(key, uri);
  return uri;
}

/** A faceted relic gem icon (transparent PNG data-URI), memoised. */
export function relicIcon(hue: number, size = 52): string {
  const key = `r:${hue}:${size}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  drawGem(ctx, hue, size / 2, size / 2, size * 0.34);
  const uri = c.toDataURL("image/png");
  cache.set(key, uri);
  return uri;
}

function softGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rad: number,
  hue: number,
): void {
  const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
  g.addColorStop(0, `hsla(${hue} 90% 65% / 0.55)`);
  g.addColorStop(1, `hsla(${hue} 90% 65% / 0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, TAU);
  ctx.fill();
}

/** Draw a weapon shape centred at (x,y), oriented "up" for directional ones. */
function drawWeaponShape(
  ctx: CanvasRenderingContext2D,
  style: string,
  hue: number,
  x: number,
  y: number,
  r: number,
): void {
  const core = `hsl(${hue} 92% 64%)`;
  const white = "rgba(255,255,255,0.95)";
  softGlow(ctx, x, y, r * 2.4, hue);
  ctx.save();
  ctx.translate(x, y);

  switch (style) {
    case "bolt": {
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.9, r * 0.7, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.ellipse(-r * 0.3, 0, r * 0.9, r * 0.32, 0, 0, TAU);
      ctx.fill();
      break;
    }
    case "lance": {
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 2.4, r * 0.4, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.ellipse(-r * 0.6, 0, r * 1.3, r * 0.16, 0, 0, TAU);
      ctx.fill();
      break;
    }
    case "dart": {
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.moveTo(r * 1.9, 0);
      ctx.lineTo(-r * 1.0, r * 1.1);
      ctx.lineTo(-r * 0.35, 0);
      ctx.lineTo(-r * 1.0, -r * 1.1);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.moveTo(r * 1.3, 0);
      ctx.lineTo(-r * 0.2, r * 0.45);
      ctx.lineTo(-r * 0.2, -r * 0.45);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "spark": {
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.55, 0, TAU);
      ctx.fill();
      ctx.fillStyle = core;
      for (let s = 0; s < 4; s++) {
        const a = (s / 4) * TAU + 0.4;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r * 1.3, Math.sin(a) * r * 1.3, r * 0.34, 0, TAU);
        ctx.fill();
      }
      break;
    }
    case "shard": {
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.9);
      ctx.lineTo(r * 0.8, 0);
      ctx.lineTo(0, r * 1.9);
      ctx.lineTo(-r * 0.8, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.42, 0, TAU);
      ctx.fill();
      break;
    }
    case "crystal": {
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = `hsl(${hue} 90% 76%)`;
      ctx.beginPath();
      ctx.moveTo(r * 2.0, 0);
      ctx.lineTo(0, r * 0.9);
      ctx.lineTo(-r * 1.6, 0);
      ctx.lineTo(0, -r * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.moveTo(r * 1.3, 0);
      ctx.lineTo(0, r * 0.32);
      ctx.lineTo(0, -r * 0.32);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "hex": {
      ctx.fillStyle = core;
      ctx.beginPath();
      for (let s = 0; s < 6; s++) {
        const a = (s / 6) * TAU - Math.PI / 2;
        const px = Math.cos(a) * r * 1.6;
        const py = Math.sin(a) * r * 1.6;
        s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = white;
      ctx.lineWidth = r * 0.32;
      ctx.stroke();
      break;
    }
    case "star": {
      ctx.fillStyle = core;
      const spike = (rot: number): void => {
        ctx.save();
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.moveTo(0, -r * 2.2);
        ctx.lineTo(r * 0.45, 0);
        ctx.lineTo(0, r * 2.2);
        ctx.lineTo(-r * 0.45, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };
      spike(0);
      spike(Math.PI / 2);
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.5, 0, TAU);
      ctx.fill();
      break;
    }
    case "glaive": {
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.7, -1.15, 1.15);
      ctx.arc(r * 0.8, 0, r * 1.5, 0.95, -0.95, true);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = white;
      ctx.lineWidth = r * 0.3;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.7, -1.05, 1.05);
      ctx.stroke();
      break;
    }
    case "saw": {
      const teeth = 9;
      ctx.fillStyle = core;
      ctx.beginPath();
      for (let s = 0; s < teeth; s++) {
        const a0 = (s / teeth) * TAU;
        const a1 = ((s + 0.5) / teeth) * TAU;
        ctx.lineTo(Math.cos(a0) * r * 1.9, Math.sin(a0) * r * 1.9);
        ctx.lineTo(Math.cos(a1) * r * 1.15, Math.sin(a1) * r * 1.15);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.55, 0, TAU);
      ctx.fill();
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.24, 0, TAU);
      ctx.fill();
      break;
    }
    case "arc": {
      ctx.rotate(-Math.PI / 2);
      ctx.strokeStyle = white;
      ctx.lineWidth = r * 0.34;
      ctx.lineCap = "round";
      ctx.beginPath();
      const n = 4;
      for (let s = 0; s <= n; s++) {
        const py = (s / n - 0.5) * r * 3.4;
        const px = s === 0 || s === n ? 0 : ((s % 2) - 0.5) * r * 1.3;
        s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      break;
    }
    default: {
      // orb / beam — a glowing sphere.
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.2, 0, TAU);
      ctx.fill();
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.arc(-r * 0.25, -r * 0.25, r * 0.5, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** A faceted relic gem — a bright hexagonal cut with a specular highlight. */
function drawGem(
  ctx: CanvasRenderingContext2D,
  hue: number,
  x: number,
  y: number,
  r: number,
): void {
  softGlow(ctx, x, y, r * 2.3, hue);
  ctx.save();
  ctx.translate(x, y);
  // Body — an upright hexagon.
  const pts: [number, number][] = [];
  for (let s = 0; s < 6; s++) {
    const a = (s / 6) * TAU - Math.PI / 2;
    pts.push([Math.cos(a) * r * 1.5, Math.sin(a) * r * 1.6]);
  }
  const grad = ctx.createLinearGradient(0, -r * 1.6, 0, r * 1.6);
  grad.addColorStop(0, `hsl(${hue} 85% 72%)`);
  grad.addColorStop(1, `hsl(${hue} 80% 42%)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  pts.forEach((p, k) => (k === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.closePath();
  ctx.fill();
  // Facet lines from centre to each vertex.
  ctx.strokeStyle = `hsla(${hue} 90% 25% / 0.55)`;
  ctx.lineWidth = r * 0.12;
  for (const p of pts) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(p[0], p[1]);
    ctx.stroke();
  }
  // Rim + specular glint.
  ctx.strokeStyle = `hsla(${hue} 95% 85% / 0.9)`;
  ctx.lineWidth = r * 0.16;
  ctx.beginPath();
  pts.forEach((p, k) => (k === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.ellipse(-r * 0.35, -r * 0.55, r * 0.34, r * 0.16, -0.6, 0, TAU);
  ctx.fill();
  ctx.restore();
}

/* ------------------------------------------------------------------ *\
 *  Illustrated icons — hand-inked kit for the Hangar (gear + relics).
 *  Shared look: a dark ink outline, a shaded fill, a soft top glint —
 *  drawn on a transparent canvas so it sits on any card colour.
\* ------------------------------------------------------------------ */

const INK = "#161019";

/** Set a rounded ink outline for the current path work. */
function ink(ctx: CanvasRenderingContext2D, r: number, w = 0.11): void {
  ctx.strokeStyle = INK;
  ctx.lineWidth = Math.max(1.3, r * w);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
}

/** A vertical two-stop fill between two points. */
function vgrad(
  ctx: CanvasRenderingContext2D,
  y0: number,
  y1: number,
  a: string,
  b: string,
): CanvasGradient {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  return g;
}

/** A faint upper-left glint blob for a painted-highlight feel. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.55, -0.6, 0, TAU);
  ctx.fill();
}

/** Dispatch to the per-slot illustration, centred at (x,y). */
function drawGearIcon(
  ctx: CanvasRenderingContext2D,
  slot: string,
  x: number,
  y: number,
  r: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  switch (slot) {
    case "hull":
      drawHullBadge(ctx, r);
      break;
    case "core":
      drawDie(ctx, r);
      break;
    case "engines":
      drawRocket(ctx, r);
      break;
    case "wings":
      drawWing(ctx, r);
      break;
    case "shield":
      drawChevron(ctx, r);
      break;
    case "targeting":
      drawBullseye(ctx, r);
      break;
    default:
      drawDie(ctx, r);
  }
  ctx.restore();
}

/** Hull — a heraldic shield split by a lightning bolt (steel / copper). */
function drawHullBadge(ctx: CanvasRenderingContext2D, r: number): void {
  const shield = (): void => {
    ctx.beginPath();
    ctx.moveTo(-r * 0.92, -r * 0.98);
    ctx.lineTo(r * 0.92, -r * 0.98);
    ctx.lineTo(r * 0.92, -r * 0.12);
    ctx.quadraticCurveTo(r * 0.86, r * 0.72, 0, r * 1.28);
    ctx.quadraticCurveTo(-r * 0.86, r * 0.72, -r * 0.92, -r * 0.12);
    ctx.closePath();
  };
  const bolt: [number, number][] = [
    [-r * 0.04, -r * 0.98],
    [r * 0.26, -r * 0.34],
    [-r * 0.1, -r * 0.02],
    [r * 0.2, r * 0.5],
    [0, r * 1.28],
  ];
  shield();
  ctx.save();
  ctx.clip();
  // Steel base.
  ctx.fillStyle = vgrad(ctx, -r, r * 1.2, "#8b98ad", "#3c465e");
  ctx.fillRect(-r * 1.3, -r * 1.3, r * 2.6, r * 2.8);
  // Copper right side, bounded by the bolt seam.
  ctx.fillStyle = vgrad(ctx, -r, r * 1.2, "#f3ad5b", "#b7601c");
  ctx.beginPath();
  bolt.forEach((p, k) => (k === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.lineTo(r * 1.3, r * 1.3);
  ctx.lineTo(r * 1.3, -r * 1.3);
  ctx.closePath();
  ctx.fill();
  // Bolt highlight seam.
  ink(ctx, r, 0.16);
  ctx.strokeStyle = "#fbf1dd";
  ctx.beginPath();
  bolt.forEach((p, k) => (k === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.stroke();
  ctx.restore();
  // Rivets + outline.
  ctx.fillStyle = "rgba(20,16,24,0.5)";
  for (const [rx, ry] of [[-r * 0.62, -r * 0.66], [r * 0.62, -r * 0.66]]) {
    ctx.beginPath();
    ctx.arc(rx, ry, r * 0.08, 0, TAU);
    ctx.fill();
  }
  shield();
  ink(ctx, r, 0.12);
  ctx.stroke();
  ctx.save();
  shield();
  ctx.clip();
  glint(ctx, -r * 0.4, -r * 0.55, r * 0.42);
  ctx.restore();
}

/** Core — an isometric die with pips. */
function drawDie(ctx: CanvasRenderingContext2D, r: number): void {
  const T: [number, number] = [0, -r * 0.98];
  const R: [number, number] = [r * 0.92, -r * 0.44];
  const L: [number, number] = [-r * 0.92, -r * 0.44];
  const M: [number, number] = [0, r * 0.12];
  const Bd: [number, number] = [0, r * 1.06];
  const RB: [number, number] = [r * 0.92, r * 0.52];
  const LB: [number, number] = [-r * 0.92, r * 0.52];
  const face = (pts: [number, number][], fill: string | CanvasGradient): void => {
    ctx.beginPath();
    pts.forEach((p, k) => (k === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ink(ctx, r, 0.1);
    ctx.stroke();
  };
  face([T, R, M, L], vgrad(ctx, -r, r, "#c79bec", "#a877d8")); // top
  face([L, M, Bd, LB], vgrad(ctx, -r * 0.4, r * 1.1, "#8f5cc0", "#5f3a8f")); // left
  face([R, M, Bd, RB], vgrad(ctx, -r * 0.4, r * 1.1, "#7a4bb0", "#472a6e")); // right
  // Pips.
  ctx.fillStyle = "#f3e9ff";
  const pip = (px: number, py: number, s = r * 0.11): void => {
    ctx.beginPath();
    ctx.arc(px, py, s, 0, TAU);
    ctx.fill();
  };
  pip(0, -r * 0.44); // top face: 1
  pip(-r * 0.44, r * 0.28); // left face: 2
  pip(-r * 0.02, r * 0.5);
  pip(r * 0.3, r * 0.18); // right face: 3
  pip(r * 0.46, r * 0.42);
  pip(r * 0.5, -r * 0.02);
}

/** Engines — a stubby rocket with fins and a flame. */
function drawRocket(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.rotate(-0.12);
  // Flame first (behind body).
  ctx.fillStyle = vgrad(ctx, r * 0.5, r * 1.5, "#ffd85e", "#f2731f");
  ctx.beginPath();
  ctx.moveTo(-r * 0.3, r * 0.72);
  ctx.quadraticCurveTo(-r * 0.5, r * 1.2, 0, r * 1.5);
  ctx.quadraticCurveTo(r * 0.5, r * 1.2, r * 0.3, r * 0.72);
  ctx.closePath();
  ctx.fill();
  // Fins.
  ctx.fillStyle = "#d9482f";
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(s * r * 0.34, r * 0.2);
    ctx.lineTo(s * r * 0.78, r * 0.78);
    ctx.lineTo(s * r * 0.34, r * 0.74);
    ctx.closePath();
    ctx.fill();
    ink(ctx, r, 0.1);
    ctx.stroke();
  }
  // Body capsule.
  ctx.beginPath();
  ctx.moveTo(-r * 0.4, r * 0.72);
  ctx.lineTo(-r * 0.4, -r * 0.34);
  ctx.quadraticCurveTo(-r * 0.4, -r * 0.86, 0, -r * 1.12);
  ctx.quadraticCurveTo(r * 0.4, -r * 0.86, r * 0.4, -r * 0.34);
  ctx.lineTo(r * 0.4, r * 0.72);
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, -r, r * 0.8, "#f4f6fb", "#b9c3d6");
  ctx.fill();
  ink(ctx, r, 0.11);
  ctx.stroke();
  // Nose cone.
  ctx.beginPath();
  ctx.moveTo(-r * 0.4, -r * 0.3);
  ctx.quadraticCurveTo(-r * 0.4, -r * 0.86, 0, -r * 1.12);
  ctx.quadraticCurveTo(r * 0.4, -r * 0.86, r * 0.4, -r * 0.3);
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, -r * 1.1, -r * 0.2, "#ec6a4d", "#c33f2b");
  ctx.fill();
  ink(ctx, r, 0.1);
  ctx.stroke();
  // Window.
  ctx.beginPath();
  ctx.arc(0, -r * 0.02, r * 0.24, 0, TAU);
  ctx.fillStyle = "#8fd4f2";
  ctx.fill();
  ink(ctx, r, 0.09);
  ctx.stroke();
  glint(ctx, -r * 0.08, -r * 0.1, r * 0.1);
}

/** Wings — feathers fanned from a single root into a swept wing. */
function drawWing(ctx: CanvasRenderingContext2D, r: number): void {
  const rootX = r * 0.64;
  const rootY = r * 0.72;
  const feather = (angle: number, len: number, wide: number): void => {
    ctx.save();
    ctx.translate(rootX, rootY);
    ctx.rotate(angle);
    // A curved teardrop feather pointing "up" from the root.
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(wide, -len * 0.55, wide * 0.32, -len);
    ctx.quadraticCurveTo(0, -len * 0.86, -wide * 0.34, -len * 0.9);
    ctx.quadraticCurveTo(-wide, -len * 0.5, 0, 0);
    ctx.closePath();
    ctx.fillStyle = vgrad(ctx, -len, 0, "#f7faff", "#c3d1ea");
    ctx.fill();
    ink(ctx, r, 0.07);
    ctx.stroke();
    // Quill.
    ctx.strokeStyle = "rgba(22,16,25,0.28)";
    ctx.lineWidth = r * 0.04;
    ctx.beginPath();
    ctx.moveTo(0, -len * 0.12);
    ctx.lineTo(-wide * 0.05, -len * 0.86);
    ctx.stroke();
    ctx.restore();
  };
  // Fan from near-upright down to the left, back-to-front so quills overlap.
  const specs: [number, number, number][] = [
    [-0.2, r * 0.88, r * 0.17],
    [-0.6, r * 1.12, r * 0.19],
    [-1.0, r * 1.28, r * 0.21],
    [-1.4, r * 1.22, r * 0.2],
    [-1.8, r * 1.02, r * 0.18],
    [-2.2, r * 0.78, r * 0.16],
  ];
  for (const [a, l, w] of specs) feather(a, l, w);
}

/** Shield relic — a bold folded chevron banner (gold on green). */
function drawChevron(ctx: CanvasRenderingContext2D, r: number): void {
  const outer: [number, number][] = [
    [-r * 0.95, -r * 0.62],
    [0, -r * 0.12],
    [r * 0.95, -r * 0.62],
    [r * 0.95, -r * 0.02],
    [0, r * 0.52],
    [-r * 0.95, -r * 0.02],
  ];
  ctx.beginPath();
  outer.forEach((p, k) => (k === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, -r * 0.7, r * 0.6, "#f0d264", "#b6882a");
  ctx.fill();
  ink(ctx, r, 0.12);
  ctx.stroke();
  // Lower folded chevron for a stacked-badge look.
  const lower: [number, number][] = [
    [-r * 0.95, r * 0.28],
    [0, r * 0.78],
    [r * 0.95, r * 0.28],
    [r * 0.95, r * 0.6],
    [0, r * 1.1],
    [-r * 0.95, r * 0.6],
  ];
  ctx.beginPath();
  lower.forEach((p, k) => (k === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, r * 0.2, r * 1.1, "#7cc06a", "#3f8a4a");
  ctx.fill();
  ink(ctx, r, 0.12);
  ctx.stroke();
  // Fold glints.
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = r * 0.07;
  ctx.beginPath();
  ctx.moveTo(-r * 0.8, -r * 0.5);
  ctx.lineTo(0, r * 0.0);
  ctx.stroke();
}

/** Targeting — a bullseye with an arrow struck into it. */
function drawBullseye(ctx: CanvasRenderingContext2D, r: number): void {
  const rings: [number, string][] = [
    [r * 1.0, "#d64b3f"],
    [r * 0.72, "#f2e6cf"],
    [r * 0.46, "#d64b3f"],
    [r * 0.2, "#f2e6cf"],
  ];
  for (const [rad, col] of rings) {
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, TAU);
    ctx.fillStyle = col;
    ctx.fill();
    ink(ctx, r, 0.075);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.09, 0, TAU);
  ctx.fillStyle = INK;
  ctx.fill();
  // Arrow, upper-right into centre.
  ctx.save();
  ctx.translate(r * 0.1, -r * 0.05);
  ctx.rotate(2.35);
  ctx.strokeStyle = "#9fb2c4";
  ctx.lineWidth = r * 0.14;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-r * 0.1, 0);
  ctx.lineTo(r * 1.25, 0);
  ctx.stroke();
  ink(ctx, r, 0.06);
  ctx.beginPath();
  ctx.moveTo(-r * 0.1, 0);
  ctx.lineTo(r * 1.25, 0);
  ctx.stroke();
  // Head.
  ctx.fillStyle = "#e9edf3";
  ctx.beginPath();
  ctx.moveTo(-r * 0.34, 0);
  ctx.lineTo(-r * 0.02, -r * 0.2);
  ctx.lineTo(-r * 0.02, r * 0.2);
  ctx.closePath();
  ctx.fill();
  ink(ctx, r, 0.07);
  ctx.stroke();
  // Fletching.
  ctx.fillStyle = "#d64b3f";
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(r * 1.0, 0);
    ctx.lineTo(r * 1.32, s * r * 0.26);
    ctx.lineTo(r * 1.28, 0);
    ctx.closePath();
    ctx.fill();
    ink(ctx, r, 0.06);
    ctx.stroke();
  }
  ctx.restore();
}

/** Dispatch to the per-relic illustration, centred at (x,y). */
function drawSignatureIcon(
  ctx: CanvasRenderingContext2D,
  id: string,
  hue: number,
  x: number,
  y: number,
  r: number,
): void {
  softGlow(ctx, x, y, r * 2.2, hue);
  ctx.save();
  ctx.translate(x, y);
  switch (id) {
    case "devourer":
      drawHeart(ctx, r);
      break;
    case "chorus":
      drawNote(ctx, r);
      break;
    case "cinderbrand":
      drawFlame(ctx, r);
      break;
    case "anvil":
      drawPlate(ctx, r);
      break;
    case "glacial":
      drawIce(ctx, r);
      break;
    case "abyssal":
      drawVoidCore(ctx, r);
      break;
    case "crown":
      drawCrown(ctx, r);
      break;
    default:
      drawHeart(ctx, r);
  }
  ctx.restore();
}

/** Devourer's Heart — an anatomical heart. */
function drawHeart(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.5);
  ctx.bezierCurveTo(r * 0.55, -r * 1.15, r * 1.25, -r * 0.35, 0, r * 0.95);
  ctx.bezierCurveTo(-r * 1.25, -r * 0.35, -r * 0.55, -r * 1.15, 0, -r * 0.5);
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, -r, r, "#d06fd8", "#8b2ea0");
  ctx.fill();
  ink(ctx, r, 0.1);
  ctx.stroke();
  // Aorta/vessels.
  ctx.strokeStyle = "rgba(60,16,70,0.6)";
  ctx.lineWidth = r * 0.09;
  ctx.lineCap = "round";
  for (const [ex, ey] of [[-r * 0.2, r * 0.2], [r * 0.22, r * 0.1]]) {
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.35);
    ctx.quadraticCurveTo(ex, -r * 0.1, ex * 1.1, ey);
    ctx.stroke();
  }
  glint(ctx, -r * 0.4, -r * 0.4, r * 0.28);
}

/** Chorus Core — a beamed eighth-note pair. */
function drawNote(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.strokeStyle = "#eaf7ff";
  ink(ctx, r, 0.14);
  ctx.strokeStyle = "#eaf7ff";
  ctx.lineWidth = r * 0.18;
  // Stems.
  ctx.beginPath();
  ctx.moveTo(-r * 0.5, r * 0.55);
  ctx.lineTo(-r * 0.5, -r * 0.9);
  ctx.lineTo(r * 0.6, -r * 1.15);
  ctx.lineTo(r * 0.6, r * 0.25);
  ctx.stroke();
  // Beam.
  ctx.strokeStyle = "#8fe6ff";
  ctx.lineWidth = r * 0.26;
  ctx.beginPath();
  ctx.moveTo(-r * 0.5, -r * 0.72);
  ctx.lineTo(r * 0.6, -r * 0.98);
  ctx.stroke();
  // Note heads.
  const head = (hx: number, hy: number): void => {
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(-0.35);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.34, r * 0.24, 0, 0, TAU);
    ctx.fillStyle = "#7fd8f4";
    ctx.fill();
    ink(ctx, r, 0.09);
    ctx.stroke();
    ctx.restore();
  };
  head(-r * 0.5, r * 0.55);
  head(r * 0.6, r * 0.25);
}

/** Cinderbrand — a licking flame. */
function drawFlame(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.beginPath();
  ctx.moveTo(0, r * 1.1);
  ctx.bezierCurveTo(-r * 1.0, r * 0.55, -r * 0.5, -r * 0.35, -r * 0.05, -r * 1.15);
  ctx.bezierCurveTo(r * 0.05, -r * 0.55, r * 0.55, -r * 0.6, r * 0.35, -r * 0.05);
  ctx.bezierCurveTo(r * 0.7, -r * 0.2, r * 0.9, r * 0.55, 0, r * 1.1);
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, -r * 1.1, r * 1.1, "#ffd24e", "#e0521c");
  ctx.fill();
  ink(ctx, r, 0.1);
  ctx.stroke();
  // Inner flame.
  ctx.beginPath();
  ctx.moveTo(0, r * 0.72);
  ctx.bezierCurveTo(-r * 0.42, r * 0.35, -r * 0.18, -r * 0.25, r * 0.05, -r * 0.6);
  ctx.bezierCurveTo(r * 0.12, -r * 0.2, r * 0.4, r * 0.35, 0, r * 0.72);
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, -r * 0.6, r * 0.7, "#fff2b0", "#ff9838");
  ctx.fill();
}

/** Anvil Plate — a glowing forged ingot in perspective. */
function drawPlate(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.rotate(-0.12);
  const top: [number, number][] = [
    [-r * 0.9, -r * 0.42],
    [r * 0.7, -r * 0.62],
    [r * 0.95, -r * 0.1],
    [-r * 0.65, r * 0.1],
  ];
  const front: [number, number][] = [
    [-r * 0.65, r * 0.1],
    [r * 0.95, -r * 0.1],
    [r * 0.95, r * 0.42],
    [-r * 0.65, r * 0.62],
  ];
  // Front (darker, with a molten glow band).
  ctx.beginPath();
  front.forEach((p, k) => (k === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, -r * 0.1, r * 0.62, "#5a4038", "#2c1f22");
  ctx.fill();
  ink(ctx, r, 0.1);
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  front.forEach((p, k) => (k === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = vgrad(ctx, r * 0.1, r * 0.62, "#ff7a2e", "#c02a12");
  ctx.fillRect(-r, r * 0.18, r * 2, r * 0.6);
  ctx.restore();
  // Top face (heated metal).
  ctx.beginPath();
  top.forEach((p, k) => (k === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, -r * 0.6, r * 0.1, "#9aa2ad", "#6a7078");
  ctx.fill();
  ink(ctx, r, 0.1);
  ctx.stroke();
  glint(ctx, -r * 0.15, -r * 0.32, r * 0.3);
}

/** Glacial Lens — a six-point ice crystal. */
function drawIce(ctx: CanvasRenderingContext2D, r: number): void {
  const spike = (rot: number, len: number, wide: number): void => {
    ctx.save();
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, -len);
    ctx.lineTo(wide, -len * 0.32);
    ctx.lineTo(0, 0);
    ctx.lineTo(-wide, -len * 0.32);
    ctx.closePath();
    ctx.fillStyle = vgrad(ctx, -len, 0, "#eafcff", "#8fd6ec");
    ctx.fill();
    ink(ctx, r, 0.08);
    ctx.stroke();
    ctx.restore();
  };
  for (let s = 0; s < 6; s++) spike((s / 6) * TAU, r * (s % 2 ? 0.7 : 1.15), r * 0.18);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.24, 0, TAU);
  ctx.fillStyle = "#dff8ff";
  ctx.fill();
  ink(ctx, r, 0.08);
  ctx.stroke();
}

/** Abyssal Core — an atom orbiting a void singularity. */
function drawVoidCore(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.strokeStyle = "#9a6fd0";
  ink(ctx, r, 0.09);
  ctx.strokeStyle = "#a878e0";
  ctx.lineWidth = r * 0.1;
  for (let s = 0; s < 3; s++) {
    ctx.save();
    ctx.rotate((s / 3) * Math.PI);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.1, r * 0.42, 0, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
  // Singularity.
  const g = ctx.createRadialGradient(0, 0, r * 0.05, 0, 0, r * 0.5);
  g.addColorStop(0, "#000");
  g.addColorStop(0.7, "#1a0d2e");
  g.addColorStop(1, "#7a3fb0");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.42, 0, TAU);
  ctx.fill();
  ink(ctx, r, 0.08);
  ctx.stroke();
}

/** Crown of Hollows — a five-point crown. */
function drawCrown(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.beginPath();
  ctx.moveTo(-r * 0.95, r * 0.5);
  ctx.lineTo(-r * 0.95, -r * 0.55);
  ctx.lineTo(-r * 0.5, -r * 0.05);
  ctx.lineTo(0, -r * 0.85);
  ctx.lineTo(r * 0.5, -r * 0.05);
  ctx.lineTo(r * 0.95, -r * 0.55);
  ctx.lineTo(r * 0.95, r * 0.5);
  ctx.closePath();
  ctx.fillStyle = vgrad(ctx, -r * 0.85, r * 0.5, "#f4d76a", "#bb8b2c");
  ctx.fill();
  ink(ctx, r, 0.11);
  ctx.stroke();
  // Base band.
  ctx.fillStyle = "#a8781f";
  ctx.beginPath();
  ctx.rect(-r * 0.95, r * 0.5, r * 1.9, r * 0.3);
  ctx.fill();
  ink(ctx, r, 0.1);
  ctx.stroke();
  // Jewels.
  const jewel = (jx: number, col: string): void => {
    ctx.beginPath();
    ctx.arc(jx, r * 0.65, r * 0.1, 0, TAU);
    ctx.fillStyle = col;
    ctx.fill();
  };
  jewel(-r * 0.5, "#e0556a");
  jewel(0, "#5fd0e8");
  jewel(r * 0.5, "#7ae08a");
  glint(ctx, -r * 0.35, -r * 0.3, r * 0.22);
}

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

/**
 * A small illustrated glyph (transparent PNG data-URI) that replaces a UI
 * emoji — achievements, commander powers, sector modifiers, how-to notes. Drawn
 * hand-inked and tinted to `hue` so a screenful reads as one engraved set
 * rather than a ransom-note of platform emoji. Keyed by the original emoji (or
 * a glyph name) so call sites can pass their existing `icon` field unchanged.
 */
export function glyphIcon(key: string, hue = 45, size = 46): string {
  const name = GLYPH_ALIAS[key] ?? key;
  const ck = `y:${name}:${hue}:${size}`;
  const hit = cache.get(ck);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  drawGlyph(ctx, name, hue, size / 2, size / 2, size * 0.32);
  const uri = c.toDataURL("image/png");
  cache.set(ck, uri);
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

/* ------------------------------------------------------------------ *\
 *  Glyph library — hand-inked, hue-tinted replacements for UI emoji.
 *  One cohesive engraved set across achievements, powers and modifiers.
\* ------------------------------------------------------------------ */

/** Map every UI emoji (and a few names) onto a drawn glyph. */
const GLYPH_ALIAS: Record<string, string> = {
  "✦": "sparkle", "✧": "sparkle", "✷": "sparkle", "❋": "sparkle", "✚": "sparkle",
  "★": "star", "🌟": "star", "☀": "sun",
  "⚔": "swords", "🗡": "sword", "🏹": "bow",
  "☠": "skull", "☄": "comet", "🌙": "moon", "⬆": "chevronUp",
  "🛠": "gear", "⚙": "gear", "🚀": "rocket", "✈": "dart",
  "⬡": "hexagon", "💠": "hexagon", "👑": "crown", "♛": "crown", "🎖": "medal",
  "🌋": "flame", "🔥": "flame", "⚡": "bolt", "💫": "bolt", "💥": "burst",
  "📦": "pod", "🎁": "pod", "🛰": "satellite", "🛸": "satellite",
  "🧭": "compass", "🌀": "spiral", "🌪": "spiral", "🌌": "galaxy",
  "🏰": "castle", "🏯": "castle", "💯": "target", "🗿": "monolith",
  "♾": "infinity", "🧩": "puzzle", "🛒": "cart", "🕹": "joystick",
  "🛡": "shield", "🔰": "shield", "🦗": "bug", "🌑": "planet",
  "📅": "calendar", "👥": "people", "🔒": "lock",
  "◆": "hexagon", "⏸": "pause",
};

/** Hue-tinted vertical fill used by most glyphs. */
function hfill(ctx: CanvasRenderingContext2D, hue: number, r: number): CanvasGradient {
  return vgrad(ctx, -r * 1.15, r * 1.15, `hsl(${hue} 88% 72%)`, `hsl(${hue} 78% 46%)`);
}

/** Draw a filled + inked polygon from points. */
function poly(ctx: CanvasRenderingContext2D, pts: [number, number][], r: number): void {
  ctx.beginPath();
  pts.forEach((p, k) => (k === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.closePath();
  ctx.fill();
  ink(ctx, r, 0.09);
  ctx.stroke();
}

function drawGlyph(
  ctx: CanvasRenderingContext2D,
  name: string,
  hue: number,
  x: number,
  y: number,
  r: number,
): void {
  softGlow(ctx, x, y, r * 2.0, hue);
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = hfill(ctx, hue, r);
  const F = hfill(ctx, hue, r);
  const setF = (): void => {
    ctx.fillStyle = F;
  };
  setF();

  switch (name) {
    case "sparkle": {
      // A four-point sparkle with concave sides.
      const pts: [number, number][] = [];
      for (let s = 0; s < 8; s++) {
        const a = (s / 8) * TAU - Math.PI / 2;
        const rad = s % 2 ? r * 0.34 : r * 1.35;
        pts.push([Math.cos(a) * rad, Math.sin(a) * rad]);
      }
      poly(ctx, pts, r);
      break;
    }
    case "star": {
      const pts: [number, number][] = [];
      for (let s = 0; s < 10; s++) {
        const a = (s / 10) * TAU - Math.PI / 2;
        const rad = s % 2 ? r * 0.5 : r * 1.35;
        pts.push([Math.cos(a) * rad, Math.sin(a) * rad]);
      }
      poly(ctx, pts, r);
      glint(ctx, -r * 0.25, -r * 0.4, r * 0.22);
      break;
    }
    case "sun": {
      for (let s = 0; s < 8; s++) {
        ctx.save();
        ctx.rotate((s / 8) * TAU);
        poly(ctx, [[-r * 0.16, -r * 0.9], [r * 0.16, -r * 0.9], [0, -r * 1.4]], r);
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.72, 0, TAU);
      ctx.fill();
      ink(ctx, r, 0.09);
      ctx.stroke();
      glint(ctx, -r * 0.22, -r * 0.28, r * 0.22);
      break;
    }
    case "sword": {
      poly(ctx, [[0, -r * 1.35], [r * 0.2, -r * 0.2], [r * 0.2, r * 0.5], [-r * 0.2, r * 0.5], [-r * 0.2, -r * 0.2]], r);
      ctx.beginPath();
      ctx.rect(-r * 0.6, r * 0.5, r * 1.2, r * 0.22);
      ctx.fill();
      ink(ctx, r, 0.09);
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(-r * 0.14, r * 0.72, r * 0.28, r * 0.55);
      ctx.fill();
      ink(ctx, r, 0.09);
      ctx.stroke();
      break;
    }
    case "swords": {
      for (const s of [-1, 1]) {
        ctx.save();
        ctx.scale(s, 1);
        ctx.rotate(-0.5);
        poly(ctx, [[0, -r * 1.4], [r * 0.16, -r * 0.3], [-r * 0.16, -r * 0.3]], r);
        ctx.beginPath();
        ctx.rect(-r * 0.16, -r * 0.3, r * 0.32, r * 1.5);
        ctx.fill();
        ink(ctx, r, 0.08);
        ctx.stroke();
        ctx.restore();
      }
      break;
    }
    case "bow": {
      ctx.lineWidth = r * 0.2;
      ctx.strokeStyle = `hsl(${hue} 80% 60%)`;
      ctx.beginPath();
      ctx.arc(r * 0.5, 0, r * 1.15, 2.3, 3.98);
      ctx.stroke();
      ink(ctx, r, 0.08);
      ctx.stroke();
      ctx.strokeStyle = "rgba(240,244,255,0.7)";
      ctx.lineWidth = r * 0.05;
      ctx.beginPath();
      ctx.moveTo(-r * 0.55, -r * 0.95);
      ctx.lineTo(-r * 0.55, r * 0.95);
      ctx.stroke();
      // Arrow.
      setF();
      ctx.save();
      ctx.rotate(0);
      ctx.fillRect(-r * 0.55, -r * 0.06, r * 1.6, r * 0.12);
      poly(ctx, [[r * 1.35, 0], [r * 0.9, -r * 0.28], [r * 0.9, r * 0.28]], r);
      ctx.restore();
      break;
    }
    case "skull": {
      ctx.beginPath();
      ctx.arc(0, -r * 0.2, r, Math.PI, 0);
      ctx.lineTo(r * 0.7, r * 0.5);
      ctx.lineTo(-r * 0.7, r * 0.5);
      ctx.closePath();
      ctx.fill();
      ink(ctx, r, 0.09);
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(-r * 0.38, -r * 0.15, r * 0.26, 0, TAU);
      ctx.arc(r * 0.38, -r * 0.15, r * 0.26, 0, TAU);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, r * 0.05);
      ctx.lineTo(r * 0.14, r * 0.35);
      ctx.lineTo(-r * 0.14, r * 0.35);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "comet": {
      // Tail.
      ctx.fillStyle = `hsla(${hue} 85% 68% / 0.5)`;
      poly(ctx, [[r * 0.2, -r * 0.2], [-r * 1.3, r * 0.9], [r * 0.5, r * 0.3]], r);
      setF();
      ctx.beginPath();
      ctx.arc(r * 0.55, -r * 0.55, r * 0.6, 0, TAU);
      ctx.fill();
      ink(ctx, r, 0.09);
      ctx.stroke();
      glint(ctx, r * 0.4, -r * 0.72, r * 0.16);
      break;
    }
    case "moon": {
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.15, 0, TAU);
      ctx.fill();
      ink(ctx, r, 0.09);
      ctx.stroke();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(r * 0.5, -r * 0.25, r * 0.95, 0, TAU);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      break;
    }
    case "chevronUp": {
      poly(ctx, [[0, -r * 1.2], [r * 1.15, -r * 0.05], [r * 0.5, -r * 0.05], [r * 0.5, r * 1.15], [-r * 0.5, r * 1.15], [-r * 0.5, -r * 0.05], [-r * 1.15, -r * 0.05]], r);
      break;
    }
    case "gear": {
      const teeth = 8;
      ctx.beginPath();
      for (let s = 0; s < teeth; s++) {
        const a0 = (s / teeth) * TAU;
        const a1 = ((s + 0.5) / teeth) * TAU;
        ctx.lineTo(Math.cos(a0) * r * 1.35, Math.sin(a0) * r * 1.35);
        ctx.lineTo(Math.cos(a1) * r * 0.95, Math.sin(a1) * r * 0.95);
      }
      ctx.closePath();
      ctx.fill();
      ink(ctx, r, 0.09);
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.42, 0, TAU);
      ctx.fill();
      break;
    }
    case "rocket":
    case "dart": {
      poly(ctx, [[0, -r * 1.35], [r * 0.55, -r * 0.1], [r * 0.4, r * 0.7], [-r * 0.4, r * 0.7], [-r * 0.55, -r * 0.1]], r);
      // Fins.
      poly(ctx, [[-r * 0.4, r * 0.35], [-r * 0.9, r * 0.95], [-r * 0.4, r * 0.7]], r);
      poly(ctx, [[r * 0.4, r * 0.35], [r * 0.9, r * 0.95], [r * 0.4, r * 0.7]], r);
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(0, -r * 0.2, r * 0.22, 0, TAU);
      ctx.fill();
      break;
    }
    case "hexagon": {
      const pts: [number, number][] = [];
      for (let s = 0; s < 6; s++) {
        const a = (s / 6) * TAU - Math.PI / 2;
        pts.push([Math.cos(a) * r * 1.25, Math.sin(a) * r * 1.25]);
      }
      poly(ctx, pts, r);
      glint(ctx, -r * 0.28, -r * 0.4, r * 0.2);
      break;
    }
    case "crown": {
      poly(ctx, [[-r * 1.1, r * 0.55], [-r * 1.1, -r * 0.5], [-r * 0.55, r * 0], [0, -r * 0.9], [r * 0.55, r * 0], [r * 1.1, -r * 0.5], [r * 1.1, r * 0.55]], r);
      ctx.beginPath();
      ctx.rect(-r * 1.1, r * 0.55, r * 2.2, r * 0.35);
      ctx.fill();
      ink(ctx, r, 0.09);
      ctx.stroke();
      break;
    }
    case "medal": {
      ctx.fillStyle = `hsl(${(hue + 20) % 360} 80% 55%)`;
      poly(ctx, [[-r * 0.5, -r * 1.3], [-r * 0.1, -r * 0.3], [-r * 0.5, -r * 0.3]], r);
      poly(ctx, [[r * 0.5, -r * 1.3], [r * 0.1, -r * 0.3], [r * 0.5, -r * 0.3]], r);
      setF();
      ctx.beginPath();
      ctx.arc(0, r * 0.35, r * 0.85, 0, TAU);
      ctx.fill();
      ink(ctx, r, 0.1);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      const sp: [number, number][] = [];
      for (let s = 0; s < 10; s++) {
        const a = (s / 10) * TAU - Math.PI / 2;
        const rad = s % 2 ? r * 0.18 : r * 0.42;
        sp.push([Math.cos(a) * rad, r * 0.35 + Math.sin(a) * rad]);
      }
      ctx.beginPath();
      sp.forEach((p, k) => (k === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "flame": {
      ctx.beginPath();
      ctx.moveTo(0, r * 1.2);
      ctx.bezierCurveTo(-r * 1.05, r * 0.6, -r * 0.5, -r * 0.4, -r * 0.05, -r * 1.25);
      ctx.bezierCurveTo(r * 0.05, -r * 0.6, r * 0.6, -r * 0.65, r * 0.35, -r * 0.05);
      ctx.bezierCurveTo(r * 0.75, -r * 0.2, r * 0.95, r * 0.6, 0, r * 1.2);
      ctx.closePath();
      ctx.fill();
      ink(ctx, r, 0.09);
      ctx.stroke();
      ctx.fillStyle = `hsl(${hue} 95% 82%)`;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.8);
      ctx.bezierCurveTo(-r * 0.4, r * 0.35, -r * 0.15, -r * 0.3, r * 0.06, -r * 0.6);
      ctx.bezierCurveTo(r * 0.12, -r * 0.2, r * 0.42, r * 0.4, 0, r * 0.8);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "bolt": {
      poly(ctx, [[r * 0.2, -r * 1.3], [-r * 0.55, r * 0.15], [-r * 0.02, r * 0.15], [-r * 0.25, r * 1.3], [r * 0.6, -r * 0.2], [r * 0.05, -r * 0.2]], r);
      break;
    }
    case "burst": {
      const pts: [number, number][] = [];
      for (let s = 0; s < 16; s++) {
        const a = (s / 16) * TAU;
        const rad = s % 2 ? r * 0.5 : r * 1.35;
        pts.push([Math.cos(a) * rad, Math.sin(a) * rad]);
      }
      poly(ctx, pts, r);
      break;
    }
    case "pod": {
      ctx.beginPath();
      ctx.rect(-r * 0.95, -r * 0.5, r * 1.9, r * 1.5);
      ctx.fill();
      ink(ctx, r, 0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(-r * 1.05, -r * 0.75, r * 2.1, r * 0.45);
      ctx.fillStyle = `hsl(${hue} 82% 60%)`;
      ctx.fill();
      ink(ctx, r, 0.1);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = r * 0.16;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.75);
      ctx.lineTo(0, r * 1.0);
      ctx.stroke();
      break;
    }
    case "satellite": {
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.55, r * 0.42, 0, 0, TAU);
      ctx.fill();
      ink(ctx, r, 0.1);
      ctx.stroke();
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.rect(s * r * 0.55, -r * 0.55, s * r * 0.75, r * 1.1);
        ctx.fillStyle = `hsl(${hue} 70% 55%)`;
        ctx.fill();
        ink(ctx, r, 0.09);
        ctx.stroke();
        setF();
      }
      break;
    }
    case "compass": {
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.2, 0, TAU);
      ctx.fillStyle = `hsl(${hue} 30% 25%)`;
      ctx.fill();
      ink(ctx, r, 0.1);
      ctx.stroke();
      setF();
      poly(ctx, [[0, -r * 0.95], [r * 0.32, 0], [0, r * 0.2], [-r * 0.32, 0]], r);
      ctx.fillStyle = "#e6ebf5";
      poly(ctx, [[0, r * 0.95], [r * 0.32, 0], [0, -r * 0.2], [-r * 0.32, 0]], r);
      break;
    }
    case "spiral":
    case "galaxy": {
      ctx.strokeStyle = `hsl(${hue} 85% 66%)`;
      ctx.lineWidth = r * 0.28;
      ctx.lineCap = "round";
      for (const dir of [0, Math.PI]) {
        ctx.beginPath();
        for (let t = 0; t <= 1; t += 0.05) {
          const a = dir + t * 5.2;
          const rad = t * r * 1.3;
          const px = Math.cos(a) * rad;
          const py = Math.sin(a) * rad;
          t === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.2, 0, TAU);
      ctx.fill();
      break;
    }
    case "castle": {
      ctx.beginPath();
      ctx.rect(-r * 1.0, -r * 0.4, r * 2.0, r * 1.4);
      ctx.fill();
      ink(ctx, r, 0.09);
      ctx.stroke();
      for (let s = -2; s <= 2; s++) {
        ctx.beginPath();
        ctx.rect(s * r * 0.42 - r * 0.16, -r * 0.85, r * 0.32, r * 0.5);
        ctx.fill();
        ink(ctx, r, 0.08);
        ctx.stroke();
      }
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.rect(-r * 0.24, r * 0.35, r * 0.48, r * 0.65);
      ctx.fill();
      break;
    }
    case "target": {
      const rings: [number, string][] = [
        [r * 1.2, `hsl(${hue} 80% 60%)`],
        [r * 0.82, "#f2e6cf"],
        [r * 0.44, `hsl(${hue} 80% 60%)`],
      ];
      for (const [rad, col] of rings) {
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, TAU);
        ctx.fillStyle = col;
        ctx.fill();
        ink(ctx, r, 0.07);
        ctx.stroke();
      }
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.14, 0, TAU);
      ctx.fill();
      break;
    }
    case "monolith": {
      poly(ctx, [[-r * 0.55, r * 1.25], [-r * 0.72, -r * 0.7], [0, -r * 1.3], [r * 0.72, -r * 0.7], [r * 0.55, r * 1.25]], r);
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(-r * 0.22, -r * 0.35, r * 0.14, 0, TAU);
      ctx.arc(r * 0.22, -r * 0.35, r * 0.14, 0, TAU);
      ctx.fill();
      break;
    }
    case "infinity": {
      ctx.strokeStyle = `hsl(${hue} 85% 64%)`;
      ctx.lineWidth = r * 0.34;
      ctx.beginPath();
      ctx.arc(-r * 0.6, 0, r * 0.6, 0, TAU);
      ctx.arc(r * 0.6, 0, r * 0.6, 0, TAU);
      ctx.stroke();
      ink(ctx, r, 0.08);
      ctx.stroke();
      break;
    }
    case "puzzle": {
      ctx.beginPath();
      ctx.rect(-r * 1.0, -r * 1.0, r * 2.0, r * 2.0);
      ctx.fill();
      ink(ctx, r, 0.1);
      ctx.stroke();
      ctx.fillStyle = `hsl(${hue} 40% 30%)`;
      ctx.beginPath();
      ctx.arc(0, -r * 1.0, r * 0.38, 0, TAU);
      ctx.arc(r * 1.0, 0, r * 0.38, 0, TAU);
      ctx.fill();
      break;
    }
    case "cart": {
      ctx.strokeStyle = `hsl(${hue} 85% 64%)`;
      ctx.lineWidth = r * 0.2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-r * 1.1, -r * 0.9);
      ctx.lineTo(-r * 0.7, -r * 0.9);
      ctx.lineTo(-r * 0.35, r * 0.5);
      ctx.lineTo(r * 0.95, r * 0.5);
      ctx.lineTo(r * 1.2, -r * 0.4);
      ctx.lineTo(-r * 0.5, -r * 0.4);
      ctx.stroke();
      ctx.fillStyle = `hsl(${hue} 85% 64%)`;
      ctx.beginPath();
      ctx.arc(-r * 0.2, r * 0.95, r * 0.2, 0, TAU);
      ctx.arc(r * 0.75, r * 0.95, r * 0.2, 0, TAU);
      ctx.fill();
      break;
    }
    case "joystick": {
      ctx.beginPath();
      ctx.ellipse(0, r * 0.75, r * 1.0, r * 0.4, 0, 0, TAU);
      ctx.fill();
      ink(ctx, r, 0.1);
      ctx.stroke();
      ctx.lineWidth = r * 0.2;
      ctx.strokeStyle = `hsl(${hue} 30% 30%)`;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.55);
      ctx.lineTo(0, -r * 0.7);
      ctx.stroke();
      ctx.fillStyle = `hsl(${hue} 85% 64%)`;
      ctx.beginPath();
      ctx.arc(0, -r * 0.85, r * 0.4, 0, TAU);
      ctx.fill();
      ink(ctx, r, 0.09);
      ctx.stroke();
      break;
    }
    case "shield": {
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.25);
      ctx.lineTo(r * 1.0, -r * 0.85);
      ctx.lineTo(r * 0.85, r * 0.35);
      ctx.quadraticCurveTo(r * 0.5, r * 1.1, 0, r * 1.35);
      ctx.quadraticCurveTo(-r * 0.5, r * 1.1, -r * 0.85, r * 0.35);
      ctx.lineTo(-r * 1.0, -r * 0.85);
      ctx.closePath();
      ctx.fill();
      ink(ctx, r, 0.1);
      ctx.stroke();
      glint(ctx, -r * 0.3, -r * 0.45, r * 0.24);
      break;
    }
    case "bug": {
      ctx.beginPath();
      ctx.ellipse(0, r * 0.1, r * 0.7, r * 1.05, 0, 0, TAU);
      ctx.fill();
      ink(ctx, r, 0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -r * 0.9, r * 0.45, 0, TAU);
      ctx.fill();
      ink(ctx, r, 0.09);
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = r * 0.11;
      for (const s of [-1, 1])
        for (const yy of [-r * 0.2, r * 0.3, r * 0.8]) {
          ctx.beginPath();
          ctx.moveTo(0, yy);
          ctx.lineTo(s * r * 1.15, yy - r * 0.3);
          ctx.stroke();
        }
      break;
    }
    case "planet": {
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.0, 0, TAU);
      ctx.fill();
      ink(ctx, r, 0.1);
      ctx.stroke();
      ctx.save();
      ctx.rotate(-0.4);
      ctx.strokeStyle = `hsl(${hue} 85% 70%)`;
      ctx.lineWidth = r * 0.18;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.5, r * 0.55, 0, 0, TAU);
      ctx.stroke();
      ctx.restore();
      glint(ctx, -r * 0.3, -r * 0.35, r * 0.22);
      break;
    }
    case "calendar": {
      ctx.beginPath();
      ctx.rect(-r * 1.05, -r * 0.9, r * 2.1, r * 1.9);
      ctx.fill();
      ink(ctx, r, 0.1);
      ctx.stroke();
      ctx.fillStyle = "#e6ebf5";
      ctx.beginPath();
      ctx.rect(-r * 1.05, -r * 0.9, r * 2.1, r * 0.55);
      ctx.fill();
      ink(ctx, r, 0.09);
      ctx.stroke();
      ctx.fillStyle = INK;
      for (let cx = -1; cx <= 1; cx++)
        for (let cy = 0; cy <= 1; cy++) {
          ctx.beginPath();
          ctx.arc(cx * r * 0.6, r * 0.1 + cy * r * 0.5, r * 0.12, 0, TAU);
          ctx.fill();
        }
      break;
    }
    case "people": {
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(s * r * 0.5, -r * 0.4, r * 0.42, 0, TAU);
        ctx.fill();
        ink(ctx, r, 0.09);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(s * r * 0.5, r * 0.9, r * 0.7, Math.PI, 0);
        ctx.fill();
        ink(ctx, r, 0.09);
        ctx.stroke();
      }
      break;
    }
    case "lock": {
      ctx.strokeStyle = `hsl(${hue} 20% 70%)`;
      ctx.lineWidth = r * 0.24;
      ctx.beginPath();
      ctx.arc(0, -r * 0.3, r * 0.55, Math.PI, 0);
      ctx.stroke();
      ctx.fillStyle = `hsl(${hue} 25% 55%)`;
      ctx.beginPath();
      ctx.rect(-r * 0.8, -r * 0.35, r * 1.6, r * 1.25);
      ctx.fill();
      ink(ctx, r, 0.1);
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(0, r * 0.2, r * 0.2, 0, TAU);
      ctx.fill();
      ctx.fillRect(-r * 0.08, r * 0.2, r * 0.16, r * 0.4);
      break;
    }
    case "pause": {
      ctx.beginPath();
      ctx.rect(-r * 0.62, -r * 0.9, r * 0.5, r * 1.8);
      ctx.rect(r * 0.12, -r * 0.9, r * 0.5, r * 1.8);
      ctx.fill();
      ink(ctx, r, 0.1);
      ctx.stroke();
      break;
    }
    default: {
      // Unknown → a simple gem so nothing renders as a broken emoji.
      const pts: [number, number][] = [];
      for (let s = 0; s < 6; s++) {
        const a = (s / 6) * TAU - Math.PI / 2;
        pts.push([Math.cos(a) * r * 1.2, Math.sin(a) * r * 1.3]);
      }
      poly(ctx, pts, r);
    }
  }
  ctx.restore();
}

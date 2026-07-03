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

/**
 * SpriteForge — procedural art baking.
 *
 * Every character in AFTERLIGHT is drawn from code (no image assets), but
 * re-running detailed vector paths for hundreds of entities every frame is
 * wasteful. Instead we "bake" each design once at startup into an offscreen
 * canvas, then the renderer just blits (drawImage) the cached sprite. This is
 * both far prettier (we can afford gradients, rim-light, glow and fine detail)
 * and faster than per-frame path drawing.
 *
 * All sprites are baked centered, at a common design body-radius (`BODY_R`) in a
 * fixed canvas (`CANVAS`), supersampled (`SS`) for crispness. The renderer
 * scales a sprite by `entity.radius / BODY_R`.
 */
import { TAU } from "../../core/math/MathUtils";

export const BODY_R = 30; // design-space body radius every sprite is built around
const CANVAS = 116; // logical sprite canvas (leaves margin for glow/limbs)
const SS = 2; // supersample factor
const C = CANVAS / 2; // centre

export interface Sprite {
  canvas: HTMLCanvasElement;
  /** Body radius in canvas pixels (post-supersample), for scale math. */
  bodyRadius: number;
  /** Half-size of the canvas in logical px (for centering the blit). */
  half: number;
}

type DrawFn = (ctx: CanvasRenderingContext2D) => void;

function makeCanvas(): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = CANVAS * SS;
  cv.height = CANVAS * SS;
  return cv;
}

function bake(draw: DrawFn): Sprite {
  const canvas = makeCanvas();
  const ctx = canvas.getContext("2d")!;
  ctx.scale(SS, SS);
  ctx.translate(C, C); // origin at centre; sprites drawn around (0,0)
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  draw(ctx);
  return { canvas, bodyRadius: BODY_R * SS, half: CANVAS / 2 };
}

/** Build a flat-white silhouette of a baked sprite, for hit-flash overlays. */
function whiteMask(src: Sprite): Sprite {
  const canvas = makeCanvas();
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(src.canvas, 0, 0);
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return { canvas, bodyRadius: src.bodyRadius, half: src.half };
}

// ---- Shared drawing helpers -------------------------------------------------

function hsl(h: number, s: number, l: number, a = 1): string {
  return `hsla(${h} ${s}% ${l}% / ${a})`;
}

/** Soft contact shadow blob (drawn below a creature for grounding). */
function bakeShadow(): Sprite {
  return bake((ctx) => {
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, BODY_R * 1.1);
    g.addColorStop(0, "rgba(0,0,0,0.5)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.save();
    ctx.scale(1, 0.42);
    ctx.beginPath();
    ctx.arc(0, 0, BODY_R * 1.1, 0, TAU);
    ctx.fill();
    ctx.restore();
  });
}

/** Outer glow aura used by several creatures and the player. */
function glow(ctx: CanvasRenderingContext2D, r: number, hue: number, strength: number) {
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  g.addColorStop(0, hsl(hue, 90, 65, strength));
  g.addColorStop(1, hsl(hue, 90, 60, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();
}

function eye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, hue: number) {
  ctx.save();
  ctx.shadowColor = hsl(hue, 100, 70, 1);
  ctx.shadowBlur = 8;
  ctx.fillStyle = hsl(hue, 100, 85, 1);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x, y, r * 0.45, 0, TAU);
  ctx.fill();
  ctx.restore();
}

// ---- The Warden (player) ----------------------------------------------------

/**
 * The Guardian — a sleek light-fighter starship. Drawn nose-up (−Y); the
 * renderer rotates it toward the direction of travel. Built from layered hull,
 * swept wings, glowing engines and a luminous cockpit.
 */
function bakeWarden(): Sprite {
  return bake((ctx) => {
    glow(ctx, BODY_R * 1.9, 215, 0.4);

    // Engine exhaust glow (behind the ship, additive).
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const ex = ctx.createRadialGradient(0, BODY_R * 0.95, 0, 0, BODY_R * 0.95, BODY_R * 0.7);
    ex.addColorStop(0, hsl(195, 100, 75, 0.9));
    ex.addColorStop(1, hsl(210, 100, 60, 0));
    ctx.fillStyle = ex;
    ctx.beginPath();
    ctx.ellipse(0, BODY_R * 0.95, BODY_R * 0.42, BODY_R * 0.75, 0, 0, TAU);
    ctx.fill();
    ctx.restore();

    // Swept wings (drawn first, behind the fuselage).
    const wing = ctx.createLinearGradient(-BODY_R, 0, BODY_R, 0);
    wing.addColorStop(0, hsl(225, 55, 52));
    wing.addColorStop(0.5, hsl(220, 60, 70));
    wing.addColorStop(1, hsl(225, 55, 52));
    ctx.fillStyle = wing;
    ctx.strokeStyle = hsl(205, 90, 80, 0.9);
    ctx.lineWidth = 1.6;
    // Left wing.
    ctx.beginPath();
    ctx.moveTo(-BODY_R * 0.16, -BODY_R * 0.1);
    ctx.lineTo(-BODY_R * 1.0, BODY_R * 0.62);
    ctx.lineTo(-BODY_R * 0.62, BODY_R * 0.78);
    ctx.lineTo(-BODY_R * 0.14, BODY_R * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Right wing (mirror).
    ctx.beginPath();
    ctx.moveTo(BODY_R * 0.16, -BODY_R * 0.1);
    ctx.lineTo(BODY_R * 1.0, BODY_R * 0.62);
    ctx.lineTo(BODY_R * 0.62, BODY_R * 0.78);
    ctx.lineTo(BODY_R * 0.14, BODY_R * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Fuselage — a sleek dart from nose (−Y) to tail (+Y).
    const hull = ctx.createLinearGradient(0, -BODY_R, 0, BODY_R);
    hull.addColorStop(0, "#ffffff");
    hull.addColorStop(0.35, hsl(210, 95, 86));
    hull.addColorStop(1, hsl(228, 70, 52));
    ctx.fillStyle = hull;
    ctx.strokeStyle = hsl(205, 95, 88, 0.95);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -BODY_R * 1.05); // nose
    ctx.quadraticCurveTo(BODY_R * 0.34, -BODY_R * 0.2, BODY_R * 0.3, BODY_R * 0.7);
    ctx.quadraticCurveTo(BODY_R * 0.22, BODY_R * 0.95, 0, BODY_R * 0.92); // tail
    ctx.quadraticCurveTo(-BODY_R * 0.22, BODY_R * 0.95, -BODY_R * 0.3, BODY_R * 0.7);
    ctx.quadraticCurveTo(-BODY_R * 0.34, -BODY_R * 0.2, 0, -BODY_R * 1.05);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Hull ridge highlight.
    ctx.strokeStyle = hsl(200, 100, 95, 0.7);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -BODY_R * 0.9);
    ctx.lineTo(0, BODY_R * 0.5);
    ctx.stroke();

    // Glowing cockpit canopy near the nose.
    ctx.save();
    ctx.shadowColor = "#dff0ff";
    ctx.shadowBlur = 12;
    const cock = ctx.createLinearGradient(0, -BODY_R * 0.5, 0, BODY_R * 0.1);
    cock.addColorStop(0, "#ffffff");
    cock.addColorStop(1, hsl(195, 100, 70));
    ctx.fillStyle = cock;
    ctx.beginPath();
    ctx.ellipse(0, -BODY_R * 0.28, BODY_R * 0.16, BODY_R * 0.3, 0, 0, TAU);
    ctx.fill();
    ctx.restore();

    // Twin engine nozzles at the tail.
    ctx.fillStyle = hsl(210, 60, 40);
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(sx * BODY_R * 0.16, BODY_R * 0.82, BODY_R * 0.09, BODY_R * 0.14, 0, 0, TAU);
      ctx.fill();
    }
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = hsl(190, 100, 80, 0.95);
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(sx * BODY_R * 0.16, BODY_R * 0.82, BODY_R * 0.06, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  });
}

// ---- Hollow (enemies) -------------------------------------------------------

/** Drifter — a hooded wraith with a tattered cloak and a single eye. */
function bakeDrifter(hue: number): Sprite {
  return bake((ctx) => {
    glow(ctx, BODY_R * 1.3, hue, 0.18);
    const g = ctx.createLinearGradient(0, -BODY_R, 0, BODY_R);
    g.addColorStop(0, hsl(hue, 55, 42));
    g.addColorStop(1, hsl(hue, 60, 16));
    ctx.fillStyle = g;
    ctx.strokeStyle = hsl(hue, 70, 60, 0.8);
    ctx.lineWidth = 2;
    // Cloak: rounded hood top, tattered triple-pointed hem.
    ctx.beginPath();
    ctx.moveTo(-BODY_R * 0.78, BODY_R * 0.2);
    ctx.quadraticCurveTo(-BODY_R * 0.95, -BODY_R * 0.9, 0, -BODY_R * 0.98);
    ctx.quadraticCurveTo(BODY_R * 0.95, -BODY_R * 0.9, BODY_R * 0.78, BODY_R * 0.2);
    ctx.lineTo(BODY_R * 0.78, BODY_R * 0.55);
    ctx.lineTo(BODY_R * 0.45, BODY_R * 0.95);
    ctx.lineTo(BODY_R * 0.2, BODY_R * 0.55);
    ctx.lineTo(0, BODY_R * 1.0);
    ctx.lineTo(-BODY_R * 0.2, BODY_R * 0.55);
    ctx.lineTo(-BODY_R * 0.45, BODY_R * 0.95);
    ctx.lineTo(-BODY_R * 0.78, BODY_R * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Dark hood cavity + eye.
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.ellipse(0, -BODY_R * 0.25, BODY_R * 0.42, BODY_R * 0.5, 0, 0, TAU);
    ctx.fill();
    eye(ctx, 0, -BODY_R * 0.25, BODY_R * 0.16, hue + 20);
  });
}

/** Mote — a small darting spark: diamond core with four spikes. */
function bakeMote(hue: number): Sprite {
  return bake((ctx) => {
    glow(ctx, BODY_R * 1.1, hue, 0.3);
    ctx.fillStyle = hsl(hue, 80, 55);
    ctx.strokeStyle = hsl(hue, 90, 75, 0.9);
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const rr = i % 2 === 0 ? BODY_R * 0.95 : BODY_R * 0.34;
      const a = (i / 8) * TAU;
      const px = Math.cos(a) * rr;
      const py = Math.sin(a) * rr;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.shadowColor = hsl(hue, 100, 80, 1);
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, BODY_R * 0.22, 0, TAU);
    ctx.fill();
    ctx.restore();
  });
}

/** Husk — a bulky armored brute with glowing cracks and two eyes. */
function bakeHusk(hue: number): Sprite {
  return bake((ctx) => {
    glow(ctx, BODY_R * 1.25, hue, 0.16);
    const g = ctx.createLinearGradient(0, -BODY_R, 0, BODY_R);
    g.addColorStop(0, hsl(hue, 45, 38));
    g.addColorStop(1, hsl(hue, 55, 14));
    ctx.fillStyle = g;
    ctx.strokeStyle = hsl(hue, 60, 50, 0.9);
    ctx.lineWidth = 3;
    // Chunky rounded heptagon.
    ctx.beginPath();
    const n = 7;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i / n) * TAU;
      const rr = BODY_R * (0.92 + 0.06 * Math.sin(i * 3));
      const px = Math.cos(a) * rr;
      const py = Math.sin(a) * rr;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Glowing cracks.
    ctx.strokeStyle = hsl(hue + 10, 100, 65, 0.9);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-BODY_R * 0.1, -BODY_R * 0.7);
    ctx.lineTo(BODY_R * 0.05, -BODY_R * 0.1);
    ctx.lineTo(-BODY_R * 0.25, BODY_R * 0.2);
    ctx.lineTo(BODY_R * 0.1, BODY_R * 0.7);
    ctx.stroke();
    eye(ctx, -BODY_R * 0.32, -BODY_R * 0.12, BODY_R * 0.13, hue + 15);
    eye(ctx, BODY_R * 0.32, -BODY_R * 0.12, BODY_R * 0.13, hue + 15);
  });
}

/** Lunger — a sleek predator: a swept arrowhead with fins and one eye. */
function bakeLunger(hue: number): Sprite {
  return bake((ctx) => {
    glow(ctx, BODY_R * 1.15, hue, 0.22);
    const g = ctx.createLinearGradient(0, -BODY_R, 0, BODY_R);
    g.addColorStop(0, hsl(hue, 75, 58));
    g.addColorStop(1, hsl(hue, 80, 24));
    ctx.fillStyle = g;
    ctx.strokeStyle = hsl(hue, 90, 72, 0.9);
    ctx.lineWidth = 2;
    // Arrowhead pointing up, swept-back fins.
    ctx.beginPath();
    ctx.moveTo(0, -BODY_R * 1.0);
    ctx.quadraticCurveTo(BODY_R * 0.5, -BODY_R * 0.1, BODY_R * 0.95, BODY_R * 0.45);
    ctx.lineTo(BODY_R * 0.3, BODY_R * 0.3);
    ctx.lineTo(0, BODY_R * 0.95);
    ctx.lineTo(-BODY_R * 0.3, BODY_R * 0.3);
    ctx.lineTo(-BODY_R * 0.95, BODY_R * 0.45);
    ctx.quadraticCurveTo(-BODY_R * 0.5, -BODY_R * 0.1, 0, -BODY_R * 1.0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    eye(ctx, 0, -BODY_R * 0.3, BODY_R * 0.15, hue + 25);
  });
}

/** Wisp — an ethereal jellyfish: soft dome head with wavy tendrils. */
function bakeWisp(hue: number): Sprite {
  return bake((ctx) => {
    glow(ctx, BODY_R * 1.4, hue, 0.3);
    // Tendrils.
    ctx.strokeStyle = hsl(hue, 80, 60, 0.8);
    ctx.lineWidth = 2.5;
    for (let i = -2; i <= 2; i++) {
      const x = i * BODY_R * 0.28;
      ctx.beginPath();
      ctx.moveTo(x, BODY_R * 0.1);
      ctx.quadraticCurveTo(x + BODY_R * 0.18, BODY_R * 0.6, x, BODY_R * 1.0);
      ctx.stroke();
    }
    // Translucent dome.
    const g = ctx.createRadialGradient(0, -BODY_R * 0.2, BODY_R * 0.1, 0, 0, BODY_R);
    g.addColorStop(0, hsl(hue, 90, 80, 0.95));
    g.addColorStop(1, hsl(hue, 80, 45, 0.65));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, -BODY_R * 0.05, BODY_R * 0.78, Math.PI, TAU);
    ctx.closePath();
    ctx.fill();
    eye(ctx, 0, -BODY_R * 0.2, BODY_R * 0.14, hue + 30);
  });
}

/** Caster — a robed sorcerer with a hooded head and a glowing orb. */
function bakeCaster(hue: number): Sprite {
  return bake((ctx) => {
    glow(ctx, BODY_R * 1.25, hue, 0.2);
    const g = ctx.createLinearGradient(0, -BODY_R, 0, BODY_R);
    g.addColorStop(0, hsl(hue, 60, 40));
    g.addColorStop(1, hsl(hue, 70, 16));
    ctx.fillStyle = g;
    ctx.strokeStyle = hsl(hue, 80, 62, 0.85);
    ctx.lineWidth = 2;
    // Robe (wide triangular base) + pointed hood.
    ctx.beginPath();
    ctx.moveTo(0, -BODY_R * 1.0);
    ctx.lineTo(BODY_R * 0.42, -BODY_R * 0.35);
    ctx.lineTo(BODY_R * 0.92, BODY_R * 0.95);
    ctx.quadraticCurveTo(0, BODY_R * 0.7, -BODY_R * 0.92, BODY_R * 0.95);
    ctx.lineTo(-BODY_R * 0.42, -BODY_R * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Hood cavity.
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.ellipse(0, -BODY_R * 0.45, BODY_R * 0.22, BODY_R * 0.32, 0, 0, TAU);
    ctx.fill();
    eye(ctx, 0, -BODY_R * 0.45, BODY_R * 0.1, hue + 20);
    // Floating orb the caster channels.
    ctx.save();
    ctx.shadowColor = hsl(hue + 20, 100, 70, 1);
    ctx.shadowBlur = 12;
    ctx.fillStyle = hsl(hue + 20, 100, 75, 1);
    ctx.beginPath();
    ctx.arc(BODY_R * 0.55, BODY_R * 0.1, BODY_R * 0.18, 0, TAU);
    ctx.fill();
    ctx.restore();
  });
}

/** Spore — a bulbous, lumpy sac that bursts on death; glowing pods. */
function bakeSpore(hue: number): Sprite {
  return bake((ctx) => {
    glow(ctx, BODY_R * 1.3, hue, 0.18);
    const g = ctx.createRadialGradient(-BODY_R * 0.2, -BODY_R * 0.2, BODY_R * 0.2, 0, 0, BODY_R);
    g.addColorStop(0, hsl(hue, 55, 45));
    g.addColorStop(1, hsl(hue, 65, 20));
    ctx.fillStyle = g;
    ctx.strokeStyle = hsl(hue, 70, 58, 0.85);
    ctx.lineWidth = 2;
    // Lumpy blob: a circle perturbed by low-frequency bumps.
    ctx.beginPath();
    const n = 14;
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * TAU;
      const rr = BODY_R * (0.82 + 0.16 * Math.sin(a * 3) + 0.06 * Math.cos(a * 5));
      const px = Math.cos(a) * rr;
      const py = Math.sin(a) * rr;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Glowing pods (the seeds that will burst out).
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * TAU + 0.6;
      const px = Math.cos(a) * BODY_R * 0.4;
      const py = Math.sin(a) * BODY_R * 0.4;
      ctx.save();
      ctx.shadowColor = hsl(hue + 10, 100, 70, 1);
      ctx.shadowBlur = 8;
      ctx.fillStyle = hsl(hue + 10, 100, 72, 1);
      ctx.beginPath();
      ctx.arc(px, py, BODY_R * 0.13, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
    eye(ctx, 0, -BODY_R * 0.05, BODY_R * 0.14, hue + 20);
  });
}

/** Sporeling — a tiny, fast spiked seed. */
function bakeSporeling(hue: number): Sprite {
  return bake((ctx) => {
    glow(ctx, BODY_R * 0.9, hue, 0.25);
    ctx.fillStyle = hsl(hue, 70, 50);
    ctx.strokeStyle = hsl(hue, 85, 68, 0.9);
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 === 0 ? BODY_R * 0.85 : BODY_R * 0.45;
      const a = (i / 10) * TAU;
      const px = Math.cos(a) * rr;
      const py = Math.sin(a) * rr;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.shadowColor = hsl(hue + 10, 100, 75, 1);
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, BODY_R * 0.2, 0, TAU);
    ctx.fill();
    ctx.restore();
  });
}

/** The Maw (boss) — a roiling spiked mass with a great central eye. */
function bakeMaw(hue: number): Sprite {
  return bake((ctx) => {
    glow(ctx, BODY_R * 1.7, hue, 0.4);
    const g = ctx.createRadialGradient(0, -BODY_R * 0.2, BODY_R * 0.2, 0, 0, BODY_R);
    g.addColorStop(0, hsl(hue, 55, 32));
    g.addColorStop(1, hsl(hue, 65, 12));
    ctx.fillStyle = g;
    ctx.strokeStyle = hsl(hue, 85, 65, 0.9);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const spikes = 12;
    for (let i = 0; i < spikes * 2; i++) {
      const rr = i % 2 === 0 ? BODY_R * 0.98 : BODY_R * 0.66;
      const a = (i / (spikes * 2)) * TAU;
      const px = Math.cos(a) * rr;
      const py = Math.sin(a) * rr;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Inner maw ring.
    ctx.strokeStyle = hsl(hue, 90, 60, 0.6);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, BODY_R * 0.5, 0, TAU);
    ctx.stroke();
    // Great eye.
    eye(ctx, 0, 0, BODY_R * 0.26, hue + 25);
  });
}

/** The Choir (boss) — a hovering ring studded with glowing eyes. */
function bakeChoir(hue: number): Sprite {
  return bake((ctx) => {
    glow(ctx, BODY_R * 1.7, hue, 0.4);
    // Thick dark annulus with a rim-light.
    ctx.lineWidth = BODY_R * 0.42;
    const ringR = BODY_R * 0.74;
    const rg = ctx.createLinearGradient(0, -ringR, 0, ringR);
    rg.addColorStop(0, hsl(hue, 60, 42));
    rg.addColorStop(1, hsl(hue, 70, 16));
    ctx.strokeStyle = rg;
    ctx.beginPath();
    ctx.arc(0, 0, ringR, 0, TAU);
    ctx.stroke();
    // Outer rim highlight.
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = hsl(hue, 90, 70, 0.8);
    ctx.beginPath();
    ctx.arc(0, 0, ringR + BODY_R * 0.21, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, ringR - BODY_R * 0.21, 0, TAU);
    ctx.stroke();
    // A chorus of eyes around the ring.
    const eyes = 6;
    for (let i = 0; i < eyes; i++) {
      const a = (i / eyes) * TAU;
      eye(ctx, Math.cos(a) * ringR, Math.sin(a) * ringR, BODY_R * 0.13, hue + 18);
    }
    // Central void with a faint singing glow.
    const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, BODY_R * 0.42);
    cg.addColorStop(0, hsl(hue, 100, 70, 0.5));
    cg.addColorStop(1, hsl(hue, 100, 60, 0));
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(0, 0, BODY_R * 0.42, 0, TAU);
    ctx.fill();
  });
}

// ---- Pickups ----------------------------------------------------------------

function bakeXpShard(): Sprite {
  return bake((ctx) => {
    glow(ctx, BODY_R * 0.9, 150, 0.4);
    const g = ctx.createLinearGradient(0, -BODY_R * 0.7, 0, BODY_R * 0.7);
    g.addColorStop(0, "#d6fff0");
    g.addColorStop(1, hsl(155, 90, 55));
    ctx.fillStyle = g;
    ctx.strokeStyle = hsl(150, 100, 80, 0.9);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -BODY_R * 0.7);
    ctx.lineTo(BODY_R * 0.42, 0);
    ctx.lineTo(0, BODY_R * 0.7);
    ctx.lineTo(-BODY_R * 0.42, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
}

function bakeBauble(hue: number, glyph: string): Sprite {
  return bake((ctx) => {
    glow(ctx, BODY_R, hue, 0.5);
    const g = ctx.createRadialGradient(-BODY_R * 0.2, -BODY_R * 0.2, BODY_R * 0.1, 0, 0, BODY_R * 0.7);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(1, hsl(hue, 90, 55));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, BODY_R * 0.62, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(10,10,30,0.85)";
    ctx.font = `bold ${BODY_R * 0.8}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(glyph, 0, BODY_R * 0.04);
  });
}

// ---- Registry ---------------------------------------------------------------

export class SpriteForge {
  readonly warden: Sprite;
  readonly shadow: Sprite;
  private readonly bosses = new Map<string, Sprite>();
  private readonly bossFlashes = new Map<string, Sprite>();
  private readonly enemies = new Map<string, Sprite>();
  private readonly enemyFlash = new Map<string, Sprite>();
  private readonly pickups = new Map<string, Sprite>();

  constructor() {
    this.warden = bakeWarden();
    this.shadow = bakeShadow();

    // Boss sprites, keyed by boss id.
    const bossBakers: Record<string, (hue: number) => Sprite> = {
      theMaw: bakeMaw,
      theChoir: bakeChoir,
      // Ember bosses reuse the two silhouettes with fiery hues.
      thePyre: bakeChoir,
      theForge: bakeMaw,
      // Hollow Deep bosses reuse them with icy hues.
      theRime: bakeChoir,
      theNadir: bakeMaw,
      // The Sovereign (Fade) — void hue fallback.
      theSovereign: bakeMaw,
    };
    const bossHues: Record<string, number> = {
      theMaw: 292,
      theChoir: 196,
      thePyre: 18,
      theForge: 6,
      theRime: 195,
      theNadir: 210,
      theSovereign: 270,
    };
    for (const id of Object.keys(bossBakers)) {
      const s = bossBakers[id](bossHues[id]);
      this.bosses.set(id, s);
      this.bossFlashes.set(id, whiteMask(s));
    }

    const defs: Record<string, (hue: number) => Sprite> = {
      drifter: bakeDrifter,
      mote: bakeMote,
      husk: bakeHusk,
      lunger: bakeLunger,
      wisp: bakeWisp,
      caster: bakeCaster,
      spore: bakeSpore,
      sporeling: bakeSporeling,
      // Ember Wastes natives reuse fitting silhouettes with hot hues.
      cinder: bakeLunger,
      revenant: bakeCaster,
      // Hollow Deep natives reuse fitting silhouettes with cold hues.
      shard: bakeMote,
      colossus: bakeHusk,
      // Fade additions — violet fallbacks.
      seer: bakeWisp,
      lancer: bakeLunger,
    };
    const hues: Record<string, number> = {
      drifter: 280,
      mote: 200,
      husk: 24,
      lunger: 340,
      wisp: 160,
      caster: 320,
      spore: 95,
      sporeling: 85,
      cinder: 18,
      revenant: 6,
      shard: 195,
      colossus: 210,
      seer: 265,
      lancer: 285,
    };
    for (const id of Object.keys(defs)) {
      const s = defs[id](hues[id]);
      this.enemies.set(id, s);
      this.enemyFlash.set(id, whiteMask(s));
    }

    this.pickups.set("xp", bakeXpShard());
    this.pickups.set("heal", bakeBauble(140, "+"));
    this.pickups.set("magnet", bakeBauble(280, "✦"));
    this.pickups.set("bomb", bakeBauble(18, "✸"));
    this.pickups.set("pod", bakeBauble(45, "▣"));
  }

  enemy(typeId: string): Sprite {
    return this.enemies.get(typeId) ?? this.enemies.get("drifter")!;
  }
  enemyWhite(typeId: string): Sprite {
    return this.enemyFlash.get(typeId) ?? this.enemyFlash.get("drifter")!;
  }
  bossSprite(id: string): Sprite {
    return this.bosses.get(id) ?? this.bosses.get("theMaw")!;
  }
  bossWhite(id: string): Sprite {
    return this.bossFlashes.get(id) ?? this.bossFlashes.get("theMaw")!;
  }
  pickup(kind: string): Sprite {
    return this.pickups.get(kind) ?? this.pickups.get("xp")!;
  }
}

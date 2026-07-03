/**
 * Layered, atmospheric backdrop — replaces the flat dotted void.
 *
 * Composition (back to front):
 *   1. A baked "deep space" tile: vertical base gradient + drifting nebula
 *      clouds + a parallax starfield. Baked once, then tiled with wrap +
 *      parallax so it scrolls subtly as the camera moves.
 *   2. A couple of large, slowly drifting fog blobs (cheap, drawn live).
 *   3. A faint energy grid for spatial reference.
 *
 * The vignette + edge "corruption" haze are drawn by the renderer *after* the
 * world, so they sit on top of gameplay.
 */
import { Rng } from "../../core/math/Rng";
import { TAU } from "../../core/math/MathUtils";
import { STAGE_DEFS, type StagePalette } from "../data/stageDefs";

const TILE = 1024;
/** Distant-landmark layer tile — larger + sparser than the star tile. */
const LTILE = 1600;

/** Stable 32-bit hash of a string → a per-galaxy sky seed. */
function hashSeed(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) || 1;
}

export class Background {
  private tile: HTMLCanvasElement;
  /** Slow-parallax layer of distant planets — varies per galaxy for depth. */
  private landmarks: HTMLCanvasElement;
  private vignette: HTMLCanvasElement | null = null;
  private vigW = 0;
  private vigH = 0;
  /** Which palette the baked tile currently reflects (rebake only on change). */
  private paletteId = "fade";
  private fogHue = STAGE_DEFS.fade.palette.fogHue;

  constructor() {
    this.tile = this.bakeTile(STAGE_DEFS.fade.palette, hashSeed("fade"));
    this.landmarks = this.bakeLandmarks(STAGE_DEFS.fade.palette, hashSeed("fade"));
  }

  /**
   * Switch the backdrop to a stage's palette, rebaking the sky tile only when
   * the stage actually changes (cheap to call every frame). The bake seed is
   * derived from the id, so every Galaxy gets a genuinely distinct star and
   * planet layout — not just the same sky recoloured.
   */
  setStage(id: string, palette: StagePalette): void {
    if (id === this.paletteId) return;
    this.paletteId = id;
    this.fogHue = palette.fogHue;
    const seed = hashSeed(id);
    this.tile = this.bakeTile(palette, seed);
    this.landmarks = this.bakeLandmarks(palette, seed);
  }

  /**
   * Bake 1–3 distant celestial bodies (soft gradient discs with a rim light and
   * an occasional ring) onto a large transparent tile, positioned from the
   * seed. Tiled at a slower parallax than the stars so they read as far away.
   */
  private bakeLandmarks(palette: StagePalette, seed: number): HTMLCanvasElement {
    const cv = document.createElement("canvas");
    cv.width = LTILE;
    cv.height = LTILE;
    const ctx = cv.getContext("2d")!;
    const rng = new Rng(seed ^ 0x9e37);
    const hues = palette.nebulaHues;
    const count = 1 + Math.floor(rng.range(0, 2.99)); // 1–3 planets
    for (let i = 0; i < count; i++) {
      const x = rng.range(LTILE * 0.15, LTILE * 0.85);
      const y = rng.range(LTILE * 0.15, LTILE * 0.85);
      const r = rng.range(70, 165);
      const hue = hues[Math.floor(rng.range(0, hues.length))];
      const lightAng = rng.range(0, TAU);

      // Soft atmosphere halo.
      ctx.globalCompositeOperation = "lighter";
      const halo = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 1.9);
      halo.addColorStop(0, `hsla(${hue} 65% 55% / 0.16)`);
      halo.addColorStop(1, `hsla(${hue} 65% 55% / 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.9, 0, TAU);
      ctx.fill();

      // Planet body: dark base + a directional rim light (lit from lightAng).
      ctx.globalCompositeOperation = "source-over";
      const lx = x + Math.cos(lightAng) * r * 0.4;
      const ly = y + Math.sin(lightAng) * r * 0.4;
      const body = ctx.createRadialGradient(lx, ly, r * 0.15, x, y, r);
      body.addColorStop(0, `hsla(${hue} 45% 32% / 0.95)`);
      body.addColorStop(0.7, `hsla(${hue} 55% 15% / 0.95)`);
      body.addColorStop(1, `hsla(${hue} 60% 8% / 0.9)`);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();

      // Crescent rim light.
      ctx.globalCompositeOperation = "lighter";
      const rim = ctx.createRadialGradient(lx, ly, r * 0.2, lx, ly, r * 1.25);
      rim.addColorStop(0, `hsla(${(hue + 20) % 360} 80% 70% / 0.5)`);
      rim.addColorStop(1, `hsla(${hue} 80% 60% / 0)`);
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.clip();
      ctx.fillStyle = rim;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
      ctx.restore();

      // Occasional ring.
      if (rng.range(0, 1) > 0.62) {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = `hsla(${hue} 60% 65% / 0.28)`;
        ctx.lineWidth = rng.range(3, 7);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rng.range(-0.6, 0.6));
        ctx.scale(1, rng.range(0.28, 0.42));
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.6, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.globalCompositeOperation = "source-over";
    return cv;
  }

  private bakeTile(palette: StagePalette, seed: number): HTMLCanvasElement {
    const cv = document.createElement("canvas");
    cv.width = TILE;
    cv.height = TILE;
    const ctx = cv.getContext("2d")!;
    const rng = new Rng(seed); // per-galaxy seed → each Galaxy's sky is distinct

    // Base gradient from the stage palette.
    const base = ctx.createLinearGradient(0, 0, 0, TILE);
    base.addColorStop(0, palette.baseTop);
    base.addColorStop(0.5, palette.baseMid);
    base.addColorStop(1, palette.baseBottom);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, TILE, TILE);

    // Nebula clouds — a handful of big soft radial blobs, additive.
    ctx.globalCompositeOperation = "lighter";
    const hues = palette.nebulaHues;
    for (let i = 0; i < 9; i++) {
      const x = rng.range(0, TILE);
      const y = rng.range(0, TILE);
      const r = rng.range(180, 420);
      const hue = hues[i % hues.length];
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `hsla(${hue} 70% 50% / ${rng.range(0.05, 0.12)})`);
      g.addColorStop(1, `hsla(${hue} 70% 50% / 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }

    // Starfield — many small dots of varied brightness; a few brighter ones
    // get a cross-glint. Tinted to suit the stage.
    const [sr, sg, sb] = palette.starTint.split(",").map((n) => parseInt(n, 10));
    for (let i = 0; i < 460; i++) {
      const x = rng.range(0, TILE);
      const y = rng.range(0, TILE);
      const b = rng.range(0.15, 0.9);
      const s = rng.range(0.4, 1.6);
      ctx.fillStyle = `rgba(${sr + rng.range(0, 30)},${sg + rng.range(0, 30)},${sb},${b})`;
      ctx.beginPath();
      ctx.arc(x, y, s, 0, TAU);
      ctx.fill();
      if (b > 0.78 && s > 1.1) {
        ctx.strokeStyle = `rgba(${sr + 20},${sg + 20},${sb},${b * 0.5})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(x - s * 2.5, y);
        ctx.lineTo(x + s * 2.5, y);
        ctx.moveTo(x, y - s * 2.5);
        ctx.lineTo(x, y + s * 2.5);
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = "source-over";
    return cv;
  }

  /** Rebuild the vignette to match the viewport. */
  resize(width: number, height: number): void {
    if (width === this.vigW && height === this.vigH && this.vignette) return;
    this.vigW = width;
    this.vigH = height;
    const cv = document.createElement("canvas");
    cv.width = Math.max(1, Math.floor(width));
    cv.height = Math.max(1, Math.floor(height));
    const ctx = cv.getContext("2d")!;
    const g = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.35,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75,
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
    this.vignette = cv;
  }

  /** Draw the parallax backdrop. `time` is elapsed seconds for fog drift. */
  draw(
    ctx: CanvasRenderingContext2D,
    camX: number,
    camY: number,
    width: number,
    height: number,
    time: number,
    reduceMotion: boolean,
  ): void {
    // Tiled, wrapped, parallaxed deep-space layer.
    const par = 0.25;
    let ox = (-camX * par) % TILE;
    let oy = (-camY * par) % TILE;
    if (ox > 0) ox -= TILE;
    if (oy > 0) oy -= TILE;
    for (let x = ox; x < width; x += TILE) {
      for (let y = oy; y < height; y += TILE) {
        ctx.drawImage(this.tile, x, y);
      }
    }

    // Distant planets — a slower parallax (0.12) than the stars (0.25) so they
    // sit convincingly far behind the action, and vary per Galaxy.
    const lpar = 0.12;
    let lx = (-camX * lpar) % LTILE;
    let ly = (-camY * lpar) % LTILE;
    if (lx > 0) lx -= LTILE;
    if (ly > 0) ly -= LTILE;
    for (let x = lx; x < width; x += LTILE) {
      for (let y = ly; y < height; y += LTILE) {
        ctx.drawImage(this.landmarks, x, y);
      }
    }

    // Drifting fog blobs (live, additive, cheap).
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const drift = reduceMotion ? 0 : time;
    for (let i = 0; i < 3; i++) {
      const fx =
        width * (0.3 + 0.4 * i) + Math.sin(drift * 0.05 + i * 2) * 120 - camX * 0.12;
      const fy =
        height * (0.4 + 0.2 * i) + Math.cos(drift * 0.04 + i) * 90 - camY * 0.12;
      const fr = 260 + i * 70;
      const hue = this.fogHue + i * 20;
      const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
      g.addColorStop(0, `hsla(${hue} 60% 50% / 0.05)`);
      g.addColorStop(1, `hsla(${hue} 60% 50% / 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(fx, fy, fr, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  /** Draw the vignette over the world. */
  drawVignette(ctx: CanvasRenderingContext2D): void {
    if (this.vignette) ctx.drawImage(this.vignette, 0, 0);
  }
}

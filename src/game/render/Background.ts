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

const TILE = 1024;

export class Background {
  private tile: HTMLCanvasElement;
  private vignette: HTMLCanvasElement | null = null;
  private vigW = 0;
  private vigH = 0;

  constructor() {
    this.tile = this.bakeTile();
  }

  private bakeTile(): HTMLCanvasElement {
    const cv = document.createElement("canvas");
    cv.width = TILE;
    cv.height = TILE;
    const ctx = cv.getContext("2d")!;
    const rng = new Rng(0xa17e); // fixed seed → stable, repeatable sky

    // Base gradient: deep indigo top, near-black bottom.
    const base = ctx.createLinearGradient(0, 0, 0, TILE);
    base.addColorStop(0, "#0a0e24");
    base.addColorStop(0.5, "#070a18");
    base.addColorStop(1, "#04050d");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, TILE, TILE);

    // Nebula clouds — a handful of big soft radial blobs, additive.
    ctx.globalCompositeOperation = "lighter";
    const hues = [230, 265, 200, 290, 180];
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
    // get a cross-glint.
    for (let i = 0; i < 460; i++) {
      const x = rng.range(0, TILE);
      const y = rng.range(0, TILE);
      const b = rng.range(0.15, 0.9);
      const s = rng.range(0.4, 1.6);
      ctx.fillStyle = `rgba(${200 + rng.range(0, 55)},${210 + rng.range(0, 45)},255,${b})`;
      ctx.beginPath();
      ctx.arc(x, y, s, 0, TAU);
      ctx.fill();
      if (b > 0.78 && s > 1.1) {
        ctx.strokeStyle = `rgba(220,230,255,${b * 0.5})`;
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
      const hue = 240 + i * 20;
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

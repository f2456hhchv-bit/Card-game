/**
 * Canvas2D renderer. Owns the canvas, handles high-DPI scaling and resize, and
 * exposes the drawing context plus a handful of batched primitive helpers.
 */
export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  dpr = 1;
  width = 0; // CSS pixels
  height = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("AFTERLIGHT LITE: 2D canvas context unavailable.");
    this.ctx = ctx;
    this.resize();
  }

  /** Match the backing store to the element size and device pixel ratio. */
  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.dpr = dpr;
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || window.innerHeight;
    const bw = Math.round(this.width * dpr);
    const bh = Math.round(this.height * dpr);
    if (this.canvas.width !== bw || this.canvas.height !== bh) {
      this.canvas.width = bw;
      this.canvas.height = bh;
    }
  }

  /** Begin a frame: reset transform to account for DPR and clear. */
  begin(clearColor: string): void {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = clearColor;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}

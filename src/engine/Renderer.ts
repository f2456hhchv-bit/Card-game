/**
 * Canvas2D renderer. Owns the canvas, handles high-DPI scaling and resize, and
 * exposes the drawing context plus a handful of batched primitive helpers.
 *
 * Canvas2D (rather than WebGL) is a deliberate choice: it keeps the codebase
 * approachable, has zero shader/asset pipeline, and — with object pooling and
 * disciplined draw batching — comfortably renders the entity counts this genre
 * needs at 120 FPS. If profiling ever shows fill-rate limits, the renderer is
 * isolated behind this class so a WebGL backend could be slotted in later.
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
    if (!ctx) throw new Error("AFTERLIGHT: 2D canvas context unavailable.");
    this.ctx = ctx;
    this.resize();
  }

  /** Match the backing store to the element size and device pixel ratio. */
  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    // Cap DPR at 2: beyond that the fill-rate cost outweighs visible benefit
    // on the dense scenes this game produces.
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

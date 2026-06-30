/**
 * Post-processing — engine-level visual polish that applies to the whole frame
 * regardless of asset source (so it lifts quality even before production art
 * lands). Canvas2D has no shaders, so effects are built from downscale + blur +
 * composite passes, kept cheap (quarter-res) for high frame rates.
 *
 * Current passes:
 *  - Bloom: bright areas bleed a soft additive glow (the signature "premium"
 *    look on dark, neon-lit scenes like AFTERLIGHT's).
 *  - Colour grade: a very subtle warm-highlight / cool-shadow duotone for a
 *    cinematic, graded tone.
 */
export class PostFx {
  private buf: HTMLCanvasElement | null = null;
  private buf2: HTMLCanvasElement | null = null;
  private bw = 0;
  private bh = 0;

  /** Bloom strength (0 disables). */
  strength = 0.62;
  /** Blur radius in source pixels (applied at quarter res). */
  blur = 7;
  enabled = true;

  private ensure(w: number, h: number): void {
    // Work at quarter resolution — bloom is low-frequency, so this is invisible
    // in quality but ~16× cheaper in fill-rate.
    const qw = Math.max(1, Math.floor(w / 4));
    const qh = Math.max(1, Math.floor(h / 4));
    if (this.buf && this.bw === qw && this.bh === qh) return;
    this.bw = qw;
    this.bh = qh;
    this.buf = document.createElement("canvas");
    this.buf.width = qw;
    this.buf.height = qh;
    this.buf2 = document.createElement("canvas");
    this.buf2.width = qw;
    this.buf2.height = qh;
  }

  /**
   * Apply post-processing to the just-rendered frame. `ctx` is the main context
   * (already at DPR transform); `srcCanvas` is its backing canvas (device px).
   */
  apply(ctx: CanvasRenderingContext2D, srcCanvas: HTMLCanvasElement, dpr: number): void {
    if (!this.enabled || this.strength <= 0) return;
    const dw = srcCanvas.width;
    const dh = srcCanvas.height;
    if (dw === 0 || dh === 0) return;
    this.ensure(dw, dh);
    const buf = this.buf!;
    const buf2 = this.buf2!;
    const bctx = buf.getContext("2d")!;
    const b2ctx = buf2.getContext("2d")!;
    const qw = this.bw;
    const qh = this.bh;

    // 1) Downscale the frame into the buffer.
    bctx.globalCompositeOperation = "source-over";
    bctx.globalAlpha = 1;
    bctx.clearRect(0, 0, qw, qh);
    bctx.drawImage(srcCanvas, 0, 0, dw, dh, 0, 0, qw, qh);

    // 2) Threshold: square the image (multiply by itself) so dark midtones drop
    //    out and only the bright, glowing areas survive to bloom.
    bctx.globalCompositeOperation = "multiply";
    bctx.drawImage(buf, 0, 0);
    bctx.globalCompositeOperation = "source-over";

    // 3) Blur the bright pass into buf2 (via canvas filter where available).
    b2ctx.clearRect(0, 0, qw, qh);
    const filterCtx = b2ctx as CanvasRenderingContext2D & { filter?: string };
    if (typeof filterCtx.filter === "string") {
      filterCtx.filter = `blur(${this.blur}px)`;
      b2ctx.drawImage(buf, 0, 0);
      filterCtx.filter = "none";
    } else {
      // Fallback: a cheap multi-tap smear if ctx.filter is unavailable.
      b2ctx.globalAlpha = 0.5;
      for (const [ox, oy] of [[-2, 0], [2, 0], [0, -2], [0, 2], [0, 0]] as const) {
        b2ctx.drawImage(buf, ox, oy);
      }
      b2ctx.globalAlpha = 1;
    }

    // 4) Composite the glow additively back over the full-res frame.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // device pixels
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = this.strength;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(buf2, 0, 0, qw, qh, 0, 0, dw, dh);

    // 5) Colour grade: a whisper of warm highlight + cool shadow for tone.
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = 0.06;
    const g = ctx.createLinearGradient(0, 0, 0, dh);
    g.addColorStop(0, "#ffd9a8"); // warm top highlight
    g.addColorStop(1, "#0a1e3a"); // cool deep shadow
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, dw, dh);

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.restore();
    // Restore the DPR transform the caller expects.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}

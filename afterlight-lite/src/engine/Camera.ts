/**
 * 2D camera: converts world coordinates to screen coordinates, follows a
 * target smoothly, and supports screen shake for impactful feedback.
 */
import { damp } from "../core/math/MathUtils";

export class Camera {
  /** World-space position the camera is centred on. */
  x = 0;
  y = 0;
  zoom = 1;

  /** Viewport size in CSS pixels (device pixel ratio handled by renderer). */
  viewWidth = 0;
  viewHeight = 0;

  // Zoom-punch state: `zoomTarget` snaps to the punched value then relaxes back
  // to 1, and `zoom` chases the target — a quick cinematic push-in on impacts.
  private zoomTarget = 1;

  // Screen-shake state.
  private shakeTime = 0;
  private shakeDuration = 0;
  private shakeMagnitude = 0;
  private shakeOffsetX = 0;
  private shakeOffsetY = 0;

  setViewport(width: number, height: number): void {
    this.viewWidth = width;
    this.viewHeight = height;
  }

  snapTo(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /** Smoothly chase a world target. Call per simulation step. */
  follow(targetX: number, targetY: number, dt: number): void {
    this.x = damp(this.x, targetX, 12, dt);
    this.y = damp(this.y, targetY, 12, dt);
  }

  /** Add a screen shake; stronger shakes override weaker active ones. */
  addShake(magnitude: number, duration: number): void {
    if (magnitude >= this.shakeMagnitude || this.shakeTime <= 0) {
      this.shakeMagnitude = magnitude;
      this.shakeDuration = duration;
      this.shakeTime = duration;
    }
  }

  /** Kick a cinematic push-in; it eases in then relaxes back to 1× on its own. */
  punchZoom(target: number): void {
    if (target > this.zoomTarget) this.zoomTarget = target;
  }

  /** Advance the zoom spring (call once per rendered frame). */
  updateZoom(dt: number): void {
    this.zoom = damp(this.zoom, this.zoomTarget, 10, dt);
    this.zoomTarget = damp(this.zoomTarget, 1, 2.6, dt);
  }

  updateShake(dt: number, rand: () => number, intensityScale: number): void {
    if (this.shakeTime > 0) {
      this.shakeTime -= dt;
      const t = Math.max(0, this.shakeTime / this.shakeDuration);
      const mag = this.shakeMagnitude * t * t * intensityScale;
      this.shakeOffsetX = (rand() * 2 - 1) * mag;
      this.shakeOffsetY = (rand() * 2 - 1) * mag;
    } else {
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
    }
  }

  get offsetX(): number {
    return this.shakeOffsetX;
  }
  get offsetY(): number {
    return this.shakeOffsetY;
  }

  worldToScreenX(wx: number): number {
    return (wx - this.x) * this.zoom + this.viewWidth * 0.5 + this.shakeOffsetX;
  }
  worldToScreenY(wy: number): number {
    return (wy - this.y) * this.zoom + this.viewHeight * 0.5 + this.shakeOffsetY;
  }
  screenToWorldX(sx: number): number {
    return (sx - this.viewWidth * 0.5) / this.zoom + this.x;
  }
  screenToWorldY(sy: number): number {
    return (sy - this.viewHeight * 0.5) / this.zoom + this.y;
  }

  /** World-space rectangle currently visible, padded by `margin`. */
  getVisibleBounds(margin: number): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } {
    const halfW = this.viewWidth * 0.5 / this.zoom + margin;
    const halfH = this.viewHeight * 0.5 / this.zoom + margin;
    return {
      minX: this.x - halfW,
      minY: this.y - halfH,
      maxX: this.x + halfW,
      maxY: this.y + halfH,
    };
  }
}

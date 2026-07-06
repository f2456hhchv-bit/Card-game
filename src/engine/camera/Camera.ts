/**
 * Top-down orthographic gameplay camera (AF-018). Pure deterministic math:
 * soft follow with predictive look-ahead and a never-outrun lag clamp,
 * locked gameplay zoom with smooth-returning temporary modes, impulse shake
 * with decay + clarity cap + accessibility scale, and world-bounds clamping.
 * No rotation exists — the perspective lock is structural (AF-000).
 */
import type { CameraMode, CameraTuning, ShakeSource } from "./cameraTuning";

export interface WorldBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface CameraSnapshot {
  mode: CameraMode;
  x: number;
  y: number;
  zoom: number;
  targetZoom: number;
  lagDistance: number;
  shakeAmplitude: number;
  shakeOffsetX: number;
  shakeOffsetY: number;
}

export class Camera {
  private mode: CameraMode = "Menu";
  private x = 0;
  private y = 0;
  private zoom: number;
  private targetZoom: number;
  private shakeAmplitude = 0;
  private shakePhase = 0;
  private bounds: WorldBounds | null = null;
  private lastLagDistance = 0;

  /**
   * Accessibility scale for shake, 0–1 (0 = disabled). Set from the
   * disable-shake / reduced-motion / photosensitivity settings.
   */
  shakeScale = 1;

  constructor(
    private readonly tuning: CameraTuning,
    /** Visible world size at zoom 1 (width, height). */
    private viewportWidth: number,
    private viewportHeight: number,
  ) {
    this.zoom = tuning.modes.Menu.zoom;
    this.targetZoom = this.zoom;
  }

  setMode(mode: CameraMode): void {
    this.mode = mode;
    this.targetZoom = this.tuning.modes[mode].zoom;
  }

  setViewport(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  setBounds(bounds: WorldBounds | null): void {
    this.bounds = bounds;
  }

  /** Jump instantly (state entry / respawn). Never used mid-gameplay. */
  snapTo(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.applyBounds();
  }

  shake(source: ShakeSource): void {
    const impulse = this.tuning.shakeAmplitudes[source] * this.shakeScale;
    this.shakeAmplitude = Math.min(
      this.tuning.maxShakeAmplitude,
      this.shakeAmplitude + impulse,
    );
  }

  update(
    fixedDtMs: number,
    targetX: number,
    targetY: number,
    targetVelX = 0,
    targetVelY = 0,
  ): void {
    const dtSeconds = fixedDtMs / 1000;

    if (this.tuning.modes[this.mode].follow) {
      const aheadSeconds = this.tuning.lookAheadMs / 1000;
      const desiredX = targetX + targetVelX * aheadSeconds;
      const desiredY = targetY + targetVelY * aheadSeconds;

      const k = 1 - Math.exp(-this.tuning.followSmoothingPerSecond * dtSeconds);
      this.x += (desiredX - this.x) * k;
      this.y += (desiredY - this.y) * k;

      // Never-outrun clamp: bound the camera's distance from the player
      // (not the look-ahead point — the player is what must stay on screen).
      const dx = this.x - targetX;
      const dy = this.y - targetY;
      const distance = Math.hypot(dx, dy);
      const maxLag = this.tuning.maxLagDistance;
      if (distance > maxLag) {
        const scale = maxLag / distance;
        this.x = targetX + dx * scale;
        this.y = targetY + dy * scale;
      }
      this.lastLagDistance = Math.min(distance, maxLag);
    }

    const zoomK = 1 - Math.exp(-this.tuning.zoomSmoothingPerSecond * dtSeconds);
    this.zoom += (this.targetZoom - this.zoom) * zoomK;

    if (this.shakeAmplitude > 0) {
      this.shakeAmplitude *= Math.exp(-this.tuning.shakeDecayPerSecond * dtSeconds);
      if (this.shakeAmplitude < 0.001) this.shakeAmplitude = 0;
      this.shakePhase += dtSeconds;
    }

    this.applyBounds();
  }

  get snapshot(): CameraSnapshot {
    // Deterministic phase-driven offset — no RNG in the render path.
    const shakeOffsetX = Math.sin(this.shakePhase * 91.7) * this.shakeAmplitude;
    const shakeOffsetY = Math.cos(this.shakePhase * 113.3) * this.shakeAmplitude;
    return {
      mode: this.mode,
      x: this.x,
      y: this.y,
      zoom: this.zoom,
      targetZoom: this.targetZoom,
      lagDistance: this.lastLagDistance,
      shakeAmplitude: this.shakeAmplitude,
      shakeOffsetX,
      shakeOffsetY,
    };
  }

  private applyBounds(): void {
    if (!this.bounds) return;
    const halfWidth = this.viewportWidth / this.zoom / 2;
    const halfHeight = this.viewportHeight / this.zoom / 2;
    this.x = clampAxis(this.x, this.bounds.minX, this.bounds.maxX, halfWidth);
    this.y = clampAxis(this.y, this.bounds.minY, this.bounds.maxY, halfHeight);
  }
}

/** Clamp a camera axis so the view never leaves [min, max]; centre when the
 * world is smaller than the viewport on that axis. */
function clampAxis(value: number, min: number, max: number, halfView: number): number {
  const worldSize = max - min;
  if (worldSize <= halfView * 2) return (min + max) / 2;
  return Math.min(max - halfView, Math.max(min + halfView, value));
}

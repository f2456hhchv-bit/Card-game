/**
 * Hit-stop controller — GP-001 §Game Feel. A brief freeze of gameplay
 * simulation on an impactful moment (a real "hitstop"/"hit-pause"), the same
 * accessibility-scaled-impulse-with-cap shape Camera.ts already established
 * for screen shake (AF-018 §5), applied to simulation time instead of a
 * screen-space offset. Pure: no RNG, no DOM, no bus — the composition root
 * decides when to call `tick()` and what to do with its return value.
 */
import type { HitStopSource, HitStopTuning } from "./hitStopTuning";

export class HitStopController {
  private remainingMs = 0;

  /** Accessibility scale, 0–1 (0 disables hit-stop entirely). Mirrors Camera.shakeScale exactly. */
  intensityScale = 1;

  constructor(private readonly tuning: HitStopTuning) {}

  trigger(source: HitStopSource): void {
    if (this.intensityScale <= 0) return;
    const impulse = this.tuning.durations[source] * this.intensityScale;
    this.remainingMs = Math.min(this.tuning.maxStopMs, this.remainingMs + impulse);
  }

  /** Advances the freeze clock by dtMs; returns true if simulation should be skipped this tick. */
  tick(dtMs: number): boolean {
    if (this.remainingMs <= 0) return false;
    this.remainingMs = Math.max(0, this.remainingMs - dtMs);
    return true;
  }

  get isActive(): boolean {
    return this.remainingMs > 0;
  }

  get remainingStopMs(): number {
    return this.remainingMs;
  }
}

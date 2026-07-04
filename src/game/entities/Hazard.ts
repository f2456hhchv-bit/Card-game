/**
 * An environmental hazard — the field itself fighting the Warden, and the thing
 * that makes a biome *play* differently rather than merely look different. Every
 * hazard runs a fair three-beat lifecycle: a **telegraph** (a growing warning
 * the player can read and dodge), a brief **active** window where it actually
 * hurts, then a **fade**. Pooled like every other entity.
 */
export type HazardKind = "lavaVent" | "iceRift" | "voidWell";

export class Hazard {
  x = 0;
  y = 0;
  radius = 90;
  kind: HazardKind = "lavaVent";
  hue = 20;
  /** Damage applied to anything caught inside during the active beat. */
  damage = 12;
  /** 0 = telegraph (safe warning), 1 = active (dangerous), 2 = fade. */
  phase = 0;
  /** Seconds elapsed in the current phase. */
  timer = 0;
  telegraphTime = 1.1;
  activeTime = 1.0;
  fadeTime = 0.5;
  /** Set once when the active beat begins, so the enemy burst fires only once. */
  burst = false;
  /** Pool-alive flag. */
  active = false;

  reset(): void {
    this.active = false;
    this.phase = 0;
    this.timer = 0;
    this.burst = false;
  }

  /** 0..1 progress through the current phase (for rendering). */
  get phaseProgress(): number {
    const d = this.phase === 0 ? this.telegraphTime : this.phase === 1 ? this.activeTime : this.fadeTime;
    return d > 0 ? Math.min(1, this.timer / d) : 1;
  }

  /** True only during the beat that actually deals damage. */
  get isDangerous(): boolean {
    return this.phase === 1;
  }
}

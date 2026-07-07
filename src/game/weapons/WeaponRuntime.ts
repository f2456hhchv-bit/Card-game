/**
 * Weapon runtime (AF-032): gates firing on its interval and, when the
 * weapon has an Energy Cost, on AF-031's ship Energy pool via an injected
 * spend callback — no second energy pool. Produces shot descriptors (spawn
 * angles + behaviour); the caller (main.ts) owns actual projectile pooling,
 * exactly as it already does for the sandbox cannon.
 */
import { computeShotAngles } from "./FirePattern";
import type { WeaponDef } from "./weaponData";

export interface ShotDescriptor {
  angle: number;
  behaviour: WeaponDef["projectileBehaviour"];
}

export interface WeaponSnapshot {
  weaponId: string;
  cooldownRemainingMs: number;
  shotsFired: number;
}

export class WeaponRuntime {
  private cooldownRemainingMs = 0;
  private shotsFired = 0;
  private spiralAngleOffset = 0;
  /** Fire-rate build bonuses (AF-022 upgrades) scale the interval, not the weapon's own def. */
  intervalScale = 1;

  constructor(
    private readonly weapon: WeaponDef,
    /** Returns false if energy was insufficient — the shot does not fire. */
    private readonly trySpendEnergy?: (amount: number) => boolean,
  ) {}

  update(fixedDtMs: number): void {
    if (this.cooldownRemainingMs > 0) {
      this.cooldownRemainingMs = Math.max(0, this.cooldownRemainingMs - fixedDtMs);
    }
  }

  /** Attempts to fire at the given absolute angle (radians). Null if gated. */
  tryFire(baseAngle: number): readonly ShotDescriptor[] | null {
    if (this.cooldownRemainingMs > 0) return null;
    if (this.weapon.energyCost > 0 && this.trySpendEnergy && !this.trySpendEnergy(this.weapon.energyCost)) {
      return null;
    }
    this.cooldownRemainingMs = this.weapon.fireIntervalMs * this.intervalScale;
    this.shotsFired += 1;
    if (this.weapon.firePattern === "spiral") {
      this.spiralAngleOffset += Math.PI / 8;
    }
    const angles = computeShotAngles(
      this.weapon.firePattern,
      this.weapon.projectilesPerShot,
      baseAngle,
      this.spiralAngleOffset,
    );
    return angles.map((angle) => ({ angle, behaviour: this.weapon.projectileBehaviour }));
  }

  get snapshot(): WeaponSnapshot {
    return {
      weaponId: this.weapon.id,
      cooldownRemainingMs: this.cooldownRemainingMs,
      shotsFired: this.shotsFired,
    };
  }
}

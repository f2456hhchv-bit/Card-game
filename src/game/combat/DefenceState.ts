/**
 * Layered defence model (AF-021 §4): Damage Reduction (capped) →
 * Temporary Barrier → Shield (regen after delay; halted by Shield Break)
 * → Hull (defeat at zero). Movement/boost i-frames live OUTSIDE this math
 * (AF-020) — dodged damage is the only 100% mitigation.
 */
import type { CombatTuning } from "./combatTuning";

export interface DamageIntake {
  reducedBy: number;
  barrierAbsorbed: number;
  shieldDamage: number;
  hullDamage: number;
  shieldBroken: boolean;
  defeated: boolean;
}

export interface DefenceSnapshot {
  shield: number;
  maxShield: number;
  hull: number;
  maxHull: number;
  barrier: number;
  damageReduction: number;
  regenBlockedMs: number;
}

export class DefenceState {
  private shield: number;
  private hull: number;
  private barrier = 0;
  private damageReduction: number;
  private regenDelayRemainingMs = 0;
  private shieldRegenHalted = false;

  constructor(
    private readonly maxShield: number,
    private readonly maxHull: number,
    private readonly tuning: CombatTuning,
    damageReduction = 0,
  ) {
    this.shield = maxShield;
    this.hull = maxHull;
    this.damageReduction = Math.min(tuning.damageReductionCap, Math.max(0, damageReduction));
  }

  setDamageReduction(value: number): void {
    this.damageReduction = Math.min(this.tuning.damageReductionCap, Math.max(0, value));
  }

  addBarrier(amount: number): void {
    this.barrier += amount;
  }

  /** Shield Break status: shield collapses and regen halts while active. */
  setShieldRegenHalted(halted: boolean): void {
    this.shieldRegenHalted = halted;
  }

  takeDamage(finalDamage: number): DamageIntake {
    const reduced = finalDamage * (1 - this.damageReduction);
    const intake: DamageIntake = {
      reducedBy: finalDamage - reduced,
      barrierAbsorbed: 0,
      shieldDamage: 0,
      hullDamage: 0,
      shieldBroken: false,
      defeated: false,
    };
    let remaining = reduced;

    if (this.barrier > 0 && remaining > 0) {
      intake.barrierAbsorbed = Math.min(this.barrier, remaining);
      this.barrier -= intake.barrierAbsorbed;
      remaining -= intake.barrierAbsorbed;
    }

    if (this.shield > 0 && remaining > 0) {
      intake.shieldDamage = Math.min(this.shield, remaining);
      this.shield -= intake.shieldDamage;
      remaining -= intake.shieldDamage;
      if (this.shield === 0) intake.shieldBroken = true;
    }

    if (remaining > 0) {
      intake.hullDamage = Math.min(this.hull, remaining);
      this.hull -= intake.hullDamage;
      if (this.hull === 0) intake.defeated = true;
    }

    if (intake.shieldDamage > 0 || intake.hullDamage > 0 || intake.barrierAbsorbed > 0) {
      this.regenDelayRemainingMs = this.tuning.shieldRegenDelayMs;
    }
    return intake;
  }

  healHull(amount: number): void {
    this.hull = Math.min(this.maxHull, this.hull + amount);
  }

  update(fixedDtMs: number): void {
    if (this.regenDelayRemainingMs > 0) {
      this.regenDelayRemainingMs = Math.max(0, this.regenDelayRemainingMs - fixedDtMs);
      return;
    }
    if (this.shieldRegenHalted || this.hull <= 0) return;
    if (this.shield < this.maxShield) {
      this.shield = Math.min(
        this.maxShield,
        this.shield + (this.tuning.shieldRegenPerSecond * fixedDtMs) / 1000,
      );
    }
  }

  get isDefeated(): boolean {
    return this.hull <= 0;
  }

  get snapshot(): DefenceSnapshot {
    return {
      shield: this.shield,
      maxShield: this.maxShield,
      hull: this.hull,
      maxHull: this.maxHull,
      barrier: this.barrier,
      damageReduction: this.damageReduction,
      regenBlockedMs: this.regenDelayRemainingMs,
    };
  }
}

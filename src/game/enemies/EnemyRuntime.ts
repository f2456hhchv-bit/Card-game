/**
 * Enemy runtime (AF-033): owns the AI state machine, gates the attack on
 * cooldown AND its readable telegraph window, and exposes the special
 * ability's condition-gated bonus. Unlike a Commander/Ship passive (always
 * active), an enemy's special-ability bonus only applies once its trigger
 * condition holds — Enrage genuinely only kicks in below the threshold.
 */
import type { BonusTotals } from "../equipment/EquipmentAggregate";
import { createEnemyStateMachine, type AiState } from "./EnemyAI";
import type { EnemyDef } from "./enemyData";

export interface EnemyRuntimeSnapshot {
  enemyId: string;
  state: AiState;
  telegraphing: boolean;
  attackCooldownMs: number;
}

export class EnemyRuntime {
  readonly ai = createEnemyStateMachine("idle");
  private attackCooldownRemainingMs = 0;
  private telegraphRemainingMs = 0;
  private telegraphing = false;

  constructor(private readonly def: EnemyDef) {}

  update(fixedDtMs: number): void {
    if (this.attackCooldownRemainingMs > 0) {
      this.attackCooldownRemainingMs = Math.max(0, this.attackCooldownRemainingMs - fixedDtMs);
    }
    if (this.telegraphing) {
      this.telegraphRemainingMs = Math.max(0, this.telegraphRemainingMs - fixedDtMs);
    }
  }

  /**
   * Call once per tick while the enemy could engage (in range + line of
   * sight). Returns true exactly once — the moment the telegraph completes
   * and the attack should actually resolve.
   */
  tryAttack(canEngage: boolean): boolean {
    if (!canEngage) {
      this.telegraphing = false;
      return false;
    }
    if (this.attackCooldownRemainingMs > 0) return false;
    if (!this.telegraphing) {
      this.telegraphing = true;
      this.telegraphRemainingMs = this.def.attack.telegraphMs;
      if (this.telegraphRemainingMs > 0) return false;
    }
    if (this.telegraphRemainingMs > 0) return false;
    this.telegraphing = false;
    this.attackCooldownRemainingMs = this.attackCooldownMs();
    return true;
  }

  private attackCooldownMs(): number {
    return this.def.attack.mechanism.kind === "melee"
      ? this.def.attack.mechanism.cooldownMs
      : this.def.attack.mechanism.weapon.fireIntervalMs;
  }

  get isTelegraphing(): boolean {
    return this.telegraphing;
  }

  /** Condition-gated — empty unless the special ability's trigger currently holds. */
  specialAbilityBonus(hullFraction: number): BonusTotals {
    const ability = this.def.specialAbility;
    if (!ability) return {};
    if (ability.trigger === "onLowHealth") {
      const threshold = ability.threshold ?? 0.3;
      if (hullFraction > threshold) return {};
    }
    return { [ability.bonus.kind]: ability.bonus.value };
  }

  get snapshot(): EnemyRuntimeSnapshot {
    return {
      enemyId: this.def.id,
      state: this.ai.current,
      telegraphing: this.telegraphing,
      attackCooldownMs: this.attackCooldownRemainingMs,
    };
  }
}

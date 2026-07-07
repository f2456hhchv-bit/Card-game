/**
 * Commander runtime (AF-030): tracks active-ability cooldown and ultimate
 * charge for the selected Commander during a run. Bonuses (passive +
 * signature) feed the SAME BonusTotals shape as AF-028/AF-029 — no new
 * stat pipeline.
 */
import type { BonusTotals } from "../equipment/EquipmentAggregate";
import type { CommanderDef } from "./commanderData";

export interface CommanderSnapshot {
  commanderId: string;
  activeCooldownMs: number;
  ultimateCharge: number;
  ultimateReady: boolean;
}

export class CommanderRuntime {
  private activeCooldownRemainingMs = 0;
  private ultimateCharge = 0;

  constructor(
    private readonly commander: CommanderDef,
    private readonly onUltimateReady?: () => void,
  ) {}

  update(fixedDtMs: number): void {
    if (this.activeCooldownRemainingMs > 0) {
      this.activeCooldownRemainingMs = Math.max(0, this.activeCooldownRemainingMs - fixedDtMs);
    }
  }

  /** Combat facts feed ultimate charge (kills, damage dealt). */
  notifyKill(): void {
    this.addCharge(this.commander.ultimate.chargePerKill);
  }

  notifyDamageDealt(amount: number): void {
    this.addCharge(amount * this.commander.ultimate.chargePerDamage);
  }

  private addCharge(amount: number): void {
    if (amount <= 0) return;
    const wasReady = this.ultimateCharge >= this.commander.ultimate.chargeRequired;
    this.ultimateCharge = Math.min(this.commander.ultimate.chargeRequired, this.ultimateCharge + amount);
    if (!wasReady && this.ultimateCharge >= this.commander.ultimate.chargeRequired) {
      this.onUltimateReady?.();
    }
  }

  tryActivateAbility(): boolean {
    if (this.activeCooldownRemainingMs > 0) return false;
    this.activeCooldownRemainingMs = this.commander.active.cooldownMs;
    return true;
  }

  tryActivateUltimate(): boolean {
    if (this.ultimateCharge < this.commander.ultimate.chargeRequired) return false;
    this.ultimateCharge = 0;
    return true;
  }

  /** Passive + signature bonuses — feeds the shared BonusTotals shape. */
  get bonuses(): BonusTotals {
    const totals: BonusTotals = {};
    totals[this.commander.passive.bonus.kind] =
      (totals[this.commander.passive.bonus.kind] ?? 0) + this.commander.passive.bonus.value;
    const sigKind = this.commander.signature.passive.bonus.kind;
    totals[sigKind] = (totals[sigKind] ?? 0) + this.commander.signature.passive.bonus.value;
    return totals;
  }

  get snapshot(): CommanderSnapshot {
    return {
      commanderId: this.commander.id,
      activeCooldownMs: this.activeCooldownRemainingMs,
      ultimateCharge: this.ultimateCharge,
      ultimateReady: this.ultimateCharge >= this.commander.ultimate.chargeRequired,
    };
  }
}

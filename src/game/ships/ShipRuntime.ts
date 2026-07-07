/**
 * Ship runtime (AF-031): tracks Energy (this module's one new resource) and
 * gates the ship's ability on cooldown AND energy cost. Passive bonuses feed
 * the SAME BonusTotals shape as AF-028/AF-029/AF-030 — no new stat pipeline.
 */
import type { BonusTotals } from "../equipment/EquipmentAggregate";
import type { ShipDef } from "./shipData";

export interface ShipSnapshot {
  shipId: string;
  energy: number;
  maxEnergy: number;
  abilityCooldownMs: number;
}

export class ShipRuntime {
  private energy: number;
  private abilityCooldownRemainingMs = 0;

  constructor(private readonly ship: ShipDef) {
    this.energy = ship.maxEnergy;
  }

  update(fixedDtMs: number): void {
    if (this.abilityCooldownRemainingMs > 0) {
      this.abilityCooldownRemainingMs = Math.max(0, this.abilityCooldownRemainingMs - fixedDtMs);
    }
    this.energy = Math.min(
      this.ship.maxEnergy,
      this.energy + (this.ship.energyRegenPerSecond * fixedDtMs) / 1000,
    );
  }

  tryActivateAbility(): boolean {
    if (this.abilityCooldownRemainingMs > 0) return false;
    if (this.energy < this.ship.ability.energyCost) return false;
    this.energy -= this.ship.ability.energyCost;
    this.abilityCooldownRemainingMs = this.ship.ability.cooldownMs;
    return true;
  }

  /** Passive bonus — feeds the shared BonusTotals shape. */
  get bonuses(): BonusTotals {
    const totals: BonusTotals = {};
    totals[this.ship.passive.bonus.kind] =
      (totals[this.ship.passive.bonus.kind] ?? 0) + this.ship.passive.bonus.value;
    return totals;
  }

  get snapshot(): ShipSnapshot {
    return {
      shipId: this.ship.id,
      energy: this.energy,
      maxEnergy: this.ship.maxEnergy,
      abilityCooldownMs: this.abilityCooldownRemainingMs,
    };
  }
}

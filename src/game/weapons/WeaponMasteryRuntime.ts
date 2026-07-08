/**
 * Weapon mastery runtime (AF-075). Pure and deterministic — the AF-073
 * outfitting discipline applied to weapons: mastery metrics (shots, hits,
 * criticals, kills, boss damage) accumulate append-only with ACCURACY
 * DERIVED, never stored; no reset/clear/wipe operation exists. AF-032's
 * WeaponRuntime (fire timing, projectiles) is untouched — this runtime
 * only keeps the ledger the framework's §Weapon Mastery demands.
 */
import type { WeaponProfileDef } from "./weaponFrameworkData";
import { ELEMENT_TO_STATUS } from "./weaponFrameworkData";
import type { StatusKind } from "../combat/combatTuning";

export interface WeaponMasterySnapshot {
  weaponId: string;
  frameworkCategory: string;
  element: string;
  elementStatus: StatusKind | null;
  shots: number;
  hits: number;
  criticalHits: number;
  kills: number;
  bossDamage: number;
  accuracy: number;
}

export class WeaponMasteryRuntime {
  private shots = 0;
  private hits = 0;
  private criticalHits = 0;
  private kills = 0;
  private bossDamage = 0;

  constructor(private readonly profile: WeaponProfileDef) {}

  recordShots(count: number): void {
    if (count > 0) this.shots += count;
  }

  recordHit(critical: boolean): void {
    this.hits += 1;
    if (critical) this.criticalHits += 1;
  }

  recordKills(count: number): void {
    if (count > 0) this.kills += count;
  }

  recordBossDamage(amount: number): void {
    if (amount > 0) this.bossDamage += amount;
  }

  get snapshot(): WeaponMasterySnapshot {
    return {
      weaponId: this.profile.weaponId,
      frameworkCategory: this.profile.frameworkCategory,
      element: this.profile.element,
      elementStatus: ELEMENT_TO_STATUS[this.profile.element],
      shots: this.shots,
      hits: this.hits,
      criticalHits: this.criticalHits,
      kills: this.kills,
      bossDamage: this.bossDamage,
      accuracy: this.shots === 0 ? 0 : Math.min(1, this.hits / this.shots),
    };
  }
}

/**
 * Ship outfitting runtime (AF-073). Pure and deterministic. AF-031's
 * ShipRuntime (energy, ability cooldown) is untouched; this runtime carries
 * what the framework adds:
 * - Modules: fit and unfit freely within the profile's slot count —
 *   refitting is normal gameplay, a LOADOUT, not content removal. Module
 *   bonuses are AF-028 values, aggregated and CACHED until the fit changes
 *   (§Performance: "cache module stats").
 * - Mastery metrics (usage, kills, boss victories, distance) accumulate
 *   append-only — the ledger side has no reset/clear/wipe operation.
 * - The ascension upgrade fits its designated module FREE (outside the
 *   slot count) once AF-069's ascension level reaches the gate.
 */
import type { EquipmentBonus } from "../equipment/equipmentData";
import type { ShipModuleDef, ShipProfileDef } from "./shipFrameworkData";

export interface ShipMasteryLedger {
  uses: number;
  kills: number;
  bossVictories: number;
  distanceTravelled: number;
}

export interface ShipOutfittingSnapshot {
  shipId: string;
  frameworkClass: string;
  primaryDefence: string;
  offensiveIdentity: string;
  fittedModules: number;
  moduleSlots: number;
  ascensionModuleFitted: boolean;
  mastery: ShipMasteryLedger;
}

/** GP-003 §Ship Progression: "ships permanently improve" — this is the save
 * shape one ship's fitted modules/ascension/mastery ledger round-trips through. */
export interface ShipOutfittingSaveData {
  fitted: readonly string[];
  ascensionModuleFitted: boolean;
  mastery: ShipMasteryLedger;
}

export class ShipOutfittingRuntime {
  private readonly fitted = new Set<string>();
  private ascensionModuleFittedFlag = false;
  private readonly mastery: ShipMasteryLedger = { uses: 0, kills: 0, bossVictories: 0, distanceTravelled: 0 };
  private bonusCache: readonly EquipmentBonus[] | null = null;
  private readonly modulesById = new Map<string, ShipModuleDef>();

  constructor(
    private readonly profile: ShipProfileDef,
    availableModules: readonly ShipModuleDef[],
  ) {
    for (const module of availableModules) this.modulesById.set(module.id, module);
  }

  /** Fit within the slot count. The ascension module, once granted, sits OUTSIDE the count. */
  tryFitModule(moduleId: string): boolean {
    if (!this.modulesById.has(moduleId) || this.fitted.has(moduleId)) return false;
    if (this.slotUsage() >= this.profile.moduleSlots) return false;
    this.fitted.add(moduleId);
    this.bonusCache = null;
    return true;
  }

  /** Refitting is a loadout decision, not content removal — the module returns to the hangar. */
  unfitModule(moduleId: string): boolean {
    if (!this.fitted.has(moduleId)) return false;
    if (this.ascensionModuleFittedFlag && moduleId === this.profile.ascensionUpgrade.moduleId) return false; // the ascension grant is permanent
    this.fitted.delete(moduleId);
    this.bonusCache = null;
    return true;
  }

  private slotUsage(): number {
    const ascensionFree = this.ascensionModuleFittedFlag && this.fitted.has(this.profile.ascensionUpgrade.moduleId) ? 1 : 0;
    return this.fitted.size - ascensionFree;
  }

  isFitted(moduleId: string): boolean {
    return this.fitted.has(moduleId);
  }

  /** Aggregated AF-028 module bonuses, cached until the fit changes (§Performance). */
  moduleBonuses(): readonly EquipmentBonus[] {
    if (this.bonusCache) return this.bonusCache;
    const bonuses: EquipmentBonus[] = [];
    for (const id of this.fitted) {
      const module = this.modulesById.get(id);
      if (module) bonuses.push(module.bonus);
    }
    this.bonusCache = bonuses;
    return bonuses;
  }

  /** The fifth ability stage: the designated module fits free at the AF-069 gate, once, permanently. */
  tryApplyAscensionUpgrade(ascensionLevel: number): boolean {
    if (this.ascensionModuleFittedFlag) return false;
    if (ascensionLevel < this.profile.ascensionUpgrade.requiredAscensionLevel) return false;
    this.ascensionModuleFittedFlag = true;
    this.fitted.add(this.profile.ascensionUpgrade.moduleId);
    this.bonusCache = null;
    return true;
  }

  /** Mastery accumulates append-only — usage, kills, boss victories, distance. */
  recordUse(): void {
    this.mastery.uses += 1;
  }

  recordKills(count: number): void {
    if (count > 0) this.mastery.kills += count;
  }

  recordBossVictory(): void {
    this.mastery.bossVictories += 1;
  }

  recordDistance(units: number): void {
    if (units > 0) this.mastery.distanceTravelled += units;
  }

  get snapshot(): ShipOutfittingSnapshot {
    return {
      shipId: this.profile.shipId,
      frameworkClass: this.profile.frameworkClass,
      primaryDefence: this.profile.primaryDefence,
      offensiveIdentity: this.profile.offensiveIdentity,
      fittedModules: this.fitted.size,
      moduleSlots: this.profile.moduleSlots,
      ascensionModuleFitted: this.ascensionModuleFittedFlag,
      mastery: { ...this.mastery },
    };
  }

  toSave(): ShipOutfittingSaveData {
    return {
      fitted: [...this.fitted],
      ascensionModuleFitted: this.ascensionModuleFittedFlag,
      mastery: { ...this.mastery },
    };
  }

  /** Restore from a save slice; unknown module ids are dropped (deprecation-safe). */
  loadSave(data: ShipOutfittingSaveData): void {
    this.fitted.clear();
    for (const id of data.fitted) if (this.modulesById.has(id)) this.fitted.add(id);
    this.ascensionModuleFittedFlag = data.ascensionModuleFitted;
    this.mastery.uses = Math.max(0, data.mastery.uses);
    this.mastery.kills = Math.max(0, data.mastery.kills);
    this.mastery.bossVictories = Math.max(0, data.mastery.bossVictories);
    this.mastery.distanceTravelled = Math.max(0, data.mastery.distanceTravelled);
    this.bonusCache = null;
  }
}

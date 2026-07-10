/**
 * LivingShipRuntime (AF-131) — the real engine behind the A.S.V.
 * Afterlight. Upgrades only ever increase ("each visual upgrade
 * permanently changes the ship"); the Memorial Garden and Companion
 * Habitat logs are append-only, mirroring AF-130's EmotionalMemoryLog.
 */
import { SHIP_DEFAULT_NAME, type CompanionHabitatEntry, type ShipUpgradeCategory, type ShipUpgradeState } from "./livingShipData";

export interface LivingShipSnapshot {
  name: string;
  totalUpgradeLevel: number;
  maxUpgradeLevel: number;
  fullyUpgradedCategories: number;
  totalCategories: number;
}

export class LivingShipRuntime {
  private shipName: string;
  private readonly upgrades: Map<ShipUpgradeCategory, ShipUpgradeState>;

  constructor(seed: readonly ShipUpgradeState[], name: string = SHIP_DEFAULT_NAME) {
    this.shipName = name;
    this.upgrades = new Map(seed.map((state) => [state.category, { ...state }]));
  }

  get name(): string {
    return this.shipName;
  }

  /** "Customisable later" — the default name may be changed at any time. */
  rename(newName: string): void {
    if (newName.trim().length === 0) return;
    this.shipName = newName;
  }

  upgradeLevel(category: ShipUpgradeCategory): number {
    return this.upgrades.get(category)?.level ?? 0;
  }

  /** Increases a category's level by 1, capped at its maxLevel. Never decreases. */
  upgrade(category: ShipUpgradeCategory): void {
    const state = this.upgrades.get(category);
    if (!state) return;
    state.level = Math.min(state.maxLevel, state.level + 1);
  }

  snapshot(): LivingShipSnapshot {
    let totalLevel = 0;
    let maxLevel = 0;
    let fullyUpgraded = 0;
    for (const state of this.upgrades.values()) {
      totalLevel += state.level;
      maxLevel += state.maxLevel;
      if (state.level >= state.maxLevel) fullyUpgraded++;
    }
    return {
      name: this.shipName,
      totalUpgradeLevel: totalLevel,
      maxUpgradeLevel: maxLevel,
      fullyUpgradedCategories: fullyUpgraded,
      totalCategories: this.upgrades.size,
    };
  }
}

export interface MemorialGardenEntry {
  kind: string;
  description: string;
  legacyNote: string;
  sequence: number;
}

/** "Never exploit grief. Celebrate legacy." — enforced structurally: every
 * entry requires a non-empty legacyNote, and nothing is ever removed. */
export class MemorialGardenLog {
  private readonly entries: MemorialGardenEntry[] = [];

  record(kind: string, description: string, legacyNote: string): void {
    if (legacyNote.trim().length === 0) {
      throw new Error("MemorialGardenLog requires a legacyNote — the Garden celebrates legacy, it never records grief alone.");
    }
    this.entries.push({ kind, description, legacyNote, sequence: this.entries.length });
  }

  all(): readonly MemorialGardenEntry[] {
    return this.entries;
  }
}

export class CompanionHabitatRuntime {
  private readonly companions = new Map<string, CompanionHabitatEntry>();

  rescue(entry: CompanionHabitatEntry): void {
    if (this.companions.has(entry.id)) return;
    this.companions.set(entry.id, entry);
  }

  all(): readonly CompanionHabitatEntry[] {
    return [...this.companions.values()];
  }

  count(): number {
    return this.companions.size;
  }
}

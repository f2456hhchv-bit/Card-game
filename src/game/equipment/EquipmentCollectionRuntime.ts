/**
 * Equipment collection runtime — the WORKSHOP (AF-079). Pure and
 * deterministic — AF-077's monotone state lattice applied to modules:
 * unseen → discovered → crafted → mastered, with evolved as a parallel
 * permanent mark. §Collection says players PERMANENTLY collect — so the
 * lattice only ever advances; no operation demotes or removes a module
 * from the workshop. AF-028's equipment engine (slots, validation,
 * aggregation, sets) is untouched — this runtime is the permanent record
 * beside it.
 */
import type { EquipmentProfileDef } from "./equipmentFrameworkData";

export type EquipmentCollectionLatticeState = "unseen" | "discovered" | "crafted" | "mastered";

export interface EquipmentCollectionSnapshot {
  workshopSize: number;
  discoveredCount: number;
  craftedCount: number;
  masteredCount: number;
  evolvedCount: number;
}

const STATE_ORDER: Readonly<Record<EquipmentCollectionLatticeState, number>> = { unseen: 0, discovered: 1, crafted: 2, mastered: 3 };

export class EquipmentCollectionRuntime {
  private readonly states = new Map<string, EquipmentCollectionLatticeState>();
  private readonly evolved = new Set<string>();
  private readonly profilesById = new Map<string, EquipmentProfileDef>();

  constructor(profiles: readonly EquipmentProfileDef[]) {
    for (const profile of profiles) this.profilesById.set(profile.itemId, profile);
  }

  recordDiscovered(itemId: string): boolean {
    if (!this.profilesById.has(itemId)) return false;
    const current = this.states.get(itemId) ?? "unseen";
    if (STATE_ORDER[current] >= STATE_ORDER.discovered) return false;
    this.states.set(itemId, "discovered");
    return true;
  }

  /** Crafting implies discovery — the lattice advances through both. */
  recordCrafted(itemId: string): boolean {
    if (!this.profilesById.has(itemId)) return false;
    const current = this.states.get(itemId) ?? "unseen";
    if (STATE_ORDER[current] >= STATE_ORDER.crafted) return false;
    this.states.set(itemId, "crafted");
    return true;
  }

  recordMastered(itemId: string): boolean {
    const current = this.states.get(itemId) ?? "unseen";
    if (current !== "crafted") return false; // mastery requires crafting first
    this.states.set(itemId, "mastered");
    return true;
  }

  /** A permanent parallel mark — an evolved module is remembered forever. */
  recordEvolved(itemId: string): boolean {
    if (!this.profilesById.has(itemId) || this.evolved.has(itemId)) return false;
    this.evolved.add(itemId);
    return true;
  }

  stateFor(itemId: string): EquipmentCollectionLatticeState {
    return this.states.get(itemId) ?? "unseen";
  }

  hasEvolved(itemId: string): boolean {
    return this.evolved.has(itemId);
  }

  get snapshot(): EquipmentCollectionSnapshot {
    let discovered = 0;
    let crafted = 0;
    let mastered = 0;
    for (const state of this.states.values()) {
      if (STATE_ORDER[state] >= STATE_ORDER.discovered) discovered += 1;
      if (STATE_ORDER[state] >= STATE_ORDER.crafted) crafted += 1;
      if (state === "mastered") mastered += 1;
    }
    return {
      workshopSize: this.profilesById.size,
      discoveredCount: discovered,
      craftedCount: crafted,
      masteredCount: mastered,
      evolvedCount: this.evolved.size,
    };
  }
}

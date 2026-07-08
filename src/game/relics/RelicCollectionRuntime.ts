/**
 * Relic collection runtime (AF-077). Pure and deterministic — the
 * AF-074/076 collection discipline with a twist: relic collection is a
 * MONOTONE STATE LATTICE (discovered → owned → mastered, with evolved as
 * a parallel permanent mark). States only ever advance; no operation can
 * demote or remove a relic from the collection. AF-029's RelicSystem
 * (acquisition, stacking, exclusion, synergy, evolution) is untouched —
 * this runtime keeps the permanent record §Collection demands.
 */
import type { RelicProfileDef } from "./relicFrameworkData";

export type RelicCollectionState = "unseen" | "discovered" | "owned" | "mastered";

export interface RelicCollectionSnapshot {
  reliquarySize: number;
  discoveredCount: number;
  ownedCount: number;
  masteredCount: number;
  evolvedCount: number;
}

const STATE_ORDER: Readonly<Record<RelicCollectionState, number>> = { unseen: 0, discovered: 1, owned: 2, mastered: 3 };

export class RelicCollectionRuntime {
  private readonly states = new Map<string, RelicCollectionState>();
  private readonly evolved = new Set<string>();
  private readonly profilesById = new Map<string, RelicProfileDef>();

  constructor(profiles: readonly RelicProfileDef[]) {
    for (const profile of profiles) this.profilesById.set(profile.relicId, profile);
  }

  private advance(relicId: string, to: RelicCollectionState): boolean {
    if (!this.profilesById.has(relicId)) return false;
    const current = this.states.get(relicId) ?? "unseen";
    if (STATE_ORDER[to] <= STATE_ORDER[current]) return false; // states only advance
    this.states.set(relicId, to);
    return true;
  }

  recordDiscovered(relicId: string): boolean {
    return this.advance(relicId, "discovered");
  }

  /** Owning implies having discovered — the lattice advances through both. */
  recordOwned(relicId: string): boolean {
    const current = this.states.get(relicId) ?? "unseen";
    if (STATE_ORDER[current] >= STATE_ORDER.owned) return false;
    this.states.set(relicId, "owned");
    return true;
  }

  recordMastered(relicId: string): boolean {
    const current = this.states.get(relicId) ?? "unseen";
    if (current !== "owned") return false; // mastery requires ownership first
    this.states.set(relicId, "mastered");
    return true;
  }

  /** A permanent parallel mark — evolution is remembered forever. */
  recordEvolved(relicId: string): boolean {
    if (!this.profilesById.has(relicId) || this.evolved.has(relicId)) return false;
    this.evolved.add(relicId);
    return true;
  }

  stateFor(relicId: string): RelicCollectionState {
    return this.states.get(relicId) ?? "unseen";
  }

  hasEvolved(relicId: string): boolean {
    return this.evolved.has(relicId);
  }

  get snapshot(): RelicCollectionSnapshot {
    let discovered = 0;
    let owned = 0;
    let mastered = 0;
    for (const state of this.states.values()) {
      if (STATE_ORDER[state] >= STATE_ORDER.discovered) discovered += 1;
      if (STATE_ORDER[state] >= STATE_ORDER.owned) owned += 1;
      if (state === "mastered") mastered += 1;
    }
    return {
      reliquarySize: this.profilesById.size,
      discoveredCount: discovered,
      ownedCount: owned,
      masteredCount: mastered,
      evolvedCount: this.evolved.size,
    };
  }
}

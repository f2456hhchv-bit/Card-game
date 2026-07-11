/**
 * Ship collection runtime (AF-074). Pure and deterministic — the AF-072
 * roster discipline applied to hulls: collection is append-only (a
 * collected hull never leaves; no removal operation exists), acquisition
 * gates on each entry's registered collection kind having been reached,
 * and usage/mission-success statistics accumulate with success rate
 * DERIVED, never stored. Nothing here can buff, nerf, or retire a hull —
 * "no Ship should become obsolete" is what the code cannot do.
 */
import type { RosterShipEntry, ShipCollectionKind } from "./shipRosterData";

export interface ShipUsageStats {
  shipId: string;
  uses: number;
  missionSuccesses: number;
  successRate: number;
}

export interface ShipCollectionSnapshot {
  fleetSize: number;
  collectedCount: number;
  totalUses: number;
}

/** GP-003 §Ship Progression: "no Ship should become obsolete" — this is the
 * save shape the append-only collected fleet and its usage ledger round-trip through. */
export interface ShipCollectionSaveData {
  collected: readonly string[];
  uses: Readonly<Record<string, number>>;
  successes: Readonly<Record<string, number>>;
}

export class ShipCollectionRuntime {
  private readonly collected = new Set<string>();
  private readonly uses = new Map<string, number>();
  private readonly successes = new Map<string, number>();
  private readonly entriesByShip = new Map<string, RosterShipEntry>();

  constructor(entries: readonly RosterShipEntry[], startingIds: readonly string[]) {
    for (const entry of entries) this.entriesByShip.set(entry.shipId, entry);
    for (const id of startingIds) {
      if (!this.entriesByShip.has(id)) throw new Error(`starting ship ${id} missing from the fleet`);
      this.collected.add(id);
    }
  }

  /** Collect when the hull's registered acquisition route has been reached. Append-only. */
  tryCollect(shipId: string, reachedKinds: ReadonlySet<ShipCollectionKind>): boolean {
    if (this.collected.has(shipId)) return false;
    const entry = this.entriesByShip.get(shipId);
    if (!entry || !reachedKinds.has(entry.collectionKind)) return false;
    this.collected.add(shipId);
    return true;
  }

  isCollected(shipId: string): boolean {
    return this.collected.has(shipId);
  }

  get collectedIds(): readonly string[] {
    return [...this.collected];
  }

  recordMission(shipId: string, success: boolean): void {
    if (!this.collected.has(shipId)) return;
    this.uses.set(shipId, (this.uses.get(shipId) ?? 0) + 1);
    if (success) this.successes.set(shipId, (this.successes.get(shipId) ?? 0) + 1);
  }

  statsFor(shipId: string): ShipUsageStats {
    const uses = this.uses.get(shipId) ?? 0;
    const missionSuccesses = this.successes.get(shipId) ?? 0;
    return { shipId, uses, missionSuccesses, successRate: uses === 0 ? 0 : missionSuccesses / uses };
  }

  get snapshot(): ShipCollectionSnapshot {
    let totalUses = 0;
    for (const count of this.uses.values()) totalUses += count;
    return {
      fleetSize: this.entriesByShip.size,
      collectedCount: this.collected.size,
      totalUses,
    };
  }

  toSave(): ShipCollectionSaveData {
    return {
      collected: [...this.collected],
      uses: Object.fromEntries(this.uses),
      successes: Object.fromEntries(this.successes),
    };
  }

  /** Restore from a save slice; unknown ship ids are dropped (deprecation-safe). */
  loadSave(data: ShipCollectionSaveData): void {
    for (const id of data.collected) if (this.entriesByShip.has(id)) this.collected.add(id);
    this.uses.clear();
    for (const [id, count] of Object.entries(data.uses)) if (this.collected.has(id)) this.uses.set(id, Math.max(0, count));
    this.successes.clear();
    for (const [id, count] of Object.entries(data.successes)) if (this.collected.has(id)) this.successes.set(id, Math.max(0, count));
  }
}

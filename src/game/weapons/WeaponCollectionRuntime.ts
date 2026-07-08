/**
 * Weapon collection runtime (AF-076). Pure and deterministic — the AF-074
 * fleet-collection discipline applied to the arsenal: collection is
 * append-only (a collected weapon never leaves; no removal operation
 * exists), acquisition gates on each entry's registered collection kind,
 * and usage statistics accumulate with rates DERIVED, never stored.
 * Nothing here can buff, nerf, or retire a weapon — "every weapon should
 * remain relevant regardless of progression stage" is what the code
 * cannot violate.
 */
import type { WeaponCollectionKind, WeaponRosterEntry } from "./weaponRosterData";

export interface WeaponCollectionSnapshot {
  arsenalSize: number;
  collectedCount: number;
  totalUses: number;
}

export class WeaponCollectionRuntime {
  private readonly collected = new Set<string>();
  private readonly uses = new Map<string, number>();
  private readonly entriesByWeapon = new Map<string, WeaponRosterEntry>();

  constructor(entries: readonly WeaponRosterEntry[], startingIds: readonly string[]) {
    for (const entry of entries) this.entriesByWeapon.set(entry.weaponId, entry);
    for (const id of startingIds) {
      if (!this.entriesByWeapon.has(id)) throw new Error(`starting weapon ${id} missing from the arsenal`);
      this.collected.add(id);
    }
  }

  tryCollect(weaponId: string, reachedKinds: ReadonlySet<WeaponCollectionKind>): boolean {
    if (this.collected.has(weaponId)) return false;
    const entry = this.entriesByWeapon.get(weaponId);
    if (!entry || !reachedKinds.has(entry.collectionKind)) return false;
    this.collected.add(weaponId);
    return true;
  }

  isCollected(weaponId: string): boolean {
    return this.collected.has(weaponId);
  }

  get collectedIds(): readonly string[] {
    return [...this.collected];
  }

  recordUse(weaponId: string): void {
    if (!this.collected.has(weaponId)) return;
    this.uses.set(weaponId, (this.uses.get(weaponId) ?? 0) + 1);
  }

  usesFor(weaponId: string): number {
    return this.uses.get(weaponId) ?? 0;
  }

  get snapshot(): WeaponCollectionSnapshot {
    let totalUses = 0;
    for (const count of this.uses.values()) totalUses += count;
    return {
      arsenalSize: this.entriesByWeapon.size,
      collectedCount: this.collected.size,
      totalUses,
    };
  }
}

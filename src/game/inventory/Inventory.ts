/**
 * Inventory engine (AF-027): instance storage with stacking, cached
 * sorting, combinable filters, instant search, loadouts, and protection.
 * Items are AF-023 drops + instance metadata; the engine organises, it
 * never redefines. Scale-tested at 20,000+ items.
 */
import { RARITY_LADDER, RARITY_TABLE, type Rarity } from "../loot/lootTuning";
import type { LootDrop } from "../loot/LootGenerator";
import {
  STACKABLE_CATEGORIES,
  type InventoryFilter,
  type InventoryTuning,
  type SortKey,
  type StorageLocation,
} from "./inventoryData";

export interface InventoryItem {
  instanceId: string;
  drop: LootDrop;
  location: StorageLocation;
  favourite: boolean;
  locked: boolean;
  markedForCrafting: boolean;
  acquiredAt: number;
  stackCount: number;
}

export interface Loadout {
  name: string;
  favourite: boolean;
  commanderId: string | null;
  shipId: string | null;
  /** Slot → instanceId; slot vocabulary is AF-028's (data-driven). */
  slots: Record<string, string | null>;
}

export type MoveResult = { ok: true } | { ok: false; reason: "storageFull" | "unknownItem" };

export interface SalvageGuard {
  allowed: boolean;
  requiresConfirmation: boolean;
  reason: "locked" | "favourite" | null;
}

/** Derived display metric (AF-027): level, tier, and affix weight — data-tunable. */
export function powerRating(drop: LootDrop): number {
  const tier = RARITY_LADDER.indexOf(drop.rarity);
  const affixPower = drop.affixes.reduce((sum, a) => sum + a.value, 0);
  return Math.round(drop.itemLevel * 10 * (1 + tier * 0.25) + affixPower);
}

export interface InventorySaveData {
  items: InventoryItem[];
  loadouts: Loadout[];
  nextInstanceId: number;
}

export class Inventory {
  private items = new Map<string, InventoryItem>();
  private loadouts: Loadout[] = [];
  private nextId = 1;
  private revision = 0;
  private sortCache: { key: SortKey; revision: number; result: InventoryItem[] } | null = null;

  constructor(private readonly tuning: InventoryTuning) {}

  // ── Adding & stacking ────────────────────────────────────────────────────

  add(drop: LootDrop, acquiredAt: number, location: StorageLocation = "player"): InventoryItem {
    if (STACKABLE_CATEGORIES.includes(drop.category)) {
      for (const item of this.items.values()) {
        if (
          item.location === location &&
          item.drop.category === drop.category &&
          item.drop.baseItemId === drop.baseItemId &&
          item.drop.rarity === drop.rarity &&
          item.stackCount < this.tuning.stackLimit
        ) {
          item.stackCount += 1;
          this.touch();
          return item;
        }
      }
    }
    const item: InventoryItem = {
      instanceId: `inv-${this.nextId}`,
      drop,
      location,
      favourite: false,
      locked: false,
      markedForCrafting: false,
      acquiredAt,
      stackCount: 1,
    };
    this.nextId += 1;
    this.items.set(item.instanceId, item);
    this.touch();
    return item;
  }

  get(instanceId: string): InventoryItem | null {
    return this.items.get(instanceId) ?? null;
  }

  remove(instanceId: string): boolean {
    const removed = this.items.delete(instanceId);
    if (removed) this.touch();
    return removed;
  }

  // ── Protection (AF-027 item protection; AF-003 §8 warnings) ─────────────

  setFavourite(instanceId: string, favourite: boolean): void {
    const item = this.items.get(instanceId);
    if (item) {
      item.favourite = favourite;
      this.touch();
    }
  }

  setLocked(instanceId: string, locked: boolean): void {
    const item = this.items.get(instanceId);
    if (item) {
      item.locked = locked;
      this.touch();
    }
  }

  /** Locked items cannot salvage at all; favourites require confirmation. */
  salvageGuard(instanceId: string): SalvageGuard {
    const item = this.items.get(instanceId);
    if (!item) return { allowed: false, requiresConfirmation: false, reason: null };
    if (item.locked) return { allowed: false, requiresConfirmation: false, reason: "locked" };
    if (item.favourite) return { allowed: true, requiresConfirmation: true, reason: "favourite" };
    return { allowed: true, requiresConfirmation: false, reason: null };
  }

  /** Batch operations are safe by construction: protected items excluded. */
  batchSalvageCandidates(filter: InventoryFilter): InventoryItem[] {
    return this.filter(filter).filter((item) => !item.locked && !item.favourite);
  }

  // ── Moving ───────────────────────────────────────────────────────────────

  move(instanceId: string, to: StorageLocation): MoveResult {
    const item = this.items.get(instanceId);
    if (!item) return { ok: false, reason: "unknownItem" };
    const limit = this.tuning.storageLimits[to];
    if (limit !== null) {
      const occupied = [...this.items.values()].filter((i) => i.location === to).length;
      if (occupied >= limit) return { ok: false, reason: "storageFull" };
    }
    item.location = to;
    this.touch();
    return { ok: true };
  }

  // ── Sorting (cached), filtering, search ─────────────────────────────────

  sorted(key: SortKey): readonly InventoryItem[] {
    if (this.sortCache && this.sortCache.key === key && this.sortCache.revision === this.revision) {
      return this.sortCache.result;
    }
    const result = [...this.items.values()].sort(comparatorFor(key));
    this.sortCache = { key, revision: this.revision, result };
    return result;
  }

  filter(criteria: InventoryFilter): InventoryItem[] {
    return [...this.items.values()].filter((item) => {
      if (criteria.category && item.drop.category !== criteria.category) return false;
      if (criteria.rarity && item.drop.rarity !== criteria.rarity) return false;
      if (criteria.affixId && !item.drop.affixes.some((a) => a.id === criteria.affixId)) return false;
      if (criteria.favouritesOnly && !item.favourite) return false;
      if (criteria.minItemLevel !== undefined && item.drop.itemLevel < criteria.minItemLevel) return false;
      return true;
    });
  }

  search(text: string): InventoryItem[] {
    const query = text.toLowerCase();
    if (query.length === 0) return [];
    return [...this.items.values()].filter(
      (item) =>
        item.drop.baseItemId.toLowerCase().includes(query) ||
        item.drop.category.toLowerCase().includes(query) ||
        item.drop.rarity.toLowerCase().includes(query) ||
        item.drop.affixes.some((a) => a.id.toLowerCase().includes(query)),
    );
  }

  // ── Loadouts (AF-027; slot vocabulary is AF-028's) ──────────────────────

  saveLoadout(loadout: Loadout): boolean {
    const existing = this.loadouts.findIndex((l) => l.name === loadout.name);
    if (existing >= 0) {
      this.loadouts[existing] = loadout;
      return true;
    }
    if (this.loadouts.length >= this.tuning.maxLoadouts) return false;
    this.loadouts.push(loadout);
    return true;
  }

  renameLoadout(name: string, next: string): boolean {
    const loadout = this.loadouts.find((l) => l.name === name);
    if (!loadout || this.loadouts.some((l) => l.name === next)) return false;
    loadout.name = next;
    return true;
  }

  duplicateLoadout(name: string, copyName: string): boolean {
    const loadout = this.loadouts.find((l) => l.name === name);
    if (!loadout) return false;
    return this.saveLoadout({ ...loadout, name: copyName, slots: { ...loadout.slots }, favourite: false });
  }

  getLoadout(name: string): Loadout | null {
    return this.loadouts.find((l) => l.name === name) ?? null;
  }

  get allLoadouts(): readonly Loadout[] {
    return this.loadouts;
  }

  // ── Views & stats ────────────────────────────────────────────────────────

  recentlyAcquired(count: number): InventoryItem[] {
    return this.sorted("newest").slice(0, count);
  }

  get size(): number {
    return this.items.size;
  }

  countIn(location: StorageLocation): number {
    let count = 0;
    for (const item of this.items.values()) if (item.location === location) count += 1;
    return count;
  }

  // ── Persistence ──────────────────────────────────────────────────────────

  toSave(): InventorySaveData {
    return { items: [...this.items.values()], loadouts: this.loadouts, nextInstanceId: this.nextId };
  }

  loadSave(data: InventorySaveData): void {
    this.items.clear();
    for (const item of data.items) this.items.set(item.instanceId, item);
    this.loadouts = data.loadouts.slice(0, this.tuning.maxLoadouts);
    this.nextId = Math.max(1, data.nextInstanceId);
    this.touch();
  }

  private touch(): void {
    this.revision += 1;
  }
}

function comparatorFor(key: SortKey): (a: InventoryItem, b: InventoryItem) => number {
  switch (key) {
    case "rarity":
      return (a, b) => rarityIndex(b.drop.rarity) - rarityIndex(a.drop.rarity);
    case "power":
      return (a, b) => powerRating(b.drop) - powerRating(a.drop);
    case "itemLevel":
      return (a, b) => b.drop.itemLevel - a.drop.itemLevel;
    case "newest":
      return (a, b) => b.acquiredAt - a.acquiredAt;
    case "oldest":
      return (a, b) => a.acquiredAt - b.acquiredAt;
    case "name":
      return (a, b) => a.drop.baseItemId.localeCompare(b.drop.baseItemId);
    case "category":
      return (a, b) => a.drop.category.localeCompare(b.drop.category);
    case "affixCount":
      return (a, b) => b.drop.affixes.length - a.drop.affixes.length;
    case "craftingValue":
      return (a, b) =>
        RARITY_TABLE[b.drop.rarity].collectionValue - RARITY_TABLE[a.drop.rarity].collectionValue;
    case "favourite":
      return (a, b) => Number(b.favourite) - Number(a.favourite);
  }
}

function rarityIndex(rarity: Rarity): number {
  return RARITY_LADDER.indexOf(rarity);
}

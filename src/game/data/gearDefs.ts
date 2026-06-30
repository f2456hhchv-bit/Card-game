import type { DerivedStats } from "../entities/Player";

/**
 * Ship Gear — the Guardian's collectable equipment. Unlike a single fixed
 * module per slot, the player builds an **inventory** of many items dropped from
 * runs, then **equips one item per slot** (Hull / Core / Engines / Wings).
 *
 * Two progression axes, both genre-standard:
 *  1. **Merge** duplicate cores of an item to raise its **grade** (more stats).
 *  2. **Sets** — every item belongs to a set; equipping multiple pieces of the
 *     same set unlocks **set bonuses** (2-piece, and a big 4-piece payoff that
 *     grants a signature perk). This rewards collecting and completing a set.
 *
 * Item/equip/merge state lives in the save (`save.gear`).
 */

/** The four ship-system slots. One item may be equipped in each. */
export type GearSlot = "hull" | "core" | "engines" | "wings";
export const SLOTS: GearSlot[] = ["hull", "core", "engines", "wings"];

/** Per-item persisted state (shared shape for inventory entries). */
export interface ModuleState {
  /** Current grade, 1..maxGrade. 0 = not owned. */
  grade: number;
  /** Duplicate cores banked toward the next merge. */
  dupes: number;
}

/** Slot presentation + the base stat each slot grants per grade. */
export const SLOT_META: Record<
  GearSlot,
  {
    label: string;
    /** Noun used to build item names, e.g. "Solaris Drive". */
    noun: string;
    icon: string;
    apply: (s: DerivedStats, grade: number) => void;
    note: (grade: number) => string;
  }
> = {
  hull: {
    label: "Hull",
    noun: "Hull",
    icon: "🛡",
    apply: (s, g) => {
      s.maxHp += 6 * g;
      s.armor += 0.015 * g;
    },
    note: (g) => `+${6 * g} HP · +${(1.5 * g).toFixed(1)}% armour`,
  },
  core: {
    label: "Core",
    noun: "Core",
    icon: "⚛",
    apply: (s, g) => {
      s.damageMult *= 1 + 0.035 * g;
    },
    note: (g) => `+${(3.5 * g).toFixed(0)}% damage`,
  },
  engines: {
    label: "Engines",
    noun: "Drive",
    icon: "🚀",
    apply: (s, g) => {
      s.moveSpeed *= 1 + 0.025 * g;
      s.pickupRadius += 8 * g;
    },
    note: (g) => `+${(2.5 * g).toFixed(0)}% speed · +${8 * g} pickup`,
  },
  wings: {
    label: "Wings",
    noun: "Wings",
    icon: "🪽",
    apply: (s, g) => {
      s.attackSpeedMult *= 1 + 0.025 * g;
      s.areaMult *= 1 + 0.02 * g;
    },
    note: (g) => `+${(2.5 * g).toFixed(0)}% atk spd · +${(2 * g).toFixed(0)}% area`,
  },
};

export interface GearSetDef {
  id: string;
  name: string;
  hue: number;
  description: string;
  /** Bonus applied when 2+ pieces of the set are equipped. */
  bonus2: (s: DerivedStats) => void;
  bonus2Note: string;
  /** Big payoff when all 4 pieces are equipped (grants a signature perk). */
  bonus4: (s: DerivedStats) => void;
  bonus4Note: string;
}

export const GEAR_SETS: Record<string, GearSetDef> = {
  salvager: {
    id: "salvager",
    name: "Salvager",
    hue: 200,
    description: "Scavenged plating from fallen ships — dependable, all-round.",
    bonus2: (s) => (s.xpMult *= 1.06),
    bonus2Note: "+6% XP gain",
    bonus4: (s) => {
      s.damageMult *= 1.08;
      s.maxHp += 25;
    },
    bonus4Note: "+8% damage & +25 Max HP",
  },
  solaris: {
    id: "solaris",
    name: "Solaris",
    hue: 30,
    description: "Reactor-grade alloys that channel raw light into firepower.",
    bonus2: (s) => (s.damageMult *= 1.08),
    bonus2Note: "+8% damage",
    bonus4: (s) => {
      s.pulseDamage = 30;
      s.damageMult *= 1.12;
    },
    bonus4Note: "Overdrive light pulse + 12% damage",
  },
  bastion: {
    id: "bastion",
    name: "Bastion",
    hue: 280,
    description: "Heavy warding plate built to outlast the dark.",
    bonus2: (s) => (s.maxHp += 30),
    bonus2Note: "+30 Max HP",
    bonus4: (s) => {
      s.revive += 1;
      s.armor += 0.06;
    },
    bonus4Note: "Aegis revive (survive a lethal hit) + 6% armour",
  },
  zephyr: {
    id: "zephyr",
    name: "Zephyr",
    hue: 150,
    description: "Featherlight racing frame tuned for speed and salvos.",
    bonus2: (s) => (s.moveSpeed *= 1.08),
    bonus2Note: "+8% move speed",
    bonus4: (s) => {
      s.extraProjectiles += 1;
      s.iframes += 0.25;
    },
    bonus4Note: "+1 projectile on every weapon & +0.25s i-frames",
  },
  tempest: {
    id: "tempest",
    name: "Tempest",
    hue: 192,
    description: "Storm-charged targeting array built around the perfect strike.",
    bonus2: (s) => (s.critChance += 0.1),
    bonus2Note: "+10% crit chance",
    bonus4: (s) => {
      s.critMult += 0.6;
      s.attackSpeedMult *= 1.06;
    },
    bonus4Note: "+60% crit damage & +6% attack speed",
  },
  nebula: {
    id: "nebula",
    name: "Nebula",
    hue: 110,
    description: "Living energy lattice that knits the hull back together.",
    bonus2: (s) => (s.regen += 0.8),
    bonus2Note: "+0.8 HP regen/s",
    bonus4: (s) => {
      s.maxHp += 40;
      s.regen += 0.7;
      s.armor += 0.05;
    },
    bonus4Note: "+40 Max HP, +0.7 regen/s & +5% armour",
  },
};

export const SET_LIST: GearSetDef[] = Object.values(GEAR_SETS);

export interface GearItemDef {
  id: string;
  setId: string;
  slot: GearSlot;
  name: string;
  icon: string;
  hue: number;
  maxGrade: number;
  apply: (s: DerivedStats, grade: number) => void;
  note: (grade: number) => string;
}

/** Stable item id for a (set, slot) pair. */
export function itemId(setId: string, slot: GearSlot): string {
  return `${setId}_${slot}`;
}

/** Build the 16 items (4 sets × 4 slots) from set + slot metadata. */
function buildItems(): Record<string, GearItemDef> {
  const out: Record<string, GearItemDef> = {};
  for (const set of SET_LIST) {
    for (const slot of SLOTS) {
      const meta = SLOT_META[slot];
      const id = itemId(set.id, slot);
      out[id] = {
        id,
        setId: set.id,
        slot,
        name: `${set.name} ${meta.noun}`,
        icon: meta.icon,
        hue: set.hue,
        maxGrade: 5,
        apply: meta.apply,
        note: meta.note,
      };
    }
  }
  return out;
}

export const GEAR_ITEMS: Record<string, GearItemDef> = buildItems();
export const ITEM_LIST: GearItemDef[] = Object.values(GEAR_ITEMS);

/** Duplicates needed to merge from `grade` to `grade + 1` (1,2,3,4 → 10 total). */
export function mergeCost(grade: number): number {
  return grade;
}

/** Equipped map: slot → item id (or null when the slot is empty). */
export type EquipMap = Record<GearSlot, string | null>;

/** A fresh, all-empty equip map. */
export function emptyEquip(): EquipMap {
  return { hull: null, core: null, engines: null, wings: null };
}

/**
 * Count how many pieces of each set are present in an equip map (using the
 * inventory to confirm the item is actually owned).
 */
export function setCounts(
  equipped: EquipMap,
  inventory: Record<string, ModuleState>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const slot of SLOTS) {
    const id = equipped[slot];
    if (!id) continue;
    const item = GEAR_ITEMS[id];
    const st = inventory[id];
    if (!item || !st || st.grade <= 0) continue;
    counts[item.setId] = (counts[item.setId] ?? 0) + 1;
  }
  return counts;
}

/** How many sets the player fully owns (all 4 slot pieces at grade ≥ 1). */
export function completedSets(inventory: Record<string, ModuleState>): number {
  let n = 0;
  for (const set of SET_LIST) {
    if (SLOTS.every((slot) => (inventory[itemId(set.id, slot)]?.grade ?? 0) > 0)) n++;
  }
  return n;
}

/** How many owned items are at their max grade. */
export function maxedItems(inventory: Record<string, ModuleState>): number {
  let n = 0;
  for (const item of ITEM_LIST) {
    const m = inventory[item.id];
    if (m && m.grade >= item.maxGrade) n++;
  }
  return n;
}

/**
 * Apply all equipped items + any earned set bonuses onto a base stat block.
 */
export function applyGear(
  stats: DerivedStats,
  equipped: EquipMap,
  inventory: Record<string, ModuleState>,
): void {
  // Per-item grade stats.
  for (const slot of SLOTS) {
    const id = equipped[slot];
    if (!id) continue;
    const item = GEAR_ITEMS[id];
    const st = inventory[id];
    if (!item || !st || st.grade <= 0) continue;
    item.apply(stats, Math.min(st.grade, item.maxGrade));
  }
  // Set bonuses (2-piece, then the big 4-piece).
  const counts = setCounts(equipped, inventory);
  for (const setId in counts) {
    const set = GEAR_SETS[setId];
    if (!set) continue;
    if (counts[setId] >= 2) set.bonus2(stats);
    if (counts[setId] >= 4) set.bonus4(stats);
  }
}

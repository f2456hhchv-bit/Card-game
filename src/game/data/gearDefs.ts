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

/** A rolled bonus sub-stat on an item (id + magnitude). */
export interface Affix {
  id: string;
  value: number;
}

/** Per-item persisted state (shared shape for inventory entries). */
export interface ModuleState {
  /** Current grade, 1..maxGrade. 0 = not owned. */
  grade: number;
  /** Duplicate cores banked toward the next merge. */
  dupes: number;
  /** Rarity tier index (0=Common … 3=Legendary). Optional for old saves. */
  rarity?: number;
  /** Rolled bonus sub-stats; count scales with rarity. Optional for old saves. */
  affixes?: Affix[];
}

/**
 * Rarity tiers — a second progression axis. Every drop rolls a rarity that
 * multiplies the item's stats; a luckier roll upgrades the item's rarity. This
 * gives long-tail chase depth on top of grade-merging.
 */
export interface RarityTier {
  name: string;
  hue: number;
  sat: number;
  /** Stat multiplier applied to the item's per-grade contribution. */
  mult: number;
  /** Relative drop weight. */
  weight: number;
}

export const RARITIES: RarityTier[] = [
  { name: "Common", hue: 210, sat: 6, mult: 1.0, weight: 60 },
  { name: "Rare", hue: 205, sat: 80, mult: 1.25, weight: 28 },
  { name: "Epic", hue: 282, sat: 72, mult: 1.6, weight: 10 },
  { name: "Legendary", hue: 42, sat: 92, mult: 2.1, weight: 2 },
];

export function rarityMult(r: number): number {
  return RARITIES[r]?.mult ?? 1;
}

export function rarityName(r: number): string {
  return (RARITIES[r] ?? RARITIES[0]).name;
}

/** CSS colour for a rarity tier. */
export function rarityColor(r: number): string {
  const t = RARITIES[r] ?? RARITIES[0];
  return `hsl(${t.hue} ${t.sat}% 62%)`;
}

/** Weighted-random rarity index. `rand` defaults to Math.random (injectable). */
export function rollRarity(rand: () => number = Math.random): number {
  const total = RARITIES.reduce((a, t) => a + t.weight, 0);
  let roll = rand() * total;
  for (let i = 0; i < RARITIES.length; i++) {
    roll -= RARITIES[i].weight;
    if (roll < 0) return i;
  }
  return 0;
}

/**
 * Affixes — rolled bonus sub-stats layered on top of an item's slot stat. The
 * **number** of affixes scales with rarity (Common 0 → Legendary 3), so rarity
 * matters twice over. Magnitudes are rolled once at drop time and persisted.
 */
export interface AffixDef {
  id: string;
  label: string;
  /** Inclusive roll range for the magnitude. */
  roll: [number, number];
  /** Round to an integer (for flat HP / pickup). */
  int?: boolean;
  apply: (s: DerivedStats, value: number) => void;
  format: (value: number) => string;
}

export const AFFIX_DEFS: Record<string, AffixDef> = {
  dmg: {
    id: "dmg",
    label: "Damage",
    roll: [0.02, 0.06],
    apply: (s, v) => (s.damageMult *= 1 + v),
    format: (v) => `+${(v * 100).toFixed(0)}% damage`,
  },
  crit: {
    id: "crit",
    label: "Crit",
    roll: [0.02, 0.05],
    apply: (s, v) => (s.critChance += v),
    format: (v) => `+${(v * 100).toFixed(0)}% crit`,
  },
  critdmg: {
    id: "critdmg",
    label: "Crit Damage",
    roll: [0.08, 0.2],
    apply: (s, v) => (s.critMult += v),
    format: (v) => `+${(v * 100).toFixed(0)}% crit dmg`,
  },
  hp: {
    id: "hp",
    label: "Max HP",
    roll: [6, 16],
    int: true,
    apply: (s, v) => (s.maxHp += v),
    format: (v) => `+${v} Max HP`,
  },
  armor: {
    id: "armor",
    label: "Armour",
    roll: [0.01, 0.03],
    apply: (s, v) => (s.armor += v),
    format: (v) => `+${(v * 100).toFixed(1)}% armour`,
  },
  regen: {
    id: "regen",
    label: "Regen",
    roll: [0.2, 0.6],
    apply: (s, v) => (s.regen += v),
    format: (v) => `+${v.toFixed(1)} regen/s`,
  },
  move: {
    id: "move",
    label: "Move Speed",
    roll: [0.02, 0.05],
    apply: (s, v) => (s.moveSpeed *= 1 + v),
    format: (v) => `+${(v * 100).toFixed(0)}% move`,
  },
  atkspd: {
    id: "atkspd",
    label: "Attack Speed",
    roll: [0.02, 0.05],
    apply: (s, v) => (s.attackSpeedMult *= 1 + v),
    format: (v) => `+${(v * 100).toFixed(0)}% atk speed`,
  },
  area: {
    id: "area",
    label: "Area",
    roll: [0.02, 0.05],
    apply: (s, v) => (s.areaMult *= 1 + v),
    format: (v) => `+${(v * 100).toFixed(0)}% area`,
  },
  pickup: {
    id: "pickup",
    label: "Pickup",
    roll: [6, 16],
    int: true,
    apply: (s, v) => (s.pickupRadius += v),
    format: (v) => `+${v} pickup`,
  },
  xp: {
    id: "xp",
    label: "XP Gain",
    roll: [0.03, 0.08],
    apply: (s, v) => (s.xpMult *= 1 + v),
    format: (v) => `+${(v * 100).toFixed(0)}% XP`,
  },
  projspd: {
    id: "projspd",
    label: "Projectile Speed",
    roll: [0.03, 0.08],
    apply: (s, v) => (s.projectileSpeedMult *= 1 + v),
    format: (v) => `+${(v * 100).toFixed(0)}% proj speed`,
  },
  iframe: {
    id: "iframe",
    label: "Evasion",
    roll: [0.05, 0.15],
    apply: (s, v) => (s.iframes += v),
    format: (v) => `+${v.toFixed(2)}s i-frames`,
  },
};

export const AFFIX_LIST: AffixDef[] = Object.values(AFFIX_DEFS);

/** Number of affixes an item of the given rarity carries. */
export function affixCount(rarity: number): number {
  return [0, 1, 2, 3][rarity] ?? 0;
}

/** Human-readable text for a rolled affix. */
export function affixText(a: Affix): string {
  const def = AFFIX_DEFS[a.id];
  return def ? def.format(a.value) : "";
}

/**
 * Roll affixes up to the rarity's count, keeping any `existing` ones (so a
 * rarity upgrade only *adds* affixes, never downgrades). `rand` is injectable.
 */
export function rollAffixes(
  rarity: number,
  existing: Affix[] = [],
  rand: () => number = Math.random,
): Affix[] {
  const target = affixCount(rarity);
  const out = existing.slice(0, target);
  const used = new Set(out.map((a) => a.id));
  const pool = AFFIX_LIST.filter((d) => !used.has(d.id));
  while (out.length < target && pool.length > 0) {
    const i = Math.floor(rand() * pool.length);
    const def = pool.splice(i, 1)[0];
    const raw = def.roll[0] + rand() * (def.roll[1] - def.roll[0]);
    out.push({ id: def.id, value: def.int ? Math.round(raw) : Math.round(raw * 1000) / 1000 });
  }
  return out;
}

/** Apply an item's rolled affixes onto a stat block. */
export function applyAffixes(stats: DerivedStats, affixes: Affix[] | undefined): void {
  if (!affixes) return;
  for (const a of affixes) AFFIX_DEFS[a.id]?.apply(stats, a.value);
}

/** Slot presentation + the base stat each slot grants per grade. */
export const SLOT_META: Record<
  GearSlot,
  {
    label: string;
    /** Noun used to build item names, e.g. "Solaris Drive". */
    noun: string;
    icon: string;
    /** @param m rarity stat multiplier (1 = Common). */
    apply: (s: DerivedStats, grade: number, m: number) => void;
    note: (grade: number, m: number) => string;
  }
> = {
  hull: {
    label: "Hull",
    noun: "Hull",
    icon: "🛡",
    apply: (s, g, m) => {
      s.maxHp += 6 * g * m;
      s.armor += 0.015 * g * m;
    },
    note: (g, m) => `+${Math.round(6 * g * m)} HP · +${(1.5 * g * m).toFixed(1)}% armour`,
  },
  core: {
    label: "Core",
    noun: "Core",
    icon: "⚛",
    apply: (s, g, m) => {
      s.damageMult *= 1 + 0.035 * g * m;
    },
    note: (g, m) => `+${(3.5 * g * m).toFixed(0)}% damage`,
  },
  engines: {
    label: "Engines",
    noun: "Drive",
    icon: "🚀",
    apply: (s, g, m) => {
      s.moveSpeed *= 1 + 0.025 * g * m;
      s.pickupRadius += 8 * g * m;
    },
    note: (g, m) => `+${(2.5 * g * m).toFixed(0)}% speed · +${Math.round(8 * g * m)} pickup`,
  },
  wings: {
    label: "Wings",
    noun: "Wings",
    icon: "🪽",
    apply: (s, g, m) => {
      s.attackSpeedMult *= 1 + 0.025 * g * m;
      s.areaMult *= 1 + 0.02 * g * m;
    },
    note: (g, m) =>
      `+${(2.5 * g * m).toFixed(0)}% atk spd · +${(2 * g * m).toFixed(0)}% area`,
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
  vanguard: {
    id: "vanguard",
    name: "Vanguard",
    hue: 12,
    description: "Frontline assault plating forged for relentless offense.",
    bonus2: (s) => (s.attackSpeedMult *= 1.08),
    bonus2Note: "+8% attack speed",
    bonus4: (s) => {
      s.damageMult *= 1.1;
      s.critChance += 0.05;
    },
    bonus4Note: "+10% damage & +5% crit chance",
  },
  warp: {
    id: "warp",
    name: "Warp",
    hue: 258,
    description: "Phase-tuned frame that hurls light farther, faster and wider.",
    bonus2: (s) => (s.projectileSpeedMult *= 1.15),
    bonus2Note: "+15% projectile speed",
    bonus4: (s) => {
      s.areaMult *= 1.15;
      s.projectileSpeedMult *= 1.12;
    },
    bonus4Note: "+15% area & +12% projectile speed",
  },
  harvester: {
    id: "harvester",
    name: "Harvester",
    hue: 84,
    description: "Scavenger rig that draws in light and wrings out every mote.",
    bonus2: (s) => (s.pickupRadius += 30),
    bonus2Note: "+30 pickup radius",
    bonus4: (s) => {
      s.xpMult *= 1.14;
      s.pickupRadius += 25;
    },
    bonus4Note: "+14% XP gain & +25 pickup radius",
  },
  juggernaut: {
    id: "juggernaut",
    name: "Juggernaut",
    hue: 326,
    description: "Siege-grade bulwark that trades nothing for staying power.",
    bonus2: (s) => (s.maxHp += 40),
    bonus2Note: "+40 Max HP",
    bonus4: (s) => {
      s.damageMult *= 1.1;
      s.armor += 0.08;
    },
    bonus4Note: "+10% damage & +8% armour",
  },
  corona: {
    id: "corona",
    name: "Corona",
    hue: 45,
    description: "Solar lattice that erupts in cleansing waves of light.",
    bonus2: (s) => (s.areaMult *= 1.1),
    bonus2Note: "+10% area",
    bonus4: (s) => {
      s.pulseDamage = Math.max(s.pulseDamage, 26);
      s.areaMult *= 1.08;
    },
    bonus4Note: "Overdrive light pulse + 8% area",
  },
  phantom: {
    id: "phantom",
    name: "Phantom",
    hue: 196,
    description: "Ghost-frame woven for evasion and the perfect dodge.",
    bonus2: (s) => (s.iframes += 0.2),
    bonus2Note: "+0.2s i-frames",
    bonus4: (s) => {
      s.moveSpeed *= 1.1;
      s.extraProjectiles += 1;
    },
    bonus4Note: "+10% move speed & +1 projectile",
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
  apply: (s: DerivedStats, grade: number, mult: number) => void;
  note: (grade: number, mult: number) => string;
}

/** Stable item id for a (set, slot) pair. */
export function itemId(setId: string, slot: GearSlot): string {
  return `${setId}_${slot}`;
}

/** Build every item (one per set × slot) from set + slot metadata. */
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

/** Alloy yielded per banked duplicate when dismantled (scales with rarity). */
export function dismantleValue(rarity: number): number {
  return 1 + rarity; // Common 1 … Legendary 4 per core
}

/** Alloy cost to reroll an item's affixes (scales with rarity; Common = n/a). */
export function rerollCost(rarity: number): number {
  return [0, 4, 10, 25][rarity] ?? 0;
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
  // Per-item grade stats, scaled by the item's rarity multiplier.
  for (const slot of SLOTS) {
    const id = equipped[slot];
    if (!id) continue;
    const item = GEAR_ITEMS[id];
    const st = inventory[id];
    if (!item || !st || st.grade <= 0) continue;
    item.apply(stats, Math.min(st.grade, item.maxGrade), rarityMult(st.rarity ?? 0));
    applyAffixes(stats, st.affixes);
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

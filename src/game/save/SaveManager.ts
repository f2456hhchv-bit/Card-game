import type { AudioSettings } from "../audio/AudioManager";
import type { RunStats } from "../World";
import {
  GEAR_ITEMS,
  ITEM_LIST,
  SLOTS,
  emptyEquip,
  itemId,
  mergeCost,
  rollRarity,
  rollAffixes,
  dismantleValue,
  rerollCost,
  type EquipMap,
  type GearSlot,
  type ModuleState,
} from "../data/gearDefs";

/**
 * Persistent profile saved to localStorage. This is the meta-progression and
 * settings layer that survives between runs. The structure is versioned so
 * future changes can migrate old saves rather than wiping them — see
 * docs/SaveDataStructure.md for the authoritative schema.
 */
export const SAVE_VERSION = 1;
const SAVE_KEY = "afterlight.save.v1";

export interface AccessibilitySettings {
  reduceMotion: boolean;
  screenShake: boolean;
  damageNumbers: boolean;
  highContrast: boolean;
}

export interface SaveData {
  version: number;
  /** Persistent soft currency earned from runs (light motes). */
  motes: number;
  /** Salvage currency from dismantling spare gear cores (used to reroll affixes). */
  alloy: number;
  /** Best survival time in seconds. */
  bestTime: number;
  /** Most kills in a single run. */
  bestKills: number;
  /** Total kills across all runs (lifetime stat). */
  totalKills: number;
  /** Total runs played. */
  runsPlayed: number;
  /** Lifetime aggregates across all runs. */
  lifetime: {
    time: number; // total seconds survived
    damage: number; // total damage dealt
    bosses: number; // bosses defeated
    elites: number; // elites felled
  };
  /** Unlocked achievement ids. */
  achievements: string[];
  /** Whether the first-run control hints have been shown. */
  tutorialSeen: boolean;
  /** Permanent meta-upgrade levels, keyed by upgrade id (see metaDefs). */
  meta: Record<string, number>;
  /** Ship gear: a collected inventory of items plus what's equipped per slot. */
  gear: {
    /** Owned items, keyed by item id (grade + banked duplicate cores). */
    inventory: Record<string, ModuleState>;
    /** Equipped item id per ship slot (null = empty). */
    equipped: EquipMap;
    /** Pity counters so drops can't go cold (consecutive dupes / non-Rare). */
    pity: { sinceNew: number; sinceRare: number };
  };
  /** Best Boss Rush result: most bosses felled in a single rush. */
  bossRushBest: number;
  /** Best Endless result: highest Ascension tier reached. */
  endlessBest: number;
  /** Best time/kills per stage id (normal runs), for the Records screen. */
  stageBest: Record<string, { time: number; kills: number }>;
  /** Unlocked Warden ids. */
  wardens: string[];
  /** Currently selected Warden id. */
  selectedWarden: string;
  /** Currently selected stage id (see stageDefs). */
  selectedStage: string;
  /** Today's Daily Run best (resets when the date rolls over). */
  daily: { date: string; bestTime: number; bestKills: number };
  audio: AudioSettings;
  accessibility: AccessibilitySettings;
}

function defaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    motes: 0,
    alloy: 0,
    bestTime: 0,
    bestKills: 0,
    totalKills: 0,
    runsPlayed: 0,
    lifetime: { time: 0, damage: 0, bosses: 0, elites: 0 },
    achievements: [],
    tutorialSeen: false,
    meta: {},
    gear: { inventory: {}, equipped: emptyEquip(), pity: { sinceNew: 0, sinceRare: 0 } },
    bossRushBest: 0,
    endlessBest: 0,
    stageBest: {},
    wardens: ["lumen"],
    selectedWarden: "lumen",
    selectedStage: "fade",
    daily: { date: "", bestTime: 0, bestKills: 0 },
    audio: { master: 0.8, sfx: 0.9, music: 0.5, muted: false },
    accessibility: {
      reduceMotion: false,
      screenShake: true,
      damageNumbers: true,
      highContrast: false,
    },
  };
}

export class SaveManager {
  data: SaveData = defaultSave();

  /** Consecutive duplicate drops before a new item is forced (if any remain). */
  private static readonly NEW_PITY = 6;
  /** Consecutive non-Rare drops before a Rare+ is guaranteed. */
  private static readonly RARE_PITY = 7;

  load(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        this.data = defaultSave();
        return this.data;
      }
      const parsed = JSON.parse(raw) as Partial<SaveData>;
      this.data = this.migrate(parsed);
    } catch {
      // Corrupt save — fall back to defaults rather than crashing.
      this.data = defaultSave();
    }
    return this.data;
  }

  /** Merge an unknown/old save onto current defaults, filling gaps. */
  private migrate(parsed: Partial<SaveData>): SaveData {
    const base = defaultSave();
    // Returning players (who already have runs) shouldn't be shown the new
    // first-run tutorial; only brand-new profiles get it.
    const tutorialSeen =
      parsed.tutorialSeen ?? (parsed.runsPlayed ?? 0) > 0;
    return {
      ...base,
      ...parsed,
      version: SAVE_VERSION,
      tutorialSeen,
      alloy: parsed.alloy ?? 0,
      meta: parsed.meta ?? {},
      gear: this.migrateGear(parsed),
      bossRushBest: parsed.bossRushBest ?? 0,
      endlessBest: parsed.endlessBest ?? 0,
      stageBest: parsed.stageBest ?? {},
      lifetime: parsed.lifetime ?? { time: 0, damage: 0, bosses: 0, elites: 0 },
      wardens: parsed.wardens ?? ["lumen"],
      selectedWarden: parsed.selectedWarden ?? "lumen",
      selectedStage: parsed.selectedStage ?? "fade",
      daily: parsed.daily ?? { date: "", bestTime: 0, bestKills: 0 },
      audio: { ...base.audio, ...(parsed.audio ?? {}) },
      accessibility: { ...base.accessibility, ...(parsed.accessibility ?? {}) },
      achievements: parsed.achievements ?? [],
    };
  }

  /**
   * Build the gear block from a parsed save, migrating the old single-module
   * format (`modules: {plating,reactor,thrusters,wings}`) into the new inventory
   * by mapping each legacy module to the matching Salvager-set item and
   * auto-equipping it, so existing players keep their progress (and start with a
   * partial/whole Salvager set).
   */
  private migrateGear(parsed: Partial<SaveData> & { modules?: Record<string, ModuleState> }): SaveData["gear"] {
    const pity = parsed.gear?.pity ?? { sinceNew: 0, sinceRare: 0 };
    if (parsed.gear?.inventory && parsed.gear?.equipped) {
      // Already in the new format; just ensure all slots + pity exist.
      return {
        inventory: parsed.gear.inventory,
        equipped: { ...emptyEquip(), ...parsed.gear.equipped },
        pity,
      };
    }
    const inventory: Record<string, ModuleState> = {};
    const equipped = emptyEquip();
    const legacy = parsed.modules;
    if (legacy) {
      const map: Record<string, GearSlot> = {
        plating: "hull",
        reactor: "core",
        thrusters: "engines",
        wings: "wings",
      };
      for (const oldId in map) {
        const m = legacy[oldId];
        if (!m || m.grade <= 0) continue;
        const slot = map[oldId];
        const id = itemId("salvager", slot);
        inventory[id] = { grade: m.grade, dupes: m.dupes, rarity: 0 };
        equipped[slot] = id; // auto-equip the migrated piece
      }
    }
    return { inventory, equipped, pity };
  }

  save(): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch {
      // Storage may be unavailable (private mode); progression is best-effort.
    }
  }

  /**
   * Record the outcome of a finished run and persist. `ctx` carries the run mode
   * so per-mode records (per-stage bests, Boss Rush best) update correctly.
   * Returns which global records fell.
   */
  recordRun(
    stats: RunStats,
    motesEarned: number,
    ctx: { stageId: string; bossRush: boolean; endless: boolean; daily: boolean } = {
      stageId: "fade",
      bossRush: false,
      endless: false,
      daily: false,
    },
  ): {
    newBestTime: boolean;
    newBestKills: boolean;
    newBestRush: boolean;
    newBestEndless: boolean;
  } {
    const d = this.data;
    d.runsPlayed++;
    d.totalKills += stats.kills;
    d.motes += motesEarned;
    d.lifetime.time += stats.elapsed;
    d.lifetime.damage += stats.damageDealt;
    d.lifetime.bosses += stats.bossKills;
    d.lifetime.elites += stats.eliteKills;
    const newBestTime = stats.elapsed > d.bestTime;
    const newBestKills = stats.kills > d.bestKills;
    if (newBestTime) d.bestTime = stats.elapsed;
    if (newBestKills) d.bestKills = stats.kills;

    // Mode-specific bests.
    let newBestRush = false;
    let newBestEndless = false;
    if (ctx.bossRush) {
      newBestRush = stats.bossKills > d.bossRushBest;
      if (newBestRush) d.bossRushBest = stats.bossKills;
    } else if (ctx.endless) {
      newBestEndless = stats.ascension > d.endlessBest;
      if (newBestEndless) d.endlessBest = stats.ascension;
    } else if (!ctx.daily) {
      // Per-stage best for normal (campaign) runs.
      const prev = d.stageBest[ctx.stageId] ?? { time: 0, kills: 0 };
      d.stageBest[ctx.stageId] = {
        time: Math.max(prev.time, stats.elapsed),
        kills: Math.max(prev.kills, stats.kills),
      };
    }

    this.save();
    return { newBestTime, newBestKills, newBestRush, newBestEndless };
  }

  /**
   * Record a Daily Run result. Resets the day's best when the date rolls over,
   * then keeps the best time/kills for that date. Returns whether a record fell.
   */
  recordDaily(
    date: string,
    timeSeconds: number,
    kills: number,
  ): { newBestTime: boolean; newBestKills: boolean } {
    const d = this.data;
    if (d.daily.date !== date) {
      d.daily = { date, bestTime: 0, bestKills: 0 };
    }
    const newBestTime = timeSeconds > d.daily.bestTime;
    const newBestKills = kills > d.daily.bestKills;
    if (newBestTime) d.daily.bestTime = timeSeconds;
    if (newBestKills) d.daily.bestKills = kills;
    this.save();
    return { newBestTime, newBestKills };
  }

  /**
   * Grant a random gear-item drop. A brand-new item is owned at grade 1 (and
   * auto-equipped if its slot is empty); a duplicate banks a core toward a merge.
   * Every drop also rolls a **rarity** — a luckier roll upgrades the item's
   * rarity (its stat multiplier), a second long-tail progression axis.
   */
  grantItemDrop(): { id: string; isNew: boolean; rarity: number; rarityUp: boolean } {
    const inv = this.data.gear.inventory;
    const pity = this.data.gear.pity;

    // New-item pity: after enough consecutive duplicates, force an unowned item
    // (if any remain) so collection never fully stalls.
    const unowned = ITEM_LIST.filter((it) => (inv[it.id]?.grade ?? 0) === 0);
    const forceNew = unowned.length > 0 && pity.sinceNew >= SaveManager.NEW_PITY;
    const def = forceNew
      ? unowned[Math.floor(Math.random() * unowned.length)]
      : ITEM_LIST[Math.floor(Math.random() * ITEM_LIST.length)];

    // Rarity pity: guarantee at least Rare when the dry streak gets long.
    let rolled = rollRarity();
    if (pity.sinceRare >= SaveManager.RARE_PITY && rolled < 1) rolled = 1;

    const m = inv[def.id] ?? { grade: 0, dupes: 0, rarity: 0, affixes: [] };
    let isNew = false;
    let rarityUp = false;
    if (m.grade === 0) {
      m.grade = 1;
      m.rarity = rolled;
      m.affixes = rollAffixes(rolled);
      isNew = true;
      if (this.data.gear.equipped[def.slot] == null) {
        this.data.gear.equipped[def.slot] = def.id;
      }
    } else {
      m.dupes++;
      if (rolled > (m.rarity ?? 0)) {
        m.rarity = rolled;
        // A higher rarity adds affixes (keeping the existing rolls).
        m.affixes = rollAffixes(rolled, m.affixes ?? []);
        rarityUp = true;
      }
    }
    inv[def.id] = m;

    // Advance pity counters.
    pity.sinceNew = isNew ? 0 : pity.sinceNew + 1;
    pity.sinceRare = rolled >= 1 ? 0 : pity.sinceRare + 1;

    this.save();
    return { id: def.id, isNew, rarity: m.rarity ?? 0, rarityUp };
  }

  /** Merge banked duplicates to raise an item's grade. Returns the new grade. */
  mergeItem(id: string): number | null {
    const def = GEAR_ITEMS[id];
    const m = this.data.gear.inventory[id];
    if (!def || !m || m.grade >= def.maxGrade) return null;
    const cost = mergeCost(m.grade);
    if (m.dupes < cost) return null;
    m.dupes -= cost;
    m.grade++;
    this.save();
    return m.grade;
  }

  /** Dismantle all banked duplicate cores of an item into Alloy. */
  dismantleDupes(id: string): number | null {
    const m = this.data.gear.inventory[id];
    if (!m || m.dupes <= 0) return null;
    const gain = m.dupes * dismantleValue(m.rarity ?? 0);
    m.dupes = 0;
    this.data.alloy += gain;
    this.save();
    return gain;
  }

  /** Reroll an item's affixes for Alloy. Returns the new affix count, or null. */
  rerollAffixes(id: string): number | null {
    const m = this.data.gear.inventory[id];
    if (!m || m.grade <= 0) return null;
    const rarity = m.rarity ?? 0;
    if (rarity < 1) return null; // Common has no affixes to reroll
    const cost = rerollCost(rarity);
    if (this.data.alloy < cost) return null;
    this.data.alloy -= cost;
    // A fresh roll (new ids + magnitudes) of the same count for this rarity.
    m.affixes = rollAffixes(rarity);
    this.save();
    return m.affixes.length;
  }

  /** Equip an owned item into its slot. Returns false if not owned. */
  equipItem(id: string): boolean {
    const def = GEAR_ITEMS[id];
    const m = this.data.gear.inventory[id];
    if (!def || !m || m.grade <= 0) return false;
    this.data.gear.equipped[def.slot] = id;
    this.save();
    return true;
  }

  /** Clear a slot. */
  unequipSlot(slot: GearSlot): void {
    this.data.gear.equipped[slot] = null;
    this.save();
  }

  /** True if the player owns at least one item (used for UI hints). */
  hasAnyGear(): boolean {
    return SLOTS.some((slot) =>
      ITEM_LIST.some((it) => it.slot === slot && (this.data.gear.inventory[it.id]?.grade ?? 0) > 0),
    );
  }

  unlockAchievement(id: string): boolean {
    if (this.data.achievements.includes(id)) return false;
    this.data.achievements.push(id);
    this.save();
    return true;
  }
}

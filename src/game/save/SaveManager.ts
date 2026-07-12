import type { AudioSettings } from "../audio/AudioManager";
import type { RunStats } from "../World";
import { type RunSnapshot, SNAPSHOT_VERSION } from "./RunSnapshot";
import { signatureForBoss } from "../data/signatureDefs";
import { wardenXpToNext } from "../data/wardenDefs";
import {
  DIRECTIVE_DEFS,
  DAILY_DIRECTIVES,
  WEEKLY_DIRECTIVES,
  metricValue,
  pickDirectives,
  type DirectiveDef,
} from "../data/directiveDefs";
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
/** Separate key for the resumable mid-run snapshot (kept out of the profile). */
const RUN_KEY = "afterlight.run.v1";

export interface AccessibilitySettings {
  reduceMotion: boolean;
  screenShake: boolean;
  damageNumbers: boolean;
  highContrast: boolean;
  /** Bloom / colour-grade post-processing (off for weak devices). */
  bloom: boolean;
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
  /** Best Endless result: highest Ascension tier reached. */
  endlessBest: number;
  /** Campaign progress: number of Sectors cleared (= index of the next to play). */
  campaignProgress: number;
  /** Best time/kills per stage id (normal runs), for the Records screen. */
  stageBest: Record<string, { time: number; kills: number }>;
  /** Boss signatures: which are unlocked, and which one is equipped. */
  signatures: { owned: string[]; equipped: string | null };
  /** Unlocked Warden ids. */
  wardens: string[];
  /** Per-Warden mastery progress (level + banked XP), keyed by warden id. */
  wardenProgress: Record<string, { level: number; xp: number }>;
  /** Currently selected Warden id. */
  selectedWarden: string;
  /** Unlocked chassis (ship) ids. */
  chassis: string[];
  /** Currently selected chassis (ship) id. */
  selectedChassis: string;
  /** Currently selected stage id (see stageDefs). */
  selectedStage: string;
  /** Daily-cache login streak: consecutive days a cache was claimed. */
  streak: { count: number; lastClaim: string };
  /** Rotating objectives (3 daily + 1 weekly) with progress + claim state. */
  directives: {
    day: string;
    week: string;
    daily: string[];
    weekly: string[];
    progress: Record<string, number>;
    claimed: string[];
  };
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
    endlessBest: 0,
    campaignProgress: 0,
    stageBest: {},
    signatures: { owned: [], equipped: null },
    wardens: ["lumen"],
    wardenProgress: {},
    selectedWarden: "lumen",
    chassis: ["skiff"],
    selectedChassis: "skiff",
    selectedStage: "fade",
    streak: { count: 0, lastClaim: "" },
    directives: { day: "", week: "", daily: [], weekly: [], progress: {}, claimed: [] },
    audio: { master: 0.8, sfx: 0.9, music: 0.5, muted: false },
    accessibility: {
      reduceMotion: false,
      screenShake: true,
      damageNumbers: true,
      highContrast: false,
      bloom: true,
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
      endlessBest: parsed.endlessBest ?? 0,
      campaignProgress: parsed.campaignProgress ?? 0,
      stageBest: parsed.stageBest ?? {},
      signatures: parsed.signatures ?? { owned: [], equipped: null },
      lifetime: parsed.lifetime ?? { time: 0, damage: 0, bosses: 0, elites: 0 },
      wardens: parsed.wardens ?? ["lumen"],
      wardenProgress: parsed.wardenProgress ?? {},
      selectedWarden: parsed.selectedWarden ?? "lumen",
      chassis: parsed.chassis ?? ["skiff"],
      selectedChassis: parsed.selectedChassis ?? "skiff",
      selectedStage: parsed.selectedStage ?? "fade",
      streak: parsed.streak ?? { count: 0, lastClaim: "" },
      directives:
        parsed.directives ?? { day: "", week: "", daily: [], weekly: [], progress: {}, claimed: [] },
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

  // ---- Resumable run snapshot (mid-run "Continue") ----------------------

  /** Persist a mid-run snapshot so the run can be resumed later. */
  saveRunSnapshot(snap: RunSnapshot): void {
    try {
      localStorage.setItem(RUN_KEY, JSON.stringify(snap));
    } catch {
      // Best-effort; a lost snapshot just means no resume prompt.
    }
  }

  /** Load a resumable run snapshot, or null if none/incompatible/corrupt. */
  loadRunSnapshot(): RunSnapshot | null {
    try {
      const raw = localStorage.getItem(RUN_KEY);
      if (!raw) return null;
      const snap = JSON.parse(raw) as RunSnapshot;
      if (!snap || snap.version !== SNAPSHOT_VERSION) {
        this.clearRunSnapshot();
        return null;
      }
      return snap;
    } catch {
      return null;
    }
  }

  /** True when a resumable run is stored. */
  hasRunSnapshot(): boolean {
    return this.loadRunSnapshot() !== null;
  }

  /** Discard any stored run snapshot (run ended or abandoned). */
  clearRunSnapshot(): void {
    try {
      localStorage.removeItem(RUN_KEY);
    } catch {
      // Ignore.
    }
  }

  /**
   * Record the outcome of a finished run and persist. `ctx` carries the run mode
   * so per-mode records (per-stage bests for Story, Ascension best for Endless)
   * update correctly. Returns which global records fell.
   */
  recordRun(
    stats: RunStats,
    motesEarned: number,
    ctx: {
      stageId: string;
      endless: boolean;
    } = {
      stageId: "fade",
      endless: false,
    },
  ): {
    newBestTime: boolean;
    newBestKills: boolean;
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
    let newBestEndless = false;
    if (ctx.endless) {
      newBestEndless = stats.ascension > d.endlessBest;
      if (newBestEndless) d.endlessBest = stats.ascension;
    } else {
      // Per-stage best for Story runs.
      const prev = d.stageBest[ctx.stageId] ?? { time: 0, kills: 0 };
      d.stageBest[ctx.stageId] = {
        time: Math.max(prev.time, stats.elapsed),
        kills: Math.max(prev.kills, stats.kills),
      };
    }

    this.save();
    return { newBestTime, newBestKills, newBestEndless };
  }

  // ---- Daily cache (login streak) -----------------------------------------

  /** Local calendar day as YYYY-MM-DD. */
  private static ymd(d: Date): string {
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  }

  /** The reward for claiming the cache on the given (post-claim) streak day. */
  static dailyCacheReward(streak: number): { motes: number; alloy: number; gear: boolean } {
    const s = Math.max(1, streak);
    return {
      motes: 30 + Math.min(s, 10) * 15,
      alloy: s >= 3 ? 10 + Math.min(s, 10) * 5 : 0,
      gear: s % 5 === 0, // a gear drop every 5th consecutive day
    };
  }

  /**
   * Today's daily-cache state — whether it can be claimed, the streak it would
   * become, and the reward. Pure (does not mutate); `now` is injectable for tests.
   */
  dailyCacheStatus(now: Date = new Date()): {
    available: boolean;
    streak: number;
    reward: { motes: number; alloy: number; gear: boolean };
  } {
    const today = SaveManager.ymd(now);
    const yst = SaveManager.ymd(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
    const { count, lastClaim } = this.data.streak;
    const available = lastClaim !== today;
    let streak: number;
    if (lastClaim === today) streak = count; // already claimed today
    else if (lastClaim === yst) streak = count + 1; // streak continues
    else streak = 1; // fresh, or the streak lapsed
    return { available, streak, reward: SaveManager.dailyCacheReward(streak) };
  }

  /** Claim today's cache. Grants the reward and advances the streak, or returns
   *  null if it was already claimed today. */
  claimDailyCache(now: Date = new Date()): {
    motes: number;
    alloy: number;
    gear: { id: string; isNew: boolean; rarity: number; rarityUp: boolean } | null;
    streak: number;
  } | null {
    const status = this.dailyCacheStatus(now);
    if (!status.available) return null;
    this.data.streak = { count: status.streak, lastClaim: SaveManager.ymd(now) };
    this.data.motes += status.reward.motes;
    this.data.alloy += status.reward.alloy;
    const gear = status.reward.gear ? this.grantItemDrop() : null;
    this.save();
    return {
      motes: status.reward.motes,
      alloy: status.reward.alloy,
      gear,
      streak: status.streak,
    };
  }

  // ---- Directives (rotating objectives) -----------------------------------

  /** Local ISO-ish week key (integer week bucket), stable across a calendar week. */
  private static weekKey(now: Date): string {
    const dayNum = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
    // Anchor weeks to Monday (epoch day 0 = Thursday → offset by 4).
    return `W${Math.floor((dayNum + 4) / 7)}`;
  }

  /** Roll the daily/weekly boards over when their period has elapsed, clearing
   *  progress + claims for objectives that leave the active set. Idempotent. */
  refreshDirectives(now: Date = new Date()): void {
    const dir = this.data.directives;
    const dayKey = SaveManager.ymd(now);
    const weekKey = SaveManager.weekKey(now);
    let dirty = false;
    if (dir.day !== dayKey) {
      for (const id of dir.daily) delete dir.progress[id];
      dir.claimed = dir.claimed.filter((id) => !dir.daily.includes(id));
      dir.daily = pickDirectives(DAILY_DIRECTIVES, dayKey, 3);
      dir.day = dayKey;
      dirty = true;
    }
    if (dir.week !== weekKey) {
      for (const id of dir.weekly) delete dir.progress[id];
      dir.claimed = dir.claimed.filter((id) => !dir.weekly.includes(id));
      dir.weekly = pickDirectives(WEEKLY_DIRECTIVES, weekKey, 1);
      dir.week = weekKey;
      dirty = true;
    }
    if (dirty) this.save();
  }

  /** The active board: daily objectives then the weekly, with live progress. */
  activeDirectives(now: Date = new Date()): {
    def: DirectiveDef;
    progress: number;
    completed: boolean;
    claimed: boolean;
  }[] {
    this.refreshDirectives(now);
    const dir = this.data.directives;
    return [...dir.daily, ...dir.weekly]
      .map((id) => DIRECTIVE_DEFS[id])
      .filter((def): def is DirectiveDef => !!def)
      .map((def) => {
        const progress = Math.min(dir.progress[def.id] ?? 0, def.target);
        return {
          def,
          progress,
          completed: progress >= def.target,
          claimed: dir.claimed.includes(def.id),
        };
      });
  }

  /** Feed a finished run's stats into every active directive's progress. */
  recordDirectiveProgress(stats: RunStats, now: Date = new Date()): void {
    this.refreshDirectives(now);
    const dir = this.data.directives;
    for (const id of [...dir.daily, ...dir.weekly]) {
      const def = DIRECTIVE_DEFS[id];
      if (!def || dir.claimed.includes(id)) continue;
      const v = metricValue(def.metric, stats);
      const cur = dir.progress[id] ?? 0;
      dir.progress[id] = def.mode === "run" ? Math.max(cur, v) : cur + v;
    }
    this.save();
  }

  /** Claim a completed directive's reward. Returns the reward, or null. */
  claimDirective(id: string, now: Date = new Date()): { motes: number; alloy: number } | null {
    this.refreshDirectives(now);
    const dir = this.data.directives;
    const def = DIRECTIVE_DEFS[id];
    if (!def) return null;
    const active = dir.daily.includes(id) || dir.weekly.includes(id);
    if (!active || dir.claimed.includes(id)) return null;
    if ((dir.progress[id] ?? 0) < def.target) return null;
    dir.claimed.push(id);
    this.data.motes += def.reward.motes;
    this.data.alloy += def.reward.alloy;
    this.save();
    return { ...def.reward };
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

  /**
   * Unlock the signature a boss drops (first kill of that boss type). Auto-equips
   * it if no signature is currently equipped. Returns the signature id + isNew.
   */
  unlockSignature(bossId: string): { id: string; isNew: boolean } | null {
    const def = signatureForBoss(bossId);
    if (!def) return null;
    const sig = this.data.signatures;
    const isNew = !sig.owned.includes(def.id);
    if (isNew) {
      sig.owned.push(def.id);
      if (sig.equipped == null) sig.equipped = def.id;
      this.save();
    }
    return { id: def.id, isNew };
  }

  /** Equip an owned signature, or pass null to clear the slot. */
  equipSignature(id: string | null): boolean {
    if (id !== null && !this.data.signatures.owned.includes(id)) return false;
    this.data.signatures.equipped = id;
    this.save();
    return true;
  }

  /** Grant Warden mastery XP and resolve any level-ups. Returns new level/gained. */
  grantWardenXp(wardenId: string, amount: number): { level: number; gained: number } {
    const p = this.data.wardenProgress[wardenId] ?? { level: 0, xp: 0 };
    p.xp += Math.max(0, Math.floor(amount));
    let gained = 0;
    while (p.xp >= wardenXpToNext(p.level)) {
      p.xp -= wardenXpToNext(p.level);
      p.level++;
      gained++;
    }
    this.data.wardenProgress[wardenId] = p;
    this.save();
    return { level: p.level, gained };
  }

  /** Mastery level of a Warden (0 if never played). */
  wardenLevel(wardenId: string): number {
    return this.data.wardenProgress[wardenId]?.level ?? 0;
  }

  unlockAchievement(id: string): boolean {
    if (this.data.achievements.includes(id)) return false;
    this.data.achievements.push(id);
    this.save();
    return true;
  }
}

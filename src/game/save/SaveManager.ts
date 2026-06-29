import type { AudioSettings } from "../audio/AudioManager";
import type { RunStats } from "../World";
import { GEAR_DEFS, GEAR_LIST, mergeCost, type ModuleState } from "../data/gearDefs";

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
  /** Ship module gear state, keyed by module id (grade + banked duplicates). */
  modules: Record<string, ModuleState>;
  /** Unlocked Warden ids. */
  wardens: string[];
  /** Currently selected Warden id. */
  selectedWarden: string;
  /** Today's Daily Run best (resets when the date rolls over). */
  daily: { date: string; bestTime: number; bestKills: number };
  audio: AudioSettings;
  accessibility: AccessibilitySettings;
}

function defaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    motes: 0,
    bestTime: 0,
    bestKills: 0,
    totalKills: 0,
    runsPlayed: 0,
    lifetime: { time: 0, damage: 0, bosses: 0, elites: 0 },
    achievements: [],
    tutorialSeen: false,
    meta: {},
    modules: {},
    wardens: ["lumen"],
    selectedWarden: "lumen",
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
      meta: parsed.meta ?? {},
      modules: parsed.modules ?? {},
      lifetime: parsed.lifetime ?? { time: 0, damage: 0, bosses: 0, elites: 0 },
      wardens: parsed.wardens ?? ["lumen"],
      selectedWarden: parsed.selectedWarden ?? "lumen",
      daily: parsed.daily ?? { date: "", bestTime: 0, bestKills: 0 },
      audio: { ...base.audio, ...(parsed.audio ?? {}) },
      accessibility: { ...base.accessibility, ...(parsed.accessibility ?? {}) },
      achievements: parsed.achievements ?? [],
    };
  }

  save(): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch {
      // Storage may be unavailable (private mode); progression is best-effort.
    }
  }

  /** Record the outcome of a finished run and persist. Returns new records. */
  recordRun(stats: RunStats, motesEarned: number): {
    newBestTime: boolean;
    newBestKills: boolean;
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
    this.save();
    return { newBestTime, newBestKills };
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

  /** Grant a random ship-module drop. New module → grade 1; else a duplicate. */
  grantModuleDrop(): { id: string; isNew: boolean } {
    const def = GEAR_LIST[Math.floor(Math.random() * GEAR_LIST.length)];
    const m = this.data.modules[def.id] ?? { grade: 0, dupes: 0 };
    let isNew = false;
    if (m.grade === 0) {
      m.grade = 1;
      isNew = true;
    } else {
      m.dupes++;
    }
    this.data.modules[def.id] = m;
    this.save();
    return { id: def.id, isNew };
  }

  /** Merge banked duplicates to raise a module's grade. Returns the new grade. */
  mergeModule(id: string): number | null {
    const def = GEAR_DEFS[id];
    const m = this.data.modules[id];
    if (!def || !m || m.grade >= def.maxGrade) return null;
    const cost = mergeCost(m.grade);
    if (m.dupes < cost) return null;
    m.dupes -= cost;
    m.grade++;
    this.save();
    return m.grade;
  }

  unlockAchievement(id: string): boolean {
    if (this.data.achievements.includes(id)) return false;
    this.data.achievements.push(id);
    this.save();
    return true;
  }
}

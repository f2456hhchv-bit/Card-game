import type { RunStats } from "../World";

/**
 * A **resumable mid-run snapshot**. Captured when the player pauses or leaves the
 * page mid-run, and restored via the menu's "Continue" button so a run is never
 * lost to a closed tab or an interruption.
 *
 * Design note: we deliberately do **not** serialise every live enemy/projectile/
 * pickup — those are ephemeral and the swarm regenerates naturally from the
 * spawn director. We persist only the *meaningful* run state: the Warden's build
 * and progress, the timer, the active mode + its sub-state, and enough RNG/boss
 * bookkeeping that the run continues coherently from where it left off.
 */
export const SNAPSHOT_VERSION = 1;

export interface WeaponSnapshot {
  id: string;
  level: number;
  cooldownRemaining: number;
}

export interface LoadoutSnapshot {
  weapons: WeaponSnapshot[];
  /** passive id → level. */
  passives: [string, number][];
}

/** The World-owned portion of a snapshot (produced by World.captureRunState). */
export interface WorldRunState {
  stageId: string;
  campaignLevel: number;
  gauntletIndex: number;
  rngState: number;
  player: {
    x: number;
    y: number;
    hp: number;
    level: number;
    xp: number;
    xpToNext: number;
    facing: number;
  };
  loadout: LoadoutSnapshot;
  stats: RunStats;
  nextBossTime: number;
  bossEncounter: number;
  ascHp: number;
  ascDmg: number;
  ascTimer: number;
  pulseTimer: number;
  revivesLeft: number;
  pendingLevelUps: number;
}

/** The full resumable snapshot: World state plus Game-level mode/flags. */
export interface RunSnapshot extends WorldRunState {
  version: number;
  /** Which mode the run is (drives how the World is reconstructed). */
  mode: {
    daily: boolean;
    bossRush: boolean;
    endless: boolean;
    gauntlet: boolean;
    campaign: boolean;
  };
  runEvolved: boolean;
  /** Outstanding level-up drafts still owed to the player. */
  draftQueue: number;
  /** Wall-clock capture time (for a friendly "resume your run" label). */
  savedAt: number;
}

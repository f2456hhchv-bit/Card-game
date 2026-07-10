import type { GearItem, GearSlot } from "../data/gearDefs";
import { GEAR_SLOTS } from "../data/gearDefs";

export const SAVE_VERSION = 1;

export interface GameState {
  version: number;
  /** Epoch ms the save was first created. */
  createdAt: number;
  /** Epoch ms this state was last simulated up to — the offline-progress anchor. */
  lastSeenAt: number;

  stage: number;
  killsInStage: number;
  /** Current enemy's remaining HP; 0 means "needs a fresh encounter". */
  enemyHp: number;
  heroHp: number;

  heroLevel: number;
  heroXp: number;

  /** Light Motes — the primary soft currency, spent in the Shop. */
  gold: number;
  /** Salvage currency from dismantled gear, spent enhancing what's equipped. */
  alloy: number;
  /** Permanent prestige currency, earned via Renewal; never resets. */
  afterglow: number;

  /** High-water mark for the *current* prestige cycle — resets on rebirth,
   * and is what gates prestige eligibility so it can't be re-triggered for
   * free immediately after rebirthing. */
  highestStageReached: number;
  /** High-water mark across all time, survives rebirths — for stats/UI only. */
  lifetimeHighestStage: number;
  totalKills: number;
  rebirths: number;

  upgrades: Record<string, number>;
  gear: Record<GearSlot, GearItem | null>;
  nextGearId: number;

  settings: {
    reducedMotion: boolean;
  };
}

export function createDefaultState(): GameState {
  const now = Date.now();
  const gear = {} as Record<GearSlot, GearItem | null>;
  for (const slot of GEAR_SLOTS) gear[slot] = null;
  return {
    version: SAVE_VERSION,
    createdAt: now,
    lastSeenAt: now,
    stage: 1,
    killsInStage: 0,
    enemyHp: 0,
    heroHp: 0,
    heroLevel: 1,
    heroXp: 0,
    gold: 0,
    alloy: 0,
    afterglow: 0,
    highestStageReached: 1,
    lifetimeHighestStage: 1,
    totalKills: 0,
    rebirths: 0,
    upgrades: {},
    gear,
    nextGearId: 1,
    settings: {
      reducedMotion: false,
    },
  };
}

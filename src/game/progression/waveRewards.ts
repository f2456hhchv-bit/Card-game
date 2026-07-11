/**
 * GP-FINAL §Wave Rewards: "Every completed wave grants a reward choice.
 * These should complement — not replace — level ups." No such system
 * existed at all. The spec's 8 named categories, dispatched through a
 * generic interpreter (applyWaveReward, main.ts) reusing real mechanisms
 * already proven elsewhere — including `UpgradePool.reroll()`, a framework
 * method its own AF-022 doc comment flagged as "awaiting its content buyer."
 *
 * Design decision: granted automatically on every wave landing rather than
 * as a modal choice overlay. Waves land roughly every 5-15s during active
 * combat — a blocking choice screen that often would fight the "No Dead
 * Time" test's own spirit (constant interruption reads as worse pacing
 * than dead time, not better), and the spec lists "Reward" as one of the
 * frequent, ambient events that SHOULD fill 30-second gaps, not one that
 * should itself create them.
 */
import { pickWeighted } from "../../core/rng/weightedPick";

export const WAVE_REWARD_CATEGORIES = [
  "healing",
  "economy",
  "utility",
  "weaponImprovement",
  "passiveImprovement",
  "rerolls",
  "atlasCache",
  "temporaryBuff",
] as const;

export type WaveRewardCategory = (typeof WAVE_REWARD_CATEGORIES)[number];

export const WAVE_REWARD_KINDS = [
  "healHull",
  "grantCredits",
  "pickupRadius",
  "weaponDamage",
  "passiveUpgrade",
  "reroll",
  "atlasFragment",
  "temporarySpeed",
] as const;

export type WaveRewardKind = (typeof WAVE_REWARD_KINDS)[number];

export interface WaveRewardDef {
  id: string;
  name: string;
  description: string;
  category: WaveRewardCategory;
  kind: WaveRewardKind;
  /** Relative offer weight, weighted-picked via pickWeighted. */
  weight: number;
  /** Meaning depends on kind — see applyWaveReward's interpreter (main.ts). */
  value: number;
}

export const SANDBOX_WAVE_REWARDS: readonly WaveRewardDef[] = [
  { id: "wave-reward-patch-kit", name: "Patch Kit", description: "Restores hull.", category: "healing", kind: "healHull", weight: 12, value: 8 },
  { id: "wave-reward-salvage-haul", name: "Salvage Haul", description: "A handful of credits.", category: "economy", kind: "grantCredits", weight: 14, value: 12 },
  { id: "wave-reward-wide-scanner", name: "Wide Scanner", description: "Extends pickup radius.", category: "utility", kind: "pickupRadius", weight: 12, value: 0.4 },
  { id: "wave-reward-coil-tune", name: "Coil Tune", description: "Raises weapon damage.", category: "weaponImprovement", kind: "weaponDamage", weight: 10, value: 0.03 },
  { id: "wave-reward-field-primer", name: "Field Primer", description: "An extra passive, applied instantly.", category: "passiveImprovement", kind: "passiveUpgrade", weight: 8, value: 0 },
  { id: "wave-reward-second-look", name: "Second Look", description: "Rerolls your next level-up offer for free.", category: "rerolls", kind: "reroll", weight: 6, value: 0 },
  { id: "wave-reward-atlas-cache", name: "Atlas Cache", description: "A small Atlas Fragment cache.", category: "atlasCache", kind: "atlasFragment", weight: 6, value: 1 },
  { id: "wave-reward-overdrive", name: "Overdrive", description: "A brief burst of movement speed.", category: "temporaryBuff", kind: "temporarySpeed", weight: 10, value: 0.25 },
];

/** Weighted pick — see pickWeighted (core/rng/weightedPick.ts). */
export function pickWaveReward(pool: readonly WaveRewardDef[], roll: number): WaveRewardDef {
  return pickWeighted(pool, roll);
}

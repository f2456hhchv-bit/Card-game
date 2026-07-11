/**
 * Boss Game-Changing Rewards (GP-001): five named artifacts, each a real,
 * permanent, mechanically-active passive — not another resource drop. The
 * composition root (main.ts) hooks each one into an already-existing system:
 * weapon fire-interval scale, the boost/dash action, the Elite reward-package
 * rarity floor (GP-001's own eliteRewards.ts), and a new self-contained hull
 * regen tick. At most one is held per run today, since AF-035's Boss spawns
 * once per run; the runtime itself supports holding several, for whenever
 * that changes.
 */
import type { Rng } from "../../core/rng/Rng";
import type { Rarity } from "../loot/lootTuning";
import { RARITY_LADDER } from "../loot/lootTuning";

export const BOSS_ARTIFACT_IDS = ["livingReactor", "atlasCore", "gravitonHeart", "stellarCompass", "voidEngine"] as const;
export type BossArtifactId = (typeof BOSS_ARTIFACT_IDS)[number];

export interface BossArtifactDef {
  id: BossArtifactId;
  name: string;
  description: string;
}

export const BOSS_ARTIFACTS: readonly BossArtifactDef[] = [
  {
    id: "livingReactor",
    name: "Living Reactor",
    description: "A slow, steady hull regeneration — and every pulse detonates, scorching everything nearby.",
  },
  {
    id: "atlasCore",
    name: "Atlas Core",
    description: "Every weapon you carry fires meaningfully faster, permanently.",
  },
  {
    id: "gravitonHeart",
    name: "Graviton Heart",
    description: "Every boost tears open a gravity well that drags nearby enemies in and crushes them.",
  },
  {
    id: "stellarCompass",
    name: "Stellar Compass",
    description: "Every Elite you kill for the rest of this run drops loot no worse than Epic.",
  },
  {
    id: "voidEngine",
    name: "Void Engine",
    description: "Every boost detonates a damaging shockwave beneath you.",
  },
];

/** Run-scoped: which artifacts the player has chosen. Choice is permanent for the run. */
export class BossArtifactRuntime {
  private readonly held = new Set<BossArtifactId>();

  choose(id: BossArtifactId): boolean {
    if (this.held.has(id)) return false;
    if (!BOSS_ARTIFACTS.some((a) => a.id === id)) return false;
    this.held.add(id);
    return true;
  }

  has(id: BossArtifactId): boolean {
    return this.held.has(id);
  }

  get heldIds(): readonly BossArtifactId[] {
    return [...this.held];
  }
}

/** Atlas Core: every weapon fires 25% faster — composes with every other fireIntervalScale source by multiplication. */
export function atlasCoreFireIntervalScale(runtime: BossArtifactRuntime): number {
  return runtime.has("atlasCore") ? 0.75 : 1;
}

/** Stellar Compass: raises (never lowers) an Elite's own rarity floor to at least Epic. */
export function stellarCompassRarityFloor(runtime: BossArtifactRuntime, baseFloor: Rarity | null): Rarity | null {
  if (!runtime.has("stellarCompass")) return baseFloor;
  const compassIndex = RARITY_LADDER.indexOf("epic");
  const baseIndex = baseFloor ? RARITY_LADDER.indexOf(baseFloor) : -1;
  return baseIndex >= compassIndex ? baseFloor : "epic";
}

/** Living Reactor: hull healed per regen pulse — a fixed fraction of max hull. */
export function livingReactorHealPerPulse(maxHull: number): number {
  return maxHull * 0.02;
}

/** Deterministic offer of `count` distinct artifacts not already held. */
export function offerBossArtifacts(alreadyHeldIds: readonly BossArtifactId[], count: number, rng: Rng): readonly BossArtifactDef[] {
  const pool = BOSS_ARTIFACTS.filter((a) => !alreadyHeldIds.includes(a.id));
  const picked: BossArtifactDef[] = [];
  while (picked.length < count && pool.length > 0) {
    const index = rng.int(0, pool.length - 1);
    picked.push(pool.splice(index, 1)[0]!);
  }
  return picked;
}

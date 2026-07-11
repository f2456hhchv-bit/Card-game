/**
 * Build-Defining Paths (GP-001): a composition layer OVER AF-022's locked
 * UpgradePool — never edits its private definitions/weighting, only biases
 * which of them get offered afterwards. The weighted-pick algorithm here
 * mirrors UpgradePool.offer()'s exactly; stack exclusion reuses its own
 * public stacksOf(), never a shadow copy of `taken`.
 */
import type { Rng } from "../../core/rng/Rng";
import type { UpgradePool, UpgradeOffer } from "./UpgradePool";
import type { UpgradeCategory, UpgradeDefinition } from "./xpTuning";

export interface BuildPathDef {
  id: string;
  name: string;
  description: string;
  /** Offer-weight multipliers applied to matching UpgradeCategory choices. */
  categoryWeightMultipliers: Readonly<Partial<Record<UpgradeCategory, number>>>;
}

/** The nine Build-Defining Paths (GP-001 §Every 5 Waves). */
export const BUILD_PATHS: readonly BuildPathDef[] = [
  {
    id: "commander",
    name: "Commander",
    description: "Ability-focused command — your active skills and ultimate carry the run.",
    categoryWeightMultipliers: { commanderAbility: 3, passive: 1.5 },
  },
  {
    id: "engineer",
    name: "Engineer",
    description: "Systems and resilience — shields and resource generation define you.",
    categoryWeightMultipliers: { shield: 3, resource: 2 },
  },
  {
    id: "void",
    name: "Void Walker",
    description: "Corruption and control — status effects chain into critical openings.",
    categoryWeightMultipliers: { statusEffect: 3, critical: 2 },
  },
  {
    id: "guardian",
    name: "Guardian",
    description: "Unbreakable — shields and passives stack into a wall nothing gets through.",
    categoryWeightMultipliers: { shield: 2.5, passive: 2 },
  },
  {
    id: "hunter",
    name: "Hunter",
    description: "Precision damage — weapon upgrades and critical strikes above all else.",
    categoryWeightMultipliers: { weaponUpgrade: 3, critical: 2 },
  },
  {
    id: "droneCommander",
    name: "Drone Commander",
    description: "A swarm of allied drones fights the run beside you.",
    categoryWeightMultipliers: { drone: 4 },
  },
  {
    id: "heavyWeapons",
    name: "Heavy Weapons",
    description: "Escalating firepower — every weapon evolves further and hits harder.",
    categoryWeightMultipliers: { weaponUpgrade: 2, weaponEvolution: 4 },
  },
  {
    id: "orbitalSpecialist",
    name: "Orbital Specialist",
    description: "Orbiting satellites do the fighting for you.",
    categoryWeightMultipliers: { orbital: 4 },
  },
  {
    id: "bioEngineer",
    name: "Bio-Engineer",
    description: "Sustain and utility — passives and resources compound over the run.",
    categoryWeightMultipliers: { passive: 2.5, resource: 2 },
  },
] as const;

/** Run-scoped choice history + the resulting composite category bias. Multiple
 * paths may be chosen across a run — their multipliers compound, so a run that
 * keeps picking the same doctrine naturally specialises (GP-001 §Build Diversity). */
export class BuildPathRuntime {
  private readonly chosen: BuildPathDef[] = [];

  choose(pathId: string): boolean {
    if (this.chosen.some((p) => p.id === pathId)) return false;
    const def = BUILD_PATHS.find((p) => p.id === pathId);
    if (!def) return false;
    this.chosen.push(def);
    return true;
  }

  multiplierFor(category: UpgradeCategory): number {
    return this.chosen.reduce((product, path) => product * (path.categoryWeightMultipliers[category] ?? 1), 1);
  }

  get chosenIds(): readonly string[] {
    return this.chosen.map((p) => p.id);
  }

  get chosenPaths(): readonly BuildPathDef[] {
    return [...this.chosen];
  }
}

/** True on the wave a Build Path offer is due — every 5th landed wave, once each. */
export function shouldOfferBuildPath(wavesLanded: number, lastOfferedAtWave: number): boolean {
  return wavesLanded > 0 && wavesLanded % 5 === 0 && wavesLanded !== lastOfferedAtWave;
}

/** Deterministic offer of `count` distinct paths not already chosen this run. */
export function offerBuildPaths(alreadyChosenIds: readonly string[], count: number, rng: Rng): readonly BuildPathDef[] {
  const pool = BUILD_PATHS.filter((p) => !alreadyChosenIds.includes(p.id));
  const picked: BuildPathDef[] = [];
  while (picked.length < count && pool.length > 0) {
    const index = rng.int(0, pool.length - 1);
    picked.push(pool.splice(index, 1)[0]!);
  }
  return picked;
}

/**
 * Mirrors UpgradePool.offer()'s weighted-pick algorithm exactly, scaling each
 * candidate's weight by the active Build Path multiplier for its category.
 * Never reads or mutates the pool's private `definitions`/`taken` — only its
 * public stacksOf() gate, the same exclusion offer() itself applies.
 */
export function offerBiasedUpgrades(
  definitions: readonly UpgradeDefinition[],
  pool: UpgradePool,
  count: number,
  multiplierFor: (category: UpgradeCategory) => number,
  rng: Rng,
): UpgradeOffer {
  const remaining = definitions.filter((def) => def.maxStacks === null || pool.stacksOf(def.id) < def.maxStacks);
  const choices: UpgradeDefinition[] = [];
  while (choices.length < count && remaining.length > 0) {
    const totalWeight = remaining.reduce((sum, d) => sum + d.weight * multiplierFor(d.category), 0);
    let roll = rng.next() * totalWeight;
    let pickedIndex = remaining.length - 1;
    for (let i = 0; i < remaining.length; i += 1) {
      roll -= (remaining[i] as UpgradeDefinition).weight * multiplierFor((remaining[i] as UpgradeDefinition).category);
      if (roll <= 0) {
        pickedIndex = i;
        break;
      }
    }
    choices.push(remaining[pickedIndex] as UpgradeDefinition);
    remaining.splice(pickedIndex, 1);
  }
  return { choices };
}

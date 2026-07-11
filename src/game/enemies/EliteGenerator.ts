/**
 * Elite generation (AF-034): Base Enemy → Elite Tier → Mutations → Stat
 * Package → Behaviour Package → Reward Package → Unique Identity, exactly
 * the spec's pipeline, as one pure deterministic function. Elite-only
 * numeric effects that don't fit AF-033's EnemyDef shape (regen, on-death
 * explosion, a status a melee attacker couldn't otherwise carry) are
 * layered alongside the def in MutationEffects, never merged into it —
 * AF-033's schema is extended by composition, not edited.
 */
import type { Rng } from "../../core/rng/Rng";
import type { Rarity } from "../loot/lootTuning";
import type { EnemyAttack, EnemyDef } from "./enemyData";
import {
  ELITE_TIER_DEFS,
  EMPTY_MUTATION_EFFECTS,
  MUTATION_DEFS,
  MUTATION_KINDS,
  type EliteTier,
  type MutationEffects,
  type MutationKind,
} from "./eliteData";

export interface EliteInstance {
  /** Unique per (base, tier, mutation-set) combination — the Codex key. */
  id: string;
  name: string;
  tier: EliteTier;
  mutations: readonly MutationKind[];
  def: EnemyDef;
  mutationEffects: MutationEffects;
  rewardMultiplier: number;
  rarityFloor: Rarity;
}

const TIER_NAME_PREFIX: Readonly<Record<EliteTier, string>> = {
  veteran: "Veteran",
  champion: "Champion",
  ancient: "Ancient",
  prime: "Prime",
  legendary: "Legendary",
  apex: "Apex",
  mythic: "Mythic",
};

/** Fisher-Yates over a seeded Rng, then greedily skip mutations whose exclusionGroup is already taken. */
function rollMutations(slots: number, rng: Rng): MutationKind[] {
  const shuffled = [...MUTATION_KINDS];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  const chosen: MutationKind[] = [];
  const usedGroups = new Set<string>();
  for (const kind of shuffled) {
    if (chosen.length >= slots) break;
    const def = MUTATION_DEFS[kind];
    if (def.exclusionGroup && usedGroups.has(def.exclusionGroup)) continue;
    chosen.push(kind);
    if (def.exclusionGroup) usedGroups.add(def.exclusionGroup);
  }
  return chosen;
}

function scaleAttackInterval(attack: EnemyAttack, factor: number): EnemyAttack {
  if (attack.mechanism.kind === "melee") {
    return { ...attack, mechanism: { ...attack.mechanism, cooldownMs: attack.mechanism.cooldownMs * factor } };
  }
  return {
    ...attack,
    mechanism: { ...attack.mechanism, weapon: { ...attack.mechanism.weapon, fireIntervalMs: attack.mechanism.weapon.fireIntervalMs * factor } },
  };
}

function scaleAttackDamage(attack: EnemyAttack, factor: number): EnemyAttack {
  if (attack.mechanism.kind === "melee") {
    return { ...attack, mechanism: { ...attack.mechanism, baseDamage: attack.mechanism.baseDamage * factor } };
  }
  return {
    ...attack,
    mechanism: { ...attack.mechanism, weapon: { ...attack.mechanism.weapon, baseDamage: attack.mechanism.weapon.baseDamage * factor } },
  };
}

export function generateElite(base: EnemyDef, tierId: EliteTier, rng: Rng): EliteInstance {
  const tierDef = ELITE_TIER_DEFS[tierId];
  const mutations = rollMutations(tierDef.mutationSlots, rng);

  let shield = base.shield;
  let movementBehaviour = base.movementBehaviour;
  let specialAbility = base.specialAbility;
  let attack = scaleAttackDamage(base.attack, tierDef.damageMultiplier);
  const mutationEffects: MutationEffects = { ...EMPTY_MUTATION_EFFECTS };

  for (const kind of mutations) {
    switch (kind) {
      case "shielded":
        shield += base.hull * 0.5;
        break;
      case "teleport":
        movementBehaviour = "teleport";
        break;
      case "berserker":
        // Same mechanic as AF-033's "enrage" special ability — the mutation is the
        // elite-flavoured name for it, not a second special-ability kind.
        specialAbility = {
          kind: "enrage",
          trigger: "onLowHealth",
          threshold: 0.3,
          bonus: { kind: "damage", value: 0.5 },
          cooldownMs: 0,
        };
        break;
      case "rapidAssault":
        attack = scaleAttackInterval(attack, 0.5);
        break;
      case "cryogenic":
        mutationEffects.attackStatusOnHit = { kind: "slow", chance: 0.5, strength: 6, durationMs: 1500 };
        break;
      case "incendiary":
        mutationEffects.attackStatusOnHit = { kind: "burn", chance: 0.5, strength: 6, durationMs: 2000 };
        break;
      case "corrupted":
        mutationEffects.attackStatusOnHit = { kind: "corruption", chance: 0.5, strength: 5, durationMs: 2500 };
        break;
      case "regeneration":
        mutationEffects.regenPerSecond = base.hull * 0.02;
        break;
      case "explosive":
        mutationEffects.explosionOnDeath = { damage: base.hull * 0.4, radius: 3 };
        break;
      // GP-002: the six mutations below were schema-complete (MUTATION_DEFS)
      // with no consumer — the exact "generated then discarded" gap GP-001
      // already fixed once for EliteGenerator's own rewardMultiplier/
      // rarityFloor fields. Consumed by main.ts at the drone-hit/update path.
      case "reflectiveArmour":
        mutationEffects.reflectDamageFraction = 0.25;
        break;
      case "gravityField":
        mutationEffects.gravityPullFraction = 0.18;
        break;
      case "summoner":
        mutationEffects.summonIntervalMs = 8000;
        break;
      case "quantumShift":
        mutationEffects.quantumShiftChance = 0.35;
        break;
      case "temporalEcho":
        mutationEffects.spawnsDecoy = true;
        break;
      case "adaptiveArmour":
        mutationEffects.adaptiveResistFraction = 0.3;
        break;
      // GP-002: three spec-named modifiers with no prior equivalent at all.
      case "electric":
        mutationEffects.attackStatusOnHit = { kind: "shock", chance: 0.5, strength: 5, durationMs: 1200 };
        break;
      case "cloaked":
        mutationEffects.cloakCycleMs = 3000;
        break;
      case "vampiric":
        mutationEffects.lifeStealFraction = 0.3;
        break;
      default:
        break;
    }
  }

  const def: EnemyDef = {
    ...base,
    id: `${base.id}-elite-${tierId}`,
    name: `${TIER_NAME_PREFIX[tierId]} ${base.name}`,
    hull: base.hull * tierDef.hullMultiplier,
    shield,
    moveSpeed: base.moveSpeed * tierDef.speedMultiplier,
    movementBehaviour,
    attack,
    specialAbility,
    eliteModifier: null,
  };

  const sortedMutations = [...mutations].sort();
  return {
    id: `${def.id}:${sortedMutations.join(",") || "none"}`,
    name: def.name,
    tier: tierId,
    mutations: sortedMutations,
    def,
    mutationEffects,
    rewardMultiplier: tierDef.rewardMultiplier,
    rarityFloor: tierDef.rarityFloor,
  };
}

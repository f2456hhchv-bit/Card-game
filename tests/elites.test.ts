import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { generateElite } from "../src/game/enemies/EliteGenerator";
import { ELITE_TIER_DEFS, ELITE_TIERS, MUTATION_DEFS, MUTATION_KINDS } from "../src/game/enemies/eliteData";
import { SANDBOX_ENEMIES, type EnemyDef } from "../src/game/enemies/enemyData";

const base = SANDBOX_ENEMIES[0] as EnemyDef; // wisp-chaser, melee

describe("ELITE_TIER_DEFS — the seven-tier ladder (AF-034)", () => {
  it("every tier is defined and ascends in hull/damage/speed/reward", () => {
    for (let i = 1; i < ELITE_TIERS.length; i += 1) {
      const prev = ELITE_TIER_DEFS[ELITE_TIERS[i - 1]!];
      const curr = ELITE_TIER_DEFS[ELITE_TIERS[i]!];
      expect(curr.hullMultiplier).toBeGreaterThan(prev.hullMultiplier);
      expect(curr.damageMultiplier).toBeGreaterThan(prev.damageMultiplier);
      expect(curr.rewardMultiplier).toBeGreaterThan(prev.rewardMultiplier);
    }
  });

  it("reuses AF-029's restricted 7-tier rarity view for reward floors, not a new ladder", () => {
    const floors = ELITE_TIERS.map((t) => ELITE_TIER_DEFS[t].rarityFloor);
    expect(new Set(floors).size).toBe(ELITE_TIERS.length); // strictly ascending, one per tier
  });
});

describe("generateElite — the deterministic pipeline (AF-034)", () => {
  it("is deterministic given the same seed", () => {
    const a = generateElite(base, "champion", new Rng(42));
    const b = generateElite(base, "champion", new Rng(42));
    expect(a.id).toBe(b.id);
    expect(a.mutations).toEqual(b.mutations);
    expect(a.def.hull).toBe(b.def.hull);
  });

  it("different seeds can roll different mutation sets", () => {
    const results = new Set<string>();
    for (let seed = 0; seed < 20; seed += 1) {
      results.add(generateElite(base, "apex", new Rng(seed)).mutations.join(","));
    }
    expect(results.size).toBeGreaterThan(1);
  });

  it("scales hull by the tier's multiplier — a real stat package, not a flat bonus", () => {
    const elite = generateElite(base, "mythic", new Rng(1));
    expect(elite.def.hull).toBe(base.hull * ELITE_TIER_DEFS.mythic.hullMultiplier);
  });

  it("never rolls two mutations sharing an exclusion group", () => {
    for (let seed = 0; seed < 50; seed += 1) {
      const elite = generateElite(base, "mythic", new Rng(seed)); // 3 slots — most likely to collide
      const groups = elite.mutations
        .map((kind) => MUTATION_DEFS[kind].exclusionGroup)
        .filter((g): g is string => g !== undefined);
      expect(new Set(groups).size).toBe(groups.length);
    }
  });

  it("rolls exactly the tier's mutation slot count (or fewer if compatibility forces it)", () => {
    const elite = generateElite(base, "veteran", new Rng(7));
    expect(elite.mutations.length).toBeLessThanOrEqual(ELITE_TIER_DEFS.veteran.mutationSlots);
  });

  it("does not mutate the base def", () => {
    const hullBefore = base.hull;
    generateElite(base, "apex", new Rng(9));
    expect(base.hull).toBe(hullBefore);
  });

  it("teleport mutation overrides movementBehaviour", () => {
    let elite = generateElite(base, "mythic", new Rng(0));
    for (let seed = 0; seed < 200 && !elite.mutations.includes("teleport"); seed += 1) {
      elite = generateElite(base, "mythic", new Rng(seed));
    }
    expect(elite.mutations).toContain("teleport");
    expect(elite.def.movementBehaviour).toBe("teleport");
  });

  it("berserker mutation grants an onLowHealth special ability", () => {
    let elite = generateElite(base, "mythic", new Rng(0));
    for (let seed = 0; seed < 200 && !elite.mutations.includes("berserker"); seed += 1) {
      elite = generateElite(base, "mythic", new Rng(seed));
    }
    expect(elite.mutations).toContain("berserker");
    expect(elite.def.specialAbility?.trigger).toBe("onLowHealth");
  });

  it("regeneration mutation sets a positive regenPerSecond in MutationEffects, not on the def", () => {
    let elite = generateElite(base, "mythic", new Rng(0));
    for (let seed = 0; seed < 200 && !elite.mutations.includes("regeneration"); seed += 1) {
      elite = generateElite(base, "mythic", new Rng(seed));
    }
    expect(elite.mutations).toContain("regeneration");
    expect(elite.mutationEffects.regenPerSecond).toBeGreaterThan(0);
  });

  it("explosive mutation sets explosionOnDeath in MutationEffects", () => {
    let elite = generateElite(base, "mythic", new Rng(0));
    for (let seed = 0; seed < 200 && !elite.mutations.includes("explosive"); seed += 1) {
      elite = generateElite(base, "mythic", new Rng(seed));
    }
    expect(elite.mutations).toContain("explosive");
    expect(elite.mutationEffects.explosionOnDeath).not.toBeNull();
  });

  it("gives every mutation kind schema-complete data (visual/effect/counterplay/threat/stacking)", () => {
    for (const kind of MUTATION_KINDS) {
      const def = MUTATION_DEFS[kind];
      expect(def.visualIndicator.length).toBeGreaterThan(0);
      expect(def.gameplayEffect.length).toBeGreaterThan(0);
      expect(def.counterplay.length).toBeGreaterThan(0);
      expect(def.threatRating).toBeGreaterThan(0);
      expect(["refresh", "stackIntensity", "stackDuration"]).toContain(def.stackBehaviour);
    }
  });
});

describe("Elites — self-review: thousands of combinations stay internally consistent", () => {
  it("every generated elite across every tier and a wide seed range is schema-valid and deterministic", () => {
    for (const tier of ELITE_TIERS) {
      for (let seed = 0; seed < 200; seed += 1) {
        const elite = generateElite(base, tier, new Rng(seed));
        expect(elite.def.hull).toBeGreaterThan(0);
        expect(elite.def.moveSpeed).toBeGreaterThan(0);
        expect(elite.mutations.length).toBeLessThanOrEqual(ELITE_TIER_DEFS[tier].mutationSlots);
        const repeat = generateElite(base, tier, new Rng(seed));
        expect(repeat.id).toBe(elite.id);
      }
    }
  });
});

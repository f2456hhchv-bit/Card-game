import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { RELIC_CATEGORIES, RELIC_RARITIES, SANDBOX_RELICS, validateRelicDef } from "../src/game/relics/relicData";
import { RelicSystem } from "../src/game/relics/RelicSystem";
import {
  BUILD_DEFINING_KINDS,
  FRAMEWORK_CATEGORY_TO_RELIC_CATEGORY,
  FRAMEWORK_RELICS,
  FRAMEWORK_TIER_TO_RARITY,
  RELIC_ARCHITECTURE_PARTS,
  RELIC_COLLECTION_STATES,
  RELIC_CUSTOMISATION_KINDS,
  RELIC_DISCOVERY_SOURCES,
  RELIC_EVOLUTION_TRIGGERS,
  RELIC_FRAMEWORK_CATEGORIES,
  RELIC_FRAMEWORK_TIERS,
  RELIC_PROFILES,
  RELIC_SYNERGY_SURFACES,
  SINGULARITY_KEEPSAKE,
  SPEC_STACKING_RULES,
  SPEC_STACKING_TO_ENGINE,
  relicArchitectureFor,
} from "../src/game/relics/relicFrameworkData";
import { RelicCollectionRuntime } from "../src/game/relics/RelicCollectionRuntime";

function profileFor(relicId: string) {
  return RELIC_PROFILES.find((p) => p.relicId === relicId)!;
}

describe("Relic Framework vocabulary — registered shelves (AF-077)", () => {
  it("registers eight tiers, sixteen categories, fifteen architecture parts, six stacking rules, six evolution triggers, seven discovery sources, seven collection states, six build-defining kinds, eight synergy surfaces, six customisation kinds", () => {
    expect(RELIC_FRAMEWORK_TIERS.length).toBe(8);
    expect(RELIC_FRAMEWORK_CATEGORIES.length).toBe(16);
    expect(RELIC_ARCHITECTURE_PARTS.length).toBe(15);
    expect(SPEC_STACKING_RULES.length).toBe(6);
    expect(RELIC_EVOLUTION_TRIGGERS.length).toBe(6);
    expect(RELIC_DISCOVERY_SOURCES.length).toBe(7);
    expect(RELIC_COLLECTION_STATES.length).toBe(7);
    expect(BUILD_DEFINING_KINDS.length).toBe(6);
    expect(RELIC_SYNERGY_SURFACES.length).toBe(8);
    expect(RELIC_CUSTOMISATION_KINDS.length).toBe(6);
  });

  it("all three spec vocabularies map TOTALLY onto AF-029's locked shelves", () => {
    for (const tier of RELIC_FRAMEWORK_TIERS) expect(RELIC_RARITIES).toContain(FRAMEWORK_TIER_TO_RARITY[tier]);
    for (const category of RELIC_FRAMEWORK_CATEGORIES) expect(RELIC_CATEGORIES).toContain(FRAMEWORK_CATEGORY_TO_RELIC_CATEGORY[category]);
    for (const rule of SPEC_STACKING_RULES) expect(["unique", "stackable", "mutuallyExclusive", "evolving"]).toContain(SPEC_STACKING_TO_ENGINE[rule]);
  });
});

describe("The extended reliquary — AF-029 untouched, one quantum relic added (AF-077 §Relic Categories)", () => {
  it("AF-029's sandbox seven remain the unmodified head; the Keepsake joins additively and passes AF-029's own validator", () => {
    expect(FRAMEWORK_RELICS.length).toBe(8);
    expect(FRAMEWORK_RELICS.slice(0, 7)).toEqual(SANDBOX_RELICS);
    for (const relic of FRAMEWORK_RELICS) expect(validateRelicDef(relic)).toEqual([]);
    expect(SINGULARITY_KEEPSAKE.effects.some((e) => e.value < 0)).toBe(true); // risk vs reward — a real trade-off
  });

  it("'relics should rarely provide only flat bonuses' was ALREADY a law — every relic carries a behaviour clause", () => {
    for (const relic of FRAMEWORK_RELICS) expect(relic.behaviours.length).toBeGreaterThan(0);
  });

  it("all fifteen architecture parts are present for every profiled relic — every relic feels handcrafted", () => {
    expect(RELIC_PROFILES.length).toBe(FRAMEWORK_RELICS.length);
    for (const relic of FRAMEWORK_RELICS) {
      const architecture = relicArchitectureFor(relic, profileFor(relic.id));
      for (const part of RELIC_ARCHITECTURE_PARTS) expect(architecture[part], `${relic.id} missing ${part}`).toBe(true);
    }
  });

  it("every evolving relic names a registered evolution trigger, and the profile layer stays stat-free", () => {
    for (const relic of FRAMEWORK_RELICS) {
      const profile = profileFor(relic.id);
      if (relic.evolvesInto) expect(RELIC_EVOLUTION_TRIGGERS).toContain(profile.evolutionTrigger!);
      expect(RELIC_DISCOVERY_SOURCES).toContain(profile.discoverySource);
      expect(BUILD_DEFINING_KINDS).toContain(profile.buildDefiningKind);
      // Tier affects discovery frequency, never viability: the profile carries identity only.
      for (const key of Object.keys(profile)) {
        expect(["relicId", "frameworkCategory", "frameworkTier", "visualIdentity", "origin", "discoverySource", "buildDefiningKind", "synergyTags", "evolutionTrigger", "codexNote", "statisticKeys", "futureExpansionHooks"]).toContain(key);
      }
    }
  });

  it("the Keepsake works through AF-029's UNCHANGED RelicSystem — acquisition, uniqueness, synergy", () => {
    const system = new RelicSystem(FRAMEWORK_RELICS);
    expect(system.acquire("singularity-keepsake").ok).toBe(true);
    expect(system.acquire("singularity-keepsake").ok).toBe(false); // unique
    expect(system.acquire("warden-token").ok).toBe(true);
    expect(system.aggregate.synergies.length).toBeGreaterThan(0); // the Keepsake's declared synergy detects
  });
});

describe("Collection — a monotone state lattice (AF-077 §Collection)", () => {
  it("states only advance: discovered → owned → mastered, with evolution as a permanent parallel mark", () => {
    const reliquary = new RelicCollectionRuntime(RELIC_PROFILES);
    expect(reliquary.stateFor("ember-core")).toBe("unseen");
    expect(reliquary.recordMastered("ember-core")).toBe(false); // mastery requires ownership
    expect(reliquary.recordDiscovered("ember-core")).toBe(true);
    expect(reliquary.recordDiscovered("ember-core")).toBe(false); // no re-discovery
    expect(reliquary.recordOwned("ember-core")).toBe(true);
    expect(reliquary.recordDiscovered("ember-core")).toBe(false); // never demotes
    expect(reliquary.recordMastered("ember-core")).toBe(true);
    expect(reliquary.stateFor("ember-core")).toBe("mastered");
    expect(reliquary.recordEvolved("ember-core")).toBe(true);
    expect(reliquary.recordEvolved("ember-core")).toBe(false); // remembered once, forever
    const snap = reliquary.snapshot;
    expect(snap).toEqual({ reliquarySize: 8, discoveredCount: 1, ownedCount: 1, masteredCount: 1, evolvedCount: 1 });
    const api = Object.getOwnPropertyNames(RelicCollectionRuntime.prototype);
    for (const name of api) expect(/remove|delete|revoke|reset|demote|forget/i.test(name)).toBe(false);
  });
});

describe("Relic Framework — self-review: thousands of builds (AF-077 §Self Review Loop)", () => {
  it("1,000 seeded collection careers keep the lattice monotone and the counts consistent", () => {
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const reliquary = new RelicCollectionRuntime(RELIC_PROFILES);
      let lastOwned = 0;
      let lastDiscovered = 0;
      for (let step = 0; step < 60; step += 1) {
        const relic = FRAMEWORK_RELICS[Math.floor(rng.next() * FRAMEWORK_RELICS.length)]!;
        const roll = rng.next();
        if (roll < 0.4) reliquary.recordDiscovered(relic.id);
        else if (roll < 0.7) reliquary.recordOwned(relic.id);
        else if (roll < 0.9) reliquary.recordMastered(relic.id);
        else reliquary.recordEvolved(relic.id);
        const snap = reliquary.snapshot;
        if (snap.ownedCount < lastOwned || snap.discoveredCount < lastDiscovered) throw new Error("the lattice regressed");
        if (snap.masteredCount > snap.ownedCount) throw new Error("mastered without owning");
        if (snap.ownedCount > snap.discoveredCount) throw new Error("owned without discovering");
        lastOwned = snap.ownedCount;
        lastDiscovered = snap.discoveredCount;
      }
    }
  });
});

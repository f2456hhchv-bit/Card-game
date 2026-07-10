import { describe, expect, it } from "vitest";
import { FULL_PROFILES_WITH_FOUNDER, FULL_ROSTER_WITH_FOUNDER } from "../src/game/commanders/cmd031AtlasPrime";
import {
  BOND_GROWTH_SOURCES,
  BOND_LEVEL_NAMES,
  BOND_TYPES,
  CAMP_LOCATIONS,
  DUAL_ULTIMATES,
  DYNAMIC_DIALOGUE_TRIGGERS,
  EMOTIONAL_MEMORY_KINDS,
  GROUP_EVENTS,
  MAX_BOND_LEVEL,
  MUSEUM_RELATIONSHIP_WING_EXHIBITS,
  bondGameplayBonusFor,
  bondKey,
  personalQuestSetsFor,
  seedBondGraph,
} from "../src/game/commanders/bondNetworkData";
import { BondNetworkRuntime, EmotionalMemoryLog } from "../src/game/commanders/BondNetworkRuntime";

describe("Commander Bond Network (AF-130)", () => {
  it("registers exactly the spec'd bond levels, bond types (plus the Unacquainted default), camp locations, and group events", () => {
    expect(BOND_LEVEL_NAMES).toEqual(["Unknown", "Acquaintance", "Professional", "Trusted", "Close Friend", "Family"]);
    expect(MAX_BOND_LEVEL).toBe(5);
    expect(BOND_TYPES.length).toBe(21);
    expect(BOND_TYPES).toContain("Friendship");
    expect(BOND_TYPES).toContain("Historic Connection");
    expect(BOND_TYPES).toContain("Unacquainted");
    expect(CAMP_LOCATIONS.length).toBe(8);
    expect(GROUP_EVENTS.length).toBe(10);
    expect(BOND_GROWTH_SOURCES.length).toBe(9);
    expect(DYNAMIC_DIALOGUE_TRIGGERS.length).toBe(9);
    expect(EMOTIONAL_MEMORY_KINDS.length).toBe(5);
    expect(MUSEUM_RELATIONSHIP_WING_EXHIBITS.length).toBe(7);
  });

  it("bondKey is order-independent", () => {
    expect(bondKey("a", "b")).toBe(bondKey("b", "a"));
    expect(bondKey("kane-vanguard", "ryker-engineer")).toBe(bondKey("ryker-engineer", "kane-vanguard"));
  });

  it("seeds exactly one bond for every unordered pair in the real 53-commander roster — the spec's 'every pair possesses one relationship type', taken literally", () => {
    const bonds = seedBondGraph(FULL_ROSTER_WITH_FOUNDER, FULL_PROFILES_WITH_FOUNDER);
    const expectedPairCount = (FULL_ROSTER_WITH_FOUNDER.length * (FULL_ROSTER_WITH_FOUNDER.length - 1)) / 2;
    expect(FULL_ROSTER_WITH_FOUNDER.length).toBe(53);
    expect(bonds.length).toBe(expectedPairCount);
    const keys = new Set(bonds.map((b) => bondKey(b.commanderA, b.commanderB)));
    expect(keys.size).toBe(expectedPairCount);
    for (const bond of bonds) expect(BOND_TYPES).toContain(bond.bondType);
  });

  it("seeds a Trusted 'Historic Connection' bond for every pair with a real authored AF-071 relationship, and Unacquainted otherwise", () => {
    const bonds = seedBondGraph(FULL_ROSTER_WITH_FOUNDER, FULL_PROFILES_WITH_FOUNDER);
    const primeVoss = bonds.find((b) => bondKey(b.commanderA, b.commanderB) === bondKey("prime-founder", "voss-pathfinder"));
    expect(primeVoss?.bondType).toBe("Historic Connection");
    expect(primeVoss?.level).toBe(3);
    const totallyUnrelated = bonds.filter((b) => b.bondType === "Unacquainted" && b.level === 0);
    expect(totallyUnrelated.length).toBeGreaterThan(0);
  });

  it("the six spec'd Dual Ultimates resolve to real, distinct roster ids, including the Orion+Mira -> Dorian Fen resolution", () => {
    expect(DUAL_ULTIMATES.length).toBe(6);
    const rosterIds = new Set(FULL_ROSTER_WITH_FOUNDER.map((c) => c.id));
    for (const dual of DUAL_ULTIMATES) {
      expect(rosterIds, `${dual.name} commanderA`).toContain(dual.commanderA);
      expect(rosterIds, `${dual.name} commanderB`).toContain(dual.commanderB);
      expect(dual.commanderA).not.toBe(dual.commanderB);
    }
    const livingEden = DUAL_ULTIMATES.find((d) => d.name === "Living Eden");
    expect(livingEden && bondKey(livingEden.commanderA, livingEden.commanderB)).toBe(bondKey("fen-beastmaster", "syn-bioforge"));
    const dualIds = new Set(DUAL_ULTIMATES.map((d) => bondKey(d.commanderA, d.commanderB)));
    expect(dualIds.size).toBe(6);
  });

  it("growBond increases level, caps at MAX_BOND_LEVEL, and never decreases", () => {
    const bonds = seedBondGraph(FULL_ROSTER_WITH_FOUNDER, FULL_PROFILES_WITH_FOUNDER);
    const runtime = new BondNetworkRuntime(bonds, DUAL_ULTIMATES);
    const [a, b] = ["kane-vanguard", "ryker-engineer"];
    const before = runtime.bondFor(a, b)!.level;
    runtime.growBond(a, b, 1);
    expect(runtime.bondFor(a, b)!.level).toBe(before + 1);
    runtime.growBond(a, b, 100);
    expect(runtime.bondFor(a, b)!.level).toBe(MAX_BOND_LEVEL);
    runtime.growBond(a, b, -5);
    expect(runtime.bondFor(a, b)!.level).toBe(MAX_BOND_LEVEL);
  });

  it("unlockedDualUltimateFor is null below max bond and returns the real DualUltimateDef once maxed", () => {
    const bonds = seedBondGraph(FULL_ROSTER_WITH_FOUNDER, FULL_PROFILES_WITH_FOUNDER);
    const runtime = new BondNetworkRuntime(bonds, DUAL_ULTIMATES);
    const [a, b] = ["thorne-starforged", "ryker-engineer"];
    expect(runtime.unlockedDualUltimateFor(a, b)).toBeNull();
    expect(runtime.dualUltimateDefFor(a, b)?.name).toBe("Planetary Forge");
    runtime.growBond(a, b, MAX_BOND_LEVEL);
    expect(runtime.isMaxBond(a, b)).toBe(true);
    expect(runtime.unlockedDualUltimateFor(a, b)?.name).toBe("Planetary Forge");
  });

  it("snapshot reports real, consistent totals", () => {
    const bonds = seedBondGraph(FULL_ROSTER_WITH_FOUNDER, FULL_PROFILES_WITH_FOUNDER);
    const runtime = new BondNetworkRuntime(bonds, DUAL_ULTIMATES);
    const snapshot = runtime.snapshot();
    expect(snapshot.totalBonds).toBe(bonds.length);
    expect(snapshot.discoveredBonds).toBeGreaterThan(0);
    expect(snapshot.discoveredBonds).toBeLessThanOrEqual(snapshot.totalBonds);
    expect(snapshot.maxedBonds).toBe(0);
  });

  it("bondGameplayBonusFor scales with level, clamps, and never touches AF-071's dialogue-only relationship shape", () => {
    expect(bondGameplayBonusFor(0)).toEqual({ passiveBonusMultiplier: 0, cooldownReductionBonus: 0 });
    const maxBonus = bondGameplayBonusFor(MAX_BOND_LEVEL);
    expect(maxBonus.passiveBonusMultiplier).toBeGreaterThan(0);
    expect(maxBonus.cooldownReductionBonus).toBeGreaterThan(0);
    expect(bondGameplayBonusFor(999)).toEqual(maxBonus);
    expect(bondGameplayBonusFor(-5)).toEqual(bondGameplayBonusFor(0));
  });

  it("personalQuestSetsFor gives every real roster commander exactly 3 personal quests plus a friendship, legacy, and final resolution quest", () => {
    const sets = personalQuestSetsFor(FULL_ROSTER_WITH_FOUNDER);
    expect(sets.length).toBe(FULL_ROSTER_WITH_FOUNDER.length);
    for (const set of sets) {
      expect(set.personalQuestIds.length).toBe(3);
      expect(new Set(set.personalQuestIds).size).toBe(3);
      expect(set.friendshipQuestId).toContain(set.commanderId);
      expect(set.legacyQuestId).toContain(set.commanderId);
      expect(set.finalResolutionQuestId).toContain(set.commanderId);
    }
  });

  it("EmotionalMemoryLog is append-only and never resets — 'nothing resets artificially'", () => {
    const log = new EmotionalMemoryLog();
    log.record("kane-vanguard", "Victories", "Held the line at Meridian Rest.");
    log.record("kane-vanguard", "Near deaths", "Nearly lost to the first Void incursion.");
    log.record("ryker-engineer", "Losses", "Lost a prototype reactor to sabotage.");
    expect(log.historyFor("kane-vanguard").length).toBe(2);
    expect(log.historyFor("ryker-engineer").length).toBe(1);
    expect(log.all().length).toBe(3);
    expect(log.historyFor("kane-vanguard")[0]!.sequence).toBe(0);
  });
});

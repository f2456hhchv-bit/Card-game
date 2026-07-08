import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  ENDGAME_DIFFICULTY_AXES,
  ENDGAME_MASTERY_TRACKS,
  ENDGAME_PHASES,
  ENDGAME_WORLD_EVENTS,
  INFINITE_RESEARCH_BRANCHES,
  LEGACY_RECORD_KINDS,
  LEGENDARY_EXPEDITION_KINDS,
  LEGENDARY_REWARD_KINDS,
  SANDBOX_ASCENSIONS,
  WORLD_EVOLUTION_KINDS,
  ascensionLevelFor,
  milestonesRequiredFor,
  researchNodeCostFor,
} from "../src/game/endgame/endgameData";
import { EndgameRuntime } from "../src/game/endgame/EndgameRuntime";

function unlockedRuntime(): EndgameRuntime {
  const endgame = new EndgameRuntime(SANDBOX_ASCENSIONS);
  endgame.notifyCampaignComplete();
  return endgame;
}

function ascendOnce(endgame: EndgameRuntime): void {
  while (!endgame.canAscend) endgame.recordMilestone();
  expect(endgame.ascend()).not.toBeNull();
}

describe("Endgame vocabulary — registered shelves (AF-069)", () => {
  it("registers ten phases, eight expedition kinds, six evolution kinds, five difficulty axes, six research branches, eight reward kinds, eight world events, eight mastery tracks, six legacy kinds", () => {
    expect(ENDGAME_PHASES.length).toBe(10);
    expect(LEGENDARY_EXPEDITION_KINDS.length).toBe(8);
    expect(WORLD_EVOLUTION_KINDS.length).toBe(6);
    expect(ENDGAME_DIFFICULTY_AXES.length).toBe(5);
    expect(INFINITE_RESEARCH_BRANCHES.length).toBe(6);
    expect(LEGENDARY_REWARD_KINDS.length).toBe(8);
    expect(ENDGAME_WORLD_EVENTS.length).toBe(8);
    expect(ENDGAME_MASTERY_TRACKS.length).toBe(8);
    expect(LEGACY_RECORD_KINDS.length).toBe(6);
  });

  it("mastery tracks are AF-026 mastery-track IDs, not a new engine", () => {
    for (const track of ENDGAME_MASTERY_TRACKS) expect(track.startsWith("endgame:")).toBe(true);
  });
});

describe("Difficulty escalates along five axes only — never health, never damage (AF-069 §Endgame Difficulty)", () => {
  it("every authored and generated modifier uses a registered axis, and the modifier shape has no numeric field", () => {
    for (let level = 1; level <= 50; level += 1) {
      const def = ascensionLevelFor(level);
      expect(def.level).toBe(level);
      for (const modifier of def.modifiers) {
        expect(ENDGAME_DIFFICULTY_AXES).toContain(modifier.axis);
        // Health/damage inflation is unrepresentable: the modifier carries
        // an axis and a description — nothing numeric to multiply with.
        expect(Object.keys(modifier).sort()).toEqual(["axis", "description"]);
      }
      for (const reward of def.rewards) expect(LEGENDARY_REWARD_KINDS).toContain(reward.kind);
    }
  });
});

describe("The endgame begins after the main campaign (AF-069 §Objective)", () => {
  it("constructs locked: every progression operation no-ops until notifyCampaignComplete", () => {
    const endgame = new EndgameRuntime(SANDBOX_ASCENSIONS);
    expect(endgame.isUnlocked).toBe(false);
    expect(endgame.recordMilestone()).toBe(false);
    expect(endgame.completeExpedition("voidIncursions")).toBe(false);
    expect(endgame.recordEvolution("newColonies")).toBe(false);
    expect(endgame.recordLegacy("memorials", "too early")).toBe(false);
    expect(endgame.tryUnlockResearchNode("efficiency")).toBe(false);
    expect(endgame.canAscend).toBe(false);
    expect(endgame.snapshot.unlocked).toBe(false);
    endgame.notifyCampaignComplete();
    expect(endgame.recordMilestone()).toBe(true);
  });
});

describe("Ascension — resets expedition progression, retains permanent progression (AF-069 §Ascension System)", () => {
  it("ascend clears exactly the per-ascension map: lifetime expeditions, research, evolution, and legacy all survive", () => {
    const endgame = unlockedRuntime();
    endgame.completeExpedition("infiniteBossHunts");
    endgame.completeExpedition("voidIncursions");
    endgame.investResearch(100);
    expect(endgame.tryUnlockResearchNode("technology")).toBe(true);
    endgame.recordEvolution("newColonies");
    endgame.recordLegacy("memorials", "The Meridian Vigil");
    expect(endgame.expeditionsThisAscension()).toBe(2);

    ascendOnce(endgame);

    expect(endgame.expeditionsThisAscension()).toBe(0); // resets expedition progression…
    expect(endgame.expeditionsLifetime()).toBe(2); // …retains permanent progression
    expect(endgame.expeditionsLifetime("voidIncursions")).toBe(1);
    expect(endgame.researchNodesFor("technology")).toBe(1);
    expect(endgame.worldEvolution.length).toBe(1);
    expect(endgame.legacy.length).toBe(1);
    expect(endgame.snapshot.ascensionLevel).toBe(1);
  });

  it("requirements escalate per level and levels extend beyond the authored defs forever", () => {
    expect(milestonesRequiredFor(1)).toBeLessThan(milestonesRequiredFor(2));
    expect(milestonesRequiredFor(2)).toBeLessThan(milestonesRequiredFor(3));
    const endgame = unlockedRuntime();
    for (let i = 0; i < 10; i += 1) ascendOnce(endgame);
    expect(endgame.snapshot.ascensionLevel).toBe(10); // past the three authored levels — unlimited expansion
    expect(endgame.currentAscension!.name).toBe("Ascension 10");
    expect(endgame.activeModifiers().length).toBeGreaterThanOrEqual(10); // escalation compounds
  });

  it("each ascension changes gameplay through its modifiers and grants its rewards", () => {
    const endgame = unlockedRuntime();
    while (!endgame.canAscend) endgame.recordMilestone();
    const first = endgame.ascend()!;
    expect(first.name).toBe("Ascension I — The Second Dawn");
    expect(first.modifiers.length).toBeGreaterThan(0);
    expect(first.rewards.length).toBeGreaterThan(0);
    expect(first.unlockedMechanic.length).toBeGreaterThan(0);
  });
});

describe("Infinite research — no cap, no wall, smooth escalation (AF-069 §Infinite Research)", () => {
  it("node costs grow geometrically and every branch scales independently without limit", () => {
    expect(researchNodeCostFor(0)).toBeLessThan(researchNodeCostFor(5));
    expect(researchNodeCostFor(5)).toBeLessThan(researchNodeCostFor(20));
    const endgame = unlockedRuntime();
    endgame.investResearch(1_000_000);
    let unlocked = 0;
    for (const branch of INFINITE_RESEARCH_BRANCHES) {
      while (endgame.tryUnlockResearchNode(branch)) unlocked += 1;
    }
    expect(unlocked).toBeGreaterThan(30); // deep progression from one big bank
    expect(endgame.tryUnlockResearchNode("efficiency")).toBe(false); // stops only when points run out — never a wall
    endgame.investResearch(researchNodeCostFor(endgame.researchNodesFor("efficiency")));
    expect(endgame.tryUnlockResearchNode("efficiency")).toBe(true); // and resumes immediately
  });
});

describe("World events and legacy (AF-069 §World Events, §Galaxy Legacy)", () => {
  it("world events pick deterministically from the registered pool under a seeded Rng", () => {
    const kinds = new Set(ENDGAME_WORLD_EVENTS.map((e) => e.kind));
    const endgame = unlockedRuntime();
    const a = new Rng(69);
    const b = new Rng(69);
    for (let i = 0; i < 500; i += 1) {
      const eventA = endgame.nextWorldEvent(a);
      expect(kinds.has(eventA)).toBe(true);
      expect(endgame.nextWorldEvent(b)).toBe(eventA);
    }
  });

  it("legacy and evolution are append-only, and the class exposes no removal operation", () => {
    const endgame = unlockedRuntime();
    for (const kind of LEGACY_RECORD_KINDS) endgame.recordLegacy(kind, `record-${kind}`);
    for (const kind of WORLD_EVOLUTION_KINDS) endgame.recordEvolution(kind);
    expect(endgame.legacy.length).toBe(LEGACY_RECORD_KINDS.length);
    expect(endgame.worldEvolution.length).toBe(WORLD_EVOLUTION_KINDS.length);
    const api = Object.getOwnPropertyNames(EndgameRuntime.prototype);
    for (const name of api) expect(/remove|delete|revoke|reset/i.test(name)).toBe(false);
  });
});

describe("Endgame — self-review: hundreds of thousands of hours (AF-069 §Self Review Loop)", () => {
  it("1,000 seeded careers of mixed play never throw, never regress permanent progression, and keep finding goals", () => {
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const endgame = unlockedRuntime();
      let lastLifetime = 0;
      let lastLevel = 0;
      for (let step = 0; step < 200; step += 1) {
        const roll = rng.next();
        if (roll < 0.4) {
          endgame.recordMilestone();
        } else if (roll < 0.7) {
          const kind = LEGENDARY_EXPEDITION_KINDS[Math.floor(rng.next() * LEGENDARY_EXPEDITION_KINDS.length)]!;
          endgame.completeExpedition(kind);
        } else if (roll < 0.85) {
          endgame.investResearch(1 + Math.floor(rng.next() * 30));
          const branch = INFINITE_RESEARCH_BRANCHES[Math.floor(rng.next() * INFINITE_RESEARCH_BRANCHES.length)]!;
          endgame.tryUnlockResearchNode(branch);
        } else if (endgame.canAscend) {
          expect(endgame.ascend()).not.toBeNull();
          expect(endgame.expeditionsThisAscension()).toBe(0); // reset on every ascension
        } else {
          endgame.recordEvolution(WORLD_EVOLUTION_KINDS[Math.floor(rng.next() * WORLD_EVOLUTION_KINDS.length)]!);
        }
        const snap = endgame.snapshot;
        if (snap.expeditionsLifetime < lastLifetime) throw new Error("permanent progression regressed");
        if (snap.ascensionLevel < lastLevel) throw new Error("ascension regressed");
        lastLifetime = snap.expeditionsLifetime;
        lastLevel = snap.ascensionLevel;
      }
      // "There is always another goal": the next ascension requirement is always finite and stated.
      expect(endgame.snapshot.milestonesRequired).toBeGreaterThan(0);
    }
  });
});

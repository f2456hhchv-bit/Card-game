import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { MISSION_EVENT_KINDS, OBJECTIVE_TYPES } from "../src/game/missions/missionData";
import { generateMission } from "../src/game/missions/MissionGenerator";
import {
  FRAMEWORK_MISSIONS,
  FRAMEWORK_MISSION_CATEGORIES,
  MISSION_PROFILES,
} from "../src/game/missions/missionFrameworkData";
import {
  DYNAMIC_EVENT_KINDS,
  DYNAMIC_EVENT_TO_MISSION_EVENT,
  ExpeditionLogRuntime,
  FAMILY_TO_FRAMEWORK_CATEGORY,
  LEGENDARY_EXPEDITION_FEATURES,
  MISSION_CHAINS,
  MISSION_CHAIN_KINDS,
  MISSION_COLLECTION_KINDS,
  MISSION_FAMILIES,
  MISSION_ROSTER_ENTRIES,
  MISSION_TIERS,
  NETWORK_SURFACE_TO_OBJECTIVE_TYPE,
  OBJECTIVE_NETWORK_SURFACES,
  OPERATIONS_CENTRE_FEATURES,
  ROSTER_GENERATOR_INPUTS,
  ROSTER_MISSION_ACCESSIBILITY_SURFACES,
  ROSTER_MISSION_FORBIDDEN_OUTCOMES,
  VAULT_SIGNAL_CHAIN,
  WORLD_REACTIVITY_SURFACES,
  nextChainStageAfter,
  operationsCentreFor,
} from "../src/game/missions/missionRosterData";

function profileFor(missionId: string) {
  return MISSION_PROFILES.find((p) => p.missionId === missionId)!;
}
function defFor(missionId: string) {
  return FRAMEWORK_MISSIONS.find((m) => m.id === missionId)!;
}

describe("Mission Roster vocabulary — registered shelves (AF-084)", () => {
  it("registers seventeen families, eight tiers, ten network surfaces, eight reactivity surfaces, nine dynamic events, seven legendary features, seven chain kinds, ten generator inputs, eight collection kinds, eight centre features, two forbidden outcomes, eight accessibility surfaces", () => {
    expect(MISSION_FAMILIES.length).toBe(17);
    expect(MISSION_TIERS.length).toBe(8);
    expect(OBJECTIVE_NETWORK_SURFACES.length).toBe(10);
    expect(WORLD_REACTIVITY_SURFACES.length).toBe(8);
    expect(DYNAMIC_EVENT_KINDS.length).toBe(9);
    expect(LEGENDARY_EXPEDITION_FEATURES.length).toBe(7);
    expect(MISSION_CHAIN_KINDS.length).toBe(7);
    expect(ROSTER_GENERATOR_INPUTS.length).toBe(10);
    expect(MISSION_COLLECTION_KINDS.length).toBe(8);
    expect(OPERATIONS_CENTRE_FEATURES.length).toBe(8);
    expect(ROSTER_MISSION_FORBIDDEN_OUTCOMES.length).toBe(2);
    expect(ROSTER_MISSION_ACCESSIBILITY_SURFACES.length).toBe(8);
  });

  it("families map TOTALLY onto AF-083's categories, network surfaces onto AF-037's objective types, dynamic events onto AF-037's event kinds — and every reactivity surface names a live system", () => {
    for (const family of MISSION_FAMILIES) {
      expect([...FRAMEWORK_MISSION_CATEGORIES]).toContain(FAMILY_TO_FRAMEWORK_CATEGORY[family]);
    }
    for (const surface of OBJECTIVE_NETWORK_SURFACES) {
      expect([...OBJECTIVE_TYPES]).toContain(NETWORK_SURFACE_TO_OBJECTIVE_TYPE[surface]);
    }
    for (const event of DYNAMIC_EVENT_KINDS) {
      expect([...MISSION_EVENT_KINDS]).toContain(DYNAMIC_EVENT_TO_MISSION_EVENT[event]);
    }
    for (const surface of WORLD_REACTIVITY_SURFACES) expect(surface.liveBinding.length, surface.id).toBeGreaterThan(0);
    for (const input of ROSTER_GENERATOR_INPUTS) expect(input.liveBinding.length, input.id).toBeGreaterThan(0);
  });
});

describe("Roster entries — identity only, bound three layers deep (AF-084)", () => {
  it("every expedition has an entry; the family binding resolves to exactly its profile's framework category; no stat field exists", () => {
    expect(MISSION_ROSTER_ENTRIES.length).toBe(FRAMEWORK_MISSIONS.length);
    for (const entry of MISSION_ROSTER_ENTRIES) {
      const profile = profileFor(entry.missionId);
      expect(profile, entry.missionId).toBeDefined();
      expect(FAMILY_TO_FRAMEWORK_CATEGORY[entry.family], `${entry.missionId} family binding`).toBe(profile.frameworkCategory);
      expect([...MISSION_TIERS]).toContain(entry.tier);
      expect(Object.keys(entry).sort()).toEqual(["family", "missionId", "tier"]);
    }
  });

  it("TIER IS NOT ENEMY STRENGTH: a lower-tier expedition outranks a higher-tier one in raw difficulty, while tier tracks complexity and reward quality", () => {
    const tierIndex = (tier: string) => MISSION_TIERS.indexOf(tier as (typeof MISSION_TIERS)[number]);
    // The common-tier Winterline Rescue is HARDER (difficulty 3) than the special-tier incursion (difficulty 1).
    const winterline = MISSION_ROSTER_ENTRIES.find((e) => e.missionId === "winterline-rescue")!;
    const incursion = MISSION_ROSTER_ENTRIES.find((e) => e.missionId === "crystal-fields-incursion")!;
    expect(tierIndex(winterline.tier)).toBeLessThan(tierIndex(incursion.tier));
    expect(defFor("winterline-rescue").difficulty).toBeGreaterThan(defFor("crystal-fields-incursion").difficulty);
    // Complexity: the ancient-tier excavation runs more modifier slots than any lower-tier expedition.
    const excavation = defFor("first-light-excavation");
    for (const entry of MISSION_ROSTER_ENTRIES) {
      if (entry.missionId === "first-light-excavation") continue;
      expect(excavation.modifierSlots).toBeGreaterThan(defFor(entry.missionId).modifierSlots);
    }
    // Mythic and galaxyEvent tiers are honestly registered-empty.
    const used = new Set(MISSION_ROSTER_ENTRIES.map((e) => e.tier));
    expect(used.has("mythic")).toBe(false);
    expect(used.has("galaxyEvent")).toBe(false);
  });
});

describe("Chain missions — long-term narratives as data (AF-084 §Chain Missions)", () => {
  it("every chain stage is a REAL expedition, stages are unique, and the pure progression function walks the chain end-to-end", () => {
    for (const chain of MISSION_CHAINS) {
      expect([...MISSION_CHAIN_KINDS]).toContain(chain.kind);
      expect(chain.narrative.length).toBeGreaterThan(0);
      expect(chain.stageMissionIds.length).toBeGreaterThanOrEqual(2);
      expect(new Set(chain.stageMissionIds).size).toBe(chain.stageMissionIds.length);
      for (const stageId of chain.stageMissionIds) {
        expect(FRAMEWORK_MISSIONS.some((m) => m.id === stageId), `${chain.id} stage ${stageId}`).toBe(true);
      }
    }
    expect(nextChainStageAfter(VAULT_SIGNAL_CHAIN, "crystal-fields-incursion")).toBe("first-light-excavation");
    expect(nextChainStageAfter(VAULT_SIGNAL_CHAIN, "first-light-excavation")).toBeNull(); // the chain ends
    expect(nextChainStageAfter(VAULT_SIGNAL_CHAIN, "winterline-rescue")).toBeNull(); // not a stage
  });
});

describe("The expedition log — permanent personal history (AF-084 §Mission Collection)", () => {
  it("records are append-only with monotone sequence numbers; defeats are remembered as honestly as victories; the prototype offers no removal", () => {
    const log = new ExpeditionLogRuntime();
    expect(log.snapshot.timelineLength).toBe(0);
    const first = log.recordExpedition({ missionId: "winterline-rescue", tier: "common", result: "victory", perfect: true, optionalsDone: 2, bossDefeated: false, playTimeMs: 60000 });
    const second = log.recordExpedition({ missionId: "crystal-fields-incursion", tier: "special", result: "defeat", perfect: false, optionalsDone: 0, bossDefeated: false, playTimeMs: 30000 });
    expect(first.sequence).toBe(1);
    expect(second.sequence).toBe(2);
    const snapshot = log.snapshot;
    expect(snapshot.completedCount).toBe(1);
    expect(snapshot.defeatCount).toBe(1); // failure generates stories — it is on the record
    expect(snapshot.perfectCount).toBe(1);
    expect(snapshot.optionalObjectivesTotal).toBe(2);
    expect(snapshot.timelineLength).toBe(2);
    const methods = Object.getOwnPropertyNames(ExpeditionLogRuntime.prototype);
    for (const method of methods) {
      expect(/remove|delete|revoke|reset|retire|forget|erase/i.test(method), `forbidden API: ${method}`).toBe(false);
    }
  });

  it("the Galaxy Operations Centre derives all eight features from the log — a viewer over history, not a system", () => {
    const log = new ExpeditionLogRuntime();
    for (const feature of OPERATIONS_CENTRE_FEATURES) {
      expect(operationsCentreFor(log)[feature].length, `empty-log ${feature}`).toBeGreaterThan(0);
    }
    log.recordExpedition({ missionId: "first-light-excavation", tier: "ancient", result: "victory", perfect: false, optionalsDone: 1, bossDefeated: true, playTimeMs: 90000 });
    const centre = operationsCentreFor(log);
    for (const feature of OPERATIONS_CENTRE_FEATURES) expect(centre[feature].length, feature).toBeGreaterThan(0);
    expect(centre.galaxyActivity).toContain("1");
  });
});

describe("Mission Roster — self-review: generate millions of expeditions (AF-084 §Self Review Loop)", () => {
  it("1,000 expeditions per template across the roster: instance ids are unique ACROSS templates and seeds — no two expeditions collide", () => {
    const ids = new Set<string>();
    for (const def of FRAMEWORK_MISSIONS) {
      for (let seed = 0; seed < 1000; seed += 1) ids.add(generateMission(def, seed).id);
    }
    expect(ids.size).toBe(FRAMEWORK_MISSIONS.length * 1000);
  });

  it("1,000 seeded expedition careers through the log: sequence strictly monotone, counts never regress, perfect never exceeds victories", () => {
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const log = new ExpeditionLogRuntime();
      let lastTimeline = 0;
      for (let step = 0; step < 20; step += 1) {
        const entry = MISSION_ROSTER_ENTRIES[Math.floor(rng.next() * MISSION_ROSTER_ENTRIES.length)]!;
        const victory = rng.next() < 0.7;
        const record = log.recordExpedition({
          missionId: entry.missionId,
          tier: entry.tier,
          result: victory ? "victory" : "defeat",
          perfect: victory && rng.next() < 0.3,
          optionalsDone: Math.floor(rng.next() * 3),
          bossDefeated: victory && rng.next() < 0.4,
          playTimeMs: Math.floor(rng.next() * 300000),
        });
        if (record.sequence !== step + 1) throw new Error(`career ${career}: sequence broke`);
        const snapshot = log.snapshot;
        if (snapshot.timelineLength <= lastTimeline) throw new Error(`career ${career}: timeline did not grow`);
        lastTimeline = snapshot.timelineLength;
        if (snapshot.perfectCount > snapshot.completedCount) throw new Error(`career ${career}: perfect exceeded victories`);
        if (snapshot.completedCount + snapshot.defeatCount !== snapshot.timelineLength) throw new Error(`career ${career}: ledger drifted`);
      }
    }
  });
});

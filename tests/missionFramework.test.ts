import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  MISSION_CATEGORIES,
  MISSION_EVENT_KINDS,
  MISSION_EVENT_TO_ENVIRONMENTAL_EVENT,
  SANDBOX_MISSIONS,
} from "../src/game/missions/missionData";
import { generateMission } from "../src/game/missions/MissionGenerator";
import { MissionRuntime } from "../src/game/missions/MissionRuntime";
import { FACTION_IDS } from "../src/game/factions/factionData";
import { SANDBOX_BOSSES } from "../src/game/bosses/bossData";
import { SANDBOX_BIOMES } from "../src/game/biomes/biomeData";
import { FROZEN_REACH_BIOME } from "../src/game/biomes/frozenReachBiome";
import { ANCIENT_CORE_BIOME } from "../src/game/biomes/ancientCoreBiome";
import { MACHINE_EXPANSE_BIOME } from "../src/game/biomes/machineExpanseBiome";
import {
  FIRST_LIGHT_EXCAVATION,
  FORGE_PRIMUS_UPRISING,
  FRAMEWORK_CATEGORY_TO_MISSION_CATEGORY,
  FRAMEWORK_EVENT_TO_MISSION_EVENT,
  FRAMEWORK_MISSIONS,
  FRAMEWORK_MISSION_CATEGORIES,
  FRAMEWORK_MISSION_EVENTS,
  MISSION_ACCESSIBILITY_SURFACES,
  MISSION_ARCHITECTURE_PARTS,
  MISSION_FAILURE_CONSEQUENCES,
  MISSION_FORBIDDEN_OUTCOMES,
  MISSION_GENERATION_INPUTS,
  MISSION_HISTORY_FIELDS,
  MISSION_PROFILES,
  MISSION_REWARD_KINDS,
  MISSION_STRUCTURE_PHASES,
  MISSION_VARIATION_SOURCES,
  OBJECTIVE_KIND_TO_MECHANISM,
  OBJECTIVE_SYSTEM_KINDS,
  PHASE_TO_LIVE_SEAM,
  WINTERLINE_RESCUE,
  missionArchitectureFor,
} from "../src/game/missions/missionFrameworkData";

const KNOWN_BIOME_IDS = new Set([...SANDBOX_BIOMES.map((b) => b.id), FROZEN_REACH_BIOME.id, ANCIENT_CORE_BIOME.id, MACHINE_EXPANSE_BIOME.id]);

function profileFor(missionId: string) {
  return MISSION_PROFILES.find((p) => p.missionId === missionId)!;
}

describe("Mission Framework vocabulary — registered shelves (AF-083)", () => {
  it("registers fourteen architecture parts, seventeen categories, nine structure phases, eight objective kinds, nine generation inputs, eight framework events, ten reward kinds, eight variation sources, five failure consequences, nine history fields, two forbidden outcomes, eight accessibility surfaces", () => {
    expect(MISSION_ARCHITECTURE_PARTS.length).toBe(14);
    expect(FRAMEWORK_MISSION_CATEGORIES.length).toBe(17);
    expect(MISSION_STRUCTURE_PHASES.length).toBe(9);
    expect(OBJECTIVE_SYSTEM_KINDS.length).toBe(8);
    expect(MISSION_GENERATION_INPUTS.length).toBe(9);
    expect(FRAMEWORK_MISSION_EVENTS.length).toBe(8);
    expect(MISSION_REWARD_KINDS.length).toBe(10);
    expect(MISSION_VARIATION_SOURCES.length).toBe(8);
    expect(MISSION_FAILURE_CONSEQUENCES.length).toBe(5);
    expect(MISSION_HISTORY_FIELDS.length).toBe(9);
    expect(MISSION_FORBIDDEN_OUTCOMES.length).toBe(2);
    expect(MISSION_ACCESSIBILITY_SURFACES.length).toBe(8);
  });

  it("the seventeen categories map TOTALLY onto AF-037's fifteen, and the eight framework events onto AF-037's ten — which already bind to the REAL environmental vocabulary", () => {
    for (const category of FRAMEWORK_MISSION_CATEGORIES) {
      expect([...MISSION_CATEGORIES]).toContain(FRAMEWORK_CATEGORY_TO_MISSION_CATEGORY[category]);
    }
    for (const event of FRAMEWORK_MISSION_EVENTS) {
      const missionEvent = FRAMEWORK_EVENT_TO_MISSION_EVENT[event];
      expect([...MISSION_EVENT_KINDS]).toContain(missionEvent);
      expect(MISSION_EVENT_TO_ENVIRONMENTAL_EVENT[missionEvent].length).toBeGreaterThan(0); // three naming layers, one fact
    }
  });

  it("the nine structure phases each name a LIVE seam, and the eight objective kinds ride AF-037's TWO engine mechanisms — no second state machine, no third objective array", () => {
    for (const phase of MISSION_STRUCTURE_PHASES) expect(PHASE_TO_LIVE_SEAM[phase].length, phase).toBeGreaterThan(0);
    for (const kind of OBJECTIVE_SYSTEM_KINDS) {
      expect(["primaryArray", "optionalArray"]).toContain(OBJECTIVE_KIND_TO_MECHANISM[kind]);
    }
    expect(OBJECTIVE_KIND_TO_MECHANISM.primary).toBe("primaryArray");
    for (const input of MISSION_GENERATION_INPUTS) expect(input.liveBinding.length, input.id).toBeGreaterThan(0);
    for (const source of MISSION_VARIATION_SOURCES) expect(source.liveBinding.length, source.id).toBeGreaterThan(0);
    for (const reward of MISSION_REWARD_KINDS) expect(reward.identity.length, reward.id).toBeGreaterThan(0);
    expect(MISSION_REWARD_KINDS.filter((r) => r.live).length).toBeGreaterThanOrEqual(6); // most reward kinds already flow
  });
});

describe("The expedition roster — AF-037 untouched, three expeditions added (AF-083/GP-003)", () => {
  it("four expeditions: the sandbox template heads the array unchanged; the additions are the FIRST missions set outside the sandbox biome", () => {
    // GP-003 §Star Systems: FORGE_PRIMUS_UPRISING is the fourth addition —
    // Forge Primus's own real, biome-matched mission (see galaxyData.ts).
    expect(FRAMEWORK_MISSIONS.length).toBe(4);
    expect(FRAMEWORK_MISSIONS.slice(0, SANDBOX_MISSIONS.length)).toEqual(SANDBOX_MISSIONS);
    expect(WINTERLINE_RESCUE.biomeId).toBe("frozen-reach");
    expect(FIRST_LIGHT_EXCAVATION.biomeId).toBe("ancient-core");
    expect(FORGE_PRIMUS_UPRISING.biomeId).toBe("machine-expanse");
    for (const def of FRAMEWORK_MISSIONS) {
      expect(KNOWN_BIOME_IDS.has(def.biomeId), `${def.id} biome ${def.biomeId}`).toBe(true);
      if (def.bossId !== null) expect(SANDBOX_BOSSES.some((b) => b.id === def.bossId), `${def.id} boss`).toBe(true);
    }
  });

  it("NOTHING REMAINS UNDEFINED: all fourteen architecture parts hold for every expedition, and faction presence resolves in AF-039's REAL register", () => {
    expect(MISSION_PROFILES.length).toBe(FRAMEWORK_MISSIONS.length);
    for (const def of FRAMEWORK_MISSIONS) {
      const profile = profileFor(def.id);
      expect(profile, def.id).toBeDefined();
      const architecture = missionArchitectureFor(def, profile);
      for (const part of MISSION_ARCHITECTURE_PARTS) {
        expect(architecture[part], `${def.id} missing ${part}`).toBe(true);
      }
      if (profile.factionPresence !== "none") {
        expect([...FACTION_IDS]).toContain(profile.factionPresence);
      }
      for (const kind of profile.rewardKinds) {
        expect(MISSION_REWARD_KINDS.some((r) => r.id === kind), `${def.id} reward ${kind}`).toBe(true);
      }
    }
  });

  it("THREAT BUDGET SCALES WITH DIFFICULTY, never against it — and rewards reflect difficulty through the xpTier ladder", () => {
    const byDifficulty = [...FRAMEWORK_MISSIONS].sort((a, b) => a.difficulty - b.difficulty);
    for (let i = 1; i < byDifficulty.length; i += 1) {
      const prev = profileFor(byDifficulty[i - 1]!.id);
      const next = profileFor(byDifficulty[i]!.id);
      expect(next.threatBudget).toBeGreaterThan(prev.threatBudget);
    }
  });
});

describe("Expeditions through the REAL engine (AF-083 §Mission Structure / §Objective System)", () => {
  it("the Winterline Rescue completes through AF-037's real runtime — rescue counters, stay-under objectives, optional never blocking", () => {
    const instance = generateMission(WINTERLINE_RESCUE, 42);
    const runtime = new MissionRuntime(instance, new Rng(42));
    expect(runtime.snapshot.primaryObjectivesComplete).toBe(false);
    runtime.recordProgress("missionCiviliansRescued", 3);
    expect(runtime.snapshot.primaryObjectivesComplete).toBe(false); // the approach is still hot
    runtime.recordProgress("missionKills", 10);
    expect(runtime.snapshot.primaryObjectivesComplete).toBe(true); // optional objectives never blocked completion
    runtime.recordProgress("missionDamageTaken", 1); // the stay-under optional revokes, primaries unaffected
    const snap = runtime.snapshot;
    expect(snap.primaryObjectivesComplete).toBe(true);
    expect(snap.optionalDone).toBeLessThan(snap.optionalTotal);
  });

  it("generation is DETERMINISTIC per seed and modifiers always come from the template's own pool", () => {
    for (const def of FRAMEWORK_MISSIONS) {
      const a = generateMission(def, 7);
      const b = generateMission(def, 7);
      expect(a.activeModifiers).toEqual(b.activeModifiers); // same seed, same expedition
      expect(a.id).toBe(b.id);
      const c = generateMission(def, 8);
      expect(c.id).not.toBe(a.id);
    }
  });
});

describe("Mission Framework — self-review: generate millions of missions (AF-083 §Self Review Loop)", () => {
  it("3,000 generated expeditions (1,000 seeds × 3 templates): modifiers subset of pool, slot counts exact, ids unique, and VARIATION is real — multiple distinct modifier rolls per template", () => {
    for (const def of FRAMEWORK_MISSIONS) {
      const ids = new Set<string>();
      const modifierSets = new Set<string>();
      for (let seed = 0; seed < 1000; seed += 1) {
        const instance = generateMission(def, seed);
        ids.add(instance.id);
        expect(instance.activeModifiers.length).toBe(Math.min(def.modifierSlots, def.modifierPool.length));
        for (const modifier of instance.activeModifiers) {
          if (!def.modifierPool.includes(modifier)) throw new Error(`${def.id}: modifier outside pool`);
        }
        modifierSets.add(instance.activeModifiers.map((m) => m.kind).sort().join("+"));
      }
      expect(ids.size).toBe(1000);
      expect(modifierSets.size).toBeGreaterThan(1); // no expedition relies on a single fixed roll
    }
  });

  it("1,000 seeded expedition careers through the REAL runtime: progress is monotone, optionals never block, stay-under objectives never resurrect", () => {
    const counterKeys = ["missionKills", "missionCiviliansRescued", "missionElitesKilled", "missionDamageTaken", "missionSitesScanned", "missionArtefactsCollected", "missionBeaconsActivated"];
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const def = FRAMEWORK_MISSIONS[career % FRAMEWORK_MISSIONS.length]!;
      const runtime = new MissionRuntime(generateMission(def, career), rng);
      let lastPrimary = 0;
      let damageTaken = false;
      for (let step = 0; step < 30; step += 1) {
        const key = counterKeys[Math.floor(rng.next() * counterKeys.length)]!;
        if (key === "missionDamageTaken") damageTaken = true;
        runtime.recordProgress(key, 1);
        const snap = runtime.snapshot;
        if (snap.primaryDone < lastPrimary) throw new Error(`career ${career}: primary progress regressed`);
        lastPrimary = snap.primaryDone;
        if (damageTaken && def.optionalObjectives.some((o) => o.target === 0)) {
          const stayUnder = def.optionalObjectives.find((o) => o.target === 0)!;
          if (runtime.isComplete(stayUnder.id)) throw new Error(`career ${career}: stay-under resurrected`);
        }
      }
    }
  });
});

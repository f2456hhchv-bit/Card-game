import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_TITAN } from "../src/game/commanders/cmd018IvanVolkov";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_ORACLE,
  FULL_RECRUITMENT_WITH_ORACLE,
  FULL_ROSTER_WITH_ORACLE,
  MYRR_ORACLE_CODEX_ENTRY,
  MYRR_ORACLE_COMMANDER,
  MYRR_ORACLE_EXPANDED_PROFILE,
  MYRR_ORACLE_ID,
  MYRR_ORACLE_PROFILE,
  MYRR_ORACLE_RECRUITMENT,
  MYRR_ORACLE_RECRUITMENT_SOURCE_IS_REAL,
  oracleArchitectureComplete,
  oracleOverlapReport,
} from "../src/game/commanders/cmd019SeleneMyrr";

describe("Commander CMD-019 — Selene Myrr 'The Oracle' (AF-117)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(MYRR_ORACLE_COMMANDER.name).toBe("Selene Myrr");
    expect(MYRR_ORACLE_COMMANDER.callsign).toBe("Oracle");
    expect(MYRR_ORACLE_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(MYRR_ORACLE_EXPANDED_PROFILE.age).toBe(39);
    expect(MYRR_ORACLE_EXPANDED_PROFILE.homeworld).toBe("Oracle Station Theta");
    expect(MYRR_ORACLE_EXPANDED_PROFILE.personality).toBe("visionary");
  });

  it("is added additively — the real 40-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_TITAN.length).toBe(40);
    expect(FULL_ROSTER_WITH_ORACLE.length).toBe(41);
    expect(FULL_PROFILES_WITH_ORACLE.length).toBe(41);
    expect(FULL_RECRUITMENT_WITH_ORACLE.length).toBe(41);
    for (const original of FULL_ROSTER_WITH_TITAN) expect(FULL_ROSTER_WITH_ORACLE).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(oracleOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(oracleArchitectureComplete()).toBe(true);
  });

  it("deliberately avoids the recon archetype, per the spec's own 'reduce overlap with reconnaissance Commanders' directive", () => {
    expect(MYRR_ORACLE_COMMANDER.archetype).not.toBe("recon");
    expect(MYRR_ORACLE_PROFILE.class).not.toBe("recon");
  });

  it("recruits via research, gated on The Infinite Equation", () => {
    expect(MYRR_ORACLE_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(MYRR_ORACLE_RECRUITMENT.source).toBe("research");
    expect(MYRR_ORACLE_RECRUITMENT.requirement).toContain("Infinite Equation");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_ORACLE, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(41);
    expect(rosterRuntime.tryRecruit(MYRR_ORACLE_ID, new Set(["research"]))).toBe(true);
    expect(rosterRuntime.isRecruited(MYRR_ORACLE_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = MYRR_ORACLE_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("The future has already begun.");
    expect(lines).toContain("I've seen this outcome before.");
    expect(lines).toContain("Look beyond the present.");
    expect(lines).toContain("The correct decision was made.");
    expect(lines).toContain("I failed to account for that...");
  });

  it("holds exactly the three spec'd relationships (Vex, Voss, Cael) — no relationship to Kane, Ryker, Drake, Sol, Vale, Iskander, Thorne, Ash, Korven, Syn, Solari, Kain, Reyes, Orion, or Volkov is invented", () => {
    const targets = MYRR_ORACLE_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["vex-chronomancer", "voss-pathfinder", "cael-weaver"]);
    for (const absent of ["kane-vanguard", "ryker-engineer", "drake-hunter", "sol-resonant", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged", "ash-tempest", "korven-phantom", "syn-bioforge", "solari-photon", "kain-singularity", "reyes-warden", "orion-starlancer", "volkov-titan"]) expect(targets).not.toContain(absent);
  });

  it("adds a twentieth real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(MYRR_ORACLE_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-vex-chronomancer", "codex-commander-voss-pathfinder", "codex-commander-cael-weaver"]);
    expect(MYRR_ORACLE_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: MYRR_ORACLE_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of MYRR_ORACLE_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of MYRR_ORACLE_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of MYRR_ORACLE_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of MYRR_ORACLE_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of MYRR_ORACLE_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of MYRR_ORACLE_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

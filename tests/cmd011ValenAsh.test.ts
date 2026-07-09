import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_CHRONOMANCER } from "../src/game/commanders/cmd010AurelionVex";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  ASH_TEMPEST_CODEX_ENTRY,
  ASH_TEMPEST_COMMANDER,
  ASH_TEMPEST_EXPANDED_PROFILE,
  ASH_TEMPEST_ID,
  ASH_TEMPEST_PROFILE,
  ASH_TEMPEST_RECRUITMENT,
  ASH_TEMPEST_RECRUITMENT_SOURCE_IS_REAL,
  FULL_PROFILES_WITH_TEMPEST,
  FULL_RECRUITMENT_WITH_TEMPEST,
  FULL_ROSTER_WITH_TEMPEST,
  tempestArchitectureComplete,
  tempestOverlapReport,
} from "../src/game/commanders/cmd011ValenAsh";

describe("Commander CMD-011 — Valen Ash 'The Tempest' (AF-109)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(ASH_TEMPEST_COMMANDER.name).toBe("Valen Ash");
    expect(ASH_TEMPEST_COMMANDER.callsign).toBe("Tempest");
    expect(ASH_TEMPEST_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(ASH_TEMPEST_EXPANDED_PROFILE.age).toBe(37);
    expect(ASH_TEMPEST_EXPANDED_PROFILE.homeworld).toBe("Stormspire Colony");
    expect(ASH_TEMPEST_EXPANDED_PROFILE.personality).toBe("optimistic");
  });

  it("is added additively — the real 32-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_CHRONOMANCER.length).toBe(32);
    expect(FULL_ROSTER_WITH_TEMPEST.length).toBe(33);
    expect(FULL_PROFILES_WITH_TEMPEST.length).toBe(33);
    expect(FULL_RECRUITMENT_WITH_TEMPEST.length).toBe(33);
    for (const original of FULL_ROSTER_WITH_CHRONOMANCER) expect(FULL_ROSTER_WITH_TEMPEST).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(tempestOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(tempestArchitectureComplete()).toBe(true);
  });

  it("recruits via factionReputation, gated on Eye of the Storm", () => {
    expect(ASH_TEMPEST_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(ASH_TEMPEST_RECRUITMENT.source).toBe("factionReputation");
    expect(ASH_TEMPEST_RECRUITMENT.requirement).toContain("Eye of the Storm");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_TEMPEST, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(33);
    expect(rosterRuntime.tryRecruit(ASH_TEMPEST_ID, new Set(["factionReputation"]))).toBe(true);
    expect(rosterRuntime.isRecruited(ASH_TEMPEST_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = ASH_TEMPEST_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Every storm begins with a single spark.");
    expect(lines).toContain("Nature always answers.");
    expect(lines).toContain("You can't outrun the sky.");
    expect(lines).toContain("Let the heavens decide.");
    expect(lines).toContain("The storm has passed.");
  });

  it("holds exactly the three spec'd relationships (Sol, Voss, Vex) — no relationship to Kane, Ryker, Cael, Drake, Vale, Iskander, or Thorne is invented", () => {
    const targets = ASH_TEMPEST_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["sol-resonant", "voss-pathfinder", "vex-chronomancer"]);
    for (const absent of ["kane-vanguard", "ryker-engineer", "cael-weaver", "drake-hunter", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged"]) expect(targets).not.toContain(absent);
  });

  it("adds a twelfth real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(ASH_TEMPEST_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-sol-resonant", "codex-commander-voss-pathfinder", "codex-commander-vex-chronomancer"]);
    expect(ASH_TEMPEST_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: ASH_TEMPEST_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of ASH_TEMPEST_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of ASH_TEMPEST_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of ASH_TEMPEST_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of ASH_TEMPEST_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of ASH_TEMPEST_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of ASH_TEMPEST_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

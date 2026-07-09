import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_STARFORGED } from "../src/game/commanders/cmd009CassiaThorne";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_CHRONOMANCER,
  FULL_RECRUITMENT_WITH_CHRONOMANCER,
  FULL_ROSTER_WITH_CHRONOMANCER,
  VEX_CHRONOMANCER_CODEX_ENTRY,
  VEX_CHRONOMANCER_COMMANDER,
  VEX_CHRONOMANCER_EXPANDED_PROFILE,
  VEX_CHRONOMANCER_ID,
  VEX_CHRONOMANCER_PROFILE,
  VEX_CHRONOMANCER_RECRUITMENT,
  VEX_CHRONOMANCER_RECRUITMENT_SOURCE_IS_REAL,
  chronomancerArchitectureComplete,
  chronomancerOverlapReport,
} from "../src/game/commanders/cmd010AurelionVex";

describe("Commander CMD-010 — Aurelion Vex 'The Chronomancer' (AF-108)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(VEX_CHRONOMANCER_COMMANDER.name).toBe("Aurelion Vex");
    expect(VEX_CHRONOMANCER_COMMANDER.callsign).toBe("Chronomancer");
    expect(VEX_CHRONOMANCER_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(VEX_CHRONOMANCER_EXPANDED_PROFILE.age).toBe(35);
    expect(VEX_CHRONOMANCER_EXPANDED_PROFILE.homeworld).toBe("Chronos Research Ring");
    expect(VEX_CHRONOMANCER_EXPANDED_PROFILE.personality).toBe("haunted");
  });

  it("is added additively — the real 31-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_STARFORGED.length).toBe(31);
    expect(FULL_ROSTER_WITH_CHRONOMANCER.length).toBe(32);
    expect(FULL_PROFILES_WITH_CHRONOMANCER.length).toBe(32);
    expect(FULL_RECRUITMENT_WITH_CHRONOMANCER.length).toBe(32);
    for (const original of FULL_ROSTER_WITH_STARFORGED) expect(FULL_ROSTER_WITH_CHRONOMANCER).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(chronomancerOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(chronomancerArchitectureComplete()).toBe(true);
  });

  it("recruits via research, gated on The Broken Hour", () => {
    expect(VEX_CHRONOMANCER_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(VEX_CHRONOMANCER_RECRUITMENT.source).toBe("research");
    expect(VEX_CHRONOMANCER_RECRUITMENT.requirement).toContain("Broken Hour");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_CHRONOMANCER, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(32);
    expect(rosterRuntime.tryRecruit(VEX_CHRONOMANCER_ID, new Set(["research"]))).toBe(true);
    expect(rosterRuntime.isRecruited(VEX_CHRONOMANCER_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = VEX_CHRONOMANCER_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Time remembers everything.");
    expect(lines).toContain("This moment has happened before.");
    expect(lines).toContain("Every beginning contains an ending.");
    expect(lines).toContain("Just... one more second.");
    expect(lines).toContain("The future remains unwritten.");
  });

  it("holds exactly the three spec'd relationships (Cael, Voss, Sol) — no relationship to Kane, Ryker, Drake, Vale, Iskander, or Thorne is invented", () => {
    const targets = VEX_CHRONOMANCER_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["cael-weaver", "voss-pathfinder", "sol-resonant"]);
    for (const absent of ["kane-vanguard", "ryker-engineer", "drake-hunter", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged"]) expect(targets).not.toContain(absent);
  });

  it("adds an eleventh real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(VEX_CHRONOMANCER_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-cael-weaver", "codex-commander-voss-pathfinder", "codex-commander-sol-resonant"]);
    expect(VEX_CHRONOMANCER_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: VEX_CHRONOMANCER_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of VEX_CHRONOMANCER_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of VEX_CHRONOMANCER_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of VEX_CHRONOMANCER_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of VEX_CHRONOMANCER_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of VEX_CHRONOMANCER_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of VEX_CHRONOMANCER_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

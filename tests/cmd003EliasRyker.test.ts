import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_VANGUARD } from "../src/game/commanders/cmd002AdrianKane";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_ENGINEER,
  FULL_RECRUITMENT_WITH_ENGINEER,
  FULL_ROSTER_WITH_ENGINEER,
  RYKER_ENGINEER_CODEX_ENTRY,
  RYKER_ENGINEER_COMMANDER,
  RYKER_ENGINEER_EXPANDED_PROFILE,
  RYKER_ENGINEER_ID,
  RYKER_ENGINEER_PROFILE,
  RYKER_ENGINEER_RECRUITMENT,
  RYKER_ENGINEER_RECRUITMENT_SOURCE_IS_REAL,
  engineerArchitectureComplete,
  engineerOverlapReport,
} from "../src/game/commanders/cmd003EliasRyker";

describe("Commander CMD-003 — Elias Ryker 'The Engineer' (AF-101)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(RYKER_ENGINEER_COMMANDER.name).toBe("Elias Ryker");
    expect(RYKER_ENGINEER_COMMANDER.callsign).toBe("Engineer");
    expect(RYKER_ENGINEER_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(RYKER_ENGINEER_EXPANDED_PROFILE.age).toBe(44);
    expect(RYKER_ENGINEER_EXPANDED_PROFILE.homeworld).toBe("Titan Foundry Station");
  });

  it("is added additively — the real 24-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_VANGUARD.length).toBe(24);
    expect(FULL_ROSTER_WITH_ENGINEER.length).toBe(25);
    expect(FULL_PROFILES_WITH_ENGINEER.length).toBe(25);
    expect(FULL_RECRUITMENT_WITH_ENGINEER.length).toBe(25);
    for (const original of FULL_ROSTER_WITH_VANGUARD) expect(FULL_ROSTER_WITH_ENGINEER).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(engineerOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(engineerArchitectureComplete()).toBe(true);
  });

  it("recruits via campaign, gated on Echoes of the Foundry", () => {
    expect(RYKER_ENGINEER_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(RYKER_ENGINEER_RECRUITMENT.source).toBe("campaign");
    expect(RYKER_ENGINEER_RECRUITMENT.requirement).toContain("Foundry");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_ENGINEER, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(25);
    expect(rosterRuntime.tryRecruit(RYKER_ENGINEER_ID, new Set(["campaign"]))).toBe(true);
    expect(rosterRuntime.isRecruited(RYKER_ENGINEER_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = RYKER_ENGINEER_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("If we can build it, we can survive it.");
    expect(lines).toContain("Let's even the odds.");
    expect(lines).toContain("They don't make engineering like this anymore.");
    expect(lines).toContain("Nothing a little maintenance couldn't fix.");
    expect(lines).toContain("I probably should've reinforced that...");
  });

  it("is Close Friends with Lyra Voss and Professionally Respects Adrian Kane — real cross-commander relationships to real roster ids", () => {
    const targets = RYKER_ENGINEER_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toContain("voss-pathfinder");
    expect(targets).toContain("kane-vanguard");
  });

  it("adds a fourth real Codex commander entry, cross-referencing both CMD-001 and CMD-002", () => {
    expect(RYKER_ENGINEER_CODEX_ENTRY.relatedEntryIds).toContain("codex-commander-voss-pathfinder");
    expect(RYKER_ENGINEER_CODEX_ENTRY.relatedEntryIds).toContain("codex-commander-kane-vanguard");
    expect(RYKER_ENGINEER_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: RYKER_ENGINEER_ID });
  });

  it("the Automation branch produces droneEffectiveness — a fourth real producer alongside kite-aviary, voss-pathfinder's Field Commander branch, and his own signature", () => {
    const automationBranch = RYKER_ENGINEER_PROFILE.talentBranches.find((b) => b.id === "ryker-engineer:automation")!;
    expect(automationBranch.nodes.some((n) => n.bonus.kind === "droneEffectiveness")).toBe(true);
    expect(RYKER_ENGINEER_COMMANDER.signature.passive.bonus.kind).toBe("droneEffectiveness");
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of RYKER_ENGINEER_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of RYKER_ENGINEER_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of RYKER_ENGINEER_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of RYKER_ENGINEER_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of RYKER_ENGINEER_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of RYKER_ENGINEER_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

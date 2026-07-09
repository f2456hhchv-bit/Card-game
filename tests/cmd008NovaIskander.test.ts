import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_VOIDRUNNER } from "../src/game/commanders/cmd007OrionVale";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_SWARMMASTER,
  FULL_RECRUITMENT_WITH_SWARMMASTER,
  FULL_ROSTER_WITH_SWARMMASTER,
  ISKANDER_SWARMMASTER_CODEX_ENTRY,
  ISKANDER_SWARMMASTER_COMMANDER,
  ISKANDER_SWARMMASTER_EXPANDED_PROFILE,
  ISKANDER_SWARMMASTER_ID,
  ISKANDER_SWARMMASTER_PROFILE,
  ISKANDER_SWARMMASTER_RECRUITMENT,
  ISKANDER_SWARMMASTER_RECRUITMENT_SOURCE_IS_REAL,
  swarmmasterArchitectureComplete,
  swarmmasterOverlapReport,
} from "../src/game/commanders/cmd008NovaIskander";

describe("Commander CMD-008 — Nova Iskander 'The Swarmmaster' (AF-106)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(ISKANDER_SWARMMASTER_COMMANDER.name).toBe("Nova Iskander");
    expect(ISKANDER_SWARMMASTER_COMMANDER.callsign).toBe("Swarmmaster");
    expect(ISKANDER_SWARMMASTER_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(ISKANDER_SWARMMASTER_EXPANDED_PROFILE.age).toBe(39);
    expect(ISKANDER_SWARMMASTER_EXPANDED_PROFILE.homeworld).toBe("Orbital Hive Sigma");
    expect(ISKANDER_SWARMMASTER_EXPANDED_PROFILE.personality).toBe("compassionate");
  });

  it("is added additively — the real 29-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_VOIDRUNNER.length).toBe(29);
    expect(FULL_ROSTER_WITH_SWARMMASTER.length).toBe(30);
    expect(FULL_PROFILES_WITH_SWARMMASTER.length).toBe(30);
    expect(FULL_RECRUITMENT_WITH_SWARMMASTER.length).toBe(30);
    for (const original of FULL_ROSTER_WITH_VOIDRUNNER) expect(FULL_ROSTER_WITH_SWARMMASTER).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(swarmmasterOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(swarmmasterArchitectureComplete()).toBe(true);
  });

  it("recruits via hiddenDiscoveries, gated on Hive Protocol", () => {
    expect(ISKANDER_SWARMMASTER_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(ISKANDER_SWARMMASTER_RECRUITMENT.source).toBe("hiddenDiscoveries");
    expect(ISKANDER_SWARMMASTER_RECRUITMENT.requirement).toContain("Hive Protocol");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_SWARMMASTER, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(30);
    expect(rosterRuntime.tryRecruit(ISKANDER_SWARMMASTER_ID, new Set(["hiddenDiscoveries"]))).toBe(true);
    expect(rosterRuntime.isRecruited(ISKANDER_SWARMMASTER_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = ISKANDER_SWARMMASTER_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("One pilot is strong. A thousand minds are stronger.");
    expect(lines).toContain("Hive online.");
    expect(lines).toContain("Adapt. Learn. Overcome.");
    expect(lines).toContain("Synchronise the network.");
    expect(lines).toContain("Efficiency saved lives today.");
  });

  it("holds exactly the three spec'd relationships (Ryker, Kane, Sol) — no relationship to Voss, Cael, or Drake is invented", () => {
    const targets = ISKANDER_SWARMMASTER_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["ryker-engineer", "kane-vanguard", "sol-resonant"]);
    for (const absent of ["voss-pathfinder", "cael-weaver", "drake-hunter"]) expect(targets).not.toContain(absent);
  });

  it("adds a ninth real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(ISKANDER_SWARMMASTER_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-ryker-engineer", "codex-commander-kane-vanguard", "codex-commander-sol-resonant"]);
    expect(ISKANDER_SWARMMASTER_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: ISKANDER_SWARMMASTER_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of ISKANDER_SWARMMASTER_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of ISKANDER_SWARMMASTER_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of ISKANDER_SWARMMASTER_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of ISKANDER_SWARMMASTER_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of ISKANDER_SWARMMASTER_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of ISKANDER_SWARMMASTER_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

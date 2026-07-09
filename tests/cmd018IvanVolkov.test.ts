import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_STARLANCER } from "../src/game/commanders/cmd017LucienOrion";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_TITAN,
  FULL_RECRUITMENT_WITH_TITAN,
  FULL_ROSTER_WITH_TITAN,
  VOLKOV_TITAN_CODEX_ENTRY,
  VOLKOV_TITAN_COMMANDER,
  VOLKOV_TITAN_EXPANDED_PROFILE,
  VOLKOV_TITAN_ID,
  VOLKOV_TITAN_PROFILE,
  VOLKOV_TITAN_RECRUITMENT,
  VOLKOV_TITAN_RECRUITMENT_SOURCE_IS_REAL,
  titanArchitectureComplete,
  titanOverlapReport,
} from "../src/game/commanders/cmd018IvanVolkov";
import { KANE_VANGUARD_COMMANDER } from "../src/game/commanders/cmd002AdrianKane";
import { REYES_WARDEN_COMMANDER, REYES_WARDEN_PROFILE } from "../src/game/commanders/cmd016AstridReyes";

describe("Commander CMD-018 — Ivan Volkov 'The Titan' (AF-116)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(VOLKOV_TITAN_COMMANDER.name).toBe("Ivan Volkov");
    expect(VOLKOV_TITAN_COMMANDER.callsign).toBe("Titan");
    expect(VOLKOV_TITAN_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(VOLKOV_TITAN_EXPANDED_PROFILE.age).toBe(49);
    expect(VOLKOV_TITAN_EXPANDED_PROFILE.homeworld).toBe("Forge Bastion Sigma");
    expect(VOLKOV_TITAN_EXPANDED_PROFILE.personality).toBe("compassionate");
  });

  it("is added additively — the real 39-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_STARLANCER.length).toBe(39);
    expect(FULL_ROSTER_WITH_TITAN.length).toBe(40);
    expect(FULL_PROFILES_WITH_TITAN.length).toBe(40);
    expect(FULL_RECRUITMENT_WITH_TITAN.length).toBe(40);
    for (const original of FULL_ROSTER_WITH_STARLANCER) expect(FULL_ROSTER_WITH_TITAN).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(titanOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(titanArchitectureComplete()).toBe(true);
  });

  it("deliberately differs from BOTH Adrian Kane's and Astrid Reyes's archetype/class/passive, per the spec's own overlap-reduction directive", () => {
    expect(VOLKOV_TITAN_COMMANDER.archetype).not.toBe(KANE_VANGUARD_COMMANDER.archetype);
    expect(VOLKOV_TITAN_COMMANDER.archetype).not.toBe(REYES_WARDEN_COMMANDER.archetype);
    expect(VOLKOV_TITAN_PROFILE.class).not.toBe("defender");
    expect(VOLKOV_TITAN_PROFILE.class).not.toBe(REYES_WARDEN_PROFILE.class);
    expect(VOLKOV_TITAN_COMMANDER.passive).not.toEqual(KANE_VANGUARD_COMMANDER.passive);
    expect(VOLKOV_TITAN_COMMANDER.passive).not.toEqual(REYES_WARDEN_COMMANDER.passive);
  });

  it("recruits via factionReputation, gated on The Iron Gate", () => {
    expect(VOLKOV_TITAN_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(VOLKOV_TITAN_RECRUITMENT.source).toBe("factionReputation");
    expect(VOLKOV_TITAN_RECRUITMENT.requirement).toContain("Iron Gate");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_TITAN, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(40);
    expect(rosterRuntime.tryRecruit(VOLKOV_TITAN_ID, new Set(["factionReputation"]))).toBe(true);
    expect(rosterRuntime.isRecruited(VOLKOV_TITAN_ID)).toBe(true);
  });

  it("carries the exact 6 dialogue lines from the spec", () => {
    const lines = VOLKOV_TITAN_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("We advance together.");
    expect(lines).toContain("Stand aside.");
    expect(lines).toContain("Even mountains can fall.");
    expect(lines).toContain("I am the wall.");
    expect(lines).toContain("The line held.");
    expect(lines).toContain("Still standing.");
  });

  it("holds exactly the three spec'd relationships (Kane, Reyes, Thorne) — no relationship to Ryker, Cael, Drake, Sol, Vale, Iskander, Vex, Ash, Korven, Syn, Solari, Kain, or Orion is invented", () => {
    const targets = VOLKOV_TITAN_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["kane-vanguard", "reyes-warden", "thorne-starforged"]);
    for (const absent of ["ryker-engineer", "cael-weaver", "drake-hunter", "sol-resonant", "vale-voidrunner", "iskander-swarmmaster", "vex-chronomancer", "ash-tempest", "korven-phantom", "syn-bioforge", "solari-photon", "kain-singularity", "orion-starlancer"]) expect(targets).not.toContain(absent);
  });

  it("adds a nineteenth real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(VOLKOV_TITAN_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-kane-vanguard", "codex-commander-reyes-warden", "codex-commander-thorne-starforged"]);
    expect(VOLKOV_TITAN_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: VOLKOV_TITAN_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of VOLKOV_TITAN_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of VOLKOV_TITAN_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of VOLKOV_TITAN_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of VOLKOV_TITAN_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of VOLKOV_TITAN_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of VOLKOV_TITAN_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

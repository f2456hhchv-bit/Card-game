import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_PHOTON } from "../src/game/commanders/cmd014RheaSolari";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_SINGULARITY,
  FULL_RECRUITMENT_WITH_SINGULARITY,
  FULL_ROSTER_WITH_SINGULARITY,
  KAIN_SINGULARITY_CODEX_ENTRY,
  KAIN_SINGULARITY_COMMANDER,
  KAIN_SINGULARITY_EXPANDED_PROFILE,
  KAIN_SINGULARITY_ID,
  KAIN_SINGULARITY_PROFILE,
  KAIN_SINGULARITY_RECRUITMENT,
  KAIN_SINGULARITY_RECRUITMENT_SOURCE_IS_REAL,
  singularityArchitectureComplete,
  singularityOverlapReport,
} from "../src/game/commanders/cmd015ZephyrKain";

describe("Commander CMD-015 — Zephyr Kain 'The Singularity' (AF-113)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(KAIN_SINGULARITY_COMMANDER.name).toBe("Zephyr Kain");
    expect(KAIN_SINGULARITY_COMMANDER.callsign).toBe("Singularity");
    expect(KAIN_SINGULARITY_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(KAIN_SINGULARITY_EXPANDED_PROFILE.age).toBe(42);
    expect(KAIN_SINGULARITY_EXPANDED_PROFILE.homeworld).toBe("Event Horizon Laboratory");
    expect(KAIN_SINGULARITY_EXPANDED_PROFILE.personality).toBe("fearless");
  });

  it("is added additively — the real 36-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_PHOTON.length).toBe(36);
    expect(FULL_ROSTER_WITH_SINGULARITY.length).toBe(37);
    expect(FULL_PROFILES_WITH_SINGULARITY.length).toBe(37);
    expect(FULL_RECRUITMENT_WITH_SINGULARITY.length).toBe(37);
    for (const original of FULL_ROSTER_WITH_PHOTON) expect(FULL_ROSTER_WITH_SINGULARITY).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(singularityOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(singularityArchitectureComplete()).toBe(true);
  });

  it("recruits via hiddenDiscoveries, gated on The Falling Sky", () => {
    expect(KAIN_SINGULARITY_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(KAIN_SINGULARITY_RECRUITMENT.source).toBe("hiddenDiscoveries");
    expect(KAIN_SINGULARITY_RECRUITMENT.requirement).toContain("Falling Sky");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_SINGULARITY, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(37);
    expect(rosterRuntime.tryRecruit(KAIN_SINGULARITY_ID, new Set(["hiddenDiscoveries"]))).toBe(true);
    expect(rosterRuntime.isRecruited(KAIN_SINGULARITY_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = KAIN_SINGULARITY_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Everything falls eventually.");
    expect(lines).toContain("The universe is bending... beautifully.");
    expect(lines).toContain("Even giants obey gravity.");
    expect(lines).toContain("Collapse into possibility.");
    expect(lines).toContain("The stars remain in balance.");
  });

  it("holds exactly the three spec'd relationships (Cael, Vex, Voss) — no relationship to Kane, Ryker, Drake, Sol, Vale, Iskander, Thorne, Ash, Korven, or Syn is invented", () => {
    const targets = KAIN_SINGULARITY_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["cael-weaver", "vex-chronomancer", "voss-pathfinder"]);
    for (const absent of ["kane-vanguard", "ryker-engineer", "drake-hunter", "sol-resonant", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged", "ash-tempest", "korven-phantom", "syn-bioforge"]) expect(targets).not.toContain(absent);
  });

  it("adds a sixteenth real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(KAIN_SINGULARITY_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-cael-weaver", "codex-commander-vex-chronomancer", "codex-commander-voss-pathfinder"]);
    expect(KAIN_SINGULARITY_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: KAIN_SINGULARITY_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of KAIN_SINGULARITY_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of KAIN_SINGULARITY_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of KAIN_SINGULARITY_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of KAIN_SINGULARITY_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of KAIN_SINGULARITY_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of KAIN_SINGULARITY_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

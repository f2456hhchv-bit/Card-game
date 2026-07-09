import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_TEMPEST } from "../src/game/commanders/cmd011ValenAsh";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_PHANTOM,
  FULL_RECRUITMENT_WITH_PHANTOM,
  FULL_ROSTER_WITH_PHANTOM,
  KORVEN_PHANTOM_CODEX_ENTRY,
  KORVEN_PHANTOM_COMMANDER,
  KORVEN_PHANTOM_EXPANDED_PROFILE,
  KORVEN_PHANTOM_ID,
  KORVEN_PHANTOM_PROFILE,
  KORVEN_PHANTOM_RECRUITMENT,
  KORVEN_PHANTOM_RECRUITMENT_SOURCE_IS_REAL,
  phantomArchitectureComplete,
  phantomOverlapReport,
} from "../src/game/commanders/cmd012NyxKorven";

describe("Commander CMD-012 — Nyx Korven 'The Phantom' (AF-110)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(KORVEN_PHANTOM_COMMANDER.name).toBe("Nyx Korven");
    expect(KORVEN_PHANTOM_COMMANDER.callsign).toBe("Phantom");
    expect(KORVEN_PHANTOM_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(KORVEN_PHANTOM_EXPANDED_PROFILE.age).toBe(33);
    expect(KORVEN_PHANTOM_EXPANDED_PROFILE.homeworld).toBe("Eclipse Station");
    expect(KORVEN_PHANTOM_EXPANDED_PROFILE.personality).toBe("compassionate");
  });

  it("is added additively — the real 33-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_TEMPEST.length).toBe(33);
    expect(FULL_ROSTER_WITH_PHANTOM.length).toBe(34);
    expect(FULL_PROFILES_WITH_PHANTOM.length).toBe(34);
    expect(FULL_RECRUITMENT_WITH_PHANTOM.length).toBe(34);
    for (const original of FULL_ROSTER_WITH_TEMPEST) expect(FULL_ROSTER_WITH_PHANTOM).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(phantomOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(phantomArchitectureComplete()).toBe(true);
  });

  it("recruits via story, gated on The Invisible War", () => {
    expect(KORVEN_PHANTOM_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(KORVEN_PHANTOM_RECRUITMENT.source).toBe("story");
    expect(KORVEN_PHANTOM_RECRUITMENT.requirement).toContain("Invisible War");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_PHANTOM, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(34);
    expect(rosterRuntime.tryRecruit(KORVEN_PHANTOM_ID, new Set(["story"]))).toBe(true);
    expect(rosterRuntime.isRecruited(KORVEN_PHANTOM_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = KORVEN_PHANTOM_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("If they know we're here, we've already failed.");
    expect(lines).toContain("They never saw tomorrow.");
    expect(lines).toContain("Every fortress has a weakness.");
    expect(lines).toContain("Silence the network.");
    expect(lines).toContain("Clean. Efficient. Forgotten.");
  });

  it("holds exactly the three spec'd relationships (Drake, Voss, Kane) — no relationship to Ryker, Cael, Sol, Vale, Iskander, Thorne, Vex, or Ash is invented", () => {
    const targets = KORVEN_PHANTOM_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["drake-hunter", "voss-pathfinder", "kane-vanguard"]);
    for (const absent of ["ryker-engineer", "cael-weaver", "sol-resonant", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged", "vex-chronomancer", "ash-tempest"]) expect(targets).not.toContain(absent);
  });

  it("adds a thirteenth real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(KORVEN_PHANTOM_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-drake-hunter", "codex-commander-voss-pathfinder", "codex-commander-kane-vanguard"]);
    expect(KORVEN_PHANTOM_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: KORVEN_PHANTOM_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of KORVEN_PHANTOM_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of KORVEN_PHANTOM_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of KORVEN_PHANTOM_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of KORVEN_PHANTOM_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of KORVEN_PHANTOM_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of KORVEN_PHANTOM_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

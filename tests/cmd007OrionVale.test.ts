import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_RESONANT } from "../src/game/commanders/cmd006AriaSol";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_VOIDRUNNER,
  FULL_RECRUITMENT_WITH_VOIDRUNNER,
  FULL_ROSTER_WITH_VOIDRUNNER,
  VALE_VOIDRUNNER_CODEX_ENTRY,
  VALE_VOIDRUNNER_COMMANDER,
  VALE_VOIDRUNNER_EXPANDED_PROFILE,
  VALE_VOIDRUNNER_ID,
  VALE_VOIDRUNNER_PROFILE,
  VALE_VOIDRUNNER_RECRUITMENT,
  VALE_VOIDRUNNER_RECRUITMENT_SOURCE_IS_REAL,
  voidrunnerArchitectureComplete,
  voidrunnerOverlapReport,
} from "../src/game/commanders/cmd007OrionVale";

describe("Commander CMD-007 — Orion Vale 'The Voidrunner' (AF-105)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(VALE_VOIDRUNNER_COMMANDER.name).toBe("Orion Vale");
    expect(VALE_VOIDRUNNER_COMMANDER.callsign).toBe("Voidrunner");
    expect(VALE_VOIDRUNNER_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(VALE_VOIDRUNNER_EXPANDED_PROFILE.age).toBe(36);
    expect(VALE_VOIDRUNNER_EXPANDED_PROFILE.homeworld).toBe("Null Reach");
    expect(VALE_VOIDRUNNER_EXPANDED_PROFILE.personality).toBe("fearless");
  });

  it("is added additively — the real 28-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_RESONANT.length).toBe(28);
    expect(FULL_ROSTER_WITH_VOIDRUNNER.length).toBe(29);
    expect(FULL_PROFILES_WITH_VOIDRUNNER.length).toBe(29);
    expect(FULL_RECRUITMENT_WITH_VOIDRUNNER.length).toBe(29);
    for (const original of FULL_ROSTER_WITH_RESONANT) expect(FULL_ROSTER_WITH_VOIDRUNNER).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(voidrunnerOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(voidrunnerArchitectureComplete()).toBe(true);
  });

  it("recruits via legendaryMissions, gated on The Black Crossing", () => {
    expect(VALE_VOIDRUNNER_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(VALE_VOIDRUNNER_RECRUITMENT.source).toBe("legendaryMissions");
    expect(VALE_VOIDRUNNER_RECRUITMENT.requirement).toContain("Black Crossing");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_VOIDRUNNER, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(29);
    expect(rosterRuntime.tryRecruit(VALE_VOIDRUNNER_ID, new Set(["legendaryMissions"]))).toBe(true);
    expect(rosterRuntime.isRecruited(VALE_VOIDRUNNER_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = VALE_VOIDRUNNER_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("The darkness isn't empty. Listen carefully.");
    expect(lines).toContain("Reality is thinner here.");
    expect(lines).toContain("Even monsters fear the abyss.");
    expect(lines).toContain("Beyond fear lies understanding.");
    expect(lines).toContain("We came back. That's enough.");
  });

  it("holds exactly the three spec'd relationships (Cael, Voss, Kane) — no relationship to Ryker, Drake, or Sol is invented", () => {
    const targets = VALE_VOIDRUNNER_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["cael-weaver", "voss-pathfinder", "kane-vanguard"]);
    for (const absent of ["ryker-engineer", "drake-hunter", "sol-resonant"]) expect(targets).not.toContain(absent);
  });

  it("adds an eighth real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(VALE_VOIDRUNNER_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-cael-weaver", "codex-commander-voss-pathfinder", "codex-commander-kane-vanguard"]);
    expect(VALE_VOIDRUNNER_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: VALE_VOIDRUNNER_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of VALE_VOIDRUNNER_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of VALE_VOIDRUNNER_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of VALE_VOIDRUNNER_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of VALE_VOIDRUNNER_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of VALE_VOIDRUNNER_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of VALE_VOIDRUNNER_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

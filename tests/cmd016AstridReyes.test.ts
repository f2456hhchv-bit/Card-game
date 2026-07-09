import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_SINGULARITY } from "../src/game/commanders/cmd015ZephyrKain";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_WARDEN,
  FULL_RECRUITMENT_WITH_WARDEN,
  FULL_ROSTER_WITH_WARDEN,
  REYES_WARDEN_CODEX_ENTRY,
  REYES_WARDEN_COMMANDER,
  REYES_WARDEN_EXPANDED_PROFILE,
  REYES_WARDEN_ID,
  REYES_WARDEN_PROFILE,
  REYES_WARDEN_RECRUITMENT,
  REYES_WARDEN_RECRUITMENT_SOURCE_IS_REAL,
  wardenArchitectureComplete,
  wardenOverlapReport,
} from "../src/game/commanders/cmd016AstridReyes";
import { KANE_VANGUARD_COMMANDER } from "../src/game/commanders/cmd002AdrianKane";

describe("Commander CMD-016 — Astrid Reyes 'The Warden' (AF-114)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(REYES_WARDEN_COMMANDER.name).toBe("Astrid Reyes");
    expect(REYES_WARDEN_COMMANDER.callsign).toBe("Warden");
    expect(REYES_WARDEN_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(REYES_WARDEN_EXPANDED_PROFILE.age).toBe(45);
    expect(REYES_WARDEN_EXPANDED_PROFILE.homeworld).toBe("Sanctuary Bastion");
    expect(REYES_WARDEN_EXPANDED_PROFILE.personality).toBe("compassionate");
  });

  it("is added additively — the real 37-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_SINGULARITY.length).toBe(37);
    expect(FULL_ROSTER_WITH_WARDEN.length).toBe(38);
    expect(FULL_PROFILES_WITH_WARDEN.length).toBe(38);
    expect(FULL_RECRUITMENT_WITH_WARDEN.length).toBe(38);
    for (const original of FULL_ROSTER_WITH_SINGULARITY) expect(FULL_ROSTER_WITH_WARDEN).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(wardenOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(wardenArchitectureComplete()).toBe(true);
  });

  it("deliberately differs from Adrian Kane's archetype/class and passive trigger+bonus pair, per the spec's own overlap-reduction directive", () => {
    expect(REYES_WARDEN_COMMANDER.archetype).not.toBe(KANE_VANGUARD_COMMANDER.archetype);
    expect(REYES_WARDEN_PROFILE.class).not.toBe("defender");
    expect(REYES_WARDEN_COMMANDER.passive).not.toEqual(KANE_VANGUARD_COMMANDER.passive);
  });

  it("recruits via legendaryMissions, gated on The Final Evacuation", () => {
    expect(REYES_WARDEN_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(REYES_WARDEN_RECRUITMENT.source).toBe("legendaryMissions");
    expect(REYES_WARDEN_RECRUITMENT.requirement).toContain("Final Evacuation");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_WARDEN, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(38);
    expect(rosterRuntime.tryRecruit(REYES_WARDEN_ID, new Set(["legendaryMissions"]))).toBe(true);
    expect(rosterRuntime.isRecruited(REYES_WARDEN_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = REYES_WARDEN_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("No one gets left behind.");
    expect(lines).toContain("You're safe now.");
    expect(lines).toContain("If you want them, you'll go through me.");
    expect(lines).toContain("This is humanity's sanctuary.");
    expect(lines).toContain("We saved them. That's enough.");
  });

  it("holds exactly the three spec'd relationships (Kane, Syn, Iskander) — no relationship to Ryker, Cael, Drake, Sol, Vale, Thorne, Vex, Ash, Korven, Solari, or Kain is invented", () => {
    const targets = REYES_WARDEN_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["kane-vanguard", "syn-bioforge", "iskander-swarmmaster"]);
    for (const absent of ["ryker-engineer", "cael-weaver", "drake-hunter", "sol-resonant", "vale-voidrunner", "thorne-starforged", "vex-chronomancer", "ash-tempest", "korven-phantom", "solari-photon", "kain-singularity"]) expect(targets).not.toContain(absent);
  });

  it("adds a seventeenth real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(REYES_WARDEN_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-kane-vanguard", "codex-commander-syn-bioforge", "codex-commander-iskander-swarmmaster"]);
    expect(REYES_WARDEN_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: REYES_WARDEN_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of REYES_WARDEN_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of REYES_WARDEN_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of REYES_WARDEN_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of REYES_WARDEN_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of REYES_WARDEN_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of REYES_WARDEN_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

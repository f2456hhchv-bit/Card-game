import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_BIOFORGE } from "../src/game/commanders/cmd013MiraSyn";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_PHOTON,
  FULL_RECRUITMENT_WITH_PHOTON,
  FULL_ROSTER_WITH_PHOTON,
  SOLARI_PHOTON_CODEX_ENTRY,
  SOLARI_PHOTON_COMMANDER,
  SOLARI_PHOTON_EXPANDED_PROFILE,
  SOLARI_PHOTON_ID,
  SOLARI_PHOTON_PROFILE,
  SOLARI_PHOTON_RECRUITMENT,
  SOLARI_PHOTON_RECRUITMENT_SOURCE_IS_REAL,
  photonArchitectureComplete,
  photonOverlapReport,
} from "../src/game/commanders/cmd014RheaSolari";

describe("Commander CMD-014 — Rhea Solari 'The Photon' (AF-112)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(SOLARI_PHOTON_COMMANDER.name).toBe("Rhea Solari");
    expect(SOLARI_PHOTON_COMMANDER.callsign).toBe("Photon");
    expect(SOLARI_PHOTON_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(SOLARI_PHOTON_EXPANDED_PROFILE.age).toBe(31);
    expect(SOLARI_PHOTON_EXPANDED_PROFILE.homeworld).toBe("Helios Array");
    expect(SOLARI_PHOTON_EXPANDED_PROFILE.personality).toBe("optimistic");
  });

  it("is added additively — the real 35-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_BIOFORGE.length).toBe(35);
    expect(FULL_ROSTER_WITH_PHOTON.length).toBe(36);
    expect(FULL_PROFILES_WITH_PHOTON.length).toBe(36);
    expect(FULL_RECRUITMENT_WITH_PHOTON.length).toBe(36);
    for (const original of FULL_ROSTER_WITH_BIOFORGE) expect(FULL_ROSTER_WITH_PHOTON).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(photonOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(photonArchitectureComplete()).toBe(true);
  });

  it("recruits via campaign, gated on The Dying Sun", () => {
    expect(SOLARI_PHOTON_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(SOLARI_PHOTON_RECRUITMENT.source).toBe("campaign");
    expect(SOLARI_PHOTON_RECRUITMENT.requirement).toContain("Dying Sun");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_PHOTON, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(36);
    expect(rosterRuntime.tryRecruit(SOLARI_PHOTON_ID, new Set(["campaign"]))).toBe(true);
    expect(rosterRuntime.isRecruited(SOLARI_PHOTON_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = SOLARI_PHOTON_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Let's give this galaxy another sunrise.");
    expect(lines).toContain("It's beautiful... it's still working.");
    expect(lines).toContain("Even stars outlive tyrants.");
    expect(lines).toContain("Rise with the dawn!");
    expect(lines).toContain("Hope travels at the speed of light.");
  });

  it("holds exactly the three spec'd relationships (Ash, Sol, Voss) — no relationship to Kane, Ryker, Cael, Drake, Vale, Iskander, Thorne, Vex, Korven, or Syn is invented", () => {
    const targets = SOLARI_PHOTON_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["ash-tempest", "sol-resonant", "voss-pathfinder"]);
    for (const absent of ["kane-vanguard", "ryker-engineer", "cael-weaver", "drake-hunter", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged", "vex-chronomancer", "korven-phantom", "syn-bioforge"]) expect(targets).not.toContain(absent);
  });

  it("adds a fifteenth real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(SOLARI_PHOTON_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-ash-tempest", "codex-commander-sol-resonant", "codex-commander-voss-pathfinder"]);
    expect(SOLARI_PHOTON_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: SOLARI_PHOTON_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of SOLARI_PHOTON_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of SOLARI_PHOTON_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of SOLARI_PHOTON_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of SOLARI_PHOTON_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of SOLARI_PHOTON_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of SOLARI_PHOTON_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

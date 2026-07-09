import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_WARDEN } from "../src/game/commanders/cmd016AstridReyes";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_STARLANCER,
  FULL_RECRUITMENT_WITH_STARLANCER,
  FULL_ROSTER_WITH_STARLANCER,
  ORION_STARLANCER_CODEX_ENTRY,
  ORION_STARLANCER_COMMANDER,
  ORION_STARLANCER_EXPANDED_PROFILE,
  ORION_STARLANCER_ID,
  ORION_STARLANCER_PROFILE,
  ORION_STARLANCER_RECRUITMENT,
  ORION_STARLANCER_RECRUITMENT_SOURCE_IS_REAL,
  starlancerArchitectureComplete,
  starlancerOverlapReport,
} from "../src/game/commanders/cmd017LucienOrion";

describe("Commander CMD-017 — Lucien Orion 'The Starlancer' (AF-115)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(ORION_STARLANCER_COMMANDER.name).toBe("Lucien Orion");
    expect(ORION_STARLANCER_COMMANDER.callsign).toBe("Starlancer");
    expect(ORION_STARLANCER_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(ORION_STARLANCER_EXPANDED_PROFILE.age).toBe(35);
    expect(ORION_STARLANCER_EXPANDED_PROFILE.homeworld).toBe("Nova Reach");
    expect(ORION_STARLANCER_EXPANDED_PROFILE.personality).toBe("fearless");
  });

  it("is added additively — the real 38-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_WARDEN.length).toBe(38);
    expect(FULL_ROSTER_WITH_STARLANCER.length).toBe(39);
    expect(FULL_PROFILES_WITH_STARLANCER.length).toBe(39);
    expect(FULL_RECRUITMENT_WITH_STARLANCER.length).toBe(39);
    for (const original of FULL_ROSTER_WITH_WARDEN) expect(FULL_ROSTER_WITH_STARLANCER).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(starlancerOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(starlancerArchitectureComplete()).toBe(true);
  });

  it("recruits via exploration, gated on The Redline", () => {
    expect(ORION_STARLANCER_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(ORION_STARLANCER_RECRUITMENT.source).toBe("exploration");
    expect(ORION_STARLANCER_RECRUITMENT.requirement).toContain("Redline");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_STARLANCER, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(39);
    expect(rosterRuntime.tryRecruit(ORION_STARLANCER_ID, new Set(["exploration"]))).toBe(true);
    expect(rosterRuntime.isRecruited(ORION_STARLANCER_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = ORION_STARLANCER_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Keep moving. Always.");
    expect(lines).toContain("Let's see if you can keep up.");
    expect(lines).toContain("Burn brighter.");
    expect(lines).toContain("Fast enough.");
    expect(lines).toContain("Still flying.");
  });

  it("holds exactly the FOUR spec'd relationships (Ash, Drake, Kane, Voss) — the roster's first commander with four instead of three, including the first Professional Rival relationship — no relationship to Ryker, Cael, Sol, Vale, Iskander, Thorne, Vex, Korven, Syn, Solari, Kain, or Reyes is invented", () => {
    const targets = ORION_STARLANCER_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["ash-tempest", "drake-hunter", "kane-vanguard", "voss-pathfinder"]);
    for (const absent of ["ryker-engineer", "cael-weaver", "sol-resonant", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged", "vex-chronomancer", "korven-phantom", "syn-bioforge", "solari-photon", "kain-singularity", "reyes-warden"]) expect(targets).not.toContain(absent);
  });

  it("adds an eighteenth real Codex commander entry, cross-referencing exactly the four related commanders' entries", () => {
    expect(ORION_STARLANCER_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-ash-tempest", "codex-commander-drake-hunter", "codex-commander-kane-vanguard", "codex-commander-voss-pathfinder"]);
    expect(ORION_STARLANCER_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: ORION_STARLANCER_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of ORION_STARLANCER_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of ORION_STARLANCER_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of ORION_STARLANCER_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of ORION_STARLANCER_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of ORION_STARLANCER_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of ORION_STARLANCER_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

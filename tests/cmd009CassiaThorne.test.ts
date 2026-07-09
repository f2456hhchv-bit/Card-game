import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_SWARMMASTER } from "../src/game/commanders/cmd008NovaIskander";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_STARFORGED,
  FULL_RECRUITMENT_WITH_STARFORGED,
  FULL_ROSTER_WITH_STARFORGED,
  THORNE_STARFORGED_CODEX_ENTRY,
  THORNE_STARFORGED_COMMANDER,
  THORNE_STARFORGED_EXPANDED_PROFILE,
  THORNE_STARFORGED_ID,
  THORNE_STARFORGED_PROFILE,
  THORNE_STARFORGED_RECRUITMENT,
  THORNE_STARFORGED_RECRUITMENT_SOURCE_IS_REAL,
  starforgedArchitectureComplete,
  starforgedOverlapReport,
} from "../src/game/commanders/cmd009CassiaThorne";

describe("Commander CMD-009 — Cassia Thorne 'The Starforged' (AF-107)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(THORNE_STARFORGED_COMMANDER.name).toBe("Cassia Thorne");
    expect(THORNE_STARFORGED_COMMANDER.callsign).toBe("Starforged");
    expect(THORNE_STARFORGED_COMMANDER.faction).toBe("Atlas Dynamics");
    expect(THORNE_STARFORGED_EXPANDED_PROFILE.age).toBe(43);
    expect(THORNE_STARFORGED_EXPANDED_PROFILE.homeworld).toBe("Forge World Helios IX");
  });

  it("is added additively — the real 30-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_SWARMMASTER.length).toBe(30);
    expect(FULL_ROSTER_WITH_STARFORGED.length).toBe(31);
    expect(FULL_PROFILES_WITH_STARFORGED.length).toBe(31);
    expect(FULL_RECRUITMENT_WITH_STARFORGED.length).toBe(31);
    for (const original of FULL_ROSTER_WITH_SWARMMASTER) expect(FULL_ROSTER_WITH_STARFORGED).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(starforgedOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(starforgedArchitectureComplete()).toBe(true);
  });

  it("recruits via exploration, gated on The Burning Foundry", () => {
    expect(THORNE_STARFORGED_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(THORNE_STARFORGED_RECRUITMENT.source).toBe("exploration");
    expect(THORNE_STARFORGED_RECRUITMENT.requirement).toContain("Burning Foundry");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_STARFORGED, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(31);
    expect(rosterRuntime.tryRecruit(THORNE_STARFORGED_ID, new Set(["exploration"]))).toBe(true);
    expect(rosterRuntime.isRecruited(THORNE_STARFORGED_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = THORNE_STARFORGED_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Nothing great is built without pressure.");
    expect(lines).toContain("Push it further.");
    expect(lines).toContain("Every titan eventually breaks.");
    expect(lines).toContain("Become the forge.");
    expect(lines).toContain("Another masterpiece.");
  });

  it("holds exactly the three spec'd relationships (Ryker, Iskander, Kane) — no relationship to Voss, Kane's earlier peers, Cael, Drake, or Sol is invented", () => {
    const targets = THORNE_STARFORGED_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["ryker-engineer", "iskander-swarmmaster", "kane-vanguard"]);
    for (const absent of ["voss-pathfinder", "cael-weaver", "drake-hunter", "sol-resonant", "vale-voidrunner"]) expect(targets).not.toContain(absent);
  });

  it("adds a tenth real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(THORNE_STARFORGED_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-ryker-engineer", "codex-commander-iskander-swarmmaster", "codex-commander-kane-vanguard"]);
    expect(THORNE_STARFORGED_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: THORNE_STARFORGED_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of THORNE_STARFORGED_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of THORNE_STARFORGED_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of THORNE_STARFORGED_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of THORNE_STARFORGED_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of THORNE_STARFORGED_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of THORNE_STARFORGED_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

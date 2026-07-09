import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_ORACLE } from "../src/game/commanders/cmd019SeleneMyrr";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_ARCHITECT,
  FULL_RECRUITMENT_WITH_ARCHITECT,
  FULL_ROSTER_WITH_ARCHITECT,
  NOVA_ARCHITECT_CODEX_ENTRY,
  NOVA_ARCHITECT_COMMANDER,
  NOVA_ARCHITECT_EXPANDED_PROFILE,
  NOVA_ARCHITECT_ID,
  NOVA_ARCHITECT_PROFILE,
  NOVA_ARCHITECT_RECRUITMENT,
  NOVA_ARCHITECT_RECRUITMENT_SOURCE_IS_REAL,
  architectArchitectureComplete,
  architectOverlapReport,
} from "../src/game/commanders/cmd020CaelusNova";
import { RYKER_ENGINEER_COMMANDER } from "../src/game/commanders/cmd003EliasRyker";
import { ISKANDER_SWARMMASTER_COMMANDER, ISKANDER_SWARMMASTER_PROFILE } from "../src/game/commanders/cmd008NovaIskander";

describe("Commander CMD-020 — Caelus Nova 'The Architect' (AF-118)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(NOVA_ARCHITECT_COMMANDER.name).toBe("Caelus Nova");
    expect(NOVA_ARCHITECT_COMMANDER.callsign).toBe("Architect");
    expect(NOVA_ARCHITECT_COMMANDER.faction).toBe("Atlas Dynamics");
    expect(NOVA_ARCHITECT_EXPANDED_PROFILE.age).toBe(46);
    expect(NOVA_ARCHITECT_EXPANDED_PROFILE.homeworld).toBe("Atlas Prime");
    expect(NOVA_ARCHITECT_EXPANDED_PROFILE.personality).toBe("visionary");
  });

  it("is added additively — the real 41-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_ORACLE.length).toBe(41);
    expect(FULL_ROSTER_WITH_ARCHITECT.length).toBe(42);
    expect(FULL_PROFILES_WITH_ARCHITECT.length).toBe(42);
    expect(FULL_RECRUITMENT_WITH_ARCHITECT.length).toBe(42);
    for (const original of FULL_ROSTER_WITH_ORACLE) expect(FULL_ROSTER_WITH_ARCHITECT).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(architectOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(architectArchitectureComplete()).toBe(true);
  });

  it("deliberately differs from BOTH Elias Ryker's and Nova Iskander's archetype/class/passive, per the spec's own overlap-reduction directive", () => {
    expect(NOVA_ARCHITECT_COMMANDER.archetype).not.toBe(RYKER_ENGINEER_COMMANDER.archetype);
    expect(NOVA_ARCHITECT_COMMANDER.archetype).not.toBe(ISKANDER_SWARMMASTER_COMMANDER.archetype);
    expect(NOVA_ARCHITECT_PROFILE.class).not.toBe("engineer");
    expect(NOVA_ARCHITECT_PROFILE.class).not.toBe(ISKANDER_SWARMMASTER_PROFILE.class);
    expect(NOVA_ARCHITECT_COMMANDER.passive).not.toEqual(RYKER_ENGINEER_COMMANDER.passive);
    expect(NOVA_ARCHITECT_COMMANDER.passive).not.toEqual(ISKANDER_SWARMMASTER_COMMANDER.passive);
  });

  it("recruits via campaign, gated on The First Foundation", () => {
    expect(NOVA_ARCHITECT_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(NOVA_ARCHITECT_RECRUITMENT.source).toBe("campaign");
    expect(NOVA_ARCHITECT_RECRUITMENT.requirement).toContain("First Foundation");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_ARCHITECT, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(42);
    expect(rosterRuntime.tryRecruit(NOVA_ARCHITECT_ID, new Set(["campaign"]))).toBe(true);
    expect(rosterRuntime.isRecruited(NOVA_ARCHITECT_ID)).toBe(true);
  });

  it("carries the exact 6 dialogue lines from the spec", () => {
    const lines = NOVA_ARCHITECT_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("We're not just surviving. We're rebuilding.");
    expect(lines).toContain("One more piece of tomorrow.");
    expect(lines).toContain("You destroy. We create.");
    expect(lines).toContain("Lay the foundations.");
    expect(lines).toContain("This is how civilisation returns.");
    expect(lines).toContain("The blueprint... isn't finished.");
  });

  it("holds exactly the FOUR spec'd relationships (Ryker, Thorne, Iskander, Voss) — the roster's second commander with four instead of three, including the first 'Inspired By' relationship — no relationship to Kane, Cael, Drake, Sol, Vale, Vex, Ash, Korven, Syn, Solari, Kain, Reyes, Orion, Volkov, or Myrr is invented", () => {
    const targets = NOVA_ARCHITECT_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["ryker-engineer", "thorne-starforged", "iskander-swarmmaster", "voss-pathfinder"]);
    for (const absent of ["kane-vanguard", "cael-weaver", "drake-hunter", "sol-resonant", "vale-voidrunner", "vex-chronomancer", "ash-tempest", "korven-phantom", "syn-bioforge", "solari-photon", "kain-singularity", "reyes-warden", "orion-starlancer", "volkov-titan", "myrr-oracle"]) expect(targets).not.toContain(absent);
  });

  it("adds a twenty-first real Codex commander entry, cross-referencing exactly the four related commanders' entries", () => {
    expect(NOVA_ARCHITECT_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-ryker-engineer", "codex-commander-thorne-starforged", "codex-commander-iskander-swarmmaster", "codex-commander-voss-pathfinder"]);
    expect(NOVA_ARCHITECT_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: NOVA_ARCHITECT_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of NOVA_ARCHITECT_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of NOVA_ARCHITECT_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of NOVA_ARCHITECT_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of NOVA_ARCHITECT_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of NOVA_ARCHITECT_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of NOVA_ARCHITECT_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

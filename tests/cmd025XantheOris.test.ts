import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_DIPLOMAT } from "../src/game/commanders/cmd024KieranSolace";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_NANOFORGE,
  FULL_RECRUITMENT_WITH_NANOFORGE,
  FULL_ROSTER_WITH_NANOFORGE,
  ORIS_NANOFORGE_CODEX_ENTRY,
  ORIS_NANOFORGE_COMMANDER,
  ORIS_NANOFORGE_EXPANDED_PROFILE,
  ORIS_NANOFORGE_ID,
  ORIS_NANOFORGE_PROFILE,
  ORIS_NANOFORGE_RECRUITMENT,
  ORIS_NANOFORGE_RECRUITMENT_SOURCE_IS_REAL,
  nanoforgeArchitectureComplete,
  nanoforgeOverlapReport,
} from "../src/game/commanders/cmd025XantheOris";
import { RYKER_ENGINEER_COMMANDER, RYKER_ENGINEER_PROFILE } from "../src/game/commanders/cmd003EliasRyker";
import { ISKANDER_SWARMMASTER_COMMANDER, ISKANDER_SWARMMASTER_PROFILE } from "../src/game/commanders/cmd008NovaIskander";
import { NOVA_ARCHITECT_COMMANDER, NOVA_ARCHITECT_PROFILE } from "../src/game/commanders/cmd020CaelusNova";

describe("Commander CMD-025 — Xanthe Oris 'The Nanoforge' (AF-123)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(ORIS_NANOFORGE_COMMANDER.name).toBe("Xanthe Oris");
    expect(ORIS_NANOFORGE_COMMANDER.callsign).toBe("Nanoforge");
    expect(ORIS_NANOFORGE_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(ORIS_NANOFORGE_EXPANDED_PROFILE.age).toBe(36);
    expect(ORIS_NANOFORGE_EXPANDED_PROFILE.homeworld).toBe("Nanite Research Nexus");
    expect(ORIS_NANOFORGE_EXPANDED_PROFILE.personality).toBe("curious");
  });

  it("is added additively — the real 46-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_DIPLOMAT.length).toBe(46);
    expect(FULL_ROSTER_WITH_NANOFORGE.length).toBe(47);
    expect(FULL_PROFILES_WITH_NANOFORGE.length).toBe(47);
    expect(FULL_RECRUITMENT_WITH_NANOFORGE.length).toBe(47);
    for (const original of FULL_ROSTER_WITH_DIPLOMAT) expect(FULL_ROSTER_WITH_NANOFORGE).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(nanoforgeOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(nanoforgeArchitectureComplete()).toBe(true);
  });

  it("deliberately differs from Elias Ryker's, Nova Iskander's, and Caelus Nova's archetype/class/passive/signature, per the spec's own triple overlap-reduction directive", () => {
    expect(ORIS_NANOFORGE_COMMANDER.archetype).not.toBe(RYKER_ENGINEER_COMMANDER.archetype);
    expect(ORIS_NANOFORGE_COMMANDER.archetype).not.toBe(ISKANDER_SWARMMASTER_COMMANDER.archetype);
    expect(ORIS_NANOFORGE_COMMANDER.archetype).not.toBe(NOVA_ARCHITECT_COMMANDER.archetype);
    expect(ORIS_NANOFORGE_PROFILE.class).not.toBe(RYKER_ENGINEER_PROFILE.class);
    expect(ORIS_NANOFORGE_PROFILE.class).not.toBe(ISKANDER_SWARMMASTER_PROFILE.class);
    expect(ORIS_NANOFORGE_PROFILE.class).not.toBe(NOVA_ARCHITECT_PROFILE.class);
    expect(ORIS_NANOFORGE_COMMANDER.passive).not.toEqual(RYKER_ENGINEER_COMMANDER.passive);
    expect(ORIS_NANOFORGE_COMMANDER.passive).not.toEqual(ISKANDER_SWARMMASTER_COMMANDER.passive);
    expect(ORIS_NANOFORGE_COMMANDER.passive).not.toEqual(NOVA_ARCHITECT_COMMANDER.passive);
    expect(ORIS_NANOFORGE_COMMANDER.signature.passive).not.toEqual(RYKER_ENGINEER_COMMANDER.signature.passive);
    expect(ORIS_NANOFORGE_COMMANDER.signature.passive).not.toEqual(ISKANDER_SWARMMASTER_COMMANDER.signature.passive);
    expect(ORIS_NANOFORGE_COMMANDER.signature.passive).not.toEqual(NOVA_ARCHITECT_COMMANDER.signature.passive);
  });

  it("recruits via hiddenDiscoveries, gated on The Grey Ocean", () => {
    expect(ORIS_NANOFORGE_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(ORIS_NANOFORGE_RECRUITMENT.source).toBe("hiddenDiscoveries");
    expect(ORIS_NANOFORGE_RECRUITMENT.requirement).toContain("Grey Ocean");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_NANOFORGE, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(47);
    expect(rosterRuntime.tryRecruit(ORIS_NANOFORGE_ID, new Set(["hiddenDiscoveries"]))).toBe(true);
    expect(rosterRuntime.isRecruited(ORIS_NANOFORGE_ID)).toBe(true);
  });

  it("carries the exact 6 dialogue lines from the spec", () => {
    const lines = ORIS_NANOFORGE_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Nothing is ever truly broken.");
    expect(lines).toContain("Adapt.");
    expect(lines).toContain("Evolution always outlasts strength.");
    expect(lines).toContain("Rebuild everything.");
    expect(lines).toContain("We leave this place better than we found it.");
    expect(lines).toContain("Reconfigure... now.");
  });

  it("holds exactly the FOUR spec'd relationships (Ryker, Thorne, Iskander, Nova) — the roster's seventh commander with four instead of three — no relationship to Cael, Drake, Sol, Vale, Vex, Ash, Korven, Syn, Solari, Kain, Reyes, Orion, Volkov, Myrr, Vega, Rhem, Ross, or Solace is invented", () => {
    const targets = ORIS_NANOFORGE_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["ryker-engineer", "thorne-starforged", "iskander-swarmmaster", "nova-architect"]);
    for (const absent of ["cael-weaver", "drake-hunter", "sol-resonant", "vale-voidrunner", "vex-chronomancer", "ash-tempest", "korven-phantom", "syn-bioforge", "solari-photon", "kain-singularity", "reyes-warden", "orion-starlancer", "volkov-titan", "myrr-oracle", "vega-echo", "rhem-catalyst", "ross-horizon", "solace-diplomat"]) expect(targets).not.toContain(absent);
  });

  it("adds a twenty-sixth real Codex commander entry, cross-referencing exactly the four related commanders' entries", () => {
    expect(ORIS_NANOFORGE_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-ryker-engineer", "codex-commander-thorne-starforged", "codex-commander-iskander-swarmmaster", "codex-commander-nova-architect"]);
    expect(ORIS_NANOFORGE_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: ORIS_NANOFORGE_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of ORIS_NANOFORGE_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of ORIS_NANOFORGE_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of ORIS_NANOFORGE_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of ORIS_NANOFORGE_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of ORIS_NANOFORGE_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of ORIS_NANOFORGE_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

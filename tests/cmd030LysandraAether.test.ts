import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_VOIDWALKER } from "../src/game/commanders/cmd029VegaNoctis";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  AETHER_CELESTIAL_CODEX_ENTRY,
  AETHER_CELESTIAL_COMMANDER,
  AETHER_CELESTIAL_EXPANDED_PROFILE,
  AETHER_CELESTIAL_ID,
  AETHER_CELESTIAL_PROFILE,
  AETHER_CELESTIAL_RECRUITMENT,
  AETHER_CELESTIAL_RECRUITMENT_SOURCE_IS_REAL,
  FULL_PROFILES_WITH_CELESTIAL,
  FULL_RECRUITMENT_WITH_CELESTIAL,
  FULL_ROSTER_WITH_CELESTIAL,
  celestialArchitectureComplete,
  celestialOverlapReport,
} from "../src/game/commanders/cmd030LysandraAether";
import { SOLARI_PHOTON_COMMANDER, SOLARI_PHOTON_PROFILE } from "../src/game/commanders/cmd014RheaSolari";
import { MYRR_ORACLE_COMMANDER, MYRR_ORACLE_PROFILE } from "../src/game/commanders/cmd019SeleneMyrr";
import { ROSS_HORIZON_COMMANDER, ROSS_HORIZON_PROFILE } from "../src/game/commanders/cmd023ElianaRoss";

describe("Commander CMD-030 — Lysandra Aether 'The Celestial' (AF-128)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(AETHER_CELESTIAL_COMMANDER.name).toBe("Lysandra Aether");
    expect(AETHER_CELESTIAL_COMMANDER.callsign).toBe("Celestial");
    expect(AETHER_CELESTIAL_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(AETHER_CELESTIAL_EXPANDED_PROFILE.age).toBe(42);
    expect(AETHER_CELESTIAL_EXPANDED_PROFILE.homeworld).toBe("Celestia Observatory");
    expect(AETHER_CELESTIAL_EXPANDED_PROFILE.personality).toBe("visionary");
  });

  it("is added additively — the real 51-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_VOIDWALKER.length).toBe(51);
    expect(FULL_ROSTER_WITH_CELESTIAL.length).toBe(52);
    expect(FULL_PROFILES_WITH_CELESTIAL.length).toBe(52);
    expect(FULL_RECRUITMENT_WITH_CELESTIAL.length).toBe(52);
    for (const original of FULL_ROSTER_WITH_VOIDWALKER) expect(FULL_ROSTER_WITH_CELESTIAL).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(celestialOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(celestialArchitectureComplete()).toBe(true);
  });

  it("deliberately differs from Rhea Solari's, Selene Myrr's, and Eliana Ross's archetype/class/passive/signature, per the spec's own triple overlap-reduction directive", () => {
    expect(AETHER_CELESTIAL_COMMANDER.archetype).not.toBe(SOLARI_PHOTON_COMMANDER.archetype);
    expect(AETHER_CELESTIAL_COMMANDER.archetype).not.toBe(MYRR_ORACLE_COMMANDER.archetype);
    expect(AETHER_CELESTIAL_COMMANDER.archetype).not.toBe(ROSS_HORIZON_COMMANDER.archetype);
    expect(AETHER_CELESTIAL_PROFILE.class).not.toBe(SOLARI_PHOTON_PROFILE.class);
    expect(AETHER_CELESTIAL_PROFILE.class).not.toBe(MYRR_ORACLE_PROFILE.class);
    expect(AETHER_CELESTIAL_PROFILE.class).not.toBe(ROSS_HORIZON_PROFILE.class);
    expect(AETHER_CELESTIAL_COMMANDER.passive).not.toEqual(SOLARI_PHOTON_COMMANDER.passive);
    expect(AETHER_CELESTIAL_COMMANDER.passive).not.toEqual(MYRR_ORACLE_COMMANDER.passive);
    expect(AETHER_CELESTIAL_COMMANDER.passive).not.toEqual(ROSS_HORIZON_COMMANDER.passive);
    expect(AETHER_CELESTIAL_COMMANDER.signature.passive).not.toEqual(SOLARI_PHOTON_COMMANDER.signature.passive);
    expect(AETHER_CELESTIAL_COMMANDER.signature.passive).not.toEqual(MYRR_ORACLE_COMMANDER.signature.passive);
    expect(AETHER_CELESTIAL_COMMANDER.signature.passive).not.toEqual(ROSS_HORIZON_COMMANDER.signature.passive);
  });

  it("recruits via legendaryMissions, gated on When Stars Remember", () => {
    expect(AETHER_CELESTIAL_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(AETHER_CELESTIAL_RECRUITMENT.source).toBe("legendaryMissions");
    expect(AETHER_CELESTIAL_RECRUITMENT.requirement).toContain("When Stars Remember");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_CELESTIAL, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(52);
    expect(rosterRuntime.tryRecruit(AETHER_CELESTIAL_ID, new Set(["legendaryMissions"]))).toBe(true);
    expect(rosterRuntime.isRecruited(AETHER_CELESTIAL_ID)).toBe(true);
  });

  it("carries the exact 6 dialogue lines from the spec", () => {
    const lines = AETHER_CELESTIAL_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("The stars have waited for us.");
    expect(lines).toContain("They never stopped shining.");
    expect(lines).toContain("You stand beneath eternity.");
    expect(lines).toContain("Become part of the cosmos.");
    expect(lines).toContain("The galaxy remembers humanity.");
    expect(lines).toContain("The stars... still guide us...");
  });

  it("holds exactly the FOUR spec'd relationships (Voss, Myrr, Vex, Ross) — the roster's twelfth commander with four instead of three — no relationship to Kane, Ryker, Cael, Drake, Sol, Vale, Iskander, Thorne, Ash, Korven, Syn, Solari, Kain, Reyes, Orion, Volkov, Nova, Vega, Rhem, Solace, Oris, Drake-Sentinel, Helix, or Fen is invented", () => {
    const targets = AETHER_CELESTIAL_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["voss-pathfinder", "myrr-oracle", "vex-chronomancer", "ross-horizon"]);
    for (const absent of ["kane-vanguard", "ryker-engineer", "cael-weaver", "drake-hunter", "sol-resonant", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged", "ash-tempest", "korven-phantom", "syn-bioforge", "solari-photon", "kain-singularity", "reyes-warden", "orion-starlancer", "volkov-titan", "nova-architect", "vega-echo", "rhem-catalyst", "solace-diplomat", "oris-nanoforge", "drake-sentinel", "helix-alchemist", "fen-beastmaster"]) expect(targets).not.toContain(absent);
  });

  it("adds a thirty-first real Codex commander entry, cross-referencing exactly the four related commanders' entries", () => {
    expect(AETHER_CELESTIAL_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-voss-pathfinder", "codex-commander-myrr-oracle", "codex-commander-vex-chronomancer", "codex-commander-ross-horizon"]);
    expect(AETHER_CELESTIAL_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: AETHER_CELESTIAL_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of AETHER_CELESTIAL_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of AETHER_CELESTIAL_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of AETHER_CELESTIAL_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of AETHER_CELESTIAL_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of AETHER_CELESTIAL_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of AETHER_CELESTIAL_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

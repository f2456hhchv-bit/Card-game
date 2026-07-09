import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_HORIZON } from "../src/game/commanders/cmd023ElianaRoss";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_DIPLOMAT,
  FULL_RECRUITMENT_WITH_DIPLOMAT,
  FULL_ROSTER_WITH_DIPLOMAT,
  SOLACE_DIPLOMAT_CODEX_ENTRY,
  SOLACE_DIPLOMAT_COMMANDER,
  SOLACE_DIPLOMAT_EXPANDED_PROFILE,
  SOLACE_DIPLOMAT_ID,
  SOLACE_DIPLOMAT_PROFILE,
  SOLACE_DIPLOMAT_RECRUITMENT,
  SOLACE_DIPLOMAT_RECRUITMENT_SOURCE_IS_REAL,
  diplomatArchitectureComplete,
  diplomatOverlapReport,
} from "../src/game/commanders/cmd024KieranSolace";
import { MYRR_ORACLE_COMMANDER, MYRR_ORACLE_PROFILE } from "../src/game/commanders/cmd019SeleneMyrr";
import { REYES_WARDEN_COMMANDER, REYES_WARDEN_PROFILE } from "../src/game/commanders/cmd016AstridReyes";

describe("Commander CMD-024 — Kieran Solace 'The Diplomat' (AF-122)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(SOLACE_DIPLOMAT_COMMANDER.name).toBe("Kieran Solace");
    expect(SOLACE_DIPLOMAT_COMMANDER.callsign).toBe("Diplomat");
    expect(SOLACE_DIPLOMAT_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(SOLACE_DIPLOMAT_EXPANDED_PROFILE.age).toBe(44);
    expect(SOLACE_DIPLOMAT_EXPANDED_PROFILE.homeworld).toBe("Unity Station");
    expect(SOLACE_DIPLOMAT_EXPANDED_PROFILE.personality).toBe("diplomatic");
  });

  it("is added additively — the real 45-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_HORIZON.length).toBe(45);
    expect(FULL_ROSTER_WITH_DIPLOMAT.length).toBe(46);
    expect(FULL_PROFILES_WITH_DIPLOMAT.length).toBe(46);
    expect(FULL_RECRUITMENT_WITH_DIPLOMAT.length).toBe(46);
    for (const original of FULL_ROSTER_WITH_HORIZON) expect(FULL_ROSTER_WITH_DIPLOMAT).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(diplomatOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(diplomatArchitectureComplete()).toBe(true);
  });

  it("is the first real use of the 'diplomatic' personality trait", () => {
    expect(SOLACE_DIPLOMAT_EXPANDED_PROFILE.personality).toBe("diplomatic");
  });

  it("deliberately differs from BOTH Selene Myrr's and Astrid Reyes's archetype/class/passive/signature, per the spec's own overlap-reduction directive", () => {
    expect(SOLACE_DIPLOMAT_COMMANDER.archetype).not.toBe(MYRR_ORACLE_COMMANDER.archetype);
    expect(SOLACE_DIPLOMAT_COMMANDER.archetype).not.toBe(REYES_WARDEN_COMMANDER.archetype);
    expect(SOLACE_DIPLOMAT_PROFILE.class).not.toBe(MYRR_ORACLE_PROFILE.class);
    expect(SOLACE_DIPLOMAT_PROFILE.class).not.toBe(REYES_WARDEN_PROFILE.class);
    expect(SOLACE_DIPLOMAT_COMMANDER.passive).not.toEqual(MYRR_ORACLE_COMMANDER.passive);
    expect(SOLACE_DIPLOMAT_COMMANDER.passive).not.toEqual(REYES_WARDEN_COMMANDER.passive);
    expect(SOLACE_DIPLOMAT_COMMANDER.signature.passive).not.toEqual(MYRR_ORACLE_COMMANDER.signature.passive);
    expect(SOLACE_DIPLOMAT_COMMANDER.signature.passive).not.toEqual(REYES_WARDEN_COMMANDER.signature.passive);
  });

  it("recruits via story, gated on The Last Embassy", () => {
    expect(SOLACE_DIPLOMAT_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(SOLACE_DIPLOMAT_RECRUITMENT.source).toBe("story");
    expect(SOLACE_DIPLOMAT_RECRUITMENT.requirement).toContain("Last Embassy");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_DIPLOMAT, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(46);
    expect(rosterRuntime.tryRecruit(SOLACE_DIPLOMAT_ID, new Set(["story"]))).toBe(true);
    expect(rosterRuntime.isRecruited(SOLACE_DIPLOMAT_ID)).toBe(true);
  });

  it("carries the exact 6 dialogue lines from the spec", () => {
    const lines = SOLACE_DIPLOMAT_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("We're here to build a future, not bury one.");
    expect(lines).toContain("Understanding is stronger than fear.");
    expect(lines).toContain("If conflict is unavoidable, let it end today.");
    expect(lines).toContain("Stand together.");
    expect(lines).toContain("Peace is never weakness.");
    expect(lines).toContain("Don't let this become another war...");
  });

  it("holds exactly the FOUR spec'd relationships (Reyes, Myrr, Vega, Kane) — the roster's sixth commander with four instead of three — no relationship to Ryker, Cael, Drake, Sol, Vale, Iskander, Thorne, Vex, Ash, Korven, Syn, Solari, Kain, Orion, Volkov, Nova, or Rhem is invented", () => {
    const targets = SOLACE_DIPLOMAT_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["reyes-warden", "myrr-oracle", "vega-echo", "kane-vanguard"]);
    for (const absent of ["ryker-engineer", "cael-weaver", "drake-hunter", "sol-resonant", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged", "vex-chronomancer", "ash-tempest", "korven-phantom", "syn-bioforge", "solari-photon", "kain-singularity", "orion-starlancer", "volkov-titan", "nova-architect", "rhem-catalyst"]) expect(targets).not.toContain(absent);
  });

  it("adds a twenty-fifth real Codex commander entry, cross-referencing exactly the four related commanders' entries", () => {
    expect(SOLACE_DIPLOMAT_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-reyes-warden", "codex-commander-myrr-oracle", "codex-commander-vega-echo", "codex-commander-kane-vanguard"]);
    expect(SOLACE_DIPLOMAT_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: SOLACE_DIPLOMAT_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of SOLACE_DIPLOMAT_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of SOLACE_DIPLOMAT_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of SOLACE_DIPLOMAT_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of SOLACE_DIPLOMAT_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of SOLACE_DIPLOMAT_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of SOLACE_DIPLOMAT_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

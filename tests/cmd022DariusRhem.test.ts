import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_ECHO } from "../src/game/commanders/cmd021TaliaVega";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_CATALYST,
  FULL_RECRUITMENT_WITH_CATALYST,
  FULL_ROSTER_WITH_CATALYST,
  RHEM_CATALYST_CODEX_ENTRY,
  RHEM_CATALYST_COMMANDER,
  RHEM_CATALYST_EXPANDED_PROFILE,
  RHEM_CATALYST_ID,
  RHEM_CATALYST_PROFILE,
  RHEM_CATALYST_RECRUITMENT,
  RHEM_CATALYST_RECRUITMENT_SOURCE_IS_REAL,
  catalystArchitectureComplete,
  catalystOverlapReport,
} from "../src/game/commanders/cmd022DariusRhem";
import { SOLARI_PHOTON_COMMANDER, SOLARI_PHOTON_PROFILE } from "../src/game/commanders/cmd014RheaSolari";
import { ASH_TEMPEST_COMMANDER, ASH_TEMPEST_PROFILE } from "../src/game/commanders/cmd011ValenAsh";

describe("Commander CMD-022 — Darius Rhem 'The Catalyst' (AF-120)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(RHEM_CATALYST_COMMANDER.name).toBe("Darius Rhem");
    expect(RHEM_CATALYST_COMMANDER.callsign).toBe("Catalyst");
    expect(RHEM_CATALYST_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(RHEM_CATALYST_EXPANDED_PROFILE.age).toBe(38);
    expect(RHEM_CATALYST_EXPANDED_PROFILE.homeworld).toBe("Helix Research Complex");
    expect(RHEM_CATALYST_EXPANDED_PROFILE.personality).toBe("optimistic");
  });

  it("is added additively — the real 43-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_ECHO.length).toBe(43);
    expect(FULL_ROSTER_WITH_CATALYST.length).toBe(44);
    expect(FULL_PROFILES_WITH_CATALYST.length).toBe(44);
    expect(FULL_RECRUITMENT_WITH_CATALYST.length).toBe(44);
    for (const original of FULL_ROSTER_WITH_ECHO) expect(FULL_ROSTER_WITH_CATALYST).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(catalystOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(catalystArchitectureComplete()).toBe(true);
  });

  it("deliberately differs from BOTH Rhea Solari's (Photon) and Valen Ash's (Tempest) archetype/class/passive/signature, per the spec's own overlap-reduction directive", () => {
    expect(RHEM_CATALYST_COMMANDER.archetype).not.toBe(SOLARI_PHOTON_COMMANDER.archetype);
    expect(RHEM_CATALYST_COMMANDER.archetype).not.toBe(ASH_TEMPEST_COMMANDER.archetype);
    expect(RHEM_CATALYST_PROFILE.class).not.toBe(SOLARI_PHOTON_PROFILE.class);
    expect(RHEM_CATALYST_PROFILE.class).not.toBe(ASH_TEMPEST_PROFILE.class);
    expect(RHEM_CATALYST_COMMANDER.passive).not.toEqual(SOLARI_PHOTON_COMMANDER.passive);
    expect(RHEM_CATALYST_COMMANDER.passive).not.toEqual(ASH_TEMPEST_COMMANDER.passive);
    expect(RHEM_CATALYST_COMMANDER.signature.passive).not.toEqual(SOLARI_PHOTON_COMMANDER.signature.passive);
    expect(RHEM_CATALYST_COMMANDER.signature.passive).not.toEqual(ASH_TEMPEST_COMMANDER.signature.passive);
  });

  it("recruits via research, gated on The Domino Principle", () => {
    expect(RHEM_CATALYST_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(RHEM_CATALYST_RECRUITMENT.source).toBe("research");
    expect(RHEM_CATALYST_RECRUITMENT.requirement).toContain("Domino Principle");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_CATALYST, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(44);
    expect(rosterRuntime.tryRecruit(RHEM_CATALYST_ID, new Set(["research"]))).toBe(true);
    expect(rosterRuntime.isRecruited(RHEM_CATALYST_ID)).toBe(true);
  });

  it("carries the exact 6 dialogue lines from the spec", () => {
    const lines = RHEM_CATALYST_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Everything begins with one reaction.");
    expect(lines).toContain("There it is... beautiful.");
    expect(lines).toContain("Let's test your stability.");
    expect(lines).toContain("Critical mass achieved.");
    expect(lines).toContain("One spark changed everything.");
    expect(lines).toContain("Still... enough energy.");
  });

  it("holds exactly the FOUR spec'd relationships (Thorne, Cael, Ryker, Voss) — the roster's fourth commander with four instead of three — no relationship to Kane, Drake, Sol, Vale, Iskander, Vex, Ash, Korven, Syn, Solari, Kain, Reyes, Orion, Volkov, Myrr, Nova, or Vega is invented", () => {
    const targets = RHEM_CATALYST_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["thorne-starforged", "cael-weaver", "ryker-engineer", "voss-pathfinder"]);
    for (const absent of ["kane-vanguard", "drake-hunter", "sol-resonant", "vale-voidrunner", "iskander-swarmmaster", "vex-chronomancer", "ash-tempest", "korven-phantom", "syn-bioforge", "solari-photon", "kain-singularity", "reyes-warden", "orion-starlancer", "volkov-titan", "myrr-oracle", "nova-architect", "vega-echo"]) expect(targets).not.toContain(absent);
  });

  it("adds a twenty-third real Codex commander entry, cross-referencing exactly the four related commanders' entries", () => {
    expect(RHEM_CATALYST_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-thorne-starforged", "codex-commander-cael-weaver", "codex-commander-ryker-engineer", "codex-commander-voss-pathfinder"]);
    expect(RHEM_CATALYST_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: RHEM_CATALYST_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of RHEM_CATALYST_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of RHEM_CATALYST_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of RHEM_CATALYST_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of RHEM_CATALYST_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of RHEM_CATALYST_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of RHEM_CATALYST_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

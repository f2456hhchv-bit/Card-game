import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_BEASTMASTER } from "../src/game/commanders/cmd028DorianFen";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_VOIDWALKER,
  FULL_RECRUITMENT_WITH_VOIDWALKER,
  FULL_ROSTER_WITH_VOIDWALKER,
  NOCTIS_VOIDWALKER_CODEX_ENTRY,
  NOCTIS_VOIDWALKER_COMMANDER,
  NOCTIS_VOIDWALKER_EXPANDED_PROFILE,
  NOCTIS_VOIDWALKER_ID,
  NOCTIS_VOIDWALKER_PROFILE,
  NOCTIS_VOIDWALKER_RECRUITMENT,
  NOCTIS_VOIDWALKER_RECRUITMENT_SOURCE_IS_REAL,
  voidwalkerArchitectureComplete,
  voidwalkerOverlapReport,
} from "../src/game/commanders/cmd029VegaNoctis";
import { KAIN_SINGULARITY_COMMANDER, KAIN_SINGULARITY_PROFILE } from "../src/game/commanders/cmd015ZephyrKain";
import { VEX_CHRONOMANCER_COMMANDER, VEX_CHRONOMANCER_PROFILE } from "../src/game/commanders/cmd010AurelionVex";
import { VALE_VOIDRUNNER_COMMANDER } from "../src/game/commanders/cmd007OrionVale";

describe("Commander CMD-029 — Vega Noctis 'The Voidwalker' (AF-127)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(NOCTIS_VOIDWALKER_COMMANDER.name).toBe("Vega Noctis");
    expect(NOCTIS_VOIDWALKER_COMMANDER.callsign).toBe("Voidwalker");
    expect(NOCTIS_VOIDWALKER_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(NOCTIS_VOIDWALKER_EXPANDED_PROFILE.age).toBe(38);
    expect(NOCTIS_VOIDWALKER_EXPANDED_PROFILE.homeworld).toBe("Unknown");
    expect(NOCTIS_VOIDWALKER_EXPANDED_PROFILE.personality).toBe("fearless");
  });

  it("is added additively — the real 50-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_BEASTMASTER.length).toBe(50);
    expect(FULL_ROSTER_WITH_VOIDWALKER.length).toBe(51);
    expect(FULL_PROFILES_WITH_VOIDWALKER.length).toBe(51);
    expect(FULL_RECRUITMENT_WITH_VOIDWALKER.length).toBe(51);
    for (const original of FULL_ROSTER_WITH_BEASTMASTER) expect(FULL_ROSTER_WITH_VOIDWALKER).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(voidwalkerOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(voidwalkerArchitectureComplete()).toBe(true);
  });

  it("deliberately differs from BOTH Zephyr Kain's and Aurelion Vex's archetype/class/passive/signature, per the spec's own overlap-reduction directive", () => {
    expect(NOCTIS_VOIDWALKER_COMMANDER.archetype).not.toBe(KAIN_SINGULARITY_COMMANDER.archetype);
    expect(NOCTIS_VOIDWALKER_COMMANDER.archetype).not.toBe(VEX_CHRONOMANCER_COMMANDER.archetype);
    expect(NOCTIS_VOIDWALKER_PROFILE.class).not.toBe(KAIN_SINGULARITY_PROFILE.class);
    expect(NOCTIS_VOIDWALKER_PROFILE.class).not.toBe(VEX_CHRONOMANCER_PROFILE.class);
    expect(NOCTIS_VOIDWALKER_COMMANDER.passive).not.toEqual(KAIN_SINGULARITY_COMMANDER.passive);
    expect(NOCTIS_VOIDWALKER_COMMANDER.passive).not.toEqual(VEX_CHRONOMANCER_COMMANDER.passive);
    expect(NOCTIS_VOIDWALKER_COMMANDER.signature.passive).not.toEqual(KAIN_SINGULARITY_COMMANDER.signature.passive);
    expect(NOCTIS_VOIDWALKER_COMMANDER.signature.passive).not.toEqual(VEX_CHRONOMANCER_COMMANDER.signature.passive);
  });

  it("disambiguates its active.id from CMD-007 Orion Vale's identically named 'Phase Step' ability while keeping the spec's display name verbatim", () => {
    expect(NOCTIS_VOIDWALKER_COMMANDER.active.name).toBe("Phase Step");
    expect(VALE_VOIDRUNNER_COMMANDER.active.name).toBe("Phase Step");
    expect(NOCTIS_VOIDWALKER_COMMANDER.active.id).not.toBe(VALE_VOIDRUNNER_COMMANDER.active.id);
  });

  it("recruits via hiddenDiscoveries, gated on Into Nothing", () => {
    expect(NOCTIS_VOIDWALKER_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(NOCTIS_VOIDWALKER_RECRUITMENT.source).toBe("hiddenDiscoveries");
    expect(NOCTIS_VOIDWALKER_RECRUITMENT.requirement).toContain("Into Nothing");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_VOIDWALKER, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(51);
    expect(rosterRuntime.tryRecruit(NOCTIS_VOIDWALKER_ID, new Set(["hiddenDiscoveries"]))).toBe(true);
    expect(rosterRuntime.isRecruited(NOCTIS_VOIDWALKER_ID)).toBe(true);
  });

  it("carries the exact 6 dialogue lines from the spec", () => {
    const lines = NOCTIS_VOIDWALKER_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("The darkness is only another path.");
    expect(lines).toContain("It remembers us.");
    expect(lines).toContain("Even infinity has boundaries.");
    expect(lines).toContain("Walk beyond.");
    expect(lines).toContain("We returned... together.");
    expect(lines).toContain("The Void is becoming louder...");
  });

  it("holds exactly the FOUR spec'd relationships (Vex, Kain, Myrr, Ross) — the roster's eleventh commander with four instead of three — no relationship to Kane, Ryker, Cael, Drake, Sol, Vale, Iskander, Thorne, Ash, Korven, Syn, Solari, Reyes, Orion, Volkov, Nova, Vega-Echo, Rhem, Solace, Oris, Drake-Sentinel, Helix, or Fen is invented", () => {
    const targets = NOCTIS_VOIDWALKER_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["vex-chronomancer", "kain-singularity", "myrr-oracle", "ross-horizon"]);
    for (const absent of ["kane-vanguard", "ryker-engineer", "cael-weaver", "drake-hunter", "sol-resonant", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged", "ash-tempest", "korven-phantom", "syn-bioforge", "solari-photon", "reyes-warden", "orion-starlancer", "volkov-titan", "nova-architect", "vega-echo", "rhem-catalyst", "solace-diplomat", "oris-nanoforge", "drake-sentinel", "helix-alchemist", "fen-beastmaster"]) expect(targets).not.toContain(absent);
  });

  it("adds a thirtieth real Codex commander entry, cross-referencing exactly the four related commanders' entries", () => {
    expect(NOCTIS_VOIDWALKER_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-vex-chronomancer", "codex-commander-kain-singularity", "codex-commander-myrr-oracle", "codex-commander-ross-horizon"]);
    expect(NOCTIS_VOIDWALKER_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: NOCTIS_VOIDWALKER_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of NOCTIS_VOIDWALKER_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of NOCTIS_VOIDWALKER_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of NOCTIS_VOIDWALKER_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of NOCTIS_VOIDWALKER_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of NOCTIS_VOIDWALKER_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of NOCTIS_VOIDWALKER_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

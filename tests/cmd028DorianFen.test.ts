import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_ALCHEMIST } from "../src/game/commanders/cmd027SoraHelix";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FEN_BEASTMASTER_CODEX_ENTRY,
  FEN_BEASTMASTER_COMMANDER,
  FEN_BEASTMASTER_EXPANDED_PROFILE,
  FEN_BEASTMASTER_ID,
  FEN_BEASTMASTER_PROFILE,
  FEN_BEASTMASTER_RECRUITMENT,
  FEN_BEASTMASTER_RECRUITMENT_SOURCE_IS_REAL,
  FULL_PROFILES_WITH_BEASTMASTER,
  FULL_RECRUITMENT_WITH_BEASTMASTER,
  FULL_ROSTER_WITH_BEASTMASTER,
  beastmasterArchitectureComplete,
  beastmasterOverlapReport,
} from "../src/game/commanders/cmd028DorianFen";
import { SYN_BIOFORGE_COMMANDER, SYN_BIOFORGE_PROFILE } from "../src/game/commanders/cmd013MiraSyn";
import { VALE_VOIDRUNNER_COMMANDER } from "../src/game/commanders/cmd007OrionVale";

describe("Commander CMD-028 — Dorian Fen 'The Beastmaster' (AF-126)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(FEN_BEASTMASTER_COMMANDER.name).toBe("Dorian Fen");
    expect(FEN_BEASTMASTER_COMMANDER.callsign).toBe("Beastmaster");
    expect(FEN_BEASTMASTER_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(FEN_BEASTMASTER_EXPANDED_PROFILE.age).toBe(41);
    expect(FEN_BEASTMASTER_EXPANDED_PROFILE.homeworld).toBe("Verdant Expanse");
    expect(FEN_BEASTMASTER_EXPANDED_PROFILE.personality).toBe("compassionate");
  });

  it("does not collide with the already-locked CMD-007 'Orion Vale' — the owner-authorised rename is respected", () => {
    expect(FEN_BEASTMASTER_COMMANDER.name).not.toBe(VALE_VOIDRUNNER_COMMANDER.name);
    expect(FEN_BEASTMASTER_ID).not.toBe("vale-voidrunner");
  });

  it("is added additively — the real 49-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_ALCHEMIST.length).toBe(49);
    expect(FULL_ROSTER_WITH_BEASTMASTER.length).toBe(50);
    expect(FULL_PROFILES_WITH_BEASTMASTER.length).toBe(50);
    expect(FULL_RECRUITMENT_WITH_BEASTMASTER.length).toBe(50);
    for (const original of FULL_ROSTER_WITH_ALCHEMIST) expect(FULL_ROSTER_WITH_BEASTMASTER).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(beastmasterOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(beastmasterArchitectureComplete()).toBe(true);
  });

  it("deliberately differs from Mira Syn's archetype/class/passive/signature, per the spec's own overlap-reduction directive", () => {
    expect(FEN_BEASTMASTER_COMMANDER.archetype).not.toBe(SYN_BIOFORGE_COMMANDER.archetype);
    expect(FEN_BEASTMASTER_PROFILE.class).not.toBe(SYN_BIOFORGE_PROFILE.class);
    expect(FEN_BEASTMASTER_COMMANDER.passive).not.toEqual(SYN_BIOFORGE_COMMANDER.passive);
    expect(FEN_BEASTMASTER_COMMANDER.signature.passive).not.toEqual(SYN_BIOFORGE_COMMANDER.signature.passive);
  });

  it("recruits via exploration, gated on The Last Guardian", () => {
    expect(FEN_BEASTMASTER_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(FEN_BEASTMASTER_RECRUITMENT.source).toBe("exploration");
    expect(FEN_BEASTMASTER_RECRUITMENT.requirement).toContain("Last Guardian");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_BEASTMASTER, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(50);
    expect(rosterRuntime.tryRecruit(FEN_BEASTMASTER_ID, new Set(["exploration"]))).toBe(true);
    expect(rosterRuntime.isRecruited(FEN_BEASTMASTER_ID)).toBe(true);
  });

  it("carries the exact 6 dialogue lines from the spec", () => {
    const lines = FEN_BEASTMASTER_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("We're guests here.");
    expect(lines).toContain("Let's go, partner.");
    expect(lines).toContain("Every apex predator eventually meets another.");
    expect(lines).toContain("The wild remembers.");
    expect(lines).toContain("Balance restored.");
    expect(lines).toContain("Stay with me... both of you.");
  });

  it("holds exactly the FOUR spec'd relationships (Syn, Ross, Helix, Reyes) — the roster's tenth commander with four instead of three — no relationship to Kane, Ryker, Cael, Drake, Sol, Vale, Iskander, Thorne, Vex, Ash, Korven, Solari, Kain, Orion, Volkov, Myrr, Nova, Vega, Rhem, Solace, Oris, or Drake-Sentinel is invented", () => {
    const targets = FEN_BEASTMASTER_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["syn-bioforge", "ross-horizon", "helix-alchemist", "reyes-warden"]);
    for (const absent of ["kane-vanguard", "ryker-engineer", "cael-weaver", "drake-hunter", "sol-resonant", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged", "vex-chronomancer", "ash-tempest", "korven-phantom", "solari-photon", "kain-singularity", "orion-starlancer", "volkov-titan", "myrr-oracle", "nova-architect", "vega-echo", "rhem-catalyst", "solace-diplomat", "oris-nanoforge", "drake-sentinel"]) expect(targets).not.toContain(absent);
  });

  it("adds a twenty-ninth real Codex commander entry, cross-referencing exactly the four related commanders' entries", () => {
    expect(FEN_BEASTMASTER_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-syn-bioforge", "codex-commander-ross-horizon", "codex-commander-helix-alchemist", "codex-commander-reyes-warden"]);
    expect(FEN_BEASTMASTER_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: FEN_BEASTMASTER_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of FEN_BEASTMASTER_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of FEN_BEASTMASTER_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of FEN_BEASTMASTER_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of FEN_BEASTMASTER_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of FEN_BEASTMASTER_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of FEN_BEASTMASTER_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

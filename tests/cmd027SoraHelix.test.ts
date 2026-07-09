import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_SENTINEL } from "../src/game/commanders/cmd026RonanDrake";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_ALCHEMIST,
  FULL_RECRUITMENT_WITH_ALCHEMIST,
  FULL_ROSTER_WITH_ALCHEMIST,
  HELIX_ALCHEMIST_CODEX_ENTRY,
  HELIX_ALCHEMIST_COMMANDER,
  HELIX_ALCHEMIST_EXPANDED_PROFILE,
  HELIX_ALCHEMIST_ID,
  HELIX_ALCHEMIST_PROFILE,
  HELIX_ALCHEMIST_RECRUITMENT,
  HELIX_ALCHEMIST_RECRUITMENT_SOURCE_IS_REAL,
  alchemistArchitectureComplete,
  alchemistOverlapReport,
} from "../src/game/commanders/cmd027SoraHelix";
import { RHEM_CATALYST_COMMANDER, RHEM_CATALYST_PROFILE } from "../src/game/commanders/cmd022DariusRhem";
import { ASH_TEMPEST_COMMANDER, ASH_TEMPEST_PROFILE } from "../src/game/commanders/cmd011ValenAsh";

describe("Commander CMD-027 — Sora Helix 'The Alchemist' (AF-125)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(HELIX_ALCHEMIST_COMMANDER.name).toBe("Sora Helix");
    expect(HELIX_ALCHEMIST_COMMANDER.callsign).toBe("Alchemist");
    expect(HELIX_ALCHEMIST_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(HELIX_ALCHEMIST_EXPANDED_PROFILE.age).toBe(34);
    expect(HELIX_ALCHEMIST_EXPANDED_PROFILE.homeworld).toBe("Elemental Research Nexus");
    expect(HELIX_ALCHEMIST_EXPANDED_PROFILE.personality).toBe("curious");
  });

  it("is added additively — the real 48-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_SENTINEL.length).toBe(48);
    expect(FULL_ROSTER_WITH_ALCHEMIST.length).toBe(49);
    expect(FULL_PROFILES_WITH_ALCHEMIST.length).toBe(49);
    expect(FULL_RECRUITMENT_WITH_ALCHEMIST.length).toBe(49);
    for (const original of FULL_ROSTER_WITH_SENTINEL) expect(FULL_ROSTER_WITH_ALCHEMIST).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(alchemistOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(alchemistArchitectureComplete()).toBe(true);
  });

  it("deliberately differs from BOTH Darius Rhem's and Valen Ash's archetype/class/passive/signature, per the spec's own overlap-reduction directive", () => {
    expect(HELIX_ALCHEMIST_COMMANDER.archetype).not.toBe(RHEM_CATALYST_COMMANDER.archetype);
    expect(HELIX_ALCHEMIST_COMMANDER.archetype).not.toBe(ASH_TEMPEST_COMMANDER.archetype);
    expect(HELIX_ALCHEMIST_PROFILE.class).not.toBe(RHEM_CATALYST_PROFILE.class);
    expect(HELIX_ALCHEMIST_PROFILE.class).not.toBe(ASH_TEMPEST_PROFILE.class);
    expect(HELIX_ALCHEMIST_COMMANDER.passive).not.toEqual(RHEM_CATALYST_COMMANDER.passive);
    expect(HELIX_ALCHEMIST_COMMANDER.passive).not.toEqual(ASH_TEMPEST_COMMANDER.passive);
    expect(HELIX_ALCHEMIST_COMMANDER.signature.passive).not.toEqual(RHEM_CATALYST_COMMANDER.signature.passive);
    expect(HELIX_ALCHEMIST_COMMANDER.signature.passive).not.toEqual(ASH_TEMPEST_COMMANDER.signature.passive);
  });

  it("recruits via research, gated on The Impossible Formula", () => {
    expect(HELIX_ALCHEMIST_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(HELIX_ALCHEMIST_RECRUITMENT.source).toBe("research");
    expect(HELIX_ALCHEMIST_RECRUITMENT.requirement).toContain("Impossible Formula");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_ALCHEMIST, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(49);
    expect(rosterRuntime.tryRecruit(HELIX_ALCHEMIST_ID, new Set(["research"]))).toBe(true);
    expect(rosterRuntime.isRecruited(HELIX_ALCHEMIST_ID)).toBe(true);
  });

  it("carries the exact 6 dialogue lines from the spec", () => {
    const lines = HELIX_ALCHEMIST_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Let's test a hypothesis.");
    expect(lines).toContain("Now that's fascinating.");
    expect(lines).toContain("Everything reacts under the right conditions.");
    expect(lines).toContain("Science... accelerated.");
    expect(lines).toContain("We learned something today.");
    expect(lines).toContain("Interesting... not ideal... but interesting.");
  });

  it("holds exactly the FOUR spec'd relationships (Rhem, Syn, Oris, Cael) — the roster's ninth commander with four instead of three — no relationship to Kane, Ryker, Drake, Sol, Vale, Iskander, Thorne, Vex, Ash, Korven, Solari, Kain, Reyes, Orion, Volkov, Myrr, Nova, Vega, Ross, Solace, or Drake-Sentinel is invented", () => {
    const targets = HELIX_ALCHEMIST_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["rhem-catalyst", "syn-bioforge", "oris-nanoforge", "cael-weaver"]);
    for (const absent of ["kane-vanguard", "ryker-engineer", "drake-hunter", "sol-resonant", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged", "vex-chronomancer", "ash-tempest", "korven-phantom", "solari-photon", "kain-singularity", "reyes-warden", "orion-starlancer", "volkov-titan", "myrr-oracle", "nova-architect", "vega-echo", "ross-horizon", "solace-diplomat", "drake-sentinel"]) expect(targets).not.toContain(absent);
  });

  it("adds a twenty-eighth real Codex commander entry, cross-referencing exactly the four related commanders' entries", () => {
    expect(HELIX_ALCHEMIST_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-rhem-catalyst", "codex-commander-syn-bioforge", "codex-commander-oris-nanoforge", "codex-commander-cael-weaver"]);
    expect(HELIX_ALCHEMIST_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: HELIX_ALCHEMIST_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of HELIX_ALCHEMIST_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of HELIX_ALCHEMIST_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of HELIX_ALCHEMIST_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of HELIX_ALCHEMIST_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of HELIX_ALCHEMIST_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of HELIX_ALCHEMIST_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

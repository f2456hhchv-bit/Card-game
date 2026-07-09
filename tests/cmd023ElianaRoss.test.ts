import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_CATALYST } from "../src/game/commanders/cmd022DariusRhem";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_HORIZON,
  FULL_RECRUITMENT_WITH_HORIZON,
  FULL_ROSTER_WITH_HORIZON,
  ROSS_HORIZON_CODEX_ENTRY,
  ROSS_HORIZON_COMMANDER,
  ROSS_HORIZON_EXPANDED_PROFILE,
  ROSS_HORIZON_ID,
  ROSS_HORIZON_PROFILE,
  ROSS_HORIZON_RECRUITMENT,
  ROSS_HORIZON_RECRUITMENT_SOURCE_IS_REAL,
  horizonArchitectureComplete,
  horizonOverlapReport,
} from "../src/game/commanders/cmd023ElianaRoss";
import { LYRA_VOSS_COMMANDER, LYRA_VOSS_PROFILE } from "../src/game/commanders/cmd001LyraVoss";

describe("Commander CMD-023 — Eliana Ross 'The Horizon' (AF-121)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(ROSS_HORIZON_COMMANDER.name).toBe("Eliana Ross");
    expect(ROSS_HORIZON_COMMANDER.callsign).toBe("Horizon");
    expect(ROSS_HORIZON_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(ROSS_HORIZON_EXPANDED_PROFILE.age).toBe(37);
    expect(ROSS_HORIZON_EXPANDED_PROFILE.homeworld).toBe("Frontier Beacon One");
    expect(ROSS_HORIZON_EXPANDED_PROFILE.personality).toBe("fearless");
  });

  it("is added additively — the real 44-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_CATALYST.length).toBe(44);
    expect(FULL_ROSTER_WITH_HORIZON.length).toBe(45);
    expect(FULL_PROFILES_WITH_HORIZON.length).toBe(45);
    expect(FULL_RECRUITMENT_WITH_HORIZON.length).toBe(45);
    for (const original of FULL_ROSTER_WITH_CATALYST) expect(FULL_ROSTER_WITH_HORIZON).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(horizonOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(horizonArchitectureComplete()).toBe(true);
  });

  it("deliberately differs from Lyra Voss's archetype/class/passive/signature, per the spec's own overlap-reduction directive", () => {
    expect(ROSS_HORIZON_COMMANDER.archetype).not.toBe(LYRA_VOSS_COMMANDER.archetype);
    expect(ROSS_HORIZON_PROFILE.class).not.toBe(LYRA_VOSS_PROFILE.class);
    expect(ROSS_HORIZON_COMMANDER.passive).not.toEqual(LYRA_VOSS_COMMANDER.passive);
    expect(ROSS_HORIZON_COMMANDER.signature.passive).not.toEqual(LYRA_VOSS_COMMANDER.signature.passive);
    expect(ROSS_HORIZON_EXPANDED_PROFILE.personality).not.toBe("curious");
  });

  it("recruits via exploration, gated on Beyond the Map", () => {
    expect(ROSS_HORIZON_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(ROSS_HORIZON_RECRUITMENT.source).toBe("exploration");
    expect(ROSS_HORIZON_RECRUITMENT.requirement).toContain("Beyond the Map");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_HORIZON, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(45);
    expect(rosterRuntime.tryRecruit(ROSS_HORIZON_ID, new Set(["exploration"]))).toBe(true);
    expect(rosterRuntime.isRecruited(ROSS_HORIZON_ID)).toBe(true);
  });

  it("carries the exact 6 dialogue lines from the spec", () => {
    const lines = ROSS_HORIZON_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("There's always another horizon.");
    expect(lines).toContain("No one has ever stood here before.");
    expect(lines).toContain("Even the unknown can be understood.");
    expect(lines).toContain("Let's chart tomorrow.");
    expect(lines).toContain("Another world welcomes us.");
    expect(lines).toContain("The expedition... continues...");
  });

  it("holds exactly the FOUR spec'd relationships (Voss, Orion, Nova, Vega) — the roster's fifth commander with four instead of three — no relationship to Kane, Ryker, Cael, Drake, Sol, Vale, Thorne, Vex, Ash, Korven, Syn, Solari, Kain, Reyes, Volkov, Myrr, or Rhem is invented", () => {
    const targets = ROSS_HORIZON_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["voss-pathfinder", "orion-starlancer", "nova-architect", "vega-echo"]);
    for (const absent of ["kane-vanguard", "ryker-engineer", "cael-weaver", "drake-hunter", "sol-resonant", "vale-voidrunner", "thorne-starforged", "vex-chronomancer", "ash-tempest", "korven-phantom", "syn-bioforge", "solari-photon", "kain-singularity", "reyes-warden", "volkov-titan", "myrr-oracle", "rhem-catalyst"]) expect(targets).not.toContain(absent);
  });

  it("adds a twenty-fourth real Codex commander entry, cross-referencing exactly the four related commanders' entries", () => {
    expect(ROSS_HORIZON_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-voss-pathfinder", "codex-commander-orion-starlancer", "codex-commander-nova-architect", "codex-commander-vega-echo"]);
    expect(ROSS_HORIZON_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: ROSS_HORIZON_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of ROSS_HORIZON_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of ROSS_HORIZON_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of ROSS_HORIZON_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of ROSS_HORIZON_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of ROSS_HORIZON_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of ROSS_HORIZON_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

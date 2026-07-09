import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_ARCHITECT } from "../src/game/commanders/cmd020CaelusNova";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_ECHO,
  FULL_RECRUITMENT_WITH_ECHO,
  FULL_ROSTER_WITH_ECHO,
  VEGA_ECHO_CODEX_ENTRY,
  VEGA_ECHO_COMMANDER,
  VEGA_ECHO_EXPANDED_PROFILE,
  VEGA_ECHO_ID,
  VEGA_ECHO_PROFILE,
  VEGA_ECHO_RECRUITMENT,
  VEGA_ECHO_RECRUITMENT_SOURCE_IS_REAL,
  echoArchitectureComplete,
  echoOverlapReport,
} from "../src/game/commanders/cmd021TaliaVega";
import { MYRR_ORACLE_COMMANDER, MYRR_ORACLE_PROFILE } from "../src/game/commanders/cmd019SeleneMyrr";
import { KORVEN_PHANTOM_COMMANDER, KORVEN_PHANTOM_PROFILE } from "../src/game/commanders/cmd012NyxKorven";

describe("Commander CMD-021 — Talia Vega 'The Echo' (AF-119)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(VEGA_ECHO_COMMANDER.name).toBe("Talia Vega");
    expect(VEGA_ECHO_COMMANDER.callsign).toBe("Echo");
    expect(VEGA_ECHO_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(VEGA_ECHO_EXPANDED_PROFILE.age).toBe(29);
    expect(VEGA_ECHO_EXPANDED_PROFILE.homeworld).toBe("Echo Deep Observatory");
    expect(VEGA_ECHO_EXPANDED_PROFILE.personality).toBe("curious");
  });

  it("is added additively — the real 42-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_ARCHITECT.length).toBe(42);
    expect(FULL_ROSTER_WITH_ECHO.length).toBe(43);
    expect(FULL_PROFILES_WITH_ECHO.length).toBe(43);
    expect(FULL_RECRUITMENT_WITH_ECHO.length).toBe(43);
    for (const original of FULL_ROSTER_WITH_ARCHITECT) expect(FULL_ROSTER_WITH_ECHO).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(echoOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(echoArchitectureComplete()).toBe(true);
  });

  it("deliberately differs from BOTH Selene Myrr's and Nyx Korven's archetype/class/passive/signature, per the spec's own overlap-reduction directive", () => {
    expect(VEGA_ECHO_COMMANDER.archetype).not.toBe(MYRR_ORACLE_COMMANDER.archetype);
    expect(VEGA_ECHO_COMMANDER.archetype).not.toBe(KORVEN_PHANTOM_COMMANDER.archetype);
    expect(VEGA_ECHO_PROFILE.class).not.toBe(MYRR_ORACLE_PROFILE.class);
    expect(VEGA_ECHO_PROFILE.class).not.toBe(KORVEN_PHANTOM_PROFILE.class);
    expect(VEGA_ECHO_COMMANDER.passive).not.toEqual(MYRR_ORACLE_COMMANDER.passive);
    expect(VEGA_ECHO_COMMANDER.passive).not.toEqual(KORVEN_PHANTOM_COMMANDER.passive);
    expect(VEGA_ECHO_COMMANDER.signature.passive).not.toEqual(MYRR_ORACLE_COMMANDER.signature.passive);
    expect(VEGA_ECHO_COMMANDER.signature.passive).not.toEqual(KORVEN_PHANTOM_COMMANDER.signature.passive);
  });

  it("recruits via hiddenDiscoveries, gated on The Silent Signal", () => {
    expect(VEGA_ECHO_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(VEGA_ECHO_RECRUITMENT.source).toBe("hiddenDiscoveries");
    expect(VEGA_ECHO_RECRUITMENT.requirement).toContain("Silent Signal");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_ECHO, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(43);
    expect(rosterRuntime.tryRecruit(VEGA_ECHO_ID, new Set(["hiddenDiscoveries"]))).toBe(true);
    expect(rosterRuntime.isRecruited(VEGA_ECHO_ID)).toBe(true);
  });

  it("carries the exact 6 dialogue lines from the spec", () => {
    const lines = VEGA_ECHO_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Listen carefully... the galaxy is speaking.");
    expect(lines).toContain("Someone wanted this message to survive.");
    expect(lines).toContain("I've already heard your next move.");
    expect(lines).toContain("Every voice. Every signal. Connected.");
    expect(lines).toContain("We're no longer alone.");
    expect(lines).toContain("The signal... is breaking...");
  });

  it("holds exactly the FOUR spec'd relationships (Myrr, Voss, Korven, Iskander) — the roster's third commander with four instead of three — no relationship to Kane, Ryker, Cael, Drake, Sol, Vale, Thorne, Vex, Ash, Syn, Solari, Kain, Reyes, Orion, Volkov, or Nova is invented", () => {
    const targets = VEGA_ECHO_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["myrr-oracle", "voss-pathfinder", "korven-phantom", "iskander-swarmmaster"]);
    for (const absent of ["kane-vanguard", "ryker-engineer", "cael-weaver", "drake-hunter", "sol-resonant", "vale-voidrunner", "thorne-starforged", "vex-chronomancer", "ash-tempest", "syn-bioforge", "solari-photon", "kain-singularity", "reyes-warden", "orion-starlancer", "volkov-titan", "nova-architect"]) expect(targets).not.toContain(absent);
  });

  it("adds a twenty-second real Codex commander entry, cross-referencing exactly the four related commanders' entries", () => {
    expect(VEGA_ECHO_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-myrr-oracle", "codex-commander-voss-pathfinder", "codex-commander-korven-phantom", "codex-commander-iskander-swarmmaster"]);
    expect(VEGA_ECHO_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: VEGA_ECHO_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of VEGA_ECHO_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of VEGA_ECHO_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of VEGA_ECHO_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of VEGA_ECHO_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of VEGA_ECHO_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of VEGA_ECHO_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_NANOFORGE } from "../src/game/commanders/cmd025XantheOris";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  DRAKE_SENTINEL_CODEX_ENTRY,
  DRAKE_SENTINEL_COMMANDER,
  DRAKE_SENTINEL_EXPANDED_PROFILE,
  DRAKE_SENTINEL_ID,
  DRAKE_SENTINEL_PROFILE,
  DRAKE_SENTINEL_RECRUITMENT,
  DRAKE_SENTINEL_RECRUITMENT_SOURCE_IS_REAL,
  FULL_PROFILES_WITH_SENTINEL,
  FULL_RECRUITMENT_WITH_SENTINEL,
  FULL_ROSTER_WITH_SENTINEL,
  sentinelArchitectureComplete,
  sentinelOverlapReport,
} from "../src/game/commanders/cmd026RonanDrake";
import { KANE_VANGUARD_COMMANDER, KANE_VANGUARD_PROFILE } from "../src/game/commanders/cmd002AdrianKane";
import { REYES_WARDEN_COMMANDER, REYES_WARDEN_PROFILE } from "../src/game/commanders/cmd016AstridReyes";
import { VOLKOV_TITAN_COMMANDER, VOLKOV_TITAN_PROFILE } from "../src/game/commanders/cmd018IvanVolkov";

describe("Commander CMD-026 — Ronan Drake 'The Sentinel' (AF-124)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(DRAKE_SENTINEL_COMMANDER.name).toBe("Ronan Drake");
    expect(DRAKE_SENTINEL_COMMANDER.callsign).toBe("Sentinel");
    expect(DRAKE_SENTINEL_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(DRAKE_SENTINEL_EXPANDED_PROFILE.age).toBe(48);
    expect(DRAKE_SENTINEL_EXPANDED_PROFILE.homeworld).toBe("Watchtower Station");
    expect(DRAKE_SENTINEL_EXPANDED_PROFILE.personality).toBe("stoic");
  });

  it("is added additively — the real 47-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_NANOFORGE.length).toBe(47);
    expect(FULL_ROSTER_WITH_SENTINEL.length).toBe(48);
    expect(FULL_PROFILES_WITH_SENTINEL.length).toBe(48);
    expect(FULL_RECRUITMENT_WITH_SENTINEL.length).toBe(48);
    for (const original of FULL_ROSTER_WITH_NANOFORGE) expect(FULL_ROSTER_WITH_SENTINEL).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(sentinelOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(sentinelArchitectureComplete()).toBe(true);
  });

  it("deliberately differs from Adrian Kane's, Astrid Reyes's, and Ivan Volkov's archetype/class/passive/signature, per the spec's own triple overlap-reduction directive", () => {
    expect(DRAKE_SENTINEL_COMMANDER.archetype).not.toBe(KANE_VANGUARD_COMMANDER.archetype);
    expect(DRAKE_SENTINEL_COMMANDER.archetype).not.toBe(REYES_WARDEN_COMMANDER.archetype);
    expect(DRAKE_SENTINEL_COMMANDER.archetype).not.toBe(VOLKOV_TITAN_COMMANDER.archetype);
    expect(DRAKE_SENTINEL_PROFILE.class).not.toBe(KANE_VANGUARD_PROFILE.class);
    expect(DRAKE_SENTINEL_PROFILE.class).not.toBe(REYES_WARDEN_PROFILE.class);
    expect(DRAKE_SENTINEL_PROFILE.class).not.toBe(VOLKOV_TITAN_PROFILE.class);
    expect(DRAKE_SENTINEL_COMMANDER.passive).not.toEqual(KANE_VANGUARD_COMMANDER.passive);
    expect(DRAKE_SENTINEL_COMMANDER.passive).not.toEqual(REYES_WARDEN_COMMANDER.passive);
    expect(DRAKE_SENTINEL_COMMANDER.passive).not.toEqual(VOLKOV_TITAN_COMMANDER.passive);
    expect(DRAKE_SENTINEL_COMMANDER.signature.passive).not.toEqual(KANE_VANGUARD_COMMANDER.signature.passive);
    expect(DRAKE_SENTINEL_COMMANDER.signature.passive).not.toEqual(REYES_WARDEN_COMMANDER.signature.passive);
    expect(DRAKE_SENTINEL_COMMANDER.signature.passive).not.toEqual(VOLKOV_TITAN_COMMANDER.signature.passive);
  });

  it("recruits via story, gated on The Long Watch", () => {
    expect(DRAKE_SENTINEL_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(DRAKE_SENTINEL_RECRUITMENT.source).toBe("story");
    expect(DRAKE_SENTINEL_RECRUITMENT.requirement).toContain("Long Watch");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_SENTINEL, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(48);
    expect(rosterRuntime.tryRecruit(DRAKE_SENTINEL_ID, new Set(["story"]))).toBe(true);
    expect(rosterRuntime.isRecruited(DRAKE_SENTINEL_ID)).toBe(true);
  });

  it("carries the exact 6 dialogue lines from the spec", () => {
    const lines = DRAKE_SENTINEL_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("The watch begins.");
    expect(lines).toContain("I see you.");
    expect(lines).toContain("You were expected.");
    expect(lines).toContain("All batteries online.");
    expect(lines).toContain("Threat eliminated.");
    expect(lines).toContain("The perimeter... still holds.");
  });

  it("holds exactly the FOUR spec'd relationships (Volkov, Kane, Reyes, Iskander) — the roster's eighth commander with four instead of three — no relationship to Cael, Sol, Vale, Thorne, Vex, Ash, Korven, Syn, Solari, Kain, Orion, Myrr, Nova, Vega, Rhem, Ross, Solace, or Oris is invented", () => {
    const targets = DRAKE_SENTINEL_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["volkov-titan", "kane-vanguard", "reyes-warden", "iskander-swarmmaster"]);
    for (const absent of ["cael-weaver", "sol-resonant", "vale-voidrunner", "thorne-starforged", "vex-chronomancer", "ash-tempest", "korven-phantom", "syn-bioforge", "solari-photon", "kain-singularity", "orion-starlancer", "myrr-oracle", "nova-architect", "vega-echo", "rhem-catalyst", "ross-horizon", "solace-diplomat", "oris-nanoforge"]) expect(targets).not.toContain(absent);
  });

  it("adds a twenty-seventh real Codex commander entry, cross-referencing exactly the four related commanders' entries", () => {
    expect(DRAKE_SENTINEL_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-volkov-titan", "codex-commander-kane-vanguard", "codex-commander-reyes-warden", "codex-commander-iskander-swarmmaster"]);
    expect(DRAKE_SENTINEL_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: DRAKE_SENTINEL_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of DRAKE_SENTINEL_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of DRAKE_SENTINEL_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of DRAKE_SENTINEL_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of DRAKE_SENTINEL_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of DRAKE_SENTINEL_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of DRAKE_SENTINEL_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

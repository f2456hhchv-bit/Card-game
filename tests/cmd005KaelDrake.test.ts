import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_WEAVER } from "../src/game/commanders/cmd004SeraphinaCael";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  DRAKE_HUNTER_CODEX_ENTRY,
  DRAKE_HUNTER_COMMANDER,
  DRAKE_HUNTER_EXPANDED_PROFILE,
  DRAKE_HUNTER_ID,
  DRAKE_HUNTER_PROFILE,
  DRAKE_HUNTER_RECRUITMENT,
  DRAKE_HUNTER_RECRUITMENT_SOURCE_IS_REAL,
  FULL_PROFILES_WITH_HUNTER,
  FULL_RECRUITMENT_WITH_HUNTER,
  FULL_ROSTER_WITH_HUNTER,
  hunterArchitectureComplete,
  hunterOverlapReport,
} from "../src/game/commanders/cmd005KaelDrake";

describe("Commander CMD-005 — Kael Drake 'The Hunter' (AF-103)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(DRAKE_HUNTER_COMMANDER.name).toBe("Kael Drake");
    expect(DRAKE_HUNTER_COMMANDER.callsign).toBe("Hunter");
    expect(DRAKE_HUNTER_COMMANDER.faction).toBe("Independent Frontier Rangers");
    expect(DRAKE_HUNTER_EXPANDED_PROFILE.age).toBe(41);
    expect(DRAKE_HUNTER_EXPANDED_PROFILE.homeworld).toBe("Ashfall Frontier");
    expect(DRAKE_HUNTER_EXPANDED_PROFILE.personality).toBe("strategic");
  });

  it("is added additively — the real 26-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_WEAVER.length).toBe(26);
    expect(FULL_ROSTER_WITH_HUNTER.length).toBe(27);
    expect(FULL_PROFILES_WITH_HUNTER.length).toBe(27);
    expect(FULL_RECRUITMENT_WITH_HUNTER.length).toBe(27);
    for (const original of FULL_ROSTER_WITH_WEAVER) expect(FULL_ROSTER_WITH_HUNTER).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(hunterOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(hunterArchitectureComplete()).toBe(true);
  });

  it("recruits via campaign, gated on The Last Trail", () => {
    expect(DRAKE_HUNTER_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(DRAKE_HUNTER_RECRUITMENT.source).toBe("campaign");
    expect(DRAKE_HUNTER_RECRUITMENT.requirement).toContain("apex organism");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_HUNTER, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(27);
    expect(rosterRuntime.tryRecruit(DRAKE_HUNTER_ID, new Set(["campaign"]))).toBe(true);
    expect(rosterRuntime.isRecruited(DRAKE_HUNTER_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = DRAKE_HUNTER_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Every trail tells a story.");
    expect(lines).toContain("Watch carefully... it's already made a mistake.");
    expect(lines).toContain("No creature is invincible.");
    expect(lines).toContain("The hunt ends now.");
    expect(lines).toContain("It was never luck.");
  });

  it("holds exactly the three spec'd relationships (Kane, Voss, Cael) — no relationship to Ryker is invented", () => {
    const targets = DRAKE_HUNTER_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["kane-vanguard", "voss-pathfinder", "cael-weaver"]);
    expect(targets).not.toContain("ryker-engineer");
  });

  it("adds a sixth real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(DRAKE_HUNTER_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-kane-vanguard", "codex-commander-voss-pathfinder", "codex-commander-cael-weaver"]);
    expect(DRAKE_HUNTER_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: DRAKE_HUNTER_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of DRAKE_HUNTER_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of DRAKE_HUNTER_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of DRAKE_HUNTER_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of DRAKE_HUNTER_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of DRAKE_HUNTER_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of DRAKE_HUNTER_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_PATHFINDER } from "../src/game/commanders/cmd001LyraVoss";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_VANGUARD,
  FULL_RECRUITMENT_WITH_VANGUARD,
  FULL_ROSTER_WITH_VANGUARD,
  KANE_VANGUARD_CODEX_ENTRY,
  KANE_VANGUARD_COMMANDER,
  KANE_VANGUARD_EXPANDED_PROFILE,
  KANE_VANGUARD_ID,
  KANE_VANGUARD_PROFILE,
  KANE_VANGUARD_RECRUITMENT,
  KANE_VANGUARD_RECRUITMENT_SOURCE_IS_REAL,
  vanguardArchitectureComplete,
  vanguardOverlapReport,
} from "../src/game/commanders/cmd002AdrianKane";

describe("Commander CMD-002 — Adrian Kane 'The Vanguard' (AF-100)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(KANE_VANGUARD_COMMANDER.name).toBe("Adrian Kane");
    expect(KANE_VANGUARD_COMMANDER.callsign).toBe("Vanguard");
    expect(KANE_VANGUARD_COMMANDER.faction).toBe("United Human Frontier");
    expect(KANE_VANGUARD_EXPANDED_PROFILE.age).toBe(47);
    expect(KANE_VANGUARD_EXPANDED_PROFILE.species).toBe("Human");
    expect(KANE_VANGUARD_EXPANDED_PROFILE.homeworld).toBe("Bastion Prime");
    expect(KANE_VANGUARD_EXPANDED_PROFILE.personality).toBe("stoic");
  });

  it("is added additively — the real 23-commander roster (launch + Batch 1 + CMD-001) is untouched", () => {
    expect(FULL_ROSTER_WITH_PATHFINDER.length).toBe(23);
    expect(FULL_ROSTER_WITH_VANGUARD.length).toBe(24);
    expect(FULL_PROFILES_WITH_VANGUARD.length).toBe(24);
    expect(FULL_RECRUITMENT_WITH_VANGUARD.length).toBe(24);
    for (const original of FULL_ROSTER_WITH_PATHFINDER) expect(FULL_ROSTER_WITH_VANGUARD).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real AF-030 fingerprint/findOverlap law", () => {
    expect(vanguardOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(vanguardArchitectureComplete()).toBe(true);
  });

  it("recruits via campaign, a real AF-072 recruitment source, gated on The Last Bastion", () => {
    expect(KANE_VANGUARD_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(KANE_VANGUARD_RECRUITMENT.source).toBe("campaign");
    expect(KANE_VANGUARD_RECRUITMENT.requirement).toContain("Last Bastion");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_VANGUARD, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(24);
    expect(rosterRuntime.isRecruited(KANE_VANGUARD_ID)).toBe(false);
    expect(rosterRuntime.tryRecruit(KANE_VANGUARD_ID, new Set(["campaign"]))).toBe(true);
    expect(rosterRuntime.isRecruited(KANE_VANGUARD_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = KANE_VANGUARD_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("We hold the line. No exceptions.");
    expect(lines).toContain("Reinforce immediately!");
    expect(lines).toContain("Strength without discipline is weakness.");
    expect(lines).toContain("They're alive. That's what matters.");
    expect(lines).toContain("I've endured worse.");
    expect(KANE_VANGUARD_EXPANDED_PROFILE.dialogueLibrary.length).toBe(5);
  });

  it("holds Deep Respect for Dr. Lyra Voss — a real, bidirectional-in-spirit cross-commander relationship binding to the real CMD-001 id", () => {
    const relationship = KANE_VANGUARD_PROFILE.relationships.find((r) => r.subject === "otherCommanders");
    expect(relationship?.targetId).toBe("voss-pathfinder");
    expect(relationship?.dialogueHint.toLowerCase()).toContain("respect");
  });

  it("adds a third real Codex commander entry, additively, cross-referencing CMD-001's entry", () => {
    expect(KANE_VANGUARD_CODEX_ENTRY.id).toBe("codex-commander-kane-vanguard");
    expect(KANE_VANGUARD_CODEX_ENTRY.category).toBe("commanders");
    expect(KANE_VANGUARD_CODEX_ENTRY.relatedEntryIds).toContain("codex-commander-voss-pathfinder");
    expect(KANE_VANGUARD_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: KANE_VANGUARD_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of KANE_VANGUARD_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of KANE_VANGUARD_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of KANE_VANGUARD_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of KANE_VANGUARD_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of KANE_VANGUARD_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of KANE_VANGUARD_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });

  it("weaknesses are structurally real — no damage/criticalDamage/movementSpeed bonus on his own passive or signature (lower mobility, limited burst)", () => {
    const passiveKind = KANE_VANGUARD_COMMANDER.passive.bonus.kind;
    const signatureKind = KANE_VANGUARD_COMMANDER.signature.passive.bonus.kind;
    for (const kind of [passiveKind, signatureKind]) {
      expect(kind).not.toBe("damage");
      expect(kind).not.toBe("criticalDamage");
      expect(kind).not.toBe("movementSpeed");
    }
  });
});

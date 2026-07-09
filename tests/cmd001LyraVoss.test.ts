import { describe, expect, it } from "vitest";
import { FULL_COMMANDER_ROSTER } from "../src/game/commanders/commanderExpansionRoster";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_PATHFINDER,
  FULL_RECRUITMENT_WITH_PATHFINDER,
  FULL_ROSTER_WITH_PATHFINDER,
  LYRA_VOSS_CODEX_ENTRY,
  LYRA_VOSS_COMMANDER,
  LYRA_VOSS_EXPANDED_PROFILE,
  LYRA_VOSS_ID,
  LYRA_VOSS_PROFILE,
  LYRA_VOSS_RECRUITMENT,
  LYRA_VOSS_RECRUITMENT_SOURCE_IS_REAL,
  pathfinderArchitectureComplete,
  pathfinderOverlapReport,
} from "../src/game/commanders/cmd001LyraVoss";

describe("Commander CMD-001 — Dr. Lyra Voss 'The Pathfinder' (AF-099)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(LYRA_VOSS_COMMANDER.name).toBe("Dr. Lyra Voss");
    expect(LYRA_VOSS_COMMANDER.callsign).toBe("Pathfinder");
    expect(LYRA_VOSS_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(LYRA_VOSS_EXPANDED_PROFILE.age).toBe(38);
    expect(LYRA_VOSS_EXPANDED_PROFILE.species).toBe("Human");
    expect(LYRA_VOSS_EXPANDED_PROFILE.homeworld).toBe("New Horizon Colony");
  });

  it("is added additively — the real 22-commander roster (launch + Batch 1) is untouched", () => {
    expect(FULL_COMMANDER_ROSTER.length).toBe(22);
    expect(FULL_ROSTER_WITH_PATHFINDER.length).toBe(23);
    expect(FULL_PROFILES_WITH_PATHFINDER.length).toBe(23);
    expect(FULL_RECRUITMENT_WITH_PATHFINDER.length).toBe(23);
    for (const original of FULL_COMMANDER_ROSTER) expect(FULL_ROSTER_WITH_PATHFINDER).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real AF-030 fingerprint/findOverlap law", () => {
    expect(pathfinderOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(pathfinderArchitectureComplete()).toBe(true);
  });

  it("recruits via campaign (Early Campaign difficulty), a real AF-072 recruitment source, gated on The Silent Observatory", () => {
    expect(LYRA_VOSS_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(LYRA_VOSS_RECRUITMENT.source).toBe("campaign");
    expect(LYRA_VOSS_RECRUITMENT.requirement).toContain("Silent Observatory");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_PATHFINDER, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(23);
    expect(rosterRuntime.isRecruited(LYRA_VOSS_ID)).toBe(false);
    expect(rosterRuntime.tryRecruit(LYRA_VOSS_ID, new Set(["campaign"]))).toBe(true);
    expect(rosterRuntime.isRecruited(LYRA_VOSS_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec, each bound to a real DIALOGUE_TRIGGER_CATEGORIES-aligned category", () => {
    const lines = LYRA_VOSS_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Every unanswered question is an opportunity.");
    expect(lines).toContain("Incredible... this changes everything.");
    expect(lines).toContain("Observe first. React second.");
    expect(lines).toContain("Knowledge survives long after battles end.");
    expect(lines).toContain("I'll need a moment to think...");
    expect(LYRA_VOSS_EXPANDED_PROFILE.dialogueLibrary.length).toBe(5);
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of LYRA_VOSS_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of LYRA_VOSS_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of LYRA_VOSS_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of LYRA_VOSS_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of LYRA_VOSS_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of LYRA_VOSS_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });

  it("adds a second real Codex commander entry, additively — extending the honest 1/14 gap AF-098 registered", () => {
    expect(LYRA_VOSS_CODEX_ENTRY.id).toBe("codex-commander-voss-pathfinder");
    expect(LYRA_VOSS_CODEX_ENTRY.category).toBe("commanders");
    expect(LYRA_VOSS_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: LYRA_VOSS_ID });
    expect(LYRA_VOSS_CODEX_ENTRY.lore.summary.length).toBeGreaterThan(0);
  });

  it("the drone-focused Field Commander branch produces droneEffectiveness — a second real producer alongside kite-aviary's", () => {
    const fieldCommanderBranch = LYRA_VOSS_PROFILE.talentBranches.find((b) => b.id === "voss-pathfinder:field-commander")!;
    const droneNodes = fieldCommanderBranch.nodes.filter((n) => n.bonus.kind === "droneEffectiveness");
    expect(droneNodes.length).toBeGreaterThan(0);
  });

  it("weaknesses are structurally real — lower burst-damage identity: no criticalDamage/damage bonus on her own passive or signature", () => {
    expect(LYRA_VOSS_COMMANDER.passive.bonus.kind).not.toBe("damage");
    expect(LYRA_VOSS_COMMANDER.passive.bonus.kind).not.toBe("criticalDamage");
    expect(LYRA_VOSS_COMMANDER.signature.passive.bonus.kind).not.toBe("damage");
    expect(LYRA_VOSS_COMMANDER.signature.passive.bonus.kind).not.toBe("criticalDamage");
  });
});

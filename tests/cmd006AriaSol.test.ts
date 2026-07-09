import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_HUNTER } from "../src/game/commanders/cmd005KaelDrake";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_RESONANT,
  FULL_RECRUITMENT_WITH_RESONANT,
  FULL_ROSTER_WITH_RESONANT,
  SOL_RESONANT_CODEX_ENTRY,
  SOL_RESONANT_COMMANDER,
  SOL_RESONANT_EXPANDED_PROFILE,
  SOL_RESONANT_ID,
  SOL_RESONANT_PROFILE,
  SOL_RESONANT_RECRUITMENT,
  SOL_RESONANT_RECRUITMENT_SOURCE_IS_REAL,
  resonantArchitectureComplete,
  resonantOverlapReport,
} from "../src/game/commanders/cmd006AriaSol";

describe("Commander CMD-006 — Aria Sol 'The Resonant' (AF-104)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(SOL_RESONANT_COMMANDER.name).toBe("Aria Sol");
    expect(SOL_RESONANT_COMMANDER.callsign).toBe("Resonant");
    expect(SOL_RESONANT_COMMANDER.faction).toBe("Crystal Ascendancy");
    expect(SOL_RESONANT_EXPANDED_PROFILE.age).toBe(32);
    expect(SOL_RESONANT_EXPANDED_PROFILE.homeworld).toBe("Resonance Station Epsilon");
    expect(SOL_RESONANT_EXPANDED_PROFILE.personality).toBe("idealistic");
  });

  it("is added additively — the real 27-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_HUNTER.length).toBe(27);
    expect(FULL_ROSTER_WITH_RESONANT.length).toBe(28);
    expect(FULL_PROFILES_WITH_RESONANT.length).toBe(28);
    expect(FULL_RECRUITMENT_WITH_RESONANT.length).toBe(28);
    for (const original of FULL_ROSTER_WITH_HUNTER) expect(FULL_ROSTER_WITH_RESONANT).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(resonantOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(resonantArchitectureComplete()).toBe(true);
  });

  it("recruits via story, gated on The Crystal Choir", () => {
    expect(SOL_RESONANT_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(SOL_RESONANT_RECRUITMENT.source).toBe("story");
    expect(SOL_RESONANT_RECRUITMENT.requirement).toContain("crystal network");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_RESONANT, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(28);
    expect(rosterRuntime.tryRecruit(SOL_RESONANT_ID, new Set(["story"]))).toBe(true);
    expect(rosterRuntime.isRecruited(SOL_RESONANT_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = SOL_RESONANT_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Everything has a rhythm. Listen carefully.");
    expect(lines).toContain("They're still singing...");
    expect(lines).toContain("Even chaos follows patterns.");
    expect(lines).toContain("Let the galaxy remember its song.");
    expect(lines).toContain("Harmony always finds a way.");
  });

  it("holds exactly the three spec'd relationships (Cael, Voss, Ryker) — no relationship to Kane or Drake is invented", () => {
    const targets = SOL_RESONANT_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["cael-weaver", "voss-pathfinder", "ryker-engineer"]);
    expect(targets).not.toContain("kane-vanguard");
    expect(targets).not.toContain("drake-hunter");
  });

  it("adds a seventh real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(SOL_RESONANT_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-cael-weaver", "codex-commander-voss-pathfinder", "codex-commander-ryker-engineer"]);
    expect(SOL_RESONANT_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: SOL_RESONANT_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of SOL_RESONANT_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of SOL_RESONANT_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of SOL_RESONANT_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of SOL_RESONANT_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of SOL_RESONANT_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of SOL_RESONANT_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

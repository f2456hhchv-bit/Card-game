import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_CELESTIAL } from "../src/game/commanders/cmd030LysandraAether";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_FOUNDER,
  FULL_RECRUITMENT_WITH_FOUNDER,
  FULL_ROSTER_WITH_FOUNDER,
  PRIME_FOUNDER_CODEX_ENTRY,
  PRIME_FOUNDER_COMMANDER,
  PRIME_FOUNDER_EXPANDED_PROFILE,
  PRIME_FOUNDER_ID,
  PRIME_FOUNDER_PROFILE,
  PRIME_FOUNDER_RECRUITMENT,
  PRIME_FOUNDER_RECRUITMENT_SOURCE_IS_REAL,
  founderArchitectureComplete,
  founderOverlapReport,
} from "../src/game/commanders/cmd031AtlasPrime";

const ALL_THIRTY_PRIOR_IDS = [
  "voss-pathfinder", "kane-vanguard", "ryker-engineer", "cael-weaver", "drake-hunter",
  "sol-resonant", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged", "vex-chronomancer",
  "ash-tempest", "korven-phantom", "syn-bioforge", "solari-photon", "kain-singularity",
  "reyes-warden", "orion-starlancer", "volkov-titan", "myrr-oracle", "nova-architect",
  "vega-echo", "rhem-catalyst", "ross-horizon", "solace-diplomat", "oris-nanoforge",
  "drake-sentinel", "helix-alchemist", "fen-beastmaster", "noctis-voidwalker", "aether-celestial",
];

describe("Commander CMD-031 — Atlas Prime 'The Founder' (AF-129)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(PRIME_FOUNDER_COMMANDER.name).toBe("Atlas Prime");
    expect(PRIME_FOUNDER_COMMANDER.callsign).toBe("Founder");
    expect(PRIME_FOUNDER_COMMANDER.faction).toBe("The First Expedition");
    expect(PRIME_FOUNDER_EXPANDED_PROFILE.age).toBe(52);
    expect(PRIME_FOUNDER_EXPANDED_PROFILE.homeworld).toBe("Earth");
    expect(PRIME_FOUNDER_EXPANDED_PROFILE.personality).toBe("visionary");
  });

  it("is added additively — the real 52-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_CELESTIAL.length).toBe(52);
    expect(FULL_ROSTER_WITH_FOUNDER.length).toBe(53);
    expect(FULL_PROFILES_WITH_FOUNDER.length).toBe(53);
    expect(FULL_RECRUITMENT_WITH_FOUNDER.length).toBe(53);
    for (const original of FULL_ROSTER_WITH_CELESTIAL) expect(FULL_ROSTER_WITH_FOUNDER).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(founderOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(founderArchitectureComplete()).toBe(true);
  });

  it("recruits via legendaryMissions, gated on The Founder", () => {
    expect(PRIME_FOUNDER_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(PRIME_FOUNDER_RECRUITMENT.source).toBe("legendaryMissions");
    expect(PRIME_FOUNDER_RECRUITMENT.requirement).toContain("The Founder");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_FOUNDER, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(53);
    expect(rosterRuntime.tryRecruit(PRIME_FOUNDER_ID, new Set(["legendaryMissions"]))).toBe(true);
    expect(rosterRuntime.isRecruited(PRIME_FOUNDER_ID)).toBe(true);
  });

  it("carries the exact 6 dialogue lines from the spec", () => {
    const lines = PRIME_FOUNDER_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Let's bring everyone home.");
    expect(lines).toContain("You've all done more than I ever dreamed.");
    expect(lines).toContain("We've survived worse.");
    expect(lines).toContain("This... is Afterlight.");
    expect(lines).toContain("The future belongs to you now.");
    expect(lines).toContain("Not yet...");
    expect(lines.length).toBe(6);
  });

  it("holds exactly THIRTY relationships — one for every prior commander, per the spec's 'Every Commander recognises Atlas' — no invented or missing entries, no duplicates", () => {
    const targets = PRIME_FOUNDER_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets.length).toBe(30);
    expect(new Set(targets).size).toBe(30);
    for (const id of ALL_THIRTY_PRIOR_IDS) expect(targets).toContain(id);
    for (const id of targets) expect(ALL_THIRTY_PRIOR_IDS).toContain(id);
  });

  it("every relationship carries a non-empty dialogueHint", () => {
    for (const relationship of PRIME_FOUNDER_PROFILE.relationships) {
      expect(relationship.dialogueHint.length).toBeGreaterThan(0);
    }
  });

  it("adds a thirty-second real Codex commander entry, cross-referencing all thirty prior commanders' entries — the largest relatedEntryIds list in the roster", () => {
    expect(PRIME_FOUNDER_CODEX_ENTRY.relatedEntryIds.length).toBe(30);
    expect(new Set(PRIME_FOUNDER_CODEX_ENTRY.relatedEntryIds).size).toBe(30);
    for (const entryId of PRIME_FOUNDER_CODEX_ENTRY.relatedEntryIds) expect(entryId.startsWith("codex-commander-")).toBe(true);
    expect(PRIME_FOUNDER_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: PRIME_FOUNDER_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "vanguard-thrusters", "barrier-plate", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of PRIME_FOUNDER_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of PRIME_FOUNDER_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of PRIME_FOUNDER_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of PRIME_FOUNDER_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of PRIME_FOUNDER_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of PRIME_FOUNDER_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

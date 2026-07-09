import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_PHANTOM } from "../src/game/commanders/cmd012NyxKorven";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  FULL_PROFILES_WITH_BIOFORGE,
  FULL_RECRUITMENT_WITH_BIOFORGE,
  FULL_ROSTER_WITH_BIOFORGE,
  SYN_BIOFORGE_CODEX_ENTRY,
  SYN_BIOFORGE_COMMANDER,
  SYN_BIOFORGE_EXPANDED_PROFILE,
  SYN_BIOFORGE_ID,
  SYN_BIOFORGE_PROFILE,
  SYN_BIOFORGE_RECRUITMENT,
  SYN_BIOFORGE_RECRUITMENT_SOURCE_IS_REAL,
  bioforgeArchitectureComplete,
  bioforgeOverlapReport,
} from "../src/game/commanders/cmd013MiraSyn";

describe("Commander CMD-013 — Dr. Mira Syn 'The Bioforge' (AF-111)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(SYN_BIOFORGE_COMMANDER.name).toBe("Dr. Mira Syn");
    expect(SYN_BIOFORGE_COMMANDER.callsign).toBe("Bioforge");
    expect(SYN_BIOFORGE_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(SYN_BIOFORGE_EXPANDED_PROFILE.age).toBe(40);
    expect(SYN_BIOFORGE_EXPANDED_PROFILE.homeworld).toBe("Eden Genesis Station");
    expect(SYN_BIOFORGE_EXPANDED_PROFILE.personality).toBe("compassionate");
  });

  it("is added additively — the real 34-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_PHANTOM.length).toBe(34);
    expect(FULL_ROSTER_WITH_BIOFORGE.length).toBe(35);
    expect(FULL_PROFILES_WITH_BIOFORGE.length).toBe(35);
    expect(FULL_RECRUITMENT_WITH_BIOFORGE.length).toBe(35);
    for (const original of FULL_ROSTER_WITH_PHANTOM) expect(FULL_ROSTER_WITH_BIOFORGE).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(bioforgeOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(bioforgeArchitectureComplete()).toBe(true);
  });

  it("recruits via research, gated on The Last Seed", () => {
    expect(SYN_BIOFORGE_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(SYN_BIOFORGE_RECRUITMENT.source).toBe("research");
    expect(SYN_BIOFORGE_RECRUITMENT.requirement).toContain("Last Seed");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_BIOFORGE, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(35);
    expect(rosterRuntime.tryRecruit(SYN_BIOFORGE_ID, new Set(["research"]))).toBe(true);
    expect(rosterRuntime.isRecruited(SYN_BIOFORGE_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = SYN_BIOFORGE_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Life always finds another path.");
    expect(lines).toContain("Incredible... evolution never truly stops.");
    expect(lines).toContain("Even predators are part of nature.");
    expect(lines).toContain("Grow. Adapt. Endure.");
    expect(lines).toContain("Another world has a future.");
  });

  it("holds exactly the three spec'd relationships (Sol, Voss, Cael) — no relationship to Kane, Ryker, Drake, Vale, Iskander, Thorne, Vex, Ash, or Korven is invented", () => {
    const targets = SYN_BIOFORGE_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toEqual(["sol-resonant", "voss-pathfinder", "cael-weaver"]);
    for (const absent of ["kane-vanguard", "ryker-engineer", "drake-hunter", "vale-voidrunner", "iskander-swarmmaster", "thorne-starforged", "vex-chronomancer", "ash-tempest", "korven-phantom"]) expect(targets).not.toContain(absent);
  });

  it("adds a fourteenth real Codex commander entry, cross-referencing exactly the three related commanders' entries", () => {
    expect(SYN_BIOFORGE_CODEX_ENTRY.relatedEntryIds).toEqual(["codex-commander-sol-resonant", "codex-commander-voss-pathfinder", "codex-commander-cael-weaver"]);
    expect(SYN_BIOFORGE_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: SYN_BIOFORGE_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion", "vanguard-core"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of SYN_BIOFORGE_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of SYN_BIOFORGE_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of SYN_BIOFORGE_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of SYN_BIOFORGE_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of SYN_BIOFORGE_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of SYN_BIOFORGE_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

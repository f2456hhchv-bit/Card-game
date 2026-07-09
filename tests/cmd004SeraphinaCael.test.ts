import { describe, expect, it } from "vitest";
import { FULL_ROSTER_WITH_ENGINEER } from "../src/game/commanders/cmd003EliasRyker";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import {
  CAEL_WEAVER_CODEX_ENTRY,
  CAEL_WEAVER_COMMANDER,
  CAEL_WEAVER_EXPANDED_PROFILE,
  CAEL_WEAVER_ID,
  CAEL_WEAVER_PROFILE,
  CAEL_WEAVER_RECRUITMENT,
  CAEL_WEAVER_RECRUITMENT_SOURCE_IS_REAL,
  FULL_PROFILES_WITH_WEAVER,
  FULL_RECRUITMENT_WITH_WEAVER,
  FULL_ROSTER_WITH_WEAVER,
  weaverArchitectureComplete,
  weaverOverlapReport,
} from "../src/game/commanders/cmd004SeraphinaCael";

describe("Commander CMD-004 — Seraphina Cael 'The Quantum Weaver' (AF-102)", () => {
  it("matches the spec's identity fields exactly", () => {
    expect(CAEL_WEAVER_COMMANDER.name).toBe("Seraphina Cael");
    expect(CAEL_WEAVER_COMMANDER.callsign).toBe("Weaver");
    expect(CAEL_WEAVER_COMMANDER.faction).toBe("Afterlight Initiative");
    expect(CAEL_WEAVER_EXPANDED_PROFILE.age).toBe(34);
    expect(CAEL_WEAVER_EXPANDED_PROFILE.homeworld).toBe("Helios Quantum Institute");
    expect(CAEL_WEAVER_EXPANDED_PROFILE.personality).toBe("fearless");
  });

  it("is added additively — the real 25-commander roster is untouched", () => {
    expect(FULL_ROSTER_WITH_ENGINEER.length).toBe(25);
    expect(FULL_ROSTER_WITH_WEAVER.length).toBe(26);
    expect(FULL_PROFILES_WITH_WEAVER.length).toBe(26);
    expect(FULL_RECRUITMENT_WITH_WEAVER.length).toBe(26);
    for (const original of FULL_ROSTER_WITH_ENGINEER) expect(FULL_ROSTER_WITH_WEAVER).toContain(original);
  });

  it("is proven distinct from the entire existing roster via the real fingerprint/findOverlap law", () => {
    expect(weaverOverlapReport()).toEqual([]);
  });

  it("satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(weaverArchitectureComplete()).toBe(true);
  });

  it("recruits via research, a real AF-072 source, gated on The Impossible Equation", () => {
    expect(CAEL_WEAVER_RECRUITMENT_SOURCE_IS_REAL).toBe(true);
    expect(CAEL_WEAVER_RECRUITMENT.source).toBe("research");
    expect(CAEL_WEAVER_RECRUITMENT.requirement).toContain("Impossible Equation");
  });

  it("is genuinely recruitable through the real RosterRuntime", () => {
    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_WITH_WEAVER, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(26);
    expect(rosterRuntime.tryRecruit(CAEL_WEAVER_ID, new Set(["research"]))).toBe(true);
    expect(rosterRuntime.isRecruited(CAEL_WEAVER_ID)).toBe(true);
  });

  it("carries the exact 5 dialogue lines from the spec", () => {
    const lines = CAEL_WEAVER_EXPANDED_PROFILE.dialogueLibrary.map((d) => d.line);
    expect(lines).toContain("Reality is remarkably flexible.");
    expect(lines).toContain("Impossible... which means we're getting closer.");
    expect(lines).toContain("Let's see which universe favours us today.");
    expect(lines).toContain("Observe what possibility truly looks like.");
    expect(lines).toContain("Every answer creates a better question.");
  });

  it("holds relationships to all three prior commanders — Close Friend Voss, Professional Collaboration Ryker, Respect Kane", () => {
    const targets = CAEL_WEAVER_PROFILE.relationships.filter((r) => r.subject === "otherCommanders").map((r) => r.targetId);
    expect(targets).toContain("voss-pathfinder");
    expect(targets).toContain("ryker-engineer");
    expect(targets).toContain("kane-vanguard");
    expect(targets.length).toBe(3);
  });

  it("adds a fifth real Codex commander entry, cross-referencing all three prior commanders' entries", () => {
    expect(CAEL_WEAVER_CODEX_ENTRY.relatedEntryIds).toContain("codex-commander-voss-pathfinder");
    expect(CAEL_WEAVER_CODEX_ENTRY.relatedEntryIds).toContain("codex-commander-ryker-engineer");
    expect(CAEL_WEAVER_CODEX_ENTRY.relatedEntryIds).toContain("codex-commander-kane-vanguard");
    expect(CAEL_WEAVER_CODEX_ENTRY.unlock).toEqual({ kind: "collection", category: "commanders", id: CAEL_WEAVER_ID });
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const id of CAEL_WEAVER_EXPANDED_PROFILE.preferredShips) expect(realShipIds, `ship ${id}`).toContain(id);
    for (const id of CAEL_WEAVER_EXPANDED_PROFILE.preferredWeapons) expect(realWeaponIds, `weapon ${id}`).toContain(id);
    for (const id of CAEL_WEAVER_EXPANDED_PROFILE.preferredEquipment) expect(realEquipmentIds, `equipment ${id}`).toContain(id);
    for (const id of CAEL_WEAVER_EXPANDED_PROFILE.preferredRelics) expect(realRelicIds, `relic ${id}`).toContain(id);
    for (const id of CAEL_WEAVER_EXPANDED_PROFILE.preferredResearch) expect(realResearchIds, `research ${id}`).toContain(id);
    for (const id of CAEL_WEAVER_EXPANDED_PROFILE.preferredBiomes) expect(realBiomeIds, `biome ${id}`).toContain(id);
  });
});

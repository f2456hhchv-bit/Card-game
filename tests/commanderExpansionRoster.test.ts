import { describe, expect, it } from "vitest";
import { LAUNCH_ROSTER, RECRUITMENT_SOURCES, STARTING_COMMANDER_IDS } from "../src/game/commanders/rosterData";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { PERSONALITY_TRAITS } from "../src/game/commanders/commanderProductionData";
import {
  EXPANSION_COMMANDERS,
  EXPANSION_EXPANDED_PROFILES,
  EXPANSION_PROFILES,
  EXPANSION_RECRUITMENT_TABLE,
  FULL_COMMANDER_PROFILES,
  FULL_COMMANDER_ROSTER,
  FULL_RECRUITMENT_TABLE,
  expansionArchitectureComplete,
  expansionOverlapReport,
} from "../src/game/commanders/commanderExpansionRoster";

describe("Commander Roster Expansion, Batch 1 (AF-098 content)", () => {
  it("adds 8 new commanders additively — the real 14-commander launch roster is untouched", () => {
    expect(LAUNCH_ROSTER.length).toBe(14);
    expect(EXPANSION_COMMANDERS.length).toBe(8);
    expect(EXPANSION_PROFILES.length).toBe(8);
    expect(EXPANSION_EXPANDED_PROFILES.length).toBe(8);
    expect(FULL_COMMANDER_ROSTER.length).toBe(22);
    expect(FULL_COMMANDER_PROFILES.length).toBe(22);
    for (const original of LAUNCH_ROSTER) expect(FULL_COMMANDER_ROSTER).toContain(original);
  });

  it("every new commander is proven distinct from the ENTIRE existing roster via the real AF-030 fingerprint/findOverlap law", () => {
    expect(expansionOverlapReport()).toEqual([]);
  });

  it("every new commander satisfies AF-071's real 17-part architecture completeness function, unmodified", () => {
    expect(expansionArchitectureComplete()).toBe(true);
  });

  it("no two new commanders share an id, and none collides with an existing launch-roster id", () => {
    const allIds = FULL_COMMANDER_ROSTER.map((c) => c.id);
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it("every expanded profile's personality trait is a real, registered PersonalityTrait, and no two of the 8 repeat one", () => {
    const traits = EXPANSION_EXPANDED_PROFILES.map((p) => p.personality);
    for (const trait of traits) expect(PERSONALITY_TRAITS).toContain(trait);
    expect(new Set(traits).size).toBe(traits.length);
  });

  it("every expanded profile carries non-empty content for all 16 AF-098 new template fields — no placeholders", () => {
    for (const profile of EXPANSION_EXPANDED_PROFILES) {
      expect(profile.age).toBeGreaterThan(0);
      expect(profile.species.length).toBeGreaterThan(0);
      expect(profile.homeworld.length).toBeGreaterThan(0);
      expect(profile.psychologicalProfile.length).toBeGreaterThan(0);
      expect(profile.leadershipStyle.length).toBeGreaterThan(0);
      expect(profile.animationStyle.length).toBeGreaterThan(0);
      expect(profile.musicMotif.length).toBeGreaterThan(0);
      expect(profile.preferredShips.length).toBeGreaterThan(0);
      expect(profile.preferredWeapons.length).toBeGreaterThan(0);
      expect(profile.preferredEquipment.length).toBeGreaterThan(0);
      expect(profile.preferredRelics.length).toBeGreaterThan(0);
      expect(profile.preferredResearch.length).toBeGreaterThan(0);
      expect(profile.preferredBiomes.length).toBeGreaterThan(0);
      expect(profile.endingStory.length).toBeGreaterThan(0);
      expect(profile.dialogueLibrary.length).toBeGreaterThan(0);
      expect(profile.masteryChallenges.length).toBeGreaterThan(0);
    }
  });

  it("every dialogue line is genuine authored text, not a placeholder token", () => {
    for (const profile of EXPANSION_EXPANDED_PROFILES) {
      for (const entry of profile.dialogueLibrary) {
        expect(entry.line.length).toBeGreaterThan(5);
        expect(entry.line.toLowerCase()).not.toContain("todo");
        expect(entry.line.toLowerCase()).not.toContain("placeholder");
      }
    }
  });

  it("preferred ship/weapon/equipment/relic/research/biome ids all resolve against real, existing rosters", () => {
    const realShipIds = new Set(["wayfarer-hull-mk2", "bastion-hull-mk1", "aurelia-hull-mk1", "sable-dart-mk1", "falchion-mk2", "hivemother-mk1", "dawnspire", "ballista-mk3", "caduceus-mk1", "maelstrom-x1"]);
    const realWeaponIds = new Set(["coil-ripper", "coil-ripper-mk2", "novasplitter", "voidlance", "hailborn-array", "atlas-cluster-battery", "helios-prism-array", "paragon-flux-driver", "foundry-sunlance", "salvage-scattergun"]);
    const realEquipmentIds = new Set(["vanguard", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive", "bastion"]);
    const realRelicIds = new Set(["ember-core", "frost-shard", "cinder-heart", "gambler-die", "static-node", "conduit-loop", "warden-token", "singularity-keepsake", "veil-fragment"]);
    const realResearchIds = new Set(["focused-lattice", "coherent-beams", "harmonic-overload", "field-dynamics", "resonant-collectors", "survey-protocols", "deep-scanning", "unified-theory", "rapid-refit", "expanded-archives", "barrier-theory", "ancient-conduit", "warp-charting"]);
    const realBiomeIds = new Set(["ancient-core", "crystal-expanse", "derelict-expanse", "meridian-rest-frontier", "frozen-reach", "living-ecospheres", "machine-expanse", "singularity-zone", "solar-wastes", "void-expanse", "crystal-fields-alpha"]);

    for (const profile of EXPANSION_EXPANDED_PROFILES) {
      for (const id of profile.preferredShips) expect(realShipIds, `${profile.commanderId} ship ${id}`).toContain(id);
      for (const id of profile.preferredWeapons) expect(realWeaponIds, `${profile.commanderId} weapon ${id}`).toContain(id);
      for (const id of profile.preferredEquipment) expect(realEquipmentIds, `${profile.commanderId} equipment ${id}`).toContain(id);
      for (const id of profile.preferredRelics) expect(realRelicIds, `${profile.commanderId} relic ${id}`).toContain(id);
      for (const id of profile.preferredResearch) expect(realResearchIds, `${profile.commanderId} research ${id}`).toContain(id);
      for (const id of profile.preferredBiomes) expect(realBiomeIds, `${profile.commanderId} biome ${id}`).toContain(id);
    }
  });

  it("every new commander is genuinely recruitable through the REAL RosterRuntime, gated on a real AF-072 recruitment source", () => {
    expect(EXPANSION_RECRUITMENT_TABLE.length).toBe(8);
    for (const entry of EXPANSION_RECRUITMENT_TABLE) expect(RECRUITMENT_SOURCES, `${entry.commanderId} source ${entry.source}`).toContain(entry.source);
    expect(FULL_RECRUITMENT_TABLE.length).toBe(22);

    const rosterRuntime = new RosterRuntime(FULL_RECRUITMENT_TABLE, STARTING_COMMANDER_IDS);
    expect(rosterRuntime.snapshot.rosterSize).toBe(22);
    for (const entry of EXPANSION_RECRUITMENT_TABLE) expect(rosterRuntime.isRecruited(entry.commanderId)).toBe(false);

    const unlocked = new Set(EXPANSION_RECRUITMENT_TABLE.map((e) => e.source));
    for (const entry of EXPANSION_RECRUITMENT_TABLE) {
      const recruited = rosterRuntime.tryRecruit(entry.commanderId, unlocked);
      expect(recruited, `${entry.commanderId} should recruit once its source unlocks`).toBe(true);
    }
    expect(rosterRuntime.snapshot.recruitedCount).toBe(3 + 8); // starting trio + all 8 new commanders
  });

  it("faction diversity: the batch introduces or reinforces factions across the roster, none dominating", () => {
    const factionCounts = new Map<string, number>();
    for (const commander of EXPANSION_COMMANDERS) factionCounts.set(commander.faction, (factionCounts.get(commander.faction) ?? 0) + 1);
    for (const count of factionCounts.values()) expect(count).toBeLessThanOrEqual(2);
    expect(factionCounts.size).toBeGreaterThanOrEqual(5);
  });
});

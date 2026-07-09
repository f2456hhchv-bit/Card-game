import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  CONFLICT_STATES,
  FACTION_EVENT_KINDS,
  FACTION_IDS,
  REPUTATION_LEVELS,
  REPUTATION_LEVEL_THRESHOLDS,
  REPUTATION_MAX,
  REPUTATION_MIN,
  SANDBOX_FACTION_ROSTER,
} from "../src/game/factions/factionData";
import { FactionRuntime } from "../src/game/factions/FactionRuntime";
import { GALAXY_REGIONS } from "../src/game/galaxy/galaxyData";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";
import {
  CIVILISATION_REGISTER,
  EVOLUTION_DRIVER_REALISATION,
  FACTION_ACCESSIBILITY_SURFACES,
  FACTION_ARCHITECTURE_PARTS,
  FACTION_ECONOMY_SECTORS,
  FACTION_PROFILES,
  FACTION_REWARD_REALISATIONS,
  INSTRUMENT_TO_CONFLICT_STATE,
  PLAYER_INTERACTION_ROUTES,
  POLITICAL_INSTRUMENTS,
  RELATIONSHIP_EVOLUTION_DRIVERS,
  REPUTATION_TRACKS,
  TERRITORY_EFFECTS,
  factionArchitectureFor,
  factionEncyclopediaFor,
} from "../src/game/factions/factionFrameworkData";

function defFor(factionId: string) {
  return SANDBOX_FACTION_ROSTER.factions.find((f) => f.id === factionId)!;
}

describe("Faction Framework vocabulary — registered shelves (AF-085)", () => {
  it("registers fifteen architecture parts, ten civilisations, eight reputation tracks, eight interaction routes, six evolution drivers, seven political instruments, eight economy sectors, seven territory effects, nine reward realisations, seven accessibility surfaces", () => {
    expect(FACTION_ARCHITECTURE_PARTS.length).toBe(15);
    expect(CIVILISATION_REGISTER.length).toBe(10);
    expect(REPUTATION_TRACKS.length).toBe(8);
    expect(PLAYER_INTERACTION_ROUTES.length).toBe(8);
    expect(RELATIONSHIP_EVOLUTION_DRIVERS.length).toBe(6);
    expect(POLITICAL_INSTRUMENTS.length).toBe(7);
    expect(FACTION_ECONOMY_SECTORS.length).toBe(8);
    expect(TERRITORY_EFFECTS.length).toBe(7);
    expect(FACTION_REWARD_REALISATIONS.length).toBe(9);
    expect(FACTION_ACCESSIBILITY_SURFACES.length).toBe(7);
    for (const track of REPUTATION_TRACKS) expect(track.liveBinding.length, track.id).toBeGreaterThan(0);
    for (const route of PLAYER_INTERACTION_ROUTES) expect(route.liveBinding.length, route.id).toBeGreaterThan(0);
    for (const effect of TERRITORY_EFFECTS) expect(effect.liveBinding.length, effect.id).toBeGreaterThan(0);
    for (const reward of FACTION_REWARD_REALISATIONS) expect(reward.liveBinding.length, reward.id).toBeGreaterThan(0);
  });

  it("NO ELEVENTH FACTION: every civilisation is realised by an existing thing — a real AF-039 faction, a real codex civilisation, or the player's own organisation", () => {
    let player = 0;
    for (const civ of CIVILISATION_REGISTER) {
      if (civ.realisation.kind === "diplomatic") {
        expect([...FACTION_IDS]).toContain(civ.realisation.factionId);
      } else if (civ.realisation.kind === "enemyCivilisation") {
        const codexEntryId = civ.realisation.codexEntryId;
        expect(SANDBOX_CODEX_ENTRIES.some((e) => e.id === codexEntryId), civ.specId).toBe(true);
      } else {
        player += 1;
        expect(civ.specId).toBe("afterlightInitiative"); // the player IS the Initiative
      }
    }
    expect(player).toBe(1);
    // No diplomatic faction is claimed twice.
    const diplomaticIds = CIVILISATION_REGISTER.flatMap((c) => (c.realisation.kind === "diplomatic" ? [c.realisation.factionId] : []));
    expect(new Set(diplomaticIds).size).toBe(diplomaticIds.length);
  });

  it("the seven political instruments map TOTALLY onto AF-039's conflict states, and every evolution driver is realised by a conflict state or a faction event", () => {
    for (const instrument of POLITICAL_INSTRUMENTS) {
      expect([...CONFLICT_STATES]).toContain(INSTRUMENT_TO_CONFLICT_STATE[instrument]);
    }
    for (const driver of RELATIONSHIP_EVOLUTION_DRIVERS) {
      const realisation = EVOLUTION_DRIVER_REALISATION[driver];
      if ("conflictState" in realisation) expect([...CONFLICT_STATES]).toContain(realisation.conflictState);
      else expect([...FACTION_EVENT_KINDS]).toContain(realisation.factionEvent);
    }
  });
});

describe("Profiled civilisations — nothing remains undefined (AF-085 §Faction Architecture)", () => {
  it("all fifteen parts hold for every profiled faction, and every territory region is a REAL galaxy region", () => {
    expect(FACTION_PROFILES.length).toBe(SANDBOX_FACTION_ROSTER.factions.length); // every profiled faction carries the framework profile
    for (const profile of FACTION_PROFILES) {
      const def = defFor(profile.factionId);
      expect(def, profile.factionId).toBeDefined();
      const architecture = factionArchitectureFor(def, profile, SANDBOX_FACTION_ROSTER);
      for (const part of FACTION_ARCHITECTURE_PARTS) {
        expect(architecture[part], `${profile.factionId} missing ${part}`).toBe(true);
      }
      for (const region of def.territory) expect([...GALAXY_REGIONS]).toContain(region);
      for (const sector of profile.economySectors) expect([...FACTION_ECONOMY_SECTORS]).toContain(sector);
    }
  });

  it("NO FACTION OVERLAPS EXCESSIVELY: architecture, music, dialogue, signature reward, and economy emphasis are all unique across the profiled roster", () => {
    const architectures = new Set(FACTION_PROFILES.map((p) => p.architectureStyle));
    const music = new Set(FACTION_PROFILES.map((p) => p.musicTheme));
    const voices = new Set(FACTION_PROFILES.map((p) => p.dialogueVoice));
    const rewards = new Set(FACTION_PROFILES.map((p) => p.signatureRewardKind));
    const economies = new Set(FACTION_PROFILES.map((p) => [...p.economySectors].sort().join("+")));
    expect(architectures.size).toBe(FACTION_PROFILES.length);
    expect(music.size).toBe(FACTION_PROFILES.length);
    expect(voices.size).toBe(FACTION_PROFILES.length);
    expect(rewards.size).toBe(FACTION_PROFILES.length);
    expect(economies.size).toBe(FACTION_PROFILES.length);
  });

  it("the faction encyclopedia derives non-empty for every profiled civilisation — a viewer, not a system", () => {
    for (const profile of FACTION_PROFILES) {
      const encyclopedia = factionEncyclopediaFor(defFor(profile.factionId), profile);
      for (const [section, textValue] of Object.entries(encyclopedia)) {
        expect(textValue.length, `${profile.factionId} encyclopedia ${section}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("Reputation and politics through the REAL engine (AF-085 §Reputation / §Galactic Politics)", () => {
  it("the reputation ladder is monotone across its whole clamped range — level never falls as standing rises", () => {
    expect(REPUTATION_LEVEL_THRESHOLDS).toEqual([...REPUTATION_LEVEL_THRESHOLDS].sort((a, b) => a - b));
    let lastIndex = -1;
    for (let value = REPUTATION_MIN; value <= REPUTATION_MAX; value += 10) {
      const index = REPUTATION_LEVELS.indexOf(FactionRuntime.reputationLevel(value));
      expect(index).toBeGreaterThanOrEqual(lastIndex);
      lastIndex = index;
    }
    expect(FactionRuntime.reputationLevel(REPUTATION_MIN)).toBe("hostile");
    expect(FactionRuntime.reputationLevel(REPUTATION_MAX)).toBe("legendaryAlly");
  });

  it("political instruments drive the REAL relationship engine: symmetric, self-allied, default-backed", () => {
    const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(7));
    expect(runtime.relationshipBetween("humanAlliance", "humanAlliance")).toBe("alliance"); // self
    expect(runtime.relationshipBetween("nomadFleet", "solarEmpire")).toBe(SANDBOX_FACTION_ROSTER.defaultRelationship); // default fallback
    runtime.setRelationship("humanAlliance", "nomadFleet", INSTRUMENT_TO_CONFLICT_STATE.militaryAlliances);
    expect(runtime.relationshipBetween("nomadFleet", "humanAlliance")).toBe("alliance"); // symmetric, either direction
    runtime.setRelationship("mercenaryGuild", "humanAlliance", INSTRUMENT_TO_CONFLICT_STATE.embargoes);
    expect(runtime.relationshipBetween("humanAlliance", "mercenaryGuild")).toBe("coldWar");
  });

  it("FACTIONS EVOLVE WITHOUT THE PLAYER: the event engine fires on time alone, deterministically per seed", () => {
    const a = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(11), 1000);
    const b = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(11), 1000);
    const fired: string[] = [];
    for (let tick = 0; tick < 10; tick += 1) {
      a.update(500);
      b.update(500);
      const eventA = a.tryTriggerEvent();
      const eventB = b.tryTriggerEvent();
      expect(eventA).toBe(eventB); // same seed, same history — no player input involved
      if (eventA) fired.push(eventA);
    }
    expect(fired.length).toBeGreaterThan(0);
    for (const kind of fired) expect([...FACTION_EVENT_KINDS]).toContain(kind);
  });
});

describe("Faction Framework — self-review: simulate thousands of galaxies (AF-085 §Self Review Loop)", () => {
  it("1,000 seeded galaxies through the REAL FactionRuntime: symmetry and self-alliance never break, events stay on the shelf, counts never regress", () => {
    const profiledIds = FACTION_PROFILES.map((p) => p.factionId);
    const instruments = [...POLITICAL_INSTRUMENTS];
    for (let galaxy = 0; galaxy < 1000; galaxy += 1) {
      const rng = new Rng(galaxy);
      const runtime = new FactionRuntime(SANDBOX_FACTION_ROSTER, rng.fork("events"), 2000);
      let lastEvents = 0;
      for (let step = 0; step < 25; step += 1) {
        const a = profiledIds[Math.floor(rng.next() * profiledIds.length)]!;
        const b = profiledIds[Math.floor(rng.next() * profiledIds.length)]!;
        const instrument = instruments[Math.floor(rng.next() * instruments.length)]!;
        runtime.setRelationship(a, b, INSTRUMENT_TO_CONFLICT_STATE[instrument]);
        if (runtime.relationshipBetween(a, b) !== runtime.relationshipBetween(b, a)) {
          throw new Error(`galaxy ${galaxy}: symmetry broke`);
        }
        if (a !== b && runtime.relationshipBetween(a, b) !== INSTRUMENT_TO_CONFLICT_STATE[instrument]) {
          throw new Error(`galaxy ${galaxy}: instrument did not apply`);
        }
        if (runtime.relationshipBetween(a, a) !== "alliance") throw new Error(`galaxy ${galaxy}: self-alliance broke`);
        runtime.update(700);
        const kind = runtime.tryTriggerEvent();
        if (kind !== null && !FACTION_EVENT_KINDS.includes(kind)) throw new Error(`galaxy ${galaxy}: off-shelf event`);
        const snapshot = runtime.snapshot;
        if (snapshot.eventsTriggered < lastEvents) throw new Error(`galaxy ${galaxy}: event count regressed`);
        lastEvents = snapshot.eventsTriggered;
      }
    }
  });
});

import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { AUDIO_CATEGORIES, SANDBOX_AUDIO_CUES } from "../src/game/audio/audioData";
import { VoicePool } from "../src/game/audio/VoicePool";
import { distanceAttenuation } from "../src/game/audio/MusicState";
import {
  ADAPTIVE_MUSIC_DRIVERS,
  AUDIO_ACCESSIBILITY_SURFACES,
  AUDIO_ARCHITECTURE_PARTS,
  AUDIO_CUE_PROFILES,
  AUDIO_PERFORMANCE_DISCIPLINES,
  BIOME_SOUND_ELEMENTS,
  BOSS_MUSIC_STAGES,
  BOSS_MUSIC_STAGE_REALISATION,
  COMBAT_AUDIO_SIGNAL_MIN_PRIORITY,
  EXPLORATION_AUDIO_BINDINGS,
  FACTION_SOUND_ELEMENTS,
  PRIMARY_AUDIO_CATEGORIES,
  PRIMARY_AUDIO_CATEGORY_REALISATION,
  SPATIAL_AUDIO_SURFACES,
  VOICE_FRAMEWORK_SPEAKERS,
  adaptiveMusicLayersFor,
  audioArchitectureFor,
  biomeSoundIdentityFor,
  factionSoundIdentityFor,
  occlusionAttenuation,
  profileForCue,
} from "../src/game/audio/audioFrameworkData";

describe("Audio Framework vocabulary (AF-091)", () => {
  it("registers 11 architecture parts, 15 primary categories, 10 adaptive drivers, 7 biome + 8 faction sound elements, 8 combat signals, 7 exploration bindings, 6 boss stages, 8 spatial surfaces, 8 voice speakers, 7 accessibility + 5 performance surfaces", () => {
    expect(AUDIO_ARCHITECTURE_PARTS.length).toBe(11);
    expect(PRIMARY_AUDIO_CATEGORIES.length).toBe(15);
    expect(Object.keys(ADAPTIVE_MUSIC_DRIVERS).length).toBe(10);
    expect(BIOME_SOUND_ELEMENTS.length).toBe(7);
    expect(FACTION_SOUND_ELEMENTS.length).toBe(8);
    expect(Object.keys(COMBAT_AUDIO_SIGNAL_MIN_PRIORITY).length).toBe(8);
    expect(Object.keys(EXPLORATION_AUDIO_BINDINGS).length).toBe(7);
    expect(BOSS_MUSIC_STAGES.length).toBe(6);
    expect(Object.keys(SPATIAL_AUDIO_SURFACES).length).toBe(8);
    expect(Object.keys(VOICE_FRAMEWORK_SPEAKERS).length).toBe(8);
    expect(Object.keys(AUDIO_ACCESSIBILITY_SURFACES).length).toBe(7);
    expect(Object.keys(AUDIO_PERFORMANCE_DISCIPLINES).length).toBe(5);
  });

  it("12 of 15 primary categories realise onto AF-045's real AudioCategory shelf; 3 are honest new categories", () => {
    let existing = 0;
    let brandNew = 0;
    for (const category of PRIMARY_AUDIO_CATEGORIES) {
      const realisation = PRIMARY_AUDIO_CATEGORY_REALISATION[category];
      if (realisation.kind === "existing") {
        expect([...AUDIO_CATEGORIES], category).toContain(realisation.category);
        existing += 1;
      } else brandNew += 1;
    }
    expect(existing).toBe(12);
    expect(brandNew).toBe(3);
  });

  it("4 of 6 boss music stages reuse AF-045's real MusicState shelf; 2 are new", () => {
    let existing = 0;
    for (const stage of BOSS_MUSIC_STAGES) if (BOSS_MUSIC_STAGE_REALISATION[stage].kind === "existing") existing += 1;
    expect(existing).toBe(4);
  });
});

describe("Cue profiles — nothing left undefined (AF-091 §Audio Architecture)", () => {
  it("every real sandbox cue resolves a complete 11-part profile", () => {
    for (const cue of SANDBOX_AUDIO_CUES) {
      const profile = profileForCue(cue.id)!;
      expect(profile).toBeDefined();
      const architecture = audioArchitectureFor(cue, profile);
      for (const part of AUDIO_ARCHITECTURE_PARTS) expect(architecture[part], `${cue.id} missing ${part}`).toBe(true);
    }
    expect(AUDIO_CUE_PROFILES.length).toBe(SANDBOX_AUDIO_CUES.length);
  });
});

describe("Composed pure functions extend, never replace, AF-045's engine", () => {
  it("occlusionAttenuation multiplies distanceAttenuation's real output rather than reimplementing it", () => {
    const base = distanceAttenuation(50, 100);
    expect(occlusionAttenuation(base, false)).toBe(base);
    expect(occlusionAttenuation(base, true)).toBeLessThan(base);
    expect(occlusionAttenuation(base, true)).toBeGreaterThanOrEqual(0);
  });

  it("adaptiveMusicLayersFor rises with pressure and low health, bounded to [0,1]", () => {
    const calm = adaptiveMusicLayersFor({ hullFraction: 1, recentDiscovery: false, eliteOrBossPressure: false });
    const pressured = adaptiveMusicLayersFor({ hullFraction: 0.1, recentDiscovery: true, eliteOrBossPressure: true });
    expect(pressured.tension).toBeGreaterThan(calm.tension);
    expect(pressured.tension).toBeLessThanOrEqual(1);
    expect(pressured.lowHealthSting).toBe(true);
    expect(pressured.discoveryStinger).toBe(true);
    expect(calm.lowHealthSting).toBe(false);
  });

  it("biome/faction sound identities resolve complete for hand-authored AND generated ids alike", () => {
    for (const biomeId of ["crystal-fields-alpha", "frozen-reach", "some-future-biome"]) {
      const identity = biomeSoundIdentityFor(biomeId);
      for (const element of BIOME_SOUND_ELEMENTS) expect(identity[element].length, `${biomeId} ${element}`).toBeGreaterThan(0);
    }
    for (const factionId of ["crystalDominion", "machineCollective", "some-future-faction"]) {
      const identity = factionSoundIdentityFor(factionId);
      for (const element of FACTION_SOUND_ELEMENTS) expect(identity[element].length, `${factionId} ${element}`).toBeGreaterThan(0);
    }
  });
});

describe("Combat Audio priorities hold against AF-045's REAL VoicePool eviction (AF-091 §Combat Audio)", () => {
  it("a higher-priority combat signal always evicts a lower one, and gameplay-critical signals outrank ambient filler", () => {
    const pool = new VoicePool(1); // force contention
    pool.requestVoice("ambience", "ambient-bed", 1);
    const evicted = pool.requestVoice("ambience", "shield-alert", COMBAT_AUDIO_SIGNAL_MIN_PRIORITY.shieldDamage!);
    expect(evicted).not.toBeNull(); // shield damage (priority 8) evicts ambience (priority 1)
    expect(COMBAT_AUDIO_SIGNAL_MIN_PRIORITY.bossMechanics).toBeGreaterThan(COMBAT_AUDIO_SIGNAL_MIN_PRIORITY.statusEffects!);
  });
});

describe("Audio Framework — self-review (AF-091 §Self Review Loop)", () => {
  it("150 seeded rounds: adaptive layers stay bounded and occlusion never increases attenuation", () => {
    for (let seed = 0; seed < 150; seed += 1) {
      const rng = new Rng(seed);
      const hullFraction = rng.next();
      const base = distanceAttenuation(rng.next() * 100, 100);
      const layers = adaptiveMusicLayersFor({ hullFraction, recentDiscovery: rng.next() > 0.5, eliteOrBossPressure: rng.next() > 0.5 });
      if (layers.tension < 0 || layers.tension > 1) throw new Error(`seed ${seed}: tension out of bounds`);
      if (occlusionAttenuation(base, true) > base) throw new Error(`seed ${seed}: occlusion increased attenuation`);
    }
  });
});

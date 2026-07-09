/**
 * Audio Framework (AF-091). Extends AF-045's locked engine — AudioCueDef,
 * AudioCategory/Channel/MusicState, AudioMixer, VoicePool, AudioEngine,
 * resolveMusicState, distanceAttenuation — all untouched. Wraps cues in
 * profiles (the AF-071+ pattern) and adds composed, not competing, pure
 * functions for the spec's newly-named surfaces (occlusion, adaptive
 * layers, boss stages, biome/faction identities).
 */
import type { AudioCategory, AudioCueDef, MusicState } from "./audioData";
import { SANDBOX_AUDIO_CUES } from "./audioData";

/** 11-part Audio Architecture (AF-091 §Audio Architecture). */
export const AUDIO_ARCHITECTURE_PARTS = [
  "uniqueId",
  "category",
  "priority",
  "volumeProfile",
  "spatialBehaviour",
  "environmentalRules",
  "variationPool",
  "fadeRules",
  "accessibilityTags",
  "performanceBudget",
  "futureExpansionHooks",
] as const;
export type AudioArchitecturePart = (typeof AUDIO_ARCHITECTURE_PARTS)[number];

/** 15 primary categories (AF-091) — 12 realise onto AF-045's real
 * AudioCategory shelf; 3 (civilisations, discovery, narration) are new. */
export type PrimaryAudioCategoryRealisation = { kind: "existing"; category: AudioCategory } | { kind: "new" };

export const PRIMARY_AUDIO_CATEGORIES = ["music", "ambience", "combat", "weapons", "ships", "commanders", "ui", "civilisations", "creatures", "bosses", "weather", "environmentalHazards", "dialogue", "discovery", "narration"] as const;
export type PrimaryAudioCategory = (typeof PRIMARY_AUDIO_CATEGORIES)[number];

export const PRIMARY_AUDIO_CATEGORY_REALISATION: Readonly<Record<PrimaryAudioCategory, PrimaryAudioCategoryRealisation>> = {
  music: { kind: "existing", category: "music" },
  ambience: { kind: "existing", category: "ambience" },
  combat: { kind: "existing", category: "player" },
  weapons: { kind: "existing", category: "weapons" },
  ships: { kind: "existing", category: "shipSystems" },
  commanders: { kind: "existing", category: "commanderAbilities" },
  ui: { kind: "existing", category: "ui" },
  civilisations: { kind: "new" },
  creatures: { kind: "existing", category: "enemies" },
  bosses: { kind: "existing", category: "bosses" },
  weather: { kind: "existing", category: "weather" },
  environmentalHazards: { kind: "existing", category: "environmentalEffects" },
  dialogue: { kind: "existing", category: "voice" },
  discovery: { kind: "new" },
  narration: { kind: "new" },
};

/** 10 Adaptive Music drivers — each names its live (or future) source. */
export const ADAPTIVE_MUSIC_DRIVERS: Readonly<Record<string, string>> = {
  biome: "AF-036 BiomeDef id (live)",
  combatIntensity: "AF-045 resolveMusicState directorPhase input (live)",
  bossPhases: "AF-045 resolveMusicState bossActive/bossPhase input (live)",
  exploration: "AF-045 resolveMusicState gameState fallback (live)",
  discovery: "AF-087 CodexDiscoveryRuntime observed events (live)",
  factionPresence: "AF-039/085 dominant faction (live)",
  weather: "AF-036 biome weather cycle (live)",
  galaxyEvents: "AF-038/041 EnvironmentalEventTriggered (live)",
  playerHealth: "AF-021 DefenceState hull/shield fraction (live)",
  missionProgress: "AF-037/083 MissionRuntime snapshot (live)",
};

/** Composes with, never replaces, `resolveMusicState`: returns extra signal
 * layers a real backend crossfades on top of the base music state. */
export interface AdaptiveMusicLayers {
  tension: number; // 0–1, drives intensity mixing within the current MusicState
  discoveryStinger: boolean;
  lowHealthSting: boolean;
}

export function adaptiveMusicLayersFor(inputs: { hullFraction: number; recentDiscovery: boolean; eliteOrBossPressure: boolean }): AdaptiveMusicLayers {
  return {
    tension: inputs.eliteOrBossPressure ? 1 : inputs.hullFraction < 0.3 ? 0.7 : 0.3,
    discoveryStinger: inputs.recentDiscovery,
    lowHealthSting: inputs.hullFraction < 0.25,
  };
}

/** Biome Sound Identity — 7 elements (AF-091 §Biome Sound Identities). */
export const BIOME_SOUND_ELEMENTS = ["ambience", "instrumentation", "environmentalAudio", "wildlife", "mechanicalAmbience", "weather", "musicalMotifs"] as const;
export type BiomeSoundElement = (typeof BIOME_SOUND_ELEMENTS)[number];

export type BiomeSoundIdentity = Readonly<Record<BiomeSoundElement, string>>;

const BIOME_SOUND_IDENTITIES: Readonly<Record<string, BiomeSoundIdentity>> = {
  "crystal-fields-alpha": {
    ambience: "Glassy resonance beds, slow harmonic drift",
    instrumentation: "Bowed crystal, detuned bells",
    environmentalAudio: "Shard-cluster chimes on collision",
    wildlife: "None — crystalline, not biological",
    mechanicalAmbience: "Ancient console hum under the ice",
    weather: "Ion cloud static crackle",
    musicalMotifs: "Rising fourths, glass-harmonica lead",
  },
  "frozen-reach": {
    ambience: "Sparse wind, long silences",
    instrumentation: "Bowed low strings, breath tones",
    environmentalAudio: "Ice-creak, distant calving",
    wildlife: "None — the stillness is the point",
    mechanicalAmbience: "Frozen station groan",
    weather: "Gentle wind loops, snow hiss",
    musicalMotifs: "Slow, spaced single notes",
  },
};

/** Deterministic fallback — every biome not hand-authored still resolves a
 * complete identity, never left undefined. */
export function biomeSoundIdentityFor(biomeId: string): BiomeSoundIdentity {
  return (
    BIOME_SOUND_IDENTITIES[biomeId] ?? {
      ambience: `${biomeId} ambience bed (generated)`,
      instrumentation: `${biomeId} instrumentation (generated)`,
      environmentalAudio: `${biomeId} environmental layer (generated)`,
      wildlife: `${biomeId} wildlife layer (generated)`,
      mechanicalAmbience: `${biomeId} mechanical layer (generated)`,
      weather: `${biomeId} weather layer (generated)`,
      musicalMotifs: `${biomeId} motif (generated)`,
    }
  );
}

/** Faction Sound Identity — 8 elements (AF-091 §Faction Sound Identities). */
export const FACTION_SOUND_ELEMENTS = ["musicalThemes", "technologySounds", "weaponIdentity", "uiIdentity", "communications", "shipAudio", "victoryTheme", "defeatTheme"] as const;
export type FactionSoundElement = (typeof FACTION_SOUND_ELEMENTS)[number];

export type FactionSoundIdentity = Readonly<Record<FactionSoundElement, string>>;

const FACTION_SOUND_IDENTITIES: Readonly<Record<string, FactionSoundIdentity>> = {
  crystalDominion: {
    musicalThemes: "Sustained glass-harmonic chords",
    technologySounds: "Resonant hum, no mechanical clicks",
    weaponIdentity: "Crystalline chime discharge",
    uiIdentity: "Soft bell confirmations",
    communications: "Plural, slightly out-of-phase voices",
    shipAudio: "Grown-hull resonance, not engines",
    victoryTheme: "Rising harmonic resolve",
    defeatTheme: "Dissonant fade, no percussion",
  },
  machineCollective: {
    musicalThemes: "Interlocking mechanical rhythms",
    technologySounds: "Servo clicks, relay clatter",
    weaponIdentity: "Repeating percussive fire",
    uiIdentity: "Precise digital ticks",
    communications: "Flat, literal synthesized voice",
    shipAudio: "Foundry-block engine drone",
    victoryTheme: "Mechanical fanfare, no swell",
    defeatTheme: "Abrupt cutoff, no lament",
  },
};

export function factionSoundIdentityFor(factionId: string): FactionSoundIdentity {
  return (
    FACTION_SOUND_IDENTITIES[factionId] ?? {
      musicalThemes: `${factionId} theme (generated)`,
      technologySounds: `${factionId} tech layer (generated)`,
      weaponIdentity: `${factionId} weapon layer (generated)`,
      uiIdentity: `${factionId} UI layer (generated)`,
      communications: `${factionId} comms layer (generated)`,
      shipAudio: `${factionId} ship layer (generated)`,
      victoryTheme: `${factionId} victory sting (generated)`,
      defeatTheme: `${factionId} defeat sting (generated)`,
    }
  );
}

/** 8 Combat Audio signals, each with a MINIMUM priority — proven against
 * AF-045's REAL VoicePool eviction rule (higher priority always survives). */
export const COMBAT_AUDIO_SIGNAL_MIN_PRIORITY: Readonly<Record<string, number>> = {
  incomingDanger: 7,
  criticalHits: 6,
  statusEffects: 4,
  shieldDamage: 8,
  hullDamage: 9,
  eliteEnemies: 5,
  bossMechanics: 10,
  environmentalHazards: 6,
};

/** 7 Exploration Audio kinds, each naming its live trigger. */
export const EXPLORATION_AUDIO_BINDINGS: Readonly<Record<string, string>> = {
  discoveryStingers: "AF-087 CodexDiscoveryRuntime.recordObserved",
  ancientActivation: "AF-050/082 ancient-technology research thread",
  hiddenSecrets: "AF-036 biome interactables",
  scientificDiscoveries: "AF-024/081 ResearchUnlocked",
  resourceGathering: "AF-023 LootDropped",
  scanning: "AF-036 biome scan interactables",
  environmentalStorytelling: "AF-087 entry lore layers",
};

/** 6 Boss Music stages — 4 reuse AF-045's real MusicState shelf, 2 are new. */
export type BossMusicStageRealisation = { kind: "existing"; state: MusicState } | { kind: "new" };

export const BOSS_MUSIC_STAGES = ["introduction", "phaseOne", "phaseTransition", "finalPhase", "victory", "aftermath"] as const;
export type BossMusicStage = (typeof BOSS_MUSIC_STAGES)[number];

export const BOSS_MUSIC_STAGE_REALISATION: Readonly<Record<BossMusicStage, BossMusicStageRealisation>> = {
  introduction: { kind: "existing", state: "bossIntroduction" },
  phaseOne: { kind: "existing", state: "bossPhase" },
  phaseTransition: { kind: "new" },
  finalPhase: { kind: "existing", state: "bossPhase" },
  victory: { kind: "existing", state: "victory" },
  aftermath: { kind: "new" },
};

/** 8 Spatial Audio surfaces — 1 already live via `distanceAttenuation`. */
export const SPATIAL_AUDIO_SURFACES: Readonly<Record<string, boolean>> = {
  positioning3d: false,
  occlusion: true, // this module's own occlusionAttenuation, below
  distanceAttenuation: true, // AF-045's real function
  environmentalReflections: false,
  largeStructureAcoustics: false,
  undergroundAcoustics: false,
  shipInteriors: false,
  planetaryAtmospheres: false,
};

/** Composes with AF-045's `distanceAttenuation` — occlusion multiplies the
 * existing falloff rather than replacing it. */
export function occlusionAttenuation(baseAttenuation: number, occluded: boolean): number {
  return occluded ? baseAttenuation * 0.35 : baseAttenuation;
}

/** 8 Voice Framework speaker kinds, each naming its live source. */
export const VOICE_FRAMEWORK_SPEAKERS: Readonly<Record<string, string>> = {
  commanders: "AF-030 commander register",
  missionControl: "AF-037/083 mission briefing text",
  civilisations: "AF-085 FactionProfileDef.dialogueVoice",
  scientists: "AF-082 laboratory register",
  military: "AF-039 faction military field",
  aiSystems: "AF-047 Machine Collective content",
  ancientRecords: "AF-087 CodexLoreLayers.recoveredArchives",
  emergencyBroadcasts: "AF-041 WorldEventRuntime events",
};

/** 7 Accessibility surfaces — Audio Sliders already live via AF-044/045. */
export const AUDIO_ACCESSIBILITY_SURFACES: Readonly<Record<string, boolean>> = {
  subtitleSystem: false,
  audioSliders: true,
  monoAudio: false,
  visualAudioIndicators: false,
  frequencyFilters: false,
  dynamicRangeCompression: false,
  hearingAccessibility: false,
};

/** 5 Performance disciplines — 3 already live via AF-045's VoicePool/Mixer. */
export const AUDIO_PERFORMANCE_DISCIPLINES: Readonly<Record<string, boolean>> = {
  poolAudioSources: true, // VoicePool
  reuseAmbience: false,
  streamMusic: false,
  optimiseSimultaneousVoices: true, // VoicePool maxVoicesPerCategory
  prioritiseGameplaySounds: true, // VoicePool priority eviction
};

/** The AF-091 profile — wraps an AF-045 AudioCueDef by id; the def is never
 * modified. Carries the 7 architecture parts AF-045 doesn't have. */
export interface AudioCueProfileDef {
  cueId: string;
  volumeProfile: string;
  spatialBehaviour: string;
  environmentalRules: string;
  variationPool: readonly string[];
  fadeRules: string;
  accessibilityTags: readonly string[];
  performanceBudget: string;
  futureExpansionHooks: readonly string[];
}

export const AUDIO_CUE_PROFILES: readonly AudioCueProfileDef[] = SANDBOX_AUDIO_CUES.map((cue) => ({
  cueId: cue.id,
  volumeProfile: `${cue.channel}-channel, priority ${cue.priority}`,
  spatialBehaviour: cue.category === "ambience" || cue.category === "weather" ? "non-positional bed" : "positional, distance-attenuated",
  environmentalRules: "ducks under higher-priority voices in the same category",
  variationPool: [`${cue.id}-a`, `${cue.id}-b`],
  fadeRules: cue.channel === "music" ? "crossfade 800ms" : "hard cut",
  accessibilityTags: ["subtitleReady"],
  performanceBudget: "1 voice slot",
  futureExpansionHooks: [`${cue.id}-variant-pool-expansion`],
}));

export function profileForCue(cueId: string): AudioCueProfileDef | null {
  return AUDIO_CUE_PROFILES.find((p) => p.cueId === cueId) ?? null;
}

/** "Nothing remains undefined" — all 11 parts must hold for every cue. */
export function audioArchitectureFor(cue: AudioCueDef, profile: AudioCueProfileDef): Record<AudioArchitecturePart, boolean> {
  return {
    uniqueId: cue.id.length > 0,
    category: cue.category.length > 0,
    priority: cue.priority > 0,
    volumeProfile: profile.volumeProfile.length > 0,
    spatialBehaviour: profile.spatialBehaviour.length > 0,
    environmentalRules: profile.environmentalRules.length > 0,
    variationPool: profile.variationPool.length > 0,
    fadeRules: profile.fadeRules.length > 0,
    accessibilityTags: profile.accessibilityTags.length > 0,
    performanceBudget: profile.performanceBudget.length > 0,
    futureExpansionHooks: profile.futureExpansionHooks.length > 0,
  };
}

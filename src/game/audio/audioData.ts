/**
 * Audio Framework data shapes (AF-045). No audio asset pipeline exists yet
 * (AF-002/006 visual assets are similarly still placeholder) — this module
 * builds the real, testable routing/mixing/priority engine and wires it to
 * events that already fire on the bus (AF-001 §7) or already-existing
 * composition-root call sites, so zero new gameplay signaling was needed.
 * Audio Channels reuse AF-044's three-slider Settings model as their seed
 * (`AudioMixer.fromSettings`) rather than inventing a second volume store.
 */
export const AUDIO_CATEGORIES = [
  "music",
  "ambience",
  "weapons",
  "projectiles",
  "enemies",
  "eliteEnemies",
  "bosses",
  "player",
  "commanderAbilities",
  "shipSystems",
  "ui",
  "menus",
  "notifications",
  "research",
  "crafting",
  "galaxyMap",
  "environmentalEffects",
  "weather",
  "voice",
] as const;
export type AudioCategory = (typeof AUDIO_CATEGORIES)[number];

export const AUDIO_CHANNELS = ["master", "music", "effects", "voice", "ui", "ambient", "notifications"] as const;
export type AudioChannel = (typeof AUDIO_CHANNELS)[number];

export const MUSIC_STATES = [
  "galaxyCommand",
  "exploration",
  "combat",
  "heavyCombat",
  "eliteEncounter",
  "bossIntroduction",
  "bossPhase",
  "victory",
  "defeat",
  "research",
  "crafting",
  "credits",
  // GP-002: "bossPhase" was the one generic cue for every phase past the
  // first two — with a real 3rd/4th boss phase now, "Chaos"/"Signature" each
  // get their own distinct cue instead of sharing the second phase's music.
  "bossPhaseChaos",
  "bossPhaseSignature",
] as const;
export type MusicState = (typeof MUSIC_STATES)[number];

export interface AudioCueDef {
  id: string;
  category: AudioCategory;
  channel: AudioChannel;
  /** Higher priority cues evict lower-priority ones in the same category when voice-limited. */
  priority: number;
  /** Which existing bus fact or composition-root call site fires this — informational, doubles as Subtitle Support text. */
  triggerSource: string;
  description: string;
}

/** Sandbox cues — one per AF-045 §Player Feedback example, each wired at a
 * real, already-existing bus fact or call site; zero new signaling. */
export const SANDBOX_AUDIO_CUES: readonly AudioCueDef[] = [
  {
    id: "cue-critical-hit",
    category: "weapons",
    channel: "effects",
    priority: 6,
    triggerSource: "DamageDealt (critical: true)",
    description: "A sharper, higher-pitched hit confirmation.",
  },
  {
    id: "cue-shield-break",
    category: "player",
    channel: "effects",
    priority: 8,
    triggerSource: "ShieldBroken",
    description: "A distinct, learned-instantly shield-collapse sting.",
  },
  {
    id: "cue-level-up",
    category: "ui",
    channel: "ui",
    priority: 7,
    triggerSource: "CommanderLevelUp",
    description: "An ascending progression fanfare.",
  },
  {
    id: "cue-legendary-drop",
    category: "notifications",
    channel: "notifications",
    priority: 9,
    triggerSource: "LootDropped (rarity: legendary or higher)",
    description: "A rare, unmistakable drop chime.",
  },
  {
    id: "cue-boss-spawn",
    category: "bosses",
    channel: "music",
    priority: 10,
    triggerSource: "spawnBoss() composition-root call site",
    description: "The Boss Introduction sting that also cues the music transition.",
  },
  {
    id: "cue-mission-complete",
    category: "notifications",
    channel: "notifications",
    priority: 8,
    triggerSource: "RunEnded (result: victory)",
    description: "A resolving, hopeful completion theme sting.",
  },
  {
    id: "cue-mission-failed",
    category: "notifications",
    channel: "notifications",
    priority: 8,
    triggerSource: "RunEnded (result: defeat)",
    description: "A subdued, non-punitive failure sting — defeat still pays (AF-026).",
  },
  {
    id: "cue-enemy-death",
    category: "enemies",
    channel: "effects",
    priority: 3,
    triggerSource: "EnemyKilled (elite: false, boss: false)",
    description: "A short, low-priority death confirmation — never crowds out combat clarity.",
  },
  {
    id: "cue-elite-death",
    category: "eliteEnemies",
    channel: "effects",
    priority: 5,
    triggerSource: "EnemyKilled (elite: true)",
    description: "A heavier death confirmation — Elite kills should read as more significant.",
  },
  {
    id: "cue-research-complete",
    category: "research",
    channel: "ui",
    priority: 5,
    triggerSource: "ResearchUnlocked",
    description: "A technological, forward-motion confirmation.",
  },
  {
    id: "cue-craft-success",
    category: "crafting",
    channel: "ui",
    priority: 5,
    triggerSource: "ItemCrafted",
    description: "A mechanical, satisfying completion sound.",
  },
  {
    id: "cue-achievement",
    category: "notifications",
    channel: "notifications",
    priority: 7,
    triggerSource: "ChallengeCompleted / AccountLevelUp / Achievement completion (AF-042)",
    description: "A celebratory but brief sting — knowledge/mastery, not a interruption.",
  },
];

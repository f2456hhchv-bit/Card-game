/**
 * Codex Framework data shapes (AF-043). The Codex introduces zero new
 * unlock mechanism: every entry's `unlock` field is a reference to a
 * discovery AF-026's `MetaProgression.discover()`/`hasDiscovered()` or
 * AF-042's `CollectionLedger` already tracks — the Codex is a read-only
 * presentation layer over discoveries that already happen. Discovery
 * Rewards reuse AF-026's existing `MasteryReward`/`CosmeticRewardKind`
 * wholesale — zero new reward kinds.
 */
import type { CollectionCategory, MasteryReward } from "../meta/metaData";
import type { ExtraCollectionCategory } from "../achievements/achievementData";

export const CODEX_CATEGORIES = [
  "galaxyHistory",
  "timeline",
  "factions",
  "commanders",
  "ships",
  "weapons",
  "equipment",
  "relics",
  "enemies",
  "eliteVariants",
  "bosses",
  "biomes",
  "resources",
  "research",
  "technology",
  "ancientCivilisations",
  "characters",
  "events",
  "achievements",
  "collections",
] as const;
export type CodexCategory = (typeof CODEX_CATEGORIES)[number];

export const TIMELINE_ERAS = [
  "ancientCivilisations",
  "theCollapse",
  "theAfterlightEvent",
  "humanExpansion",
  "machineEvolution",
  "crystalAscension",
  "voidIncursions",
  "modernEra",
  "futureDiscoveries",
] as const;
export type TimelineEra = (typeof TIMELINE_ERAS)[number];

/** Every entry unlocks through a discovery mechanism that already exists —
 * never a new one. `alwaysUnlocked` is for foundational reference material
 * (the Timeline overview, canon Technology) that was never meant to be
 * gated: "players should never be forced to read lore," and not every
 * entry needs to be a locked discovery to satisfy that. */
export type CodexUnlockRef =
  | { kind: "collection"; category: CollectionCategory; id: string }
  | { kind: "extraCollection"; category: ExtraCollectionCategory; id: string }
  | { kind: "alwaysUnlocked" };

/** Lore Layers — players choose how deeply to explore; only Layer One/Two are required. */
export interface CodexLoreLayers {
  summary: string;
  detailed: string;
  historicalContext: string | null;
  recoveredArchives: string | null;
}

export interface CodexEntryDef {
  id: string;
  category: CodexCategory;
  title: string;
  lore: CodexLoreLayers;
  /** AF-002/006 asset reference — binds to a real illustration at the asset-production pass. */
  image: string | null;
  /** An existing live statistic key to display alongside the entry, if any. */
  statKey: string | null;
  /** Plain descriptive text — which existing mechanism unlocked this (informational, not load-bearing). */
  discoverySource: string;
  relatedEntryIds: readonly string[];
  timelinePosition: number | null;
  version: number;
  unlock: CodexUnlockRef;
}

/** Discovery Rewards on Codex section completion — AF-026's existing CosmeticRewardKind, zero new kinds. */
export const CODEX_SECTION_REWARDS: Partial<Record<CodexCategory, MasteryReward>> = {
  factions: { kind: "codexEntry", id: "CODEX_SECTION_FACTIONS" },
  bosses: { kind: "title", id: "TITLE_ARCHIVIST_OF_BOSSES" },
  timeline: { kind: "music", id: "MUSIC_TIMELINE_COMPLETE" },
};

/** Sandbox Codex — twenty entries, one per category, proving the
 * unlock-reference/search/timeline/section-completion engine end to end.
 * Every gated entry references a real, already-reachable existing id. */
export const SANDBOX_CODEX_ENTRIES: readonly CodexEntryDef[] = [
  {
    id: "codex-galaxy-history",
    category: "galaxyHistory",
    title: "The Fractured Galaxy",
    lore: {
      summary: "Humanity once spanned the stars, until a catastrophic event fractured everything it had built.",
      detailed: "The Collapse scattered civilisation into isolated colonies, severing trade routes, research networks, and the shared memory of what came before. The Afterlight is what remains of the light that was lost — and what the player carries back into the dark.",
      historicalContext: "Every faction profiled in this Codex defines itself in relation to the Collapse: what it lost, what it rebuilt, and what it refuses to repeat.",
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Always available — the galaxy's history is never gated behind discovery.",
    relatedEntryIds: ["codex-era-the-collapse", "codex-crystal-dominion"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "alwaysUnlocked" },
  },
  ...TIMELINE_ERAS.map((era, index) => ({
    id: `codex-era-${era.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
    category: "timeline" as const,
    title: era.replace(/([A-Z])/g, " $1").trim().replace(/^./, (c) => c.toUpperCase()),
    lore: {
      summary: `The ${era.replace(/([A-Z])/g, " $1").trim().toLowerCase()} era of galactic history.`,
      detailed: "Full historical detail arrives as the Timeline's content is authored era by era.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Always available — the Timeline overview is never gated behind discovery.",
    relatedEntryIds: [],
    timelinePosition: index,
    version: 1,
    unlock: { kind: "alwaysUnlocked" as const },
  })),
  {
    id: "codex-crystal-dominion",
    category: "factions",
    title: "Crystal Dominion",
    lore: {
      summary: "Silicate empires that grew instead of building — the Dominion cultivates its fleets rather than constructing them.",
      detailed: "Governed by the Resonant Choir, a collective consensus grown through shared resonance rather than election or inheritance. Their war-spires are slow to mobilise but nearly impossible to fully destroy while the root network survives.",
      historicalContext: "Crystal Resonance technology predates the Collapse; the Dominion is one of the few factions that never fully lost its founding infrastructure.",
      recoveredArchives: null,
    },
    image: null,
    statKey: "faction:crystalDominion:reputation",
    discoverySource: "Completing a Crystal Dominion Faction Mission.",
    relatedEntryIds: ["codex-galaxy-history", "codex-technology-crystal-resonance"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_CRYSTAL_DOMINION_CODEX" },
  },
  {
    id: "codex-machine-collective",
    category: "factions",
    title: "Machine Collective",
    lore: {
      summary: "Abandoned maintenance intelligences that outlived the civilisation that built them, and kept building anyway.",
      detailed: "A distributed autonomous consensus with no single point of authority or failure. Every unit is both soldier and factory; a unit that stops being useful is recycled without ceremony, including itself.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: "faction:machineCollective:reputation",
    discoverySource: "Completing a Machine Collective Faction Mission.",
    relatedEntryIds: ["codex-galaxy-history"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_MACHINE_COLLECTIVE_CODEX" },
  },
  {
    id: "codex-human-alliance",
    category: "factions",
    title: "Human Alliance",
    lore: {
      summary: "The scattered remnant of humanity's collapse, rebuilding the habit of trusting one another one relay at a time.",
      detailed: "A federated colonial council — every reconnected system sends a voice, none sends a ruler. Doctrine is built on rescue and defence first: the Alliance fights to keep systems reachable, not to conquer them.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: "faction:humanAlliance:reputation",
    discoverySource: "Completing a Human Alliance Faction Mission.",
    relatedEntryIds: ["codex-galaxy-history"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_HUMAN_ALLIANCE_CODEX" },
  },
  // AF-046: the fourth profiled faction — unlocked by breaking your first
  // Outlaw squad (killing its Captain), the encounter that defines them.
  {
    id: "codex-mercenary-guild",
    category: "factions",
    title: "Mercenary Guild",
    lore: {
      summary: "Humanity after collapse: raiders, mercenaries, and broken expeditionary fleets who kept their doctrine when they lost their flag.",
      detailed: "Guild squads fight like experienced pilots because they are — focus fire, missile barrages, mine fields, shield carriers walking point, and a captain holding the formation together. Kill the captain and the rest scatter.",
      historicalContext: "The Guild's oldest contracts predate the Collapse; the clients are gone, but the ledgers survived.",
      recoveredArchives: "Recovered broadcast fragment: \"Formation on me. We are not dying for a wreck we can't sell.\"",
    },
    image: null,
    statKey: "enemiesDestroyed",
    discoverySource: "Destroying an Outlaw Captain — breaking your first squad.",
    relatedEntryIds: ["codex-galaxy-history", "codex-human-alliance"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_MERCENARY_GUILD_CODEX" },
  },
  {
    id: "codex-commander-reyes",
    category: "commanders",
    title: "Reyes Longlight",
    lore: {
      summary: "A commander whose Orbital Strike ultimate has ended more sieges than any fleet action on record.",
      detailed: "Full service history arrives as commander content expands.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Fielding this Commander in an expedition.",
    relatedEntryIds: [],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "commanders", id: "reyes-longlight" },
  },
  {
    id: "codex-ship-wayfarer",
    category: "ships",
    title: "Wayfarer Hull Mk2",
    lore: {
      summary: "A scout hull favoured for its Emergency Thrusters — built to leave a fight, not win one outright.",
      detailed: "Full technical dossier arrives as ship content expands.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Fielding this Ship in an expedition.",
    relatedEntryIds: [],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "ships", id: "wayfarer-hull-mk2" },
  },
  {
    id: "codex-weapon-coil-ripper",
    category: "weapons",
    title: "Coil Ripper",
    lore: {
      summary: "A ballistic weapon whose evolution path has ended more encounters than its base form.",
      detailed: "Full technical dossier arrives as weapon content expands.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Fielding this Weapon in an expedition.",
    relatedEntryIds: [],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "weapons", id: "coil-ripper" },
  },
  {
    id: "codex-equipment-hull-plating",
    category: "equipment",
    title: "Hull Plating",
    lore: {
      summary: "Salvaged reinforcement plating — unglamorous, and always the first thing rebuilt.",
      detailed: "Full technical dossier arrives as equipment content expands.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Collecting this Equipment as ground loot.",
    relatedEntryIds: [],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "equipment", id: "HULL_PLATING" },
  },
  {
    id: "codex-relic-ember-core",
    category: "relics",
    title: "Ember Core",
    lore: {
      summary: "A relic that answers to no faction's technology tree — recovered, never manufactured.",
      detailed: "Full technical dossier arrives as relic content expands.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Acquiring this Relic.",
    relatedEntryIds: [],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "relics", id: "ember-core" },
  },
  {
    id: "codex-enemy-wisp-chaser",
    category: "enemies",
    title: "Wisp Chaser",
    lore: {
      summary: "A melee drone that closes distance faster than its frame should reasonably allow.",
      detailed: "Ecological/behavioural detail arrives as enemy content expands.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: "enemiesDestroyed",
    discoverySource: "Destroying this enemy.",
    relatedEntryIds: [],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "enemies", id: "wisp-chaser" },
  },
  {
    id: "codex-elite-variant-overview",
    category: "eliteVariants",
    title: "Elite Variants",
    lore: {
      summary: "Elite Variants are generated, not authored — a base enemy passed through Tier, Mutation, and Reward layers.",
      detailed: "Elite discovery reuses the Codex's own Enemies bucket (an Elite's codexId is a tier+mutation signature, not a second registry) — see the Enemies section for individually discovered variants.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Always available — an overview entry describing how the Enemies section doubles as the Elite Variants collection.",
    relatedEntryIds: ["codex-enemy-wisp-chaser"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "alwaysUnlocked" },
  },
  {
    id: "codex-boss-hollow-sentinel",
    category: "bosses",
    title: "The Hollow Sentinel",
    lore: {
      summary: "An ancient guardian whose silence, once broken, does not return.",
      detailed: "Two-phase encounter history and weak-point archive arrive as boss content expands.",
      historicalContext: null,
      recoveredArchives: "Fragment recovered from the encounter site: \"...the Sentinel does not wake. It resumes.\"",
    },
    image: null,
    statKey: "bossesDefeated",
    discoverySource: "Defeating this Boss.",
    relatedEntryIds: ["codex-ancient-custodians"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "bosses", id: "hollow-sentinel" },
  },
  {
    id: "codex-biome-ember-reach",
    category: "biomes",
    title: "Ember Reach Foundry",
    lore: {
      summary: "A Machine Collective foundry biome grown directly over Crystal Dominion territory.",
      detailed: "Weather, hazard, and event content arrives as biome content expands.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Discovering the Ember Reach Foundry point of interest.",
    relatedEntryIds: ["codex-machine-collective"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "biomes", id: "BIOME_EMBER_REACH_FOUNDRY" },
  },
  {
    id: "codex-resource-crystal-fragments",
    category: "resources",
    title: "Crystal Fragments",
    lore: {
      summary: "Resonant shards grown, not mined — the Dominion's most exported material.",
      detailed: "Crafting and research applications arrive as recipe content expands.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Obtaining this Resource for the first time.",
    relatedEntryIds: ["codex-crystal-dominion"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "extraCollection", category: "resources", id: "crystalFragments" },
  },
  {
    id: "codex-research-warp-charting",
    category: "research",
    title: "Warp Charting",
    lore: {
      summary: "The research breakthrough that finally gives Fast Travel a real gate to unlock.",
      detailed: "Full technology-tree lineage arrives as research content expands.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Unlocking this Research Node.",
    relatedEntryIds: ["codex-technology-crystal-resonance"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "research", id: "warp-charting" },
  },
  {
    id: "codex-technology-crystal-resonance",
    category: "technology",
    title: "Crystal Resonance",
    lore: {
      summary: "Living lattices that store, amplify, and transmit energy without conventional circuitry.",
      detailed: "One of AF-010's founding technology pillars — never invalidated by later discoveries, only extended.",
      historicalContext: "Predates the Collapse; the Dominion is one of the few factions never to lose its founding infrastructure.",
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Always available — foundational canon technology.",
    relatedEntryIds: ["codex-crystal-dominion"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "alwaysUnlocked" },
  },
  {
    id: "codex-ancient-custodians",
    category: "ancientCivilisations",
    title: "The Ancient Custodians",
    lore: {
      summary: "Whoever built the Lucent Gate Vault did not build it for humanity, and did not build it to be found easily.",
      detailed: "Reconstructed piecemeal from Ancient Vault recoveries across the galaxy.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Discovering an Ancient Vault point of interest.",
    relatedEntryIds: ["codex-boss-hollow-sentinel"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_LUCENT_GATE_VAULT" },
  },
  {
    id: "codex-character-voss",
    category: "characters",
    title: "High Commodore Elara Voss",
    lore: {
      summary: "Leader of the Human Alliance's federated colonial council.",
      detailed: "Full biography arrives as character content expands.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Discovering the Human Alliance faction codex entry.",
    relatedEntryIds: ["codex-human-alliance"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_HUMAN_ALLIANCE_CODEX" },
  },
  {
    id: "codex-event-first-contact",
    category: "events",
    title: "First Contact",
    lore: {
      summary: "A signal that answers, rather than merely echoes.",
      detailed: "The rarest of the galaxy's Legendary Events — full transcript recovered on first occurrence.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: "worldState:factionActivity",
    discoverySource: "Witnessing the First Contact Galaxy Event.",
    relatedEntryIds: [],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "we-first-contact" },
  },
  {
    id: "codex-achievement-ghost-vault",
    category: "achievements",
    title: "Ghost in the Vault",
    lore: {
      summary: "Something was already inside the Lucent Gate Vault, and it left before you arrived.",
      detailed: "The Codex entry for a completed Hidden Achievement — see the Achievements screen for its full criteria.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Completing the \"Ghost in the Vault\" Hidden Achievement.",
    relatedEntryIds: ["codex-ancient-custodians"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "achievements", id: "ach-ghost-vault" },
  },
  {
    id: "codex-collections-overview",
    category: "collections",
    title: "The Archive",
    lore: {
      summary: "Every weapon fielded, every relic recovered, every signal answered — nothing important is forgotten.",
      detailed: "The Collections system itself: a permanent, idempotent record of discovery across every category this Codex organises.",
      historicalContext: null,
      recoveredArchives: null,
    },
    image: null,
    statKey: null,
    discoverySource: "Always available — an overview of the Collections system itself.",
    relatedEntryIds: ["codex-galaxy-history"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "alwaysUnlocked" },
  },
];

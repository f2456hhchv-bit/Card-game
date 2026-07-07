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
  // AF-050: the sixth profiled faction's doctrine entry — unlocked by
  // destroying your first Shield Architect, the network node whose loss
  // caps the site's escalation. A separate, older entry (`codex-ancient-
  // custodians`, category ancientCivilisations, from Ancient Vault
  // discovery) already covers who they are; this one covers how they fight.
  {
    id: "codex-ancient-security-doctrine",
    category: "enemies",
    title: "Ancient Security Doctrine",
    lore: {
      summary: "They did not build the Afterlight Network to be found. They built it to be kept.",
      detailed: "A Custodian site escalates in five measured stages — Minor Trespass, Warning, Containment, Guardian Deployment, Maximum Response — climbing for as long as you linger and standing down the moment you leave. It is not aggression. It is a security system that has never once needed to improvise.",
      historicalContext: "The precursor civilisation that raised the Network is gone. Its last order to the Custodians was never rescinded, and nothing since has outranked it.",
      recoveredArchives: "Recovered glyph translation, partial: \"...preserve. Not pursue. Preserve.\"",
    },
    image: null,
    statKey: "enemiesDestroyed",
    discoverySource: "Destroying a Shield Architect — breaking your first defence grid.",
    relatedEntryIds: ["codex-ancient-custodians"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_ANCIENT_CUSTODIANS_CODEX" },
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
  // AF-047: Machine Collective combat doctrine — unlocked by taking your
  // first Command Core offline, the encounter that reveals the network.
  {
    id: "codex-machine-network",
    category: "enemies",
    title: "Machine Network Doctrine",
    lore: {
      summary: "The Collective does not field soldiers. It fields a network wearing soldiers.",
      detailed: "Target Synchronisation, Shared Shields, Self Repair, and mid-battle drone fabrication all route through a Command Core. Take the core offline and the machines do not flee — they simply stop being more than the sum of their parts.",
      historicalContext: "The war network predates the Collapse; what survived kept optimising without anyone left to give it objectives.",
      recoveredArchives: "Recovered process log: \"UNIT LOSS 0.4% — WITHIN PARAMETERS. CONTINUE.\"",
    },
    image: null,
    statKey: "enemiesDestroyed",
    discoverySource: "Destroying a Machine Command Core — degrading your first network.",
    relatedEntryIds: ["codex-machine-collective"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_MACHINE_NETWORK_DOCTRINE" },
  },
  // AF-048: Crystal Ascendancy resonance doctrine — unlocked by taking your
  // first Resonance Node offline, the encounter that reveals the ecosystem.
  {
    id: "codex-crystal-resonance",
    category: "enemies",
    title: "Resonance Doctrine",
    lore: {
      summary: "No crystal fights alone. Every one nearby is a little stronger for the others still standing.",
      detailed: "Healing, shielding, damage, and speed all scale continuously with how many resonance nodes remain alive — there is no threshold to cross, only a strength that rises and falls with every kill. Destroy the nodes and the ecosystem measurably weakens, node by node.",
      historicalContext: "The Dominion's growths predate any war they were built for; they simply never stopped tuning themselves to each other.",
      recoveredArchives: "Field note: \"Killed the small one. The big one hit noticeably softer after.\"",
    },
    image: null,
    statKey: "enemiesDestroyed",
    discoverySource: "Destroying a Crystal Resonance Node — weakening your first ecosystem.",
    relatedEntryIds: ["codex-crystal-dominion"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_CRYSTAL_RESONANCE_ARCHIVE" },
  },
  // AF-049: Void Swarm corruption doctrine — unlocked by taking your first
  // Void Beacon offline. Deliberately not related to a faction profile: the
  // Swarm is not a civilisation, so it gets no AF-039 FactionDef entry.
  {
    id: "codex-void-corruption",
    category: "enemies",
    title: "Corruption Doctrine",
    lore: {
      summary: "It is not an army. It is a condition, and the Beacon is where the condition takes root.",
      detailed: "Corruption climbs for as long as a Beacon survives, and only a Beacon's death rolls it back — the Swarm has no captain to break and no core to degrade, only time it is allowed to keep.",
      historicalContext: "No record explains where it began. Every record agrees it has never once retreated for good.",
      recoveredArchives: "Recovered fragment, sender unknown: \"Contained. For now. It does not know the word 'now'.\"",
    },
    image: null,
    statKey: "enemiesDestroyed",
    discoverySource: "Destroying a Void Beacon — rolling back your first corruption.",
    relatedEntryIds: [],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_VOID_CORRUPTION_ARCHIVE" },
  },
  // AF-051: Xenomorph Hive evolution doctrine — unlocked by taking your
  // first Evolution Node offline. Like AF-049's Void Swarm, the Hive is not
  // a civilisation, so it gets no AF-039 FactionDef; the two share a
  // cross-reference here as the galaxy's other non-civilisation threats.
  {
    id: "codex-xenomorph-hive",
    category: "enemies",
    title: "Hive Evolution Doctrine",
    lore: {
      summary: "It does not remember losing. It only remembers what worked, and it never stops working.",
      detailed: "Every death feeds the Hive's Biomass — its own losses included — and Biomass never falls, only rises toward the next Evolution Stage. There is no core to break and no timer to outlast. The only thing that can be cut is a Node's link to what's nearby, and even that never touches what the Hive has already become.",
      historicalContext: "No one engineered the Hive to stop evolving, because no one expected it to still be here to ask.",
      recoveredArchives: "Recovered field log: \"Killed the big one. Ten minutes later the small ones hit like the big one did.\"",
    },
    image: null,
    statKey: "enemiesDestroyed",
    discoverySource: "Destroying an Evolution Node — severing your first Hive network link.",
    relatedEntryIds: ["codex-void-corruption"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_XENOMORPH_HIVE_CODEX" },
  },
  // AF-052: the seventh profiled faction — unlocked by destroying your
  // first Command Ship, the encounter that reveals the fleet's cohesion.
  {
    id: "codex-nomad-fleet",
    category: "factions",
    title: "Stellar Nomads",
    lore: {
      summary: "No two Nomad hulls match, and every one of them still flies.",
      detailed: "Harpoons, Deployable Turrets, and Scrap Shields — a Nomad fleet fights with whatever the last derelict provided, coordinated by Scrap they salvage mid-battle rather than any standing network. Drop the Command Ship and the fleet doesn't break; it just stops earning as fast.",
      historicalContext: "Some convoys have been moving since the Collapse itself and never once considered stopping.",
      recoveredArchives: "Recovered broadcast: \"Command's down. Keep salvaging — we're still flying.\"",
    },
    image: null,
    statKey: "enemiesDestroyed",
    discoverySource: "Destroying a Nomad Command Ship — disrupting your first fleet's cohesion.",
    relatedEntryIds: ["codex-galaxy-history"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_NOMAD_FLEET_CODEX" },
  },
  // AF-053: Paragon Protocol containment doctrine — unlocked by taking your
  // first Containment Sentinel offline. Belongs to no civilisation (pre-
  // Collapse abandoned military research), so it gets no AF-039 FactionDef,
  // the same way AF-049's Void Swarm and AF-051's Xenomorph Hive didn't.
  {
    id: "codex-paragon-protocol",
    category: "enemies",
    title: "Containment Doctrine",
    lore: {
      summary: "Every safety interlock on this programme was bypassed on purpose, more than once, by people who are gone now.",
      detailed: "Reactor Stability holds a Paragon unit's Adaptive Shields up — and it only ever falls, cracked further by every hit it takes, until Containment Collapse fires once and never again. What comes out the other side is not weaker.",
      historicalContext: "No one who approved this research survived to explain what they were hoping to contain.",
      recoveredArchives: "Recovered lab note, final entry: \"Containment holding. Recommend immediate shutdown. Denied.\"",
    },
    image: null,
    statKey: "enemiesDestroyed",
    discoverySource: "Destroying a Containment Sentinel — removing your first line of active repair.",
    relatedEntryIds: ["codex-xenomorph-hive"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_PARAGON_PROTOCOL_CODEX" },
  },
  // AF-054: Celestial Conclave constellation doctrine — unlocked by taking
  // your first Constellation Avatar offline. Ancient cosmic consciousness,
  // not a civilisation, so it gets no AF-039 FactionDef — the fourth
  // faction sharing that framing, cross-referenced to the Paragon Protocol.
  {
    id: "codex-celestial-conclave",
    category: "enemies",
    title: "Constellation Doctrine",
    lore: {
      summary: "It was never one network. It was always a pattern, and every point in it drew a little strength from its neighbours.",
      detailed: "A Constellation shares Solar Energy, Shield Strength, and Healing along specific links, not through any single core — two entities in the same formation can carry entirely different strength at the same moment, depending only on who is still standing beside them. Breaking the most-connected point costs every neighbour something at once.",
      historicalContext: "No record exists of the Conclave being young. Every account begins with them already ancient.",
      recoveredArchives: "Recovered transmission, untranslatable but for one phrase: \"...the pattern remains, even diminished.\"",
    },
    image: null,
    statKey: "enemiesDestroyed",
    discoverySource: "Destroying a Constellation Avatar — collapsing your first formation's anchor.",
    relatedEntryIds: ["codex-paragon-protocol"],
    timelinePosition: null,
    version: 1,
    unlock: { kind: "collection", category: "lore", id: "LORE_CELESTIAL_CONCLAVE_CODEX" },
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

/**
 * The Dynamic Story Engine (AF-136). Real, new narrative-tracking
 * primitives, composing with — never duplicating — the locked/prior
 * stack:
 *
 * - "Story Director" tracks genuinely new signals (combat/exploration/
 *   downtime action counts) and is deliberately distinct from AF-056's
 *   `DirectorConductor` (combat-encounter recovery-window pacing) —
 *   different questions, different state, no shared fields.
 * - "Personal Storylines" (Origin Story/Growth Arc/Breaking Point/
 *   Triumph/Legacy) reuse AF-135's real `EvolvingEntry` class directly
 *   rather than a new versioning primitive, since these beats are
 *   meant to expand over a Commander's life exactly like AF-135's
 *   Dynamic Writing already does.
 * - "Player Reputation Stories" (8 titles) derive from AF-133's real
 *   `LegacyProgressTracker.topCategory()` — no new stat tracking.
 * - "Ending Generation"/"Post-Campaign Documentary" compose AF-135's
 *   real `generateFinalChronicle` — no duplicate aggregation.
 * - "Campaign Themes" are a pure function of the new
 *   `StoryPillarTracker`'s dominant pillar, never a player choice,
 *   matching "the player never explicitly chooses the theme."
 */

export const STORY_PILLARS = [
  "Hope",
  "Curiosity",
  "Sacrifice",
  "Leadership",
  "Discovery",
  "Unity",
  "Innovation",
  "Compassion",
  "Resilience",
  "Exploration",
] as const;
export type StoryPillar = (typeof STORY_PILLARS)[number];

export const WORLD_STORY_STATE_SIGNALS = [
  "Destroyed colonies",
  "Saved wildlife",
  "Scientific breakthroughs",
  "Political alliances",
  "Economic prosperity",
  "Commander morale",
  "Museum progress",
  "Historic discoveries",
] as const;
export type WorldStoryStateSignal = (typeof WORLD_STORY_STATE_SIGNALS)[number];

export const GALACTIC_STORYLINE_ARCS = [
  "Scientific Renaissance",
  "Engineering Revolution",
  "Political Unification",
  "Wildlife Recovery",
  "Economic Crisis",
  "Exploration Boom",
  "Ancient Awakening",
  "Energy Shortage",
] as const;
export type GalacticStorylineArc = (typeof GALACTIC_STORYLINE_ARCS)[number];

export const EMERGENT_MOMENT_KINDS = [
  "Unexpected rescues",
  "Equipment failures",
  "Lucky discoveries",
  "Ancient signals",
  "Lost survivors",
  "Friendly encounters",
  "Natural disasters",
  "Celebrations",
  "Quiet personal moments",
] as const;
export type EmergentMomentKind = (typeof EMERGENT_MOMENT_KINDS)[number];

export const PERSONAL_STORYLINE_BEATS = ["Origin Story", "Growth Arc", "Breaking Point", "Triumph", "Legacy"] as const;
export type PersonalStorylineBeat = (typeof PERSONAL_STORYLINE_BEATS)[number];

export const PLAYER_REPUTATION_TITLES = [
  "The Explorer",
  "The Builder",
  "The Scientist",
  "The Guardian",
  "The Diplomat",
  "The Founder",
  "The Pathfinder",
  "The Restorer",
] as const;
export type PlayerReputationTitle = (typeof PLAYER_REPUTATION_TITLES)[number];

export const STORY_BRANCH_AXES = [
  "Curiosity vs Caution",
  "Expansion vs Preservation",
  "Innovation vs Tradition",
  "Risk vs Stability",
  "Efficiency vs Compassion",
] as const;
export type StoryBranchAxis = (typeof STORY_BRANCH_AXES)[number];

export const QUIET_MOMENT_KINDS = [
  "Watching stars",
  "Commander conversations",
  "Children playing",
  "Companion interactions",
  "Reading recovered books",
  "Music performances",
  "Planetary festivals",
] as const;
export type QuietMomentKind = (typeof QUIET_MOMENT_KINDS)[number];

export const CAMPAIGN_THEMES = [
  "Hope after disaster",
  "Scientific discovery",
  "Family",
  "Exploration",
  "Forgiveness",
  "Rebuilding",
  "Legacy",
] as const;
export type CampaignTheme = (typeof CAMPAIGN_THEMES)[number];

export const POST_CAMPAIGN_DOCUMENTARY_SEGMENTS = [
  "Major events",
  "Commander interviews",
  "Recovered footage",
  "Player statistics",
  "Historic narration",
  "Museum footage",
  "Planet transformations",
] as const;
export type PostCampaignDocumentarySegment = (typeof POST_CAMPAIGN_DOCUMENTARY_SEGMENTS)[number];

/** Deriving a reputation title from the player's real dominant legacy
 * category (AF-133's LegacyProgressTracker) rather than new tracking. */
export const REPUTATION_TITLE_BY_LEGACY_CATEGORY: Record<string, PlayerReputationTitle> = {
  Explorer: "The Explorer",
  Builder: "The Builder",
  Engineer: "The Builder",
  Scientist: "The Scientist",
  Guardian: "The Guardian",
  Conqueror: "The Guardian",
  Diplomat: "The Diplomat",
  Founder: "The Founder",
  Historian: "The Pathfinder",
  Mentor: "The Pathfinder",
  Collector: "The Restorer",
  Conservationist: "The Restorer",
  Commander: "The Founder",
};

/** Deriving a campaign theme from the player's dominant Story Pillar —
 * "the player never explicitly chooses the theme, it emerges." */
export const CAMPAIGN_THEME_BY_STORY_PILLAR: Record<StoryPillar, CampaignTheme> = {
  Hope: "Hope after disaster",
  Curiosity: "Scientific discovery",
  Sacrifice: "Forgiveness",
  Leadership: "Legacy",
  Discovery: "Scientific discovery",
  Unity: "Family",
  Innovation: "Rebuilding",
  Compassion: "Family",
  Resilience: "Rebuilding",
  Exploration: "Exploration",
};

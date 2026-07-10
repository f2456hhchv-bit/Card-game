/**
 * The Atlas Meaning Engine (AF-163). Exists above AF-162's Purpose
 * Engine: purpose asks "what are we trying to achieve?", meaning asks
 * "why does it matter?"
 *
 * "Meaning Domains" (12) overlaps with the same recurring "domain"
 * vocabulary family as AF-160's `WISDOM_DIMENSIONS`, AF-161's
 * `PHILOSOPHICAL_DOMAINS`, and AF-162's `PURPOSE_DOMAINS` — up to 5
 * exact-string matches against `PURPOSE_DOMAINS` (Community/History/
 * Culture/Education/Exploration), confirmed by a dedicated test, but
 * notably NOT a new overlap record (AF-162's own 8-match overlap with
 * AF-161 remains the heaviest). Kept as its own separate union: this
 * one tags what kind of EMOTIONAL SIGNIFICANCE applies, a fourth
 * distinct question over largely shared vocabulary.
 *
 * "Personal Meaning", "Player Meaning" and "Collective Memory" are
 * three sections that all describe the identical mechanic — curate a
 * single best-of entry per named category for an entity ("favourite
 * memory", "favourite planet", "great kindness") — so they share ONE
 * generic `MeaningCurator<TCategory>` class rather than three near-
 * identical trackers. `PersonalMeaningCategory` is confirmed a
 * genuinely different concept from AF-133's real `NpcMemoryLog`:
 * `NpcMemoryLog` stores every memory a subject accumulates, while
 * `MeaningCurator` picks out the single most meaningful entry per
 * named superlative category — a "highlights reel" layered above raw
 * memory, never a replacement for it.
 *
 * "Symbols" ("objects gradually gain symbolic value... artifacts gain
 * emotional weight") and "Meaning Through Time" ("events become more
 * meaningful as children learn about them, books reference them...")
 * describe the same underlying mechanic at two granularities — a named
 * entity (object OR event) accumulating significance through
 * reinforcing moments — so both are served by one generic
 * `SignificanceTracker` rather than two separate growing-weight
 * classes.
 */

export const MEANING_DOMAINS = ["Personal", "Relationships", "Family", "Community", "Science", "History", "Culture", "Nature", "Education", "Civilisation", "Exploration", "Legacy"] as const;
export type MeaningDomain = (typeof MEANING_DOMAINS)[number];

export const PERSONAL_MEANING_CATEGORIES = ["Favourite memory", "Personal triumph", "Quiet regret", "Greatest friendship", "Most meaningful discovery", "Proudest achievement"] as const;
export type PersonalMeaningCategory = (typeof PERSONAL_MEANING_CATEGORIES)[number];

export const PLAYER_MEANING_CATEGORIES = ["Favourite planet", "Favourite Commander", "Favourite expedition", "Favourite tradition", "Favourite discovery", "Favourite moment"] as const;
export type PlayerMeaningCategory = (typeof PLAYER_MEANING_CATEGORIES)[number];

export const COLLECTIVE_MEMORY_CATEGORIES = ["Great kindness", "Scientific courage", "Engineering brilliance", "Acts of compassion", "Historic discoveries", "Player achievements"] as const;
export type CollectiveMemoryCategory = (typeof COLLECTIVE_MEMORY_CATEGORIES)[number];

export const COMMUNITY_MEANING_PLACE_TYPES = ["Parks", "Schools", "Monuments", "Gardens", "Libraries", "Museums", "Historic buildings"] as const;
export type CommunityMeaningPlaceType = (typeof COMMUNITY_MEANING_PLACE_TYPES)[number];

export const SCIENTIFIC_MEANING_REASONS = ["Diseases disappear", "Children learn", "Planets recover", "Exploration becomes safer", "Knowledge changes lives"] as const;

export const HISTORICAL_MEANING_FOCUS = ["Lessons", "Sacrifices", "Cooperation", "Recovery", "Discovery", "Inspiration"] as const;

export const CULTURAL_MEANING_TRADITIONS = ["Annual remembrance walks", "Planetary festivals", "Commander lectures", "Community gardens", "Museum volunteer days"] as const;

export const ECOLOGICAL_MEANING_OUTCOMES = ["Sacred parks", "Educational reserves", "Research sanctuaries"] as const;

export const EXPLORATION_MEANING_QUALITIES = ["Understanding", "Connection", "Respect", "Wonder", "Stewardship"] as const;

export const INSTITUTIONAL_MEANING_EXAMPLES = ["Schools remember founders", "Hospitals honour pioneers", "Museums preserve stories", "Universities celebrate discoveries"] as const;

export const SYMBOL_EXAMPLES = ["Atlas Beacon", "First expedition journal", "Founder's helmet", "Commander medals", "Ancient saplings", "Historic observatories"] as const;

export const QUIET_MOMENT_EXAMPLES = ["Watching sunrise", "Walking through restored forests", "Commander conversations", "Museum visits", "Graduations", "Family celebrations"] as const;

export const MEANING_DEVELOPER_TOOLS = ["Meaning graph", "Memory importance viewer", "Emotional timeline", "Symbol evolution tracker", "Community identity map", "Legacy influence browser"] as const;

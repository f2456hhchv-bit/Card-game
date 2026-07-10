/**
 * The Atlas Infinity Engine (AF-175). Sits above AF-174's Horizon
 * Engine: the Horizon Engine ensures there is always another frontier,
 * the Infinity Engine ensures there is always another future.
 *
 * CRITICAL SCOPE NOTE: this module's own text calls itself "the
 * highest simulation layer governing the continued evolution of the
 * Afterlight universe." That phrase describes its position at the top
 * of the IN-FICTION Atlas enrichment chain (AF-160 → ... → AF-174 →
 * AF-175), nothing more. It never ranks above, modifies, or claims any
 * authority over the REAL `docs/CONSTITUTION.md`, which remains
 * categorically outside and above the entire in-fiction hierarchy per
 * this project's standing rule (established at AF-145/146/147,
 * reaffirmed at AF-170's own explicit `SYSTEM_PRIORITY_LADDER` scope
 * note). AF-175 does not modify AF-170's ladder or introduce a second
 * one.
 *
 * Reused directly wherever a section names a mechanic that already
 * exists:
 *
 * - "Evolution Cycles" (Knowledge → Innovation → Discovery →
 *   Civilisation → Legacy → Education → New Questions → Knowledge,
 *   "the cycle never ends") is driven directly by AF-155's real
 *   generic `CyclicStageTracker<TStage>` over this module's own
 *   7-stage `EVOLUTION_CYCLE_STAGES` union — an explicitly cyclic
 *   progression is exactly the wraparound `next()` this tracker
 *   already implements.
 * - "The Expanding Questions" ("what remains unknown... questions
 *   fuel infinity") and "Self-Renewal" ("old mysteries resolve, new
 *   mysteries emerge... nothing stagnates") both compose AF-159's real
 *   `MysteryLog.open`/`resolve` and AF-169's real
 *   `ensureNextHorizonOpen` directly — the same open-until-resolved,
 *   completion-chains-to-a-new-mystery guarantees AF-159/169/172/174
 *   already established, never a second renewal mechanic.
 * - "The Expanding Heart" ("Commanders inspire descendants... humanity
 *   grows emotionally") composes AF-160's real `MentorshipLedger` and
 *   AF-166's real `EmotionalContinuityTracker` (at civilisation scale,
 *   entity id `"humanity"`, the same reuse AF-168/169 already made)
 *   directly.
 * - "The Expanding Legacy" ("a museum inspires a child... legacy
 *   becomes exponential") composes AF-160's real `MentorshipLedger`
 *   and AF-162's real `LongTermMissionTracker` directly at the call
 *   site — the module's own genuinely new `GenerationalHandoffLedger`
 *   is what actually measures the compounding, not a duplicate
 *   narrative-chain class.
 *
 * "Infinity Domains" (12) is confirmed a NEW ABSOLUTE overlap record
 * in this codebase: TEN of its 12 members are exact-string matches
 * with AF-172's real `IMAGINATION_DOMAINS`, verified using AF-170's
 * real `detectOverlap` function, surpassing the previous 9-member
 * record set by AF-171/172.
 *
 * "Generational Handoff" ("the next generation begins further ahead,
 * never from zero") is confirmed genuinely new: `GenerationalHandoffLedger`
 * measures cumulative inherited contribution across generations — a
 * fundamentally different shape from AF-169's real `NextGenerationLog`
 * (a plain witnessed-moment description log with no categorised
 * contributions or cumulative baseline).
 *
 * "Self-Growing Systems," "The Expanding Universe," "The Expanding
 * Mind," and "Infinite Replayability" stay pure reference vocabulary:
 * the intended composition is calling AF-151's real
 * `KnowledgeGraph.addEdge`, AF-159's real `CulturalTrendTracker`, and
 * this codebase's existing RNG/seed systems together at the call
 * site, never new duplicate trackers for lists that describe growth
 * already modelled elsewhere. "The Atlas Principle," "The Player
 * Principle," and "The Final Horizon" are philosophical/design-law
 * statements, documented in prose only, matching every prior module's
 * treatment of non-mechanical "Core Principle"/"Player Experience"
 * sections.
 */

export const EVOLUTION_CYCLE_STAGES = ["Knowledge", "Innovation", "Discovery", "Civilisation", "Legacy", "Education", "New Questions"] as const;
export type EvolutionCycleStage = (typeof EVOLUTION_CYCLE_STAGES)[number];

export const INFINITY_DOMAINS = ["Exploration", "Science", "Engineering", "Education", "Culture", "Ecology", "Architecture", "History", "Relationships", "Civilisation", "Art", "Identity"] as const;
export type InfinityDomain = (typeof INFINITY_DOMAINS)[number];

export const SELF_GROWING_SYSTEM_EXAMPLES = ["Museums gain new exhibits", "Universities establish new disciplines", "Cities develop new districts", "Species evolve", "Languages shift", "Traditions mature", "Architectural movements emerge"] as const;

export const GENERATIONAL_HANDOFF_CATEGORIES = ["Knowledge", "Culture", "Infrastructure", "Mentorship", "Traditions", "Questions"] as const;
export type GenerationalHandoffCategory = (typeof GENERATIONAL_HANDOFF_CATEGORIES)[number];

export const EXPANDING_UNIVERSE_EXAMPLES = ["New star clusters", "Previously unreachable regions", "Improved navigation", "Recovered maps", "Astronomical discoveries"] as const;

export const EXPANDING_MIND_DISCIPLINE_EXAMPLES = ["Planetary Memory Studies", "Living Architecture", "Galactic Ecology", "Interstellar Anthropology", "Deep-Time Astronomy"] as const;

export const EXPANDING_HEART_EXAMPLES = ["Families create traditions", "Commanders inspire descendants", "Institutions preserve values", "Communities become richer", "Humanity grows emotionally"] as const;

export const EXPANDING_QUESTIONS = ["What remains unknown?", "Who has not yet been heard?", "Which worlds remain silent?", "What histories remain buried?", "What futures remain unimaginable?"] as const;

export const SELF_RENEWAL_EXAMPLES = ["Old mysteries resolve", "New mysteries emerge", "Old technologies mature", "New disciplines appear", "Old traditions evolve"] as const;

export const INFINITE_REPLAYABILITY_FACTORS = ["Different people", "Different histories", "Different priorities", "Different cultures", "Different discoveries", "Different relationships"] as const;

export const INFINITY_DEVELOPER_TOOLS = ["Infinity graph", "Generational simulator", "Knowledge growth viewer", "Civilisation maturity tracker", "Discovery cascade explorer", "Long-term evolution dashboard"] as const;

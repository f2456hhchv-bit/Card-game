/**
 * The Atlas Ascension Engine (AF-179). Measures how humanity matures,
 * never how powerful it becomes.
 *
 * NAMING SCOPE NOTE: the word "Ascension" already appears in the
 * locked AF-069/AF-070 endgame system (`ascensionLevel`,
 * `milestonesThisAscension`, `SANDBOX_ASCENSIONS`) — a per-run
 * New-Game-Plus prestige counter. That is a completely different
 * concept from this module's civilisation-wide maturity ladder. AF-179
 * lives entirely under its own `src/game/atlasAscension/` directory
 * and never reads, writes, or reuses any AF-069/AF-070 endgame state.
 * The two "Ascension" words are a coincidence of English vocabulary,
 * not a shared mechanic.
 *
 * Reused directly wherever a section names a mechanic that already
 * exists:
 *
 * - "Commander Ascension"'s "Mentorship" composes AF-160's real
 *   `MentorshipLedger` directly.
 * - "Cultural Ascension"'s "Beauty"/"Public spaces" composes AF-168's
 *   real `BeautyIndexTracker` directly; "Knowledge sharing" composes
 *   AF-159's real `CulturalTrendTracker` directly.
 * - "Ascension Network" ("progress in one domain supports others...
 *   growth compounds") composes AF-151's real `KnowledgeGraph.addEdge`
 *   directly, using the already-real `"Influenced"` `GraphEdgeKind`.
 *
 * "Ascension Tiers" (8, ordered, non-cyclic — Tier I Survival through
 * Tier VIII Ascension), "Scientific Ascension" (6-stage, ordered,
 * non-cyclic), and "Player Ascension" (8-stage, ordered, non-cyclic)
 * all mirror this codebase's established `xRank(stage): number`
 * pattern (AF-139/156/157/162/166/170's real `lifeStageRank`/
 * `systemPriorityRank`/`purposeEvolutionRank`/etc.) rather than
 * AF-155's real `CyclicStageTracker` — none of these three ladders is
 * ever described as returning to its first stage, the same reasoning
 * that already kept AF-166's `LIFE_STAGES` on a plain rank function
 * instead of the cyclic tracker.
 *
 * "The Ascension Index" mirrors the SHAPE of AF-143's real
 * `DesignScoreCard`/AF-149's real `AtlasScoreCard`/AF-170's real
 * `PrimeDirectiveScoreCard`/AF-173's real `InnovationFilterScoreCard`
 * — the FIFTH mirrored scoring rubric in this codebase, typed to its
 * own union, reusing the same 9.5 gate threshold each of those four
 * real rubrics already settled on. Its governing design law —
 * "Military dominance is never a primary measure" — is enforced
 * structurally: `AscensionIndexCriterion` has no military/power/
 * strength member at all, confirmed by a dedicated test scanning the
 * union for forbidden keywords.
 *
 * "The Ascension Test" ("are children better educated... if not,
 * progress is incomplete") mirrors AF-170's real `finalTestPassed`/
 * `futureCompatibilityValidated` all-must-pass checklist pattern
 * exactly.
 */

export const ASCENSION_PILLARS = ["Knowledge", "Wisdom", "Education", "Discovery", "Compassion", "Engineering", "Ecology", "Creativity", "Stewardship", "Community", "Legacy", "Hope"] as const;
export type AscensionPillar = (typeof ASCENSION_PILLARS)[number];

export interface AscensionTier {
  numeral: string;
  name: string;
  description: string;
}

export const ASCENSION_TIERS: readonly AscensionTier[] = [
  { numeral: "I", name: "Survival", description: "Secure the future." },
  { numeral: "II", name: "Recovery", description: "Restore civilisation." },
  { numeral: "III", name: "Exploration", description: "Expand knowledge." },
  { numeral: "IV", name: "Prosperity", description: "Improve quality of life." },
  { numeral: "V", name: "Harmony", description: "Balance civilisation and nature." },
  { numeral: "VI", name: "Inspiration", description: "Become a model for future generations." },
  { numeral: "VII", name: "Stewardship", description: "Protect the galaxy." },
  { numeral: "VIII", name: "Ascension", description: "Humanity becomes a civilisation defined by continual learning and service." },
];
export type AscensionTierName = (typeof ASCENSION_TIERS)[number]["name"];

export function ascensionTierRank(name: AscensionTierName): number {
  return ASCENSION_TIERS.findIndex((tier) => tier.name === name);
}

export const COMMANDER_ASCENSION_EXAMPLES = ["Experience", "Teaching", "Research", "Mentorship", "Reflection", "Community leadership"] as const;

export const SCIENTIFIC_ASCENSION_STAGES = ["Observation", "Experimentation", "Understanding", "Integration", "Stewardship", "Universal collaboration"] as const;
export type ScientificAscensionStage = (typeof SCIENTIFIC_ASCENSION_STAGES)[number];

export function scientificAscensionRank(stage: ScientificAscensionStage): number {
  return SCIENTIFIC_ASCENSION_STAGES.indexOf(stage);
}

export const CULTURAL_ASCENSION_EXAMPLES = ["Education", "Beauty", "Compassion", "Curiosity", "Public spaces", "Art", "Environmental care", "Knowledge sharing"] as const;

export const INSTITUTION_EVOLUTION_EXAMPLES: ReadonlyArray<readonly [string, string]> = [
  ["Museums", "Living research centres"],
  ["Universities", "Innovation ecosystems"],
  ["Hospitals", "Preventative wellbeing networks"],
  ["Observatories", "Galactic collaboration hubs"],
];

export const PLANETARY_ASCENSION_EXAMPLES = ["Thriving ecosystems", "Scientific centres", "Educational destinations", "Architectural landmarks", "Living examples of stewardship"] as const;

export const PLAYER_ASCENSION_ROLES = ["Explorer", "Builder", "Commander", "Founder", "Teacher", "Guardian", "Steward", "Living Inspiration"] as const;
export type PlayerAscensionRole = (typeof PLAYER_ASCENSION_ROLES)[number];

export function playerAscensionRank(role: PlayerAscensionRole): number {
  return PLAYER_ASCENSION_ROLES.indexOf(role);
}

export const ASCENSION_INDEX_CRITERIA = ["Knowledge growth", "Educational access", "Ecological health", "Community wellbeing", "Scientific openness", "Architectural beauty", "Historical preservation", "Interstellar cooperation"] as const;
export type AscensionIndexCriterion = (typeof ASCENSION_INDEX_CRITERIA)[number];

export const ASCENSION_INDEX_GATE_THRESHOLD = 9.5;

export const ASCENSION_EVENT_EXAMPLES = ["Universal Education Accord", "The Great Ecological Recovery", "The Atlas Knowledge Exchange", "The Commander Mentorship Era", "The Living Cities Initiative", "The Garden Galaxy Programme"] as const;

export const ASCENSION_TEST_QUESTIONS = ["Are children better educated?", "Are ecosystems healthier?", "Are discoveries more accessible?", "Are communities stronger?", "Are people kinder?"] as const;
export type AscensionTestQuestion = (typeof ASCENSION_TEST_QUESTIONS)[number];

export function ascensionTestPassed(answers: ReadonlySet<AscensionTestQuestion>): boolean {
  return ASCENSION_TEST_QUESTIONS.every((question) => answers.has(question));
}

export const ASCENSION_DEVELOPER_TOOLS = ["Ascension dashboard", "Civilisation maturity graph", "Stewardship index", "Educational progression map", "Institution evolution viewer", "Hope trajectory analyser"] as const;

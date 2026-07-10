/**
 * The Afterlight Franchise Bible (AF-147). Explicitly "not a gameplay
 * system" per its own text — the fourth module in a row whose subject
 * is franchise-level governance rather than in-game mechanics (after
 * the real `docs/CONSTITUTION.md`, AF-145's Atlas Core, and AF-146's
 * Design Constitution). Confirmed genuinely new territory: no "Era"/
 * timeline-chronology concept and no canon-tier conflict resolver
 * exist anywhere in the codebase (AF-068's `CampaignRuntime` chapters
 * are a gameplay-campaign structure, not a franchise-wide timeline).
 *
 * "Core Themes" (10: Hope/Discovery/Civilisation/Curiosity/Humanity/
 * Legacy/Science/Friendship/Education/Stewardship) is the densest
 * vocabulary overlap yet with the project's other three abstract-value
 * lists: the real Constitution's 10 Design Pillars, AF-146's
 * `TEN_PILLARS` (shares Hope/Discovery/Humanity/Civilisation verbatim),
 * and AF-145's Atlas Principle virtues (shares Curiosity/Hope/
 * Stewardship/Discovery/Legacy verbatim). Kept as its own separate,
 * fourth list — the spec's own genuinely new rule attached to it is a
 * minimum-count threshold ("every story reinforces at least three
 * themes"), a different mechanic shape than AF-146's exact-8-of-10
 * Content Test or AF-145's all-8 Design Validation, so no merge is
 * attempted.
 *
 * "The Franchise Test" (6 questions, all must be "Yes" — "if not, it
 * is redesigned") is the FIFTH occurrence of the same checklist-gate
 * mechanic in this codebase, after the real Constitution's two gates,
 * AF-146's `EXPANSION_TEST_REQUIREMENTS`, and AF-145's
 * `DESIGN_VALIDATION_QUESTIONS` (all three of those are also
 * all-must-pass). Kept as its own separate, sixth question list.
 *
 * Kept as pure reference data, no runtime validator, since this module
 * explicitly disclaims being a gameplay system: Visual/Music/Language
 * Identity, Commander/World Standards, Technology Rules, Merchandise/
 * Adaptation Guidelines, Community Values, Future Vision — all
 * franchise-wide brand/creative guidance with no computational analog,
 * the same honest scope boundary AF-140 through AF-146 already applied
 * to sections describing pure design philosophy.
 */
export const FRANCHISE_PURPOSE_GOALS = ["Consistency", "Quality", "Lore accuracy", "Visual identity", "Technical philosophy", "Emotional identity", "Creative direction"] as const;

/** The fourth overlapping abstract-value list in the codebase (see
 * module doc comment) — kept separate from the real Constitution's
 * Design Pillars, AF-145's Atlas Principle virtues, and AF-146's
 * `TEN_PILLARS`. */
export const CORE_THEMES = ["Hope", "Discovery", "Civilisation", "Curiosity", "Humanity", "Legacy", "Science", "Friendship", "Education", "Stewardship"] as const;
export type CoreTheme = (typeof CORE_THEMES)[number];

export const THEME_MINIMUM_COUNT = 3;

/** "Every story reinforces at least three themes." A minimum-count
 * threshold — a different mechanic shape than AF-146's exact-8-of-10
 * or AF-145's all-8. */
export function themeCoverageMet(themesReinforced: ReadonlySet<CoreTheme>): boolean {
  return themesReinforced.size >= THEME_MINIMUM_COUNT;
}

export interface EraDef {
  id: string;
  name: string;
  order: number;
  startEpoch: number;
}

/** "All future content references this chronology." Confirmed
 * genuinely new — no named-Era timeline concept exists anywhere else;
 * AF-068's `CampaignRuntime` chapters are a gameplay-campaign
 * structure, not a franchise timeline. Epoch boundaries are this
 * module's own illustrative pacing, not derived from any real epoch
 * counter. */
export const ERAS: readonly EraDef[] = [
  { id: "earth-era", name: "Earth Era", order: 1, startEpoch: 0 },
  { id: "collapse-era", name: "Collapse Era", order: 2, startEpoch: 5 },
  { id: "first-expedition", name: "First Expedition", order: 3, startEpoch: 10 },
  { id: "atlas-initiative", name: "Atlas Initiative", order: 4, startEpoch: 20 },
  { id: "reconstruction-era", name: "Reconstruction Era", order: 5, startEpoch: 40 },
  { id: "expansion-era", name: "Expansion Era", order: 6, startEpoch: 80 },
  { id: "beacon-era", name: "Beacon Era", order: 7, startEpoch: 150 },
  { id: "future-eras", name: "Future Eras", order: 8, startEpoch: 300 },
];

export function eraFor(epoch: number): EraDef {
  let current = ERAS[0]!;
  for (const era of ERAS) if (epoch >= era.startEpoch) current = era;
  return current;
}

/** "Conflicts always resolve in favour of the highest canon tier." A
 * closed, ordered ladder — index 0 is the highest authority. */
export const CANON_TIERS = ["Main Games", "Official Expansions", "Official Companion Books", "Museum Records", "Educational Archives", "Developer Commentary"] as const;
export type CanonTier = (typeof CANON_TIERS)[number];

export function canonTierRank(tier: CanonTier): number {
  return CANON_TIERS.indexOf(tier);
}

export const VISUAL_IDENTITY_ARCHITECTURE = ["Elegant", "Optimistic", "Functional", "Human-centred"] as const;
export const VISUAL_IDENTITY_TECHNOLOGY = ["Readable", "Clean", "Purposeful", "Scientific"] as const;
export const VISUAL_IDENTITY_LIGHTING = ["Warm", "Hopeful", "Natural", "Celestial"] as const;
export const VISUAL_IDENTITY_COLOUR_LANGUAGE = ["White", "Gold", "Deep Blue", "Emerald", "Silver", "Soft Amber"] as const;

export const MUSIC_PILLARS = ["Wonder", "Hope", "Reflection", "Adventure", "Civilisation", "Discovery"] as const;

export const LANGUAGE_STYLE_AVOID = ["Edgelord cynicism", "Needless profanity", "Hopeless nihilism"] as const;
export const LANGUAGE_STYLE_EMPHASISE = ["Competence", "Kindness", "Professionalism", "Curiosity", "Occasional humour"] as const;

export const COMMANDER_STANDARDS = ["A philosophy", "A profession", "A gameplay identity", "A human story"] as const;

export const WORLD_STANDARDS = ["History", "Culture", "Ecology", "Economy", "Education", "Architecture", "Wildlife", "Scientific value", "Hope for the future"] as const;

export const TECHNOLOGY_RULES = ["Technology should solve problems", "Not replace humanity", "People remain central", "AI assists", "Humans decide"] as const;

export const EXPANSION_RULES = ["Introduce genuine discovery", "Expand civilisation", "Respect history", "Create memorable characters", "Leave the universe richer than before"] as const;

export const MERCHANDISE_CELEBRATE = ["Engineering", "Science", "Exploration", "Commanders", "Museum artifacts", "Companions", "Architecture", "History"] as const;

export const ADAPTATION_MEDIA_KINDS = ["Books", "Television", "Animation", "Film", "Board games", "Educational media"] as const;
export const ADAPTATION_PRESERVATION_REQUIREMENTS = ["Core philosophy", "Timeline", "Themes", "Hopeful identity"] as const;

export const COMMUNITY_VALUES = ["Creativity", "Knowledge sharing", "Accessibility", "Respect", "Constructive collaboration", "Celebration of discovery"] as const;

/** The FIFTH occurrence of the same checklist-gate mechanic in this
 * codebase (see module doc comment) — kept as its own separate list. */
export const FRANCHISE_TEST_QUESTIONS = ["Does it strengthen hope?", "Does it expand discovery?", "Does it deepen civilisation?", "Does it respect history?", "Does it reward curiosity?", "Does it preserve humanity?"] as const;
export type FranchiseTestQuestion = (typeof FRANCHISE_TEST_QUESTIONS)[number];

export function franchiseTestPassed(answers: ReadonlySet<FranchiseTestQuestion>): boolean {
  return FRANCHISE_TEST_QUESTIONS.every((question) => answers.has(question));
}

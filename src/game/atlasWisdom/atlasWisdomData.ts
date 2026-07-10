/**
 * The Atlas Wisdom Engine (AF-160). Sits above AF-155–159 (Intelligence,
 * Decision, Planning, Future, Possibility): where those engines
 * understand, choose, coordinate, forecast and imagine, AF-160 asks
 * whether something should be done at all, and what centuries of
 * experience have taught about it.
 *
 * "Reflection Loop" (Experience→Reflection→Discussion→Learning→
 * Teaching→Improved Judgement, "wisdom compounds across generations")
 * is driven directly by AF-155's real generic `CyclicStageTracker<TStage>`
 * — the same class already reused for AF-155's own Intelligence Layers/
 * Learning Loop and AF-156's Decision Pyramid. No new stage-tracker
 * class, even though this list's exact membership (confirmed by a
 * dedicated test) differs from every prior cyclic list in this
 * codebase.
 *
 * "Commander Wisdom" (Patience/Mentorship/Perspective/Humility/Long-
 * term thinking/Emotional maturity, "gradually develops") is a
 * genuinely different axis from two existing Commander concepts: AF-030's
 * real `PersonalityTrait` is fixed and dialogue-only by design law
 * (never grows, never a stat); AF-139's real `COMMANDER_MATURITY_STAGES`
 * (Rookie Officer/Seasoned Leader/Trusted Mentor/Living Legend) is a
 * coarse 4-stage career-summary ladder. `CommanderWisdomTrait` is six
 * fine-grained scores that accumulate with lived experience — neither
 * fixed flavour nor a single coarse rank. `CommanderWisdomTracker`
 * never writes to `PersonalityTrait` or `COMMANDER_MATURITY_STAGES`.
 *
 * "Civilisation Values" (10: Curiosity/Compassion/Responsibility/Hope/
 * Cooperation/Stewardship/Integrity/Humility/Education/Legacy) is
 * confirmed another entry in this codebase's recurring "abstract
 * value/virtue list" family (alongside the real Constitution's 10
 * Design Pillars, AF-146's real `TEN_PILLARS`, AF-145's Atlas Principle
 * virtues, and AF-147's real `CORE_THEMES`) — kept as its own separate
 * list, never merged.
 *
 * "Scientific Wisdom" and "Ethical Deliberation" are two more instances
 * of this codebase's established all-must-pass checklist-gate mechanic
 * (`.every()` over a `ReadonlySet` of answered questions) — the same
 * shape as AF-145's Design Validation, AF-146's Expansion Test, AF-147's
 * Franchise Test and others, kept as their own separate question sets
 * rather than merged into any of them.
 *
 * "Civilisation Wisdom"'s `Future generations` factor is a single
 * verbatim overlap with AF-155's real `STRATEGIC_REASONING_FACTORS`
 * (which also lists "Future generations") — the other five factors
 * differ, so the two lists are kept separate rather than merged.
 *
 * "Wisdom Memory" (6 outcomes) mirrors the SHAPE of AF-157's real
 * `PlanMemoryArchive`, AF-158's real `FutureMemoryArchive`, and AF-159's
 * real `InnovationMemoryArchive` — the FOURTH mirrored "completed
 * experience becomes a named institution" archive in this codebase,
 * typed to its own separate union rather than any of the three real
 * ones.
 *
 * "Mentorship System" is confirmed the first REAL mentor/mentee
 * relationship ledger in the codebase — AF-156/157's own `*_DECISION_
 * KINDS`/`*_PLAN_KINDS` mention "Mentoring opportunities"/"Mentorship"
 * only as reference vocabulary, never a tracked relationship.
 * "Generational Transfer" (Knowledge→Lessons→Traditions→Institutions→
 * Civilisation) is a linear escalation ladder, mirroring AF-148/154/
 * 157's real indexOf-rank pattern rather than a cycle.
 */

export const WISDOM_SOURCES = ["Chronicle", "Legacy Engine", "Museum", "Historical Records", "Commander Memories", "Player Actions", "Scientific Discoveries", "Civilisation Outcomes", "Ecological Recovery", "Cultural Development", "Education", "Failures", "Successes"] as const;
export type WisdomSource = (typeof WISDOM_SOURCES)[number];

export const WISDOM_DIMENSIONS = ["Scientific", "Ethical", "Environmental", "Historical", "Educational", "Cultural", "Diplomatic", "Engineering", "Medical", "Leadership", "Exploration", "Personal"] as const;
export type WisdomDimension = (typeof WISDOM_DIMENSIONS)[number];

export const COMMANDER_WISDOM_TRAITS = ["Patience", "Mentorship", "Perspective", "Humility", "Long-term thinking", "Emotional maturity"] as const;
export type CommanderWisdomTrait = (typeof COMMANDER_WISDOM_TRAITS)[number];

export const SCIENTIFIC_WISDOM_QUESTIONS = ["Should this experiment happen?", "Who benefits?", "Who might be harmed?", "What safeguards exist?", "Can history teach us anything?"] as const;
export type ScientificWisdomQuestion = (typeof SCIENTIFIC_WISDOM_QUESTIONS)[number];

/** "Discovery includes responsibility." All-must-pass, mirroring this
 * codebase's established checklist-gate mechanic. */
export function scientificWisdomReviewed(answers: ReadonlySet<ScientificWisdomQuestion>): boolean {
  return SCIENTIFIC_WISDOM_QUESTIONS.every((question) => answers.has(question));
}

export const CIVILISATION_WISDOM_FACTORS = ["Future generations", "Environmental sustainability", "Educational impact", "Historical preservation", "Social wellbeing", "Long-term prosperity"] as const;
export type CivilisationWisdomFactor = (typeof CIVILISATION_WISDOM_FACTORS)[number];

export const ECOLOGICAL_WISDOM_FACTORS = ["Biodiversity", "Native ecosystems", "Long-term resilience", "Species balance", "Climate stability", "Intergenerational stewardship"] as const;

export const CULTURAL_WISDOM_FACTORS = ["Traditions", "Languages", "Art", "Music", "Stories", "Scientific heritage", "Local identity"] as const;

export const HISTORICAL_REFLECTION_EXAMPLES = ["Past mistakes", "Successful recoveries", "Historic leaders", "Engineering failures", "Scientific triumphs", "Diplomatic breakthroughs"] as const;

export const MENTORSHIP_AUDIENCES = ["Young recruits", "Scientists", "Engineers", "Citizens", "Students"] as const;
export type MentorshipAudience = (typeof MENTORSHIP_AUDIENCES)[number];

export const ETHICAL_DELIBERATION_QUESTIONS = ["Is this necessary?", "Is it sustainable?", "Is it reversible?", "Does it improve humanity?", "Can we achieve the goal another way?"] as const;
export type EthicalDeliberationQuestion = (typeof ETHICAL_DELIBERATION_QUESTIONS)[number];

/** Another all-must-pass checklist gate (see module doc comment). */
export function ethicalDeliberationPassed(answers: ReadonlySet<EthicalDeliberationQuestion>): boolean {
  return ETHICAL_DELIBERATION_QUESTIONS.every((question) => answers.has(question));
}

export const REFLECTION_LOOP_STAGES = ["Experience", "Reflection", "Discussion", "Learning", "Teaching", "Improved Judgement"] as const;
export type ReflectionLoopStage = (typeof REFLECTION_LOOP_STAGES)[number];

export const CIVILISATION_VALUES = ["Curiosity", "Compassion", "Responsibility", "Hope", "Cooperation", "Stewardship", "Integrity", "Humility", "Education", "Legacy"] as const;
export type CivilisationValue = (typeof CIVILISATION_VALUES)[number];

export const GENERATIONAL_TRANSFER_STAGES = ["Knowledge", "Lessons", "Traditions", "Institutions", "Civilisation"] as const;
export type GenerationalTransferStage = (typeof GENERATIONAL_TRANSFER_STAGES)[number];

/** Mirrors AF-148/154/157's real indexOf-rank pattern — a linear
 * escalation ladder, not a cycle. */
export function generationalTransferRank(stage: GenerationalTransferStage): number {
  return GENERATIONAL_TRANSFER_STAGES.indexOf(stage);
}

/** The FOURTH mirrored "completed experience becomes a named
 * institution" archive in this codebase (see module doc comment) —
 * typed to its own separate union rather than AF-157/158/159's real
 * ones. */
export const WISDOM_MEMORY_OUTCOMES = ["Schools", "Universities", "Commander academies", "Museums", "Public monuments", "Scientific ethics"] as const;
export type WisdomMemoryOutcome = (typeof WISDOM_MEMORY_OUTCOMES)[number];

export const WISDOM_DEVELOPER_TOOLS = ["Wisdom graph", "Ethics viewer", "Historical influence map", "Leadership maturity tracker", "Mentorship network", "Civilisation values dashboard"] as const;

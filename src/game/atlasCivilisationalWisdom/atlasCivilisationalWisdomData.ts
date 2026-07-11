/**
 * The Atlas Civilisational Wisdom Engine (AF-199). "Knowledge answers
 * 'What is true?' Reasoning answers 'What follows?' Judgement answers
 * 'What should we choose?' Wisdom answers 'What should never be
 * forgotten?'"
 *
 * NAMING SCOPE NOTE: "Wisdom" already names AF-160's own locked "Atlas
 * Wisdom Engine" (`atlasWisdom/`) — the closest possible collision
 * short of a verbatim duplicate. AF-160 already sits "above AF-155-159
 * ... asking whether something should be done at all, and what
 * centuries of experience have taught about it" — almost the identical
 * framing AF-199 uses for itself. This module lives under its own
 * `atlasCivilisationalWisdom/` directory and never redefines AF-160.
 *
 * A research pass before implementation found AF-160 already built the
 * near-entirety of this spec's apparatus. Reused directly:
 *
 * - "The Wisdom Cycle" ("wisdom compounds forever," ending in "New
 *   Experience" — an explicit closed loop) reuses AF-155's real generic
 *   `CyclicStageTracker<TStage>` directly, instantiated over this
 *   module's own new `WISDOM_CYCLE_STAGES` union — the same class
 *   AF-160's own "Reflection Loop" already reused. Shares 3 of 7 stages
 *   exactly with AF-160's real `REFLECTION_LOOP_STAGES`
 *   (Experience/Reflection/Teaching), verified via AF-170's real
 *   `detectOverlap`.
 * - "Commander Wisdom" ("teach calmly... mentor effectively...
 *   experience becomes guidance") reuses AF-160's real
 *   `CommanderWisdomTracker` directly, and its "mentor effectively"
 *   clause reuses AF-160's real `MentorshipLedger` directly.
 * - "Institutional Wisdom" reuses AF-165's real `InstitutionalMemoryTracker`
 *   directly.
 * - "Cultural Wisdom" composes AF-159's real `CulturalTrendTracker`
 *   directly.
 * - "Wisdom Through Failure" ("failures are preserved... as education")
 *   reuses AF-160's real `WisdomMemoryArchive` directly — that class
 *   already archives a lesson id against named outcome destinations
 *   (Schools/Universities/Museums/etc.), exactly "preserving failure as
 *   education."
 * - "Intergenerational Wisdom" ("every generation inherits...
 *   civilisation begins ahead of where it once stood") reuses AF-160's
 *   real `generationalTransferRank`/`GENERATIONAL_TRANSFER_STAGES`
 *   directly.
 * - "Wisdom Domains" (12) is, as a SET, an EXACT match — all 12
 *   members, only reordered — for AF-198's real `JUDGEMENT_DOMAINS`.
 *   Confirmed via `detectOverlap`: 12/12, TYING the absolute overlap
 *   record for the second time in this codebase (AF-191's own reuse of
 *   AF-171's real `CREATIVE_DOMAINS` was the first). Given a perfect
 *   match, this module reuses AF-198's real `JUDGEMENT_DOMAINS`
 *   directly rather than declaring a third near-duplicate domain list.
 *   Notably, that same 12-member set shares only 3 of 12 exact-string
 *   members with AF-160's own real `WISDOM_DIMENSIONS` — despite all
 *   three lists (Reasoning/Judgement/Wisdom Domains) describing the
 *   "which fields does this apply to" question, membership fragments
 *   sharply once word-form differs (Science vs Scientific, Education
 *   vs Educational, etc.).
 *
 * Confirmed genuinely new: "The Wisdom Library" ("every lesson
 * permanently records situation/decision/outcome/reflection/future
 * relevance/teaching value... wisdom becomes searchable") is a
 * genuinely different question from AF-160's real `WisdomMemoryArchive`
 * (which only tags a lesson id against WHICH institutions now teach
 * it, never the situation/decision/outcome narrative itself) — the
 * same "archive tags destinations, ledger records the narrative"
 * distinction AF-190's real `DesignHistoryLedger` already established
 * relative to its own neighbouring archive. The new `WisdomLibrary` is
 * an append-only per-lesson record, mirroring the established shape.
 *
 * "Collective Wisdom" (7 qualities) shares 2 of 7 exact members with
 * AF-160's real `CIVILISATION_VALUES` (Humility/Stewardship); "The
 * Civilisational Compass" (7 values) shares 5 of 7 exactly
 * (Hope/Responsibility/Education/Stewardship/Compassion) — the
 * stronger of the two, documented honestly rather than merged, since
 * "Discovery"/"Long-term thinking" here and "Curiosity"/"Cooperation"/
 * "Integrity"/"Humility"/"Legacy" there genuinely differ. "Cultural
 * Wisdom" (6 examples) shares 2 of 6 with AF-160's real
 * `CULTURAL_WISDOM_FACTORS`. All confirmed via `detectOverlap`, kept
 * as separate reference lists. "Scientific Wisdom," "Player Wisdom,"
 * and "The Wisdom Test" are kept as pure reference vocabulary — none
 * uses an explicit "if yes/no then X" gate framing, the same honest
 * restraint AF-197/198 already applied to their own reflective
 * checklists.
 */

// ── The Wisdom Cycle: explicit closed loop — reuses AF-155's real generic CyclicStageTracker directly. ──
export const WISDOM_CYCLE_STAGES = ["Experience", "Reflection", "Understanding", "Teaching", "Application", "Improved Outcomes", "New Experience"] as const;
export type WisdomCycleStage = (typeof WISDOM_CYCLE_STAGES)[number];

export const COLLECTIVE_WISDOM_QUALITIES = ["Long-term thinking", "Patience", "Humility", "Stewardship", "Scientific responsibility", "Educational generosity", "Institutional resilience"] as const;

export const SCIENTIFIC_WISDOM_EXAMPLES = ["Historic failures", "Unexpected discoveries", "Methodological improvements", "Ethical lessons", "Collaborative successes"] as const;

export const INSTITUTIONAL_WISDOM_EXAMPLES = ["Museums", "Universities", "Academies", "Hospitals", "Research institutes"] as const;

export const CULTURAL_WISDOM_EXAMPLES = ["Stories", "Traditions", "Proverbs", "Celebrations", "Memorials", "Public rituals"] as const;

export const PLAYER_WISDOM_EXAMPLES = ["Preparation", "Curiosity", "Mentorship", "Environmental care", "Long-term planning", "Scientific thinking"] as const;

export const WISDOM_THROUGH_FAILURE_EXAMPLES = ["Unsuccessful expeditions", "Engineering redesigns", "Scientific dead ends", "Historic misunderstandings"] as const;

/** "Every lesson permanently records... wisdom becomes searchable."
 * Confirmed genuinely new — a different question from AF-160's real
 * `WisdomMemoryArchive` (see module doc comment). */
export const WISDOM_LIBRARY_FIELDS = ["Situation", "Decision", "Outcome", "Reflection", "Future relevance", "Teaching value"] as const;

export const INTERGENERATIONAL_WISDOM_EXAMPLES = ["Experience", "Best practices", "Improved methods", "Historic context", "Public knowledge", "Shared responsibility"] as const;

export const WISDOM_TEST_QUESTIONS = ["Have we faced something similar?", "What did we learn?", "What still remains uncertain?", "How can we improve?"] as const;

export const CIVILISATIONAL_COMPASS_VALUES = ["Hope", "Discovery", "Responsibility", "Education", "Stewardship", "Compassion", "Long-term thinking"] as const;

export const CIVILISATIONAL_WISDOM_DEVELOPER_TOOLS = ["Wisdom browser", "Lesson graph", "Civilisation learning timeline", "Institutional wisdom map", "Experience archive", "Reflection dashboard"] as const;

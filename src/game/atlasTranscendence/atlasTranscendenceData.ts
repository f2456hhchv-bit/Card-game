/**
 * The Atlas Transcendence Engine (AF-180). AF-179's Ascension measures
 * how humanity matures; Transcendence measures how humanity permanently
 * changes its relationship with existence itself.
 *
 * CRITICAL SCOPE NOTE: this module's own text calls itself "the
 * highest philosophical layer of the Afterlight universe." That
 * describes its position at the top of the in-fiction Atlas
 * enrichment chain only (AF-160 → ... → AF-179 → AF-180). It never
 * ranks above, modifies, or claims any authority over the REAL
 * `docs/CONSTITUTION.md`, which remains categorically outside and
 * above the entire in-fiction hierarchy per this project's standing
 * rule (established at AF-145/146/147, reaffirmed at AF-170's own
 * `SYSTEM_PRIORITY_LADDER` scope note and AF-175's own scope note).
 * AF-180 does not modify AF-170's ladder or introduce a second one.
 *
 * Reused directly wherever a section names a mechanic that already
 * exists:
 *
 * - "The Stewardship Loop" (Discover → Understand → Protect → Teach →
 *   Inspire → Discover Again, "the cycle never ends") is driven
 *   directly by AF-155's real generic `CyclicStageTracker<TStage>`
 *   over this module's own 6-stage `STEWARDSHIP_LOOP_STAGES` union —
 *   an explicitly cyclic progression, unlike "The Civilisational
 *   Shift" below.
 * - "The Quiet Victory" ("a restored river... a shared discovery")
 *   reuses AF-163's real `QuietMomentLog` directly — that class
 *   already records free-text descriptions rather than a closed
 *   union, exactly matching these full-sentence examples.
 * - "Commander Transcendence" composes AF-160's real
 *   `MentorshipLedger` and AF-167's real `EarnedTitleTracker` directly.
 * - "The Transcendent City" composes AF-168's real `BeautyIndexTracker`
 *   directly.
 *
 * "The Civilisational Shift" (8-stage, ordered, never described as
 * returning to its first stage) mirrors this codebase's established
 * `xRank(stage): number` pattern (AF-139/156/157/162/166/170/179's
 * real rank functions) rather than `CyclicStageTracker` — the same
 * reasoning AF-179's own "Ascension Tiers" already applied. It shares
 * exactly 3 of 8 stage names ("Survival", "Recovery", "Stewardship")
 * with AF-179's real `ASCENSION_TIERS`, confirmed via AF-170's real
 * `detectOverlap`, but diverges enough afterward to require its own
 * separate rank function rather than reusing AF-179's real
 * `ascensionTierRank` (which is typed to that closed union).
 *
 * "Transcendent Institutions" shares 4 of its 5 institution names
 * ("Museums"/"Universities"/"Hospitals"/"Observatories") with AF-179's
 * real `INSTITUTION_EVOLUTION_EXAMPLES` — only "Gardens" is new,
 * confirmed via `detectOverlap`. "The Transcendent Planet" shares
 * exactly 1 of 5 exact-string examples ("Educational destinations")
 * with AF-179's real `PLANETARY_ASCENSION_EXAMPLES`, despite heavy
 * conceptual overlap, also confirmed via `detectOverlap`.
 * "Transcendence Domains" (12) shares 8 of 12 exact-string members
 * with AF-179's real `ASCENSION_PILLARS` — documented honestly, no
 * record claimed since the codebase's current record is 11/12.
 *
 * "The Transcendence Index" mirrors the SHAPE of AF-143/149/170/173/
 * 179's real scoring rubrics — the SIXTH mirrored rubric in this
 * codebase, sharing exactly 3 of its 9 criteria ("Educational access",
 * "Scientific openness", "Interstellar cooperation") verbatim with
 * AF-179's real `ASCENSION_INDEX_CRITERIA`, confirmed via
 * `detectOverlap`, and reusing the same 9.5 gate threshold. "The Gift
 * Principle" mirrors AF-170's real `finalTestPassed`/AF-179's real
 * `ascensionTestPassed` all-must-pass checklist pattern a third time.
 *
 * "The Universal Library" ("nothing worthy is intentionally lost") is
 * confirmed genuinely new: `UniversalLibrary` is a preservation
 * ledger with no removal method at all — permanence is structural,
 * not merely a convention, a fundamentally different guarantee from
 * AF-177's real `GenesisRegistry` (which records how something began,
 * not that it can never be lost) and AF-176's real `ThreadRegistry`
 * (which curates importance, not permanence of the underlying content).
 */

export const TRANSCENDENCE_DOMAINS = ["Knowledge", "Education", "Life", "Ecology", "Culture", "Science", "Stewardship", "Architecture", "Community", "Discovery", "Legacy", "Hope"] as const;
export type TranscendenceDomain = (typeof TRANSCENDENCE_DOMAINS)[number];

export const CIVILISATIONAL_SHIFT_STAGES = ["Survival", "Recovery", "Expansion", "Understanding", "Wisdom", "Stewardship", "Service", "Transcendence"] as const;
export type CivilisationalShiftStage = (typeof CIVILISATIONAL_SHIFT_STAGES)[number];

export function civilisationalShiftRank(stage: CivilisationalShiftStage): number {
  return CIVILISATIONAL_SHIFT_STAGES.indexOf(stage);
}

export const TRANSCENDENT_INSTITUTIONS: ReadonlyArray<readonly [string, string]> = [
  ["Museums", "Guardians of memory"],
  ["Universities", "Guardians of knowledge"],
  ["Hospitals", "Guardians of wellbeing"],
  ["Observatories", "Guardians of curiosity"],
  ["Gardens", "Guardians of biodiversity"],
];

export const COMMANDER_TRANSCENDENCE_EXAMPLES = ["Inspired others", "Shared knowledge", "Protected life", "Mentored generations", "Created opportunities", "Left the galaxy better than they found it"] as const;

export const TRANSCENDENT_CITY_EXAMPLES = ["Education is universal", "Nature is integrated", "Science is celebrated", "Art is public", "History is visible", "Children feel safe", "Discovery is encouraged", "Architecture inspires"] as const;

export const TRANSCENDENT_PLANET_EXAMPLES = ["Living ecosystems", "Scientific sanctuaries", "Educational destinations", "Cultural treasures", "Interstellar symbols of hope"] as const;

export const TRANSCENDENT_GALAXY_EXAMPLES = ["Protecting knowledge", "Restoring ecosystems", "Mentoring younger civilisations", "Preserving history", "Sharing discoveries", "Encouraging peace"] as const;

export const GIFT_PRINCIPLE_QUESTIONS = ["Who benefits?", "How long will it help?", "What future becomes possible because this now exists?"] as const;
export type GiftPrincipleQuestion = (typeof GIFT_PRINCIPLE_QUESTIONS)[number];

export function giftPrincipleSatisfied(answers: ReadonlySet<GiftPrincipleQuestion>): boolean {
  return GIFT_PRINCIPLE_QUESTIONS.every((question) => answers.has(question));
}

export const STEWARDSHIP_LOOP_STAGES = ["Discover", "Understand", "Protect", "Teach", "Inspire", "Discover Again"] as const;
export type StewardshipLoopStage = (typeof STEWARDSHIP_LOOP_STAGES)[number];

export const LIBRARY_CATEGORIES = ["Language", "Species", "Culture", "Scientific discovery", "Work of art", "Memory"] as const;
export type LibraryCategory = (typeof LIBRARY_CATEGORIES)[number];

export const GARDEN_PRINCIPLE_VERBS = ["Cultivates", "Protects", "Teaches", "Restores", "Encourages growth"] as const;

export const TRANSCENDENCE_INDEX_CRITERIA = ["Educational access", "Knowledge preservation", "Ecological resilience", "Public wellbeing", "Scientific openness", "Cultural richness", "Historical stewardship", "Interstellar cooperation", "Hope created"] as const;
export type TranscendenceIndexCriterion = (typeof TRANSCENDENCE_INDEX_CRITERIA)[number];

export const TRANSCENDENCE_INDEX_GATE_THRESHOLD = 9.5;

export const QUIET_VICTORY_EXAMPLES = ["A restored river", "A graduating student", "A reunited family", "A recovered archive", "A new forest", "A shared discovery"] as const;

export const TRANSCENDENCE_DEVELOPER_TOOLS = ["Transcendence dashboard", "Stewardship graph", "Hope trajectory", "Knowledge preservation map", "Educational reach analyser", "Legacy continuum viewer"] as const;

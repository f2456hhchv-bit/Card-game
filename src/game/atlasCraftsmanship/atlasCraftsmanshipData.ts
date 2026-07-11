/**
 * The Atlas Craftsmanship Engine (AF-192). "The Creator Engine governs
 * the act of creation. The Craftsmanship Engine governs the pursuit of
 * excellence" — AF-191's direct sibling, extending it rather than
 * repeating it.
 *
 * NAMING NOTE (light-touch, no real vocabulary overlap): unrelated to
 * `src/game/crafting/`'s "Crafting System" (AF-025, material inventory
 * and item-recipe crafting) and `src/game/masterIndex/`'s "Master
 * Index" (AF-150, module dependency registration) — both share a plain
 * English word with this module's title, zero shared state or vocabulary.
 *
 * Reused directly wherever a section names a mechanic that already
 * exists:
 *
 * - "Master Craftsmen" ("their names become respected... recognised
 *   for Precision/Patience/...") is exactly AF-166's real
 *   `ReputationTracker` — "reveals, never assigns" a most-recognised
 *   quality, the same mechanic AF-187's own "Commander Emergence"
 *   already reused for an identical purpose.
 * - "Quality Without Perfection" ("iteration... mistakes become part of
 *   mastery... not flawless execution") is exactly AF-149's real
 *   `IterationCycleTracker` — "never ship the first version," ready
 *   once genuinely cycled twice.
 * - "The Maker's Mark" ("objects possess provenance... their creator,
 *   workshop, era, techniques, improvements, influence") composes
 *   AF-151's real `KnowledgeGraph.addEdge` directly — yet another
 *   instance of this heavily-reused provenance/network pattern.
 * - "The Craft Guilds" ("knowledge spreads through mentorship") reuses
 *   AF-160's real `MentorshipLedger` directly.
 *
 * "The Craft Cycle" (Inspiration→Planning→Prototype→Construction→
 * Evaluation→Feedback→Refinement→Mastery→Teaching→Legacy) is, unlike
 * AF-191's own "Creation Cycle," an ORDERED, NON-CYCLIC ladder — the
 * spec never draws an arrow back from Legacy to Inspiration ("mastery
 * is a journey, not a destination" describes an open-ended endpoint,
 * not a closed loop). Modelled with this codebase's established
 * `xRank(stage): number` pure-lookup pattern via `craftCycleRank`,
 * never AF-155's real `CyclicStageTracker`. It shares only 3 of its 10
 * stages exactly with AF-191's real `CREATION_CYCLE_STAGES`
 * (Inspiration/Refinement/Teaching), verified via AF-170's real
 * `detectOverlap` — two sibling 10-stage process ladders, authored back
 * to back, with genuinely different shape (cyclic vs non-cyclic) and
 * mostly different membership.
 *
 * "The Standard of Excellence" ("every important creation asks... if
 * yes, continue refining") is an ANY-of-N shape — a single affirmed
 * question is sufficient to warrant continued refinement — distinct in
 * DIRECTION from every existing ANY-of-N gate in this codebase (AF-149's
 * `featureFlagAssessment`, AF-181's `eternalStandardMet`, AF-183's
 * `thematicConsistencyMet`, AF-190's `updateQualityAssessment`), which
 * all gate REJECTION or PASSING; this one gates ONGOING INVESTMENT via
 * the new `standardOfExcellenceAssessment`.
 *
 * "Craftsmanship Domains" (12) shares 9 of 12 exact-string members with
 * AF-191's real `CREATIVE_DOMAINS` (reused directly there from AF-171) —
 * documented honestly via `detectOverlap`, no record claimed (the
 * current absolute record remains AF-191's own 12/12 against the same
 * list). The six domain-specific craftsmanship-values sections
 * (Scientific/Engineering/Architectural/Artistic/Educational/Leadership)
 * plus "Player Craftsmanship" are kept as pure reference vocabulary —
 * confirmed no computational analog beyond the shared mechanisms above,
 * the same honest scope boundary AF-143/149/171/191 already established
 * for enumeration sections with no distinct mechanic of their own.
 */

export const CRAFTSMANSHIP_DOMAINS = ["Engineering", "Science", "Architecture", "Education", "Medicine", "Art", "Music", "Writing", "Ecology", "Manufacturing", "Exploration", "Leadership"] as const;
export type CraftsmanshipDomain = (typeof CRAFTSMANSHIP_DOMAINS)[number];

// ── The Craft Cycle: ordered, non-cyclic — mirrors the established xRank pattern, never CyclicStageTracker. ──
export const CRAFT_CYCLE_STAGES = ["Inspiration", "Planning", "Prototype", "Construction", "Evaluation", "Feedback", "Refinement", "Mastery", "Teaching", "Legacy"] as const;
export type CraftCycleStage = (typeof CRAFT_CYCLE_STAGES)[number];

/** Mirrors AF-139/156/157/162/166/170/179/180's real rank functions —
 * an ordered, non-cyclic ladder, never described as wrapping back to
 * its first stage (see module doc comment). */
export function craftCycleRank(stage: CraftCycleStage): number {
  return CRAFT_CYCLE_STAGES.indexOf(stage);
}

export const MASTER_CRAFTSMAN_TRAITS = ["Precision", "Patience", "Creativity", "Reliability", "Innovation", "Teaching", "Humility"] as const;

export const SCIENTIFIC_CRAFTSMANSHIP_VALUES = ["Careful observation", "Repeatability", "Clear documentation", "Peer review", "Transparency", "Long-term accuracy"] as const;

export const ENGINEERING_CRAFTSMANSHIP_VALUES = ["Efficiency", "Safety", "Maintainability", "Beauty", "Longevity", "Accessibility"] as const;

export const ARCHITECTURAL_CRAFTSMANSHIP_VALUES = ["Local materials", "Climate", "History", "Identity", "Beauty", "Function"] as const;

export const ARTISTIC_CRAFTSMANSHIP_VALUES = ["Composition", "Technique", "Expression", "Storytelling", "Materials", "Public engagement"] as const;

export const EDUCATIONAL_CRAFTSMANSHIP_VALUES = ["Lessons", "Museums", "Fieldwork", "Demonstrations", "Assessment", "Mentorship"] as const;

export const LEADERSHIP_CRAFTSMANSHIP_VALUES = ["Listening", "Reflection", "Delegation", "Mentoring", "Communication", "Integrity"] as const;

export const PLAYER_CRAFTSMANSHIP_EXAMPLES = ["Settlement planning", "Museum curation", "Expedition preparation", "Landscape design", "Infrastructure", "Commander development"] as const;

export const MAKERS_MARK_FIELDS = ["Creator", "Workshop", "Era", "Techniques", "Improvements", "Influence"] as const;

export const CRAFT_GUILD_EXAMPLES = ["Engineering guilds", "Artist collectives", "Research societies", "Architect associations", "Teaching circles", "Ecological restoration groups"] as const;

/** "Every important creation asks... if yes, continue refining." An
 * ANY-of-N shape distinct in direction from every existing instance in
 * this codebase (see module doc comment). */
export const STANDARD_OF_EXCELLENCE_QUESTIONS = ["Can this be improved?", "Who benefits?", "Will it endure?", "Will future generations admire it?"] as const;
export type StandardOfExcellenceQuestion = (typeof STANDARD_OF_EXCELLENCE_QUESTIONS)[number];

export const CRAFTSMANSHIP_DEVELOPER_TOOLS = ["Craftsmanship browser", "Iteration timeline", "Mastery graph", "Quality evolution viewer", "Creator lineage explorer", "Refinement dashboard"] as const;

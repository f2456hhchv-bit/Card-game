/**
 * The Atlas Excellence Engine (AF-193). "The Craftsmanship Engine
 * governs refinement. The Excellence Engine governs continual pursuit
 * of the highest achievable standards" — the third module in the
 * Creator (AF-191) → Craftsmanship (AF-192) → Excellence (AF-193)
 * trilogy, extending both rather than repeating either.
 *
 * Reused directly wherever a section names a mechanic that already
 * exists:
 *
 * - "The Excellence Cycle" (Learn→Attempt→Measure→Reflect→Improve→
 *   Validate→Teach→Inspire→"Learn Again," an explicit closed loop)
 *   reuses AF-155's real generic `CyclicStageTracker<TStage>` directly,
 *   instantiated over this module's own new 8-stage
 *   `EXCELLENCE_CYCLE_STAGES` union — unlike AF-192's own "Craft Cycle"
 *   (confirmed non-cyclic), this one explicitly loops.
 * - "Personal Excellence"'s "Mentorship" channel reuses AF-160's real
 *   `MentorshipLedger` directly.
 * - "Commander Excellence" ("their influence grows through continual
 *   learning") reuses AF-166's real `ReputationTracker` directly —
 *   the same "reveals, never assigns" mechanic AF-187's Commander
 *   Emergence and AF-192's Master Craftsmen both already reused.
 * - "Cultural Excellence" ("culture matures continuously") composes
 *   AF-159's real `CulturalTrendTracker` directly.
 * - "Institutional Excellence" ("all regularly evaluate and improve
 *   their service") reuses AF-149's real `IterationCycleTracker`
 *   directly — the same "never ship the first version" mechanic
 *   AF-192's own Quality Without Perfection already reused.
 *
 * "The Excellence Standard" (5 questions, "if yes, continue refining")
 * is the SECOND instance of AF-192's own `standardOfExcellenceAssessment`
 * shape (an ANY-of-N gate that triggers ONGOING INVESTMENT rather than
 * rejection or completion) via the new `excellenceStandardAssessment`,
 * typed to its own separate `ExcellenceStandardQuestion` union — shares
 * ZERO exact-string members with AF-192's real
 * `STANDARD_OF_EXCELLENCE_QUESTIONS` despite near-identical framing
 * ("Will it endure?" vs "Can it endure?"), verified via AF-170's real
 * `detectOverlap`.
 *
 * "The Excellence Index" (8 categories, "quality is measured
 * holistically") mirrors AF-143/149/170/173/179/180/182/184/188/190's
 * real scoring-rubric shape exactly — the ELEVENTH such rubric in this
 * codebase, typed to its own new `ExcellenceIndexCategory` union,
 * reusing the same established 9.5 gate even though this section never
 * restates the threshold explicitly. Shares only 1 of 8 exact-string
 * members with AF-190's real `ATLAS_SCORECARD_CATEGORIES`
 * (Accessibility).
 *
 * "The Improvement Network" ("every improvement records Reason/Method/
 * Evidence/Outcome/Educational value/Future opportunities") is
 * confirmed genuinely new in domain: no per-improvement structured
 * record of this exact field shape exists anywhere else (AF-190's
 * `DesignHistoryLedger` is per-MECHANIC, not per-improvement-EVENT, and
 * uses entirely different fields). The new `ImprovementNetworkLedger`
 * mirrors the established append-only-record-list shape (AF-135's
 * `EvolvingEntry`, AF-190's `DesignHistoryLedger`) rather than
 * inventing a new one.
 *
 * "Excellence Domains" (12) shares 9 of 12 exact-string members with
 * AF-191's real `CREATIVE_DOMAINS` and 8 of 12 with AF-192's real
 * `CRAFTSMANSHIP_DOMAINS` — no record claimed (current record remains
 * AF-191's own 12/12). "The Excellence Cycle" shares ZERO exact-string
 * stages with either AF-191's `CREATION_CYCLE_STAGES` or AF-192's
 * `CRAFT_CYCLE_STAGES` despite being the THIRD sibling process ladder
 * authored back to back ("Teach" vs "Teaching," "Reflect" vs
 * "Reflection") — confirmed via `detectOverlap`, an even starker
 * membership divergence than AF-186's own 0/12 domain overlap. The six
 * domain-specific excellence-values sections (Personal/Scientific/
 * Engineering/Educational/Community/Cultural) plus "Player Excellence"
 * and "Institutional Excellence"'s own institution-type examples are
 * kept as pure reference vocabulary — the same honest scope boundary
 * AF-143/149/171/191/192 already established for enumeration sections
 * with no distinct mechanic of their own.
 */

export const EXCELLENCE_DOMAINS = ["Science", "Engineering", "Education", "Leadership", "Medicine", "Architecture", "Ecology", "Culture", "Community", "Exploration", "History", "Governance"] as const;
export type ExcellenceDomain = (typeof EXCELLENCE_DOMAINS)[number];

// ── The Excellence Cycle: explicit closed loop — reuses AF-155's real generic CyclicStageTracker directly. ──
export const EXCELLENCE_CYCLE_STAGES = ["Learn", "Attempt", "Measure", "Reflect", "Improve", "Validate", "Teach", "Inspire"] as const;
export type ExcellenceCycleStage = (typeof EXCELLENCE_CYCLE_STAGES)[number];

export const PERSONAL_EXCELLENCE_CHANNELS = ["Practice", "Reflection", "Mentorship", "Education", "Curiosity", "Resilience", "Experience"] as const;

export const COMMANDER_EXCELLENCE_CHANNELS = ["Leadership", "Decision making", "Scientific understanding", "Teaching", "Communication", "Strategic thinking", "Compassion"] as const;

export const SCIENTIFIC_EXCELLENCE_VALUES = ["Evidence", "Replication", "Transparency", "Peer review", "Curiosity", "Integrity", "Collaboration"] as const;

export const ENGINEERING_EXCELLENCE_VALUES = ["Reliability", "Maintainability", "Accessibility", "Efficiency", "Safety", "Beauty", "Longevity"] as const;

export const EDUCATIONAL_EXCELLENCE_CHANNELS = ["Research", "Teaching innovation", "Student feedback", "Field learning", "Museums", "Mentorship", "Accessibility"] as const;

export const COMMUNITY_EXCELLENCE_CHANNELS = ["Public spaces", "Volunteerism", "Healthcare", "Education", "Ecology", "Neighbourhood identity", "Mutual trust"] as const;

export const CULTURAL_EXCELLENCE_VALUES = ["Curiosity", "Respect", "Open discussion", "Creativity", "Public learning", "Stewardship", "Shared responsibility"] as const;

export const INSTITUTIONAL_EXCELLENCE_EXAMPLES = ["Museums", "Universities", "Hospitals", "Observatories", "Libraries", "Research centres"] as const;

export const PLAYER_EXCELLENCE_EXAMPLES = ["City planning", "Research strategy", "Ecological restoration", "Museum curation", "Commander development", "Expedition preparation"] as const;

/** "If yes... continue refining." The SECOND instance of AF-192's real
 * `standardOfExcellenceAssessment` shape (ANY-of-N, gating ongoing
 * investment), typed to its own separate union — shares zero exact
 * members with AF-192's real `STANDARD_OF_EXCELLENCE_QUESTIONS` (see
 * module doc comment). */
export const EXCELLENCE_STANDARD_QUESTIONS = ["Can it teach?", "Can it inspire?", "Can it endure?", "Can it become more accessible?", "Can future generations improve it?"] as const;
export type ExcellenceStandardQuestion = (typeof EXCELLENCE_STANDARD_QUESTIONS)[number];

export const IMPROVEMENT_NETWORK_FIELDS = ["Reason", "Method", "Evidence", "Outcome", "Educational value", "Future opportunities"] as const;

// ── The Excellence Index: the ELEVENTH mirrored scoring-rubric shape in this codebase. ──
export const EXCELLENCE_INDEX_CATEGORIES = ["Educational quality", "Scientific integrity", "Engineering reliability", "Environmental stewardship", "Institutional resilience", "Community wellbeing", "Historical preservation", "Accessibility"] as const;
export type ExcellenceIndexCategory = (typeof EXCELLENCE_INDEX_CATEGORIES)[number];

export const EXCELLENCE_INDEX_GATE_THRESHOLD = 9.5;

export const EXCELLENCE_DEVELOPER_TOOLS = ["Excellence dashboard", "Continuous improvement viewer", "Institution benchmarking", "Learning graph", "Quality evolution browser", "Mastery analyser"] as const;

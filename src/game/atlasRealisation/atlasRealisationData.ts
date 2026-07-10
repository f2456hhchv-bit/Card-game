/**
 * The Atlas Possibility Realisation Engine (AF-188). AF-187's
 * Emergence allows unexpected outcomes to appear; the Realisation
 * Engine governs how ideas transition from imagination into reality.
 *
 * NAMING SCOPE NOTE: this module lives entirely under its own
 * `atlasRealisation/` directory — distinct from both the already-
 * locked AF-159 `atlasPossibility/` ("Atlas Possibility Engine":
 * serendipity, mysteries, opportunity) and AF-173
 * `atlasPossibilitySpace/` ("Atlas Possibility Space": sandboxed,
 * not-yet-committed scenarios). AF-188 never redefines either.
 *
 * Reused directly wherever a section names a mechanic that already
 * exists:
 *
 * - "Scientific Realisation" ("evidence... replication... field
 *   testing") composes AF-172's real `HypothesisTracker` directly.
 * - "Commander Realisation" composes AF-160's real `MentorshipLedger`
 *   directly.
 * - "Institutional Realisation" ("founding charter... institutions
 *   mature naturally") reuses AF-177's real `GenesisRegistry`
 *   directly — a new institution's founding is exactly the "who
 *   began it, why, where, when, who believed in it" origin event that
 *   class already models.
 * - "Cultural Realisation" composes AF-159's real `CulturalTrendTracker`
 *   directly.
 * - "Player Realisation" ("idea... investment... execution...
 *   completion") reuses AF-162's real `LongTermMissionTracker`
 *   directly — `register`/`advance`/`progressFor`/`isComplete` already
 *   models exactly this arc.
 * - "The Implementation Network" and "The Ripple Effect" both compose
 *   AF-151's real `KnowledgeGraph.addEdge` directly.
 * - "Feedback Loop" ("reality creates future possibility") composes
 *   AF-159's real `MysteryLog.open` and AF-169's real
 *   `ensureNextHorizonOpen` directly.
 *
 * "Realisation Domains" (12) shares 9 of 12 exact-string members with
 * AF-178's real `RENAISSANCE_DOMAINS`, verified using AF-170's real
 * `detectOverlap` function — documented honestly, no record claimed
 * since the codebase's current record is 11/12.
 *
 * "Quality Gates" (7 criteria) mirrors the SHAPE of AF-143/149/170/
 * 173/179/180/182/184's real scoring rubrics — the NINTH mirrored
 * rubric in this codebase, sharing exactly 3 of its 7 criteria
 * ("Scientific plausibility", "Engineering feasibility", "Historical
 * consistency") verbatim with AF-173's real `INNOVATION_FILTER_CRITERIA`,
 * confirmed via `detectOverlap`, and reusing the same 9.5 gate
 * threshold — kept as its own separate rubric rather than reused
 * directly, since 4 of its 7 criteria genuinely differ.
 *
 * "Realisation Stages" (Wonder → ... → Legacy, an ordered, non-cyclic
 * 12-stage journey where "progress is earned... not automatic") and
 * "The Implementation Archive"'s governing guarantee together
 * describe the module's own genuinely new contribution:
 * `RealisationTracker`. Unlike AF-155's real `CyclicStageTracker`
 * (which accepts any stage in any order, a pure append-only log) and
 * this codebase's established `xRank(stage): number` pattern (a pure
 * lookup with no enforcement), `RealisationTracker.advanceTo` is the
 * FIRST tracker in this codebase that structurally REJECTS
 * out-of-order or skipped-ahead advancement — an idea cannot become
 * "Legacy" without first passing through every earlier stage in
 * sequence, confirmed by a dedicated test.
 */

export const REALISATION_STAGES = ["Wonder", "Question", "Hypothesis", "Research", "Experiment", "Prototype", "Validation", "Implementation", "Education", "Adoption", "Tradition", "Legacy"] as const;
export type RealisationStage = (typeof REALISATION_STAGES)[number];

export const REALISATION_DOMAINS = ["Science", "Engineering", "Medicine", "Architecture", "Education", "Ecology", "Culture", "Technology", "Infrastructure", "Exploration", "Institutions", "Civilisation"] as const;
export type RealisationDomain = (typeof REALISATION_DOMAINS)[number];

export const SCIENTIFIC_REALISATION_EXAMPLES = ["Observation", "Evidence", "Peer review", "Replication", "Field testing", "Educational adoption", "Museum documentation"] as const;

export const ENGINEERING_REALISATION_EXAMPLES = ["Concept", "Design", "Simulation", "Prototype", "Safety review", "Construction", "Operational testing", "Public deployment", "Maintenance", "Historical preservation"] as const;

export const COMMANDER_REALISATION_EXAMPLES = ["Planning", "Leadership", "Collaboration", "Mentorship", "Delegation", "Evaluation", "Reflection", "Legacy"] as const;

export const INSTITUTIONAL_REALISATION_EXAMPLES = ["Community need", "Founding charter", "Funding", "Construction", "Recruitment", "Education", "Growth", "Historic significance"] as const;

export const CULTURAL_REALISATION_EXAMPLES = ["Small gatherings", "Community adoption", "Annual repetition", "Intergenerational participation", "Historical recognition", "Shared identity"] as const;

export const PLAYER_REALISATION_EXAMPLES = ["Idea", "Preparation", "Investment", "Collaboration", "Execution", "Completion", "Community impact", "Historical remembrance"] as const;

export const IMPLEMENTATION_NETWORK_LINKS = ["Original inspiration", "Contributors", "Institutions", "Scientific foundations", "Educational impact", "Future opportunities"] as const;

export const FEEDBACK_LOOP_EXAMPLES = ["New knowledge", "New questions", "New opportunities", "New collaborators", "New frontiers"] as const;

export const QUALITY_GATE_CRITERIA = ["Scientific plausibility", "Engineering feasibility", "Historical consistency", "Accessibility", "Environmental stewardship", "Civilisational value", "Long-term sustainability"] as const;
export type QualityGateCriterion = (typeof QUALITY_GATE_CRITERIA)[number];

export const QUALITY_GATE_THRESHOLD = 9.5;

export const RIPPLE_EFFECT_EXAMPLES = ["Universities", "Cities", "Expeditions", "Children", "Commanders", "Entire civilisations"] as const;

export const IMPLEMENTATION_ARCHIVE_FIELDS = ["Origin", "Contributors", "Timeline", "Challenges", "Lessons learned", "Long-term influence"] as const;

export const REALISATION_DEVELOPER_TOOLS = ["Implementation timeline", "Prototype viewer", "Dependency explorer", "Contribution graph", "Innovation maturity dashboard", "Realisation pipeline browser"] as const;

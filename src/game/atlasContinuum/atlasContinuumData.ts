/**
 * The Atlas Continuum (AF-176). Sits above AF-175's Infinity Engine:
 * the Infinity Engine ensures civilisation always has another future,
 * the Continuum ensures every past, present and future remain
 * permanently connected. Reused directly wherever a section names a
 * mechanic that already exists:
 *
 * - "The Continuum" (Past → Memory → Learning → Present → Choice →
 *   Future → Legacy → Past Again, "history becomes a living cycle")
 *   is driven directly by AF-155's real generic
 *   `CyclicStageTracker<TStage>` over this module's own 8-stage
 *   `CONTINUUM_STAGES` union — the same explicitly-cyclic reuse
 *   AF-175's "Evolution Cycles" already made.
 * - "Time Continuity" ("every event permanently links to previous
 *   causes, consequences, future discoveries...") and "The Threads"
 *   ("every important object becomes a thread... connects people,
 *   places, events, ideas, discoveries, institutions, generations")
 *   are the SAME question AF-151's real `KnowledgeGraph.addEdge`
 *   already answers — an arbitrary-relationship edge store, reused
 *   directly for both rather than two new linked-network registries.
 * - "Generational Continuity" and "Player Continuity" ("not separate
 *   save files... one continuous human journey... future campaigns
 *   naturally reference them") both reuse AF-175's real
 *   `GenerationalHandoffLedger` directly — the SAME ledger instance
 *   spans generations AND campaigns, since both are the identical
 *   "inherited baseline, never from zero" mechanic under different
 *   names. Only 2 of this module's own 9 `GENERATIONAL_CONTINUITY_EXAMPLES`
 *   ("Culture", "Questions") are exact-string members of AF-175's
 *   real closed `GenerationalHandoffCategory` union — the rest stay
 *   reference vocabulary describing the same mechanism in different
 *   words.
 * - "Commander Continuity" ("students... even after retirement")
 *   composes AF-160's real `MentorshipLedger` directly.
 * - "Continuous Culture" ("music evolves... identity remains")
 *   composes AF-159's real `CulturalTrendTracker` directly.
 * - "Continuous Questions" ("every solved mystery reveals a deeper
 *   mystery... understanding expands forever") composes AF-159's real
 *   `MysteryLog.open`/`resolve` and AF-169's real
 *   `ensureNextHorizonOpen` directly — this is at least the FOURTH
 *   module (after AF-172/174/175) to reuse this exact
 *   completion-chains-to-a-new-mystery guarantee, never a fifth
 *   near-duplicate chaining function.
 *
 * "Continuum Domains" (12) is confirmed to TIE (not break) the
 * codebase's current absolute overlap record: TEN of its 12 members
 * are exact-string matches with AF-175's real `INFINITY_DOMAINS`,
 * verified using AF-170's real `detectOverlap` function.
 *
 * "Continuous Discovery" and "Continuous Civilisation" both read as
 * near-total conceptual duplicates of AF-174's real
 * `DISCOVERY_CASCADE_OUTCOMES` and AF-175's real
 * `SELF_GROWING_SYSTEM_EXAMPLES` respectively, but `detectOverlap`
 * confirms ZERO exact-string members shared with either (the "New "
 * prefix and differing verbs mean the wording never lines up exactly,
 * the same near-duplicate-but-not-identical pattern AF-171 already
 * documented for its own "Creative Movements").
 *
 * "The Threads"' governing guarantee — "nothing exists in
 * isolation" — is confirmed genuinely new as a STRUCTURAL check (not
 * just a graph edge): `ThreadRegistry` curates which entity ids count
 * as a "thread" (permanently significant, cross-referenced), and the
 * module's own `allThreadsConnected` composes AF-151's real
 * `KnowledgeGraph.isIsolated` to verify none of them have drifted into
 * isolation — a fundamentally different question from AF-151's own
 * edge store (which treats every node uniformly and has no concept of
 * "marked as important").
 */

export const CONTINUUM_STAGES = ["Past", "Memory", "Learning", "Present", "Choice", "Future", "Legacy", "Past Again"] as const;
export type ContinuumStage = (typeof CONTINUUM_STAGES)[number];

export const CONTINUUM_DOMAINS = ["History", "Memory", "Knowledge", "Education", "Identity", "Civilisation", "Culture", "Science", "Relationships", "Architecture", "Ecology", "Exploration"] as const;
export type ContinuumDomain = (typeof CONTINUUM_DOMAINS)[number];

export const TIME_CONTINUITY_LINKS = ["Previous causes", "Immediate consequences", "Long-term influence", "Future discoveries", "Educational material", "Historical interpretation"] as const;

export const GENERATIONAL_CONTINUITY_EXAMPLES = ["Cities", "Ideas", "Values", "Institutions", "Relationships", "Technology", "Culture", "Questions", "Dreams"] as const;

export const COMMANDER_CONTINUITY_EXAMPLES = ["Students", "Research", "Institutions", "Exploration", "Leadership", "Museum archives", "Historic literature"] as const;

export const PLAYER_CONTINUITY_EXAMPLES = ["Traditions", "Architecture", "Academies", "Historic expeditions", "Protected ecosystems", "Commander philosophies", "Museum collections"] as const;

export const CONTINUOUS_DISCOVERY_EXAMPLES = ["Research", "Education", "Museum exhibits", "Historical debate", "Future expeditions", "Scientific inspiration"] as const;

export const CONTINUOUS_CIVILISATION_EXAMPLES = ["Buildings change purpose", "Universities expand", "Museums gain wings", "Gardens mature", "Communities redefine themselves"] as const;

export const CONTINUOUS_EDUCATION_EXAMPLES = ["New research", "Student projects", "Engineering solutions", "Historic reinterpretation", "Commander mentorship"] as const;

export const CONTINUOUS_ECOLOGY_EXAMPLES = ["Growing", "Migrating", "Adapting", "Interacting", "Recovering", "Teaching"] as const;

export const CONTINUOUS_CULTURE_EXAMPLES = ["Music evolves", "Architecture evolves", "Festivals evolve", "Language evolves", "Stories evolve", "Traditions evolve"] as const;

export const CONTINUOUS_QUESTION_EXAMPLES = ["A deeper mystery", "A broader question", "A forgotten connection", "An unexpected implication"] as const;

export const THREAD_CONNECTION_KINDS = ["People", "Places", "Events", "Ideas", "Discoveries", "Institutions", "Generations"] as const;

export const CONTINUUM_MAP_TOOLS = ["Historical thread viewer", "Generational timeline", "Discovery cascade", "Relationship lineage", "Institution evolution", "Civilisation continuity graph"] as const;

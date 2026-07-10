/**
 * The Atlas Renaissance Engine (AF-178). Sits alongside AF-177's
 * Genesis Engine: Genesis creates beginnings, the Renaissance Engine
 * creates ages. Reused directly wherever a section names a mechanic
 * that already exists:
 *
 * - "Architectural Renaissance"' "beauty becomes civic identity" is
 *   exactly AF-168's real `BeautyIndexTracker` — reused directly
 *   rather than a second civic-beauty measure.
 * - "Cultural Renaissance" composes AF-159's real
 *   `CulturalTrendTracker` directly.
 * - "The Renaissance Network" ("one breakthrough inspires another...
 *   civilisation enters positive feedback loops") is exactly AF-151's
 *   real `KnowledgeGraph.addEdge` using the already-real `"Inspired"`
 *   `GraphEdgeKind` — the SAME reuse AF-177's "The Spark Network"
 *   already made, never a second inspiration-chain mechanic.
 * - "The End of an Age" ("their achievements become the foundations of
 *   the next era") reuses AF-175's real `GenerationalHandoffLedger`
 *   directly — a concluded golden age's contributions become exactly
 *   the inherited baseline that ledger already models.
 *
 * "Renaissance Domains" (12) is confirmed a NEW ABSOLUTE overlap
 * record in this codebase: ELEVEN of its 12 members are exact-string
 * matches with AF-171's real `CREATIVE_DOMAINS`, verified using
 * AF-170's real `detectOverlap` function, surpassing the previous
 * 10-member record.
 *
 * "Triggers" and "The Golden Age" together describe the module's own
 * genuinely new contribution: `RenaissanceTracker`. "A renaissance
 * cannot be forced... it emerges when knowledge, leadership,
 * creativity, education, opportunity, cooperation, hope all align
 * together" and "multiple triggers compound together" is modelled as
 * a compounding-diversity gate — recording the SAME trigger kind
 * repeatedly never starts an age, only recording enough DISTINCT
 * trigger kinds does, confirmed by a dedicated test. "The End of an
 * Age"'s "renaissances conclude naturally, not through collapse,
 * through maturity" is modelled as an explicit `concludeAge` call,
 * never an automatic timeout or decay — a fundamentally different
 * shape from every existing "score crosses a threshold" gate in this
 * codebase (AF-143/149/170/173's scoring rubrics), since those measure
 * QUALITY of a fixed criterion set, not DIVERSITY of accumulating
 * qualitative events.
 *
 * "Commander Renaissance," "Scientific Renaissance," "Educational
 * Renaissance," "Ecological Renaissance," and "Legacy of Ages" stay
 * pure reference vocabulary: the intended composition is calling
 * AF-160's real `MentorshipLedger`, AF-172's real `HypothesisTracker`,
 * AF-165's real `InstitutionalMemoryTracker`, and AF-163's real
 * `SignificanceTracker` together at the call site, never new
 * duplicate trackers for effects already modelled elsewhere.
 */

export const RENAISSANCE_DOMAINS = ["Science", "Engineering", "Education", "Architecture", "Medicine", "Ecology", "Art", "Music", "Literature", "Exploration", "Culture", "Civilisation"] as const;
export type RenaissanceDomain = (typeof RENAISSANCE_DOMAINS)[number];

export const RENAISSANCE_TRIGGERS = ["Historic scientific discovery", "Legendary Commander", "Educational revolution", "Recovered ancient archive", "Planetary restoration", "Interstellar cooperation", "Museum milestone", "Player achievement"] as const;
export type RenaissanceTrigger = (typeof RENAISSANCE_TRIGGERS)[number];

export const GOLDEN_AGE_EFFECTS = ["Scientific breakthroughs increase", "Architecture flourishes", "Universities expand", "Museums become busier", "Public celebrations increase", "Commander collaboration grows", "Children become more inspired"] as const;

export const COMMANDER_RENAISSANCE_EXAMPLES = ["New academies", "Leadership movements", "Scientific societies", "Engineering standards", "Mentorship traditions"] as const;

export const SCIENTIFIC_RENAISSANCE_EXAMPLES = ["Research collaboration", "Rapid discovery", "Cross-disciplinary innovation", "Publication booms", "Global conferences", "Student inspiration"] as const;

export const ARCHITECTURAL_RENAISSANCE_EXAMPLES = ["New skylines", "Public gardens", "Observatories", "Museums", "Learning districts", "Parks"] as const;

export const CULTURAL_RENAISSANCE_EXAMPLES = ["Music", "Art", "Literature", "Public lectures", "Festivals", "Theatre", "Public science"] as const;

export const ECOLOGICAL_RENAISSANCE_EXAMPLES = ["Species return", "Forests mature", "Oceans recover", "Parks expand", "Cities integrate nature", "Planetary wellbeing improves"] as const;

export const EDUCATIONAL_RENAISSANCE_EXAMPLES = ["Exploration programmes", "Scientific competitions", "Museum learning", "Mentorship", "Innovation labs", "Historical expeditions"] as const;

export const LEGACY_OF_AGES_EXAMPLES = ["Museum galleries", "University courses", "Public holidays", "Architectural preservation", "Commander biographies"] as const;

export const RENAISSANCE_DEVELOPER_TOOLS = ["Golden age timeline", "Renaissance trigger viewer", "Innovation cascade graph", "Cultural prosperity map", "Historical era browser", "Civilisation momentum dashboard"] as const;

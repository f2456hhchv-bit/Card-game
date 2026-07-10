/**
 * The Atlas Creative Intelligence (AF-171). Ensures the Afterlight
 * universe never stops creating — creatively, not procedurally.
 * Reused directly wherever a section names a mechanic that already
 * exists:
 *
 * - "Cultural Creativity" and "Creative Movements" both reuse AF-159's
 *   real `CulturalTrendTracker` mechanic directly — "Creative
 *   Movements" in particular is a near-total conceptual duplicate of
 *   AF-159's real `CULTURAL_EVOLUTION_EXAMPLES` (only "Architectural
 *   movements" matches as an exact string, since "Educational
 *   reforms"/"Scientific philosophies" differ from AF-159's "Education
 *   reforms"/"Scientific philosophy" by pluralisation alone) — kept as
 *   its own reference list since no exact-string merge is honest, but
 *   composed through the SAME real tracker rather than a second one.
 * - "Educational Creativity"'s "Mentorship programmes" and "Creative
 *   Network"'s "Mentorship" both reuse AF-160's real `MentorshipLedger`
 *   directly.
 * - "Player Creativity"'s "Photography" reuses AF-165's real
 *   `PlayerMemoryTracker.photograph` directly.
 * - "Collaborative Creation" is confirmed (at minimum) the SEVENTH
 *   instance of AF-155's real `CollaborativeProblemLog` mechanic in
 *   this codebase.
 * - "Beauty Principle" ("beauty is a core system, not decoration") is
 *   exactly AF-168's real `BeautyIndexTracker`, reused directly.
 * - "Creative Network" also reuses AF-151's real `KnowledgeGraph`
 *   directly for how ideas spread between people and institutions.
 * - "Discovery Through Creation" ("building something new reveals...
 *   creation generates discovery") composes AF-159's real
 *   `MysteryLog.open` directly at the call site — the same "a new
 *   horizon opens" mechanic AF-169's `ensureNextHorizonOpen` already
 *   formalised, reused here without a third chaining function.
 *
 * "Creative Domains" (12) is confirmed a NEW ABSOLUTE overlap record
 * in this codebase: NINE of its 12 members are exact-string matches
 * with AF-169's real `LEGACY_DOMAINS` (Science/Engineering/
 * Architecture/Art/Education/Ecology/Exploration/Culture/Community) —
 * verified using AF-170's real `detectOverlap` function, surpassing
 * the previous 8-member absolute record (AF-162 vs AF-161, AF-169 vs
 * AF-162). Kept as its own separate reference vocabulary: it tags
 * which domain a CREATIVE act belongs to, a fourth distinct question
 * from "meaningful goal" (Purpose), "emotional significance" (Meaning)
 * and "cross-generational inheritance" (Legacy).
 *
 * "Creative Heritage" (5 outcomes: Museum exhibits/University
 * curriculum/Historic landmarks/Public traditions/Commander
 * inspiration) mirrors the SHAPE of AF-157/158/159/160/162's real
 * memory-archive classes — the SIXTH mirrored "completed work becomes
 * a named output" archive in this codebase, typed to its own separate
 * union.
 *
 * `CreativeContributionLog` is the module's own genuinely new piece:
 * one generic append-only log, keyed by entity id and `CreativeDomain`,
 * serving every one of the "X Creativity" sections (Commander/
 * Scientific/Engineering/Educational) uniformly rather than four
 * near-identical trackers. "Commander Creativity"'s "creative
 * expression reflects personality" is deliberately never wired to
 * AF-030's real `PersonalityTrait` — that class remains dialogue-only
 * by design law, exactly as AF-155/156/166 already established.
 */

export const CREATIVE_DOMAINS = ["Science", "Engineering", "Architecture", "Music", "Art", "Literature", "Education", "Medicine", "Ecology", "Exploration", "Culture", "Community"] as const;
export type CreativeDomain = (typeof CREATIVE_DOMAINS)[number];

export const CREATIVE_SOURCES = ["Experience", "Collaboration", "Failure", "Observation", "Experimentation", "Historical reflection", "Environmental adaptation", "Unexpected discovery", "Cross-disciplinary thinking", "Player influence"] as const;

export const COMMANDER_CREATIVITY_EXAMPLES = ["Original teaching methods", "New expedition strategies", "Scientific hypotheses", "Engineering solutions", "Personal rituals", "Leadership innovations"] as const;

export const SCIENTIFIC_CREATIVITY_EXAMPLES = ["Novel experiments", "Unexpected hypotheses", "Alternative methodologies", "New classification systems", "Innovative instruments"] as const;

export const ENGINEERING_CREATIVITY_EXAMPLES = ["Construction techniques", "Infrastructure layouts", "Adaptive habitats", "Energy systems", "Manufacturing processes", "Transport improvements"] as const;

export const CULTURAL_CREATIVITY_EXAMPLES = ["Festivals", "Songs", "Artwork", "Architecture", "Cuisine", "Literature", "Public traditions"] as const;

export const EDUCATIONAL_CREATIVITY_EXAMPLES = ["Learning experiences", "Museum exhibits", "Field expeditions", "Interactive lessons", "Scientific demonstrations", "Mentorship programmes"] as const;

export const PLAYER_CREATIVITY_EXAMPLES = ["Unique settlement layouts", "Museum curation", "Expedition planning", "Photography", "Architecture", "Gardens", "Written journals", "Memorials"] as const;

export const COLLABORATIVE_CREATION_PARTICIPANTS = ["Scientists", "Artists", "Engineers", "Teachers", "Explorers", "Children", "Communities"] as const;

export const CREATIVE_MOVEMENT_EXAMPLES = ["Architectural movements", "Musical eras", "Scientific philosophies", "Educational reforms", "Public art", "Environmental design"] as const;

/** The SIXTH mirrored "completed work becomes a named output" archive
 * in this codebase (see module doc comment) — typed to its own
 * separate union. */
export const CREATIVE_HERITAGE_OUTCOMES = ["Museum exhibits", "University curriculum", "Historic landmarks", "Public traditions", "Commander inspiration"] as const;
export type CreativeHeritageOutcome = (typeof CREATIVE_HERITAGE_OUTCOMES)[number];

export const DISCOVERY_THROUGH_CREATION_EXAMPLES = ["Ancient knowledge", "Hidden ecosystems", "Unexpected technologies", "New scientific questions"] as const;

export const CREATIVE_NETWORK_CHANNELS = ["Schools", "Museums", "Libraries", "Universities", "Expeditions", "Mentorship", "Friendship"] as const;

export const CREATIVE_INTELLIGENCE_DEVELOPER_TOOLS = ["Creativity graph", "Innovation timeline", "Cultural movement browser", "Idea propagation viewer", "Architectural evolution map", "Creative collaboration dashboard"] as const;

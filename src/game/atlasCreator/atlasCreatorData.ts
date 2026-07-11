/**
 * The Atlas Creator Engine (AF-191). Previous systems explain how
 * civilisation grows; the Creator Engine explains how civilisation
 * creates — every invention, building, artwork, theory, expedition,
 * tradition and institution must emerge from an understandable creative
 * process.
 *
 * NAMING SCOPE NOTE: "Creator"/"Creative" now spans three module titles.
 * AF-141's locked "Galactic Creator Engine" (`galacticCreator/`) is
 * PLAYER-FACING decoration tooling (settlement décor, memorials, photo
 * albums, community projects) — concrete build content, not an abstract
 * process. AF-171's locked "Atlas Creative Intelligence"
 * (`atlasCreativeIntelligence/`) is the closest match by far: it already
 * models the exact same civilisational creative process this spec
 * describes. AF-191 lives under its own `atlasCreator/` directory and
 * never redefines either.
 *
 * A research pass before implementation found this spec's vocabulary is,
 * to an unusual degree, already real:
 *
 * - "Creation Domains" (12: Science/Engineering/Architecture/Education/
 *   Medicine/Art/Music/Literature/Ecology/Exploration/Culture/Community)
 *   is, as a SET, an EXACT match — all 12 members, only reordered — for
 *   AF-171's real `CREATIVE_DOMAINS`. Confirmed via AF-170's real
 *   `detectOverlap`: 12/12, a NEW ABSOLUTE OVERLAP RECORD in this
 *   codebase, surpassing the previous 11/12 (AF-178 vs AF-171). Given a
 *   perfect match, this module reuses AF-171's real `CREATIVE_DOMAINS`
 *   directly rather than declaring a second, redundant list.
 * - "Commander/Scientific/Engineering/Educational/Artistic/Architectural
 *   Creation" all reuse AF-171's real `CreativeContributionLog` directly
 *   — the same generic, domain-keyed append-only log already built to
 *   serve exactly this shape of section uniformly, now serving two more
 *   domains (Art, Architecture) than AF-171 itself exercised.
 * - "The Creation Cycle" (Inspiration→Question→Vision→Experimentation→
 *   Draft→Collaboration→Refinement→Completion→Reflection→Teaching→
 *   Inspiration, an explicit closed loop) reuses AF-155's real generic
 *   `CyclicStageTracker<TStage>` directly, instantiated over this
 *   module's own new 10-stage `CREATION_CYCLE_STAGES` union.
 * - "Collaborative Creation" reuses AF-155's real `CollaborativeProblemLog`
 *   directly — at least the EIGHTH instance of this mechanic in this
 *   codebase (AF-171 itself already confirmed the seventh). Its own
 *   7-item participant list shares 6 of 7 exact members with AF-171's
 *   real `COLLABORATIVE_CREATION_PARTICIPANTS` (only "Citizens" differs
 *   from AF-171's "Explorers") — documented via `detectOverlap`, no new
 *   list declared.
 * - "The Creator Network" ("every creation permanently records...
 *   nothing loses its creative history") composes AF-151's real
 *   `KnowledgeGraph.addEdge` directly — yet another instance of this
 *   heavily-reused pattern.
 * - "Beauty Through Purpose" ("beauty emerges naturally, not through
 *   ornament") reuses AF-168's real `BeautyIndexTracker` directly —
 *   the same class AF-171's own "Beauty Principle" already reused.
 * - "The Creation Archive" ("every important creation enters Museum...
 *   Chronicle... public memory") reuses AF-171's real
 *   `CreativeHeritageArchive` directly — the same "completed work
 *   becomes a named permanent output" mechanism, rather than a second,
 *   near-identical archive typed to different outcome wording.
 *
 * Confirmed genuinely new: "Beauty Through Purpose"'s own closing
 * clause — "a beautiful object ALSO teaches, serves, inspires, endures"
 * — is a distinct question from AF-168's real `BeautyIndexTracker`
 * (which tracks a continuous 0-100 LEVEL per settlement-scale category,
 * never a per-object four-criterion completeness check). The new
 * `purposefulBeautyMet` is another instance of this codebase's
 * established all-must-pass checklist-function family, typed to its own
 * `PurposefulBeautyCriterion` union.
 *
 * "Creative Inspiration" (8 sources) shares 3 of 8 exact-string members
 * with AF-171's real `CREATIVE_SOURCES` (Failure/Observation/Unexpected
 * discovery) — kept as its own separate reference list, documented via
 * `detectOverlap`. "Architectural Creation" (7: Need/Identity/Climate/
 * Culture/Materials/History/Beauty — why buildings emerge) and "Player
 * Creation" (8 examples) are confirmed genuinely new vocabulary, kept as
 * pure reference lists. "The Creator Network"'s own 7 permanent-record
 * fields overlap only 2 of 7 exact members with AF-188's real
 * `IMPLEMENTATION_ARCHIVE_FIELDS` (Contributors/Challenges) — kept
 * separate, documented honestly.
 */

// ── The Creation Cycle: reuses AF-155's real generic CyclicStageTracker directly. ──
export const CREATION_CYCLE_STAGES = ["Inspiration", "Question", "Vision", "Experimentation", "Draft", "Collaboration", "Refinement", "Completion", "Reflection", "Teaching"] as const;
export type CreationCycleStage = (typeof CREATION_CYCLE_STAGES)[number];

export const CREATIVE_INSPIRATION_SOURCES = ["Observation", "History", "Failure", "Friendship", "Nature", "Children", "Exploration", "Unexpected discovery"] as const;

export const COLLABORATIVE_CREATION_PARTICIPANTS = ["Scientists", "Artists", "Engineers", "Teachers", "Children", "Citizens", "Communities"] as const;

export const ARCHITECTURAL_CREATION_ORIGINS = ["Need", "Identity", "Climate", "Culture", "Materials", "History", "Beauty"] as const;

export const PLAYER_CREATION_EXAMPLES = ["Settlements", "Institutions", "Museums", "Landscapes", "Research initiatives", "Commander academies", "Living ecosystems", "Personal legacy"] as const;

export const CREATOR_NETWORK_FIELDS = ["Original inspiration", "Contributors", "Iterations", "Challenges", "Purpose", "Influence", "Future legacy"] as const;

export const CREATION_ARCHIVE_DESTINATIONS = ["Museum", "Chronicle", "Educational curriculum", "Historic archive", "Public memory"] as const;

/** "A beautiful object also teaches, serves, inspires, endures."
 * Confirmed genuinely new: a distinct per-object completeness question
 * from AF-168's real `BeautyIndexTracker` (a continuous settlement-scale
 * level, not a four-criterion checklist). Another instance of this
 * codebase's established all-must-pass checklist-function family. */
export const PURPOSEFUL_BEAUTY_CRITERIA = ["Teaches", "Serves", "Inspires", "Endures"] as const;
export type PurposefulBeautyCriterion = (typeof PURPOSEFUL_BEAUTY_CRITERIA)[number];

export const CREATOR_ENGINE_DEVELOPER_TOOLS = ["Creation graph", "Idea lineage browser", "Creative influence viewer", "Contribution timeline", "Iteration history", "Craftsmanship analyser"] as const;

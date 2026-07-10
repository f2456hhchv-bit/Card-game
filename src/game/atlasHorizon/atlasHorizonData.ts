/**
 * The Atlas Horizon Engine (AF-174). Governs humanity's relationship
 * with the unknown — the perpetual-frontier layer sitting above every
 * prior Atlas module, formalising the "horizon" concept AF-169's real
 * `ensureNextHorizonOpen` first introduced and AF-172's own "Horizon
 * Effect" section already reused. Reused directly wherever a section
 * names a mechanic that already exists:
 *
 * - "Commander Horizons" ("every Commander develops future
 *   ambitions... dreams evolve, never end") is exactly AF-161's real
 *   `CommanderBeliefTracker` — the THIRD reuse of that plain evolving-
 *   string generic for an "aspiration that evolves" concept, after
 *   AF-161's own beliefs and AF-172's "Commander Visions."
 * - "Living Frontiers" and "The Unknown Index" (mysteries the universe
 *   intentionally retains, never solved for their own sake) both
 *   compose AF-159's real `MysteryLog.open`/`unsolved` directly —
 *   "Lost expeditions" and "Incomplete research" are verbatim-shared
 *   members between this module's own `LIVING_FRONTIER_EXAMPLES` and
 *   AF-159's real `MYSTERY_KINDS`, confirming the same mechanic.
 * - "Horizon Network" ("every new horizon links to knowledge, history,
 *   resources, people, institutions, expeditions, future
 *   possibilities") composes AF-151's real `KnowledgeGraph.addEdge`
 *   directly — an arbitrary-relationship edge store already answers
 *   exactly this question, no second linked-network registry.
 * - "Beyond the Map" ("every explored region reveals hints of...")
 *   and "Legacy Horizons" ("legacy creates tomorrow's horizon") both
 *   reuse AF-169's real `ensureNextHorizonOpen` directly — the SAME
 *   completion-chains-to-a-new-mystery function AF-172's "Horizon
 *   Effect" already reused, never a second chaining mechanic.
 * - "Civilisation Horizons" (the 8-stage "ambitions expand" ladder:
 *   Survive/Restore/Discover/Understand/Inspire/Guide/Imagine/Reach
 *   further) is driven directly by AF-155's real generic
 *   `CyclicStageTracker<TStage>` over this module's own
 *   `CIVILISATION_HORIZON_STAGES` union — wraparound after "Reach
 *   further" fits "dreams evolve, never end" thematically as well as
 *   structurally.
 * - "Discovery Cascade" and "Educational Horizons" stay pure
 *   reference vocabulary: the intended composition is calling
 *   AF-159's real `MysteryLog.open`, AF-151's real
 *   `KnowledgeGraph.addEdge`, and AF-161's real `CommanderBeliefTracker`
 *   together at the call site for one discovery event, never a new
 *   cascade class duplicating what those three already do.
 *
 * "Horizon Categories" (12) ties (does not break) the codebase's 8/12
 * absolute-count overlap record: EIGHT of its 12 members are
 * exact-string matches with AF-173's real `POSSIBILITY_CATEGORIES`,
 * verified using AF-170's real `detectOverlap` function.
 *
 * "The Horizon Effect" ("the more civilisation learns, the more it
 * realises remains unknown... knowledge expands humility, not
 * certainty") is confirmed genuinely new: `HorizonEffectTracker` is
 * the module's own contribution — an unknown-index that grows,
 * never shrinks, as recorded knowledge grows, a fundamentally
 * different guarantee from AF-172's real `HypothesisTracker` (which
 * gates ONE idea's grounded status, not a civilisation-wide
 * knowledge/unknown ratio) and from AF-166's real
 * `EmotionalContinuityTracker` (which recovers toward a ceiling, the
 * opposite direction).
 */

export const HORIZON_CATEGORIES = ["Scientific", "Exploratory", "Historical", "Educational", "Ecological", "Technological", "Architectural", "Cultural", "Social", "Civilisational", "Astronomical", "Philosophical"] as const;
export type HorizonCategory = (typeof HORIZON_CATEGORIES)[number];

export const DISCOVERY_CASCADE_OUTCOMES = ["New research", "New expeditions", "New museum exhibits", "New Commander dialogue", "New educational material", "New historical interpretation"] as const;

export const LIVING_FRONTIER_EXAMPLES = ["Unmapped systems", "Ancient ruins", "Unknown ecosystems", "Incomplete research", "Forgotten archives", "Unexplored nebulae", "Lost expeditions", "Potential megaprojects"] as const;

export const COMMANDER_HORIZON_EXAMPLES = ["Teach a generation", "Map an unexplored region", "Restore an extinct ecosystem", "Publish a historic theory", "Build a legendary academy"] as const;

export const PLAYER_HORIZON_EXAMPLES = ["A child inspired by your museum", "A signal beyond explored space", "A forgotten Earth archive", "A newly habitable planet", "An impossible astronomical anomaly"] as const;

export const CIVILISATION_HORIZON_STAGES = ["Survive", "Restore", "Discover", "Understand", "Inspire", "Guide", "Imagine", "Reach further"] as const;
export type CivilisationHorizonStage = (typeof CIVILISATION_HORIZON_STAGES)[number];

export const HORIZON_NETWORK_LINKS = ["Knowledge", "History", "Resources", "People", "Institutions", "Expeditions", "Future possibilities"] as const;

export const UNKNOWN_INDEX_EXAMPLES = ["Signals with unknown origins", "Incomplete star charts", "Untranslated archives", "Anomalous ecosystems", "Impossible physics"] as const;

export const BEYOND_THE_MAP_EXAMPLES = ["Further galaxies", "Ancient migration routes", "Unfinished scientific questions", "Hidden observatories", "New forms of life"] as const;

export const EDUCATIONAL_HORIZON_EXAMPLES = ["New questions", "Student expeditions", "Museum investigations", "Scientific challenges", "Engineering competitions"] as const;

export const LEGACY_HORIZON_EXAMPLES = ["Future expeditions", "Future research", "Future architecture", "Future traditions", "Future dreams"] as const;

export const HORIZON_DEVELOPER_TOOLS = ["Horizon graph", "Unknown index", "Future opportunity viewer", "Discovery cascade map", "Curiosity tracker", "Frontier browser"] as const;

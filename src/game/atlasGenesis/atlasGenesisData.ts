/**
 * The Atlas Genesis Engine (AF-177). Sits alongside AF-176's Continuum:
 * the Continuum preserves continuity, the Genesis Engine ensures the
 * universe continually creates authentic beginnings. Reused directly
 * wherever a section names a mechanic that already exists:
 *
 * - "Scientific Origins"' "Original hypothesis" and "First experiment"
 *   are exactly AF-172's real `HypothesisTracker.propose`/
 *   `supportWithEvidence` — reused directly rather than a second
 *   speculative-idea registry.
 * - "Institution Foundations"' "Institutional memory" is exactly
 *   AF-165's real `InstitutionalMemoryTracker.remember` — "Founders"
 *   is already the FIRST category in AF-165's real closed
 *   `INSTITUTIONAL_MEMORY_CATEGORIES` union, confirming the same
 *   mechanic.
 * - "The Spark Network" ("one discovery inspires another... history
 *   expands organically") is exactly AF-151's real
 *   `KnowledgeGraph.addEdge` using the already-real `"Inspired"`
 *   `GraphEdgeKind` — no new inspiration-chain mechanic.
 * - "Beginning → Legacy" (Origin → Growth → Maturity → Legacy → New
 *   Origin, "civilisation continually renews itself") is driven
 *   directly by AF-155's real generic `CyclicStageTracker<TStage>`
 *   over this module's own 5-stage `GENESIS_LIFECYCLE_STAGES` union.
 * - "Commander Origins" ("first mentor... these origins shape
 *   personality forever") composes AF-166's real `IdentityRegistry`
 *   directly — a Commander's `Identity.lifeMilestones` field is
 *   already exactly where a "first" belongs, no second milestone log.
 * - "The Founders" ("founders remain remembered") composes AF-167's
 *   real `EarnedTitleTracker.earn` directly — that class already
 *   takes a plain free-text title, so `"Founder"` is a valid title
 *   with no modification needed.
 *
 * "Genesis Domains" (12) is confirmed to TIE (not break) the
 * codebase's current 10/12 absolute overlap record: TEN of its 12
 * members are exact-string matches with AF-174's real
 * `HORIZON_CATEGORIES`, verified using AF-170's real `detectOverlap`
 * function.
 *
 * "The First Moment" ("who began it, why it began, where, when, what
 * inspired it, who doubted it, who believed in it... these become
 * permanent history") is confirmed genuinely new: `GenesisRegistry`
 * records exactly these seven fields per entity, and — because "these
 * become permanent history" — an origin can be recorded exactly once
 * per entity; a second `recordOrigin` call for an already-recorded
 * entity id is a no-op, the same "write-once, never silently
 * rewritten" guarantee AF-135's real `EvolvingEntry` established for
 * its own objective description. This is a fundamentally different
 * shape from every existing per-entity log in this codebase (all of
 * which are either append-only histories or freely-overwritable
 * current-state trackers), and from AF-159/173's real `Possibility`/
 * `PossibilityRegistry` (which links required knowledge/people/
 * resources for something NOT YET realised, not a record of how
 * something ALREADY BEGUN came to exist).
 */

export const GENESIS_DOMAINS = ["Scientific", "Educational", "Technological", "Ecological", "Architectural", "Cultural", "Social", "Exploratory", "Institutional", "Civilisational", "Personal", "Historical"] as const;
export type GenesisDomain = (typeof GENESIS_DOMAINS)[number];

export const COMMANDER_ORIGIN_EXAMPLES = ["First mentor", "First expedition", "First mistake", "First discovery", "First friendship", "First success"] as const;

export const CITY_FOUNDATION_EXAMPLES = ["Founders", "Original buildings", "Early hardships", "First celebrations", "Initial architecture", "Historic purpose"] as const;

export const SCIENTIFIC_ORIGIN_EXAMPLES = ["Original hypothesis", "First experiment", "Founding researchers", "Historic failures", "Breakthrough publication", "Educational adoption"] as const;

export const TRADITION_ORIGIN_TRIGGERS = ["A celebration", "An act of kindness", "A scientific achievement", "A Commander", "A child", "A community"] as const;

export const INSTITUTION_TYPES = ["Schools", "Museums", "Universities", "Hospitals", "Observatories", "Research centres"] as const;

export const INSTITUTION_FOUNDING_ATTRIBUTES = ["Founding charter", "Mission", "First members", "Historic milestones", "Institutional memory"] as const;

export const CULTURAL_BEGINNING_EXAMPLES = ["Art movements", "Music traditions", "Architecture", "Cuisine", "Literature", "Language"] as const;

export const ECOLOGICAL_BEGINNING_EXAMPLES = ["Recovered forests", "Protected habitats", "Wildlife sanctuaries", "Ocean reserves", "Botanical gardens"] as const;

export const PLAYER_FOUNDATION_EXAMPLES = ["The first restored colony", "The first academy", "The first planetary park", "The first museum wing", "The first living forest"] as const;

export const FOUNDER_LEGACY_EXAMPLES = ["Historical figures", "Museum exhibits", "Educational curriculum", "Commander inspiration", "Public monuments"] as const;

export const GENESIS_LIFECYCLE_STAGES = ["Origin", "Growth", "Maturity", "Legacy", "New Origin"] as const;
export type GenesisLifecycleStage = (typeof GENESIS_LIFECYCLE_STAGES)[number];

export const GENESIS_DEVELOPER_TOOLS = ["Origin browser", "Founding timeline", "Institution lineage", "Discovery genealogy", "Tradition creator", "Genesis graph"] as const;

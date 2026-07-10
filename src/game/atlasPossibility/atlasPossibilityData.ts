/**
 * The Atlas Possibility Engine (AF-159). Sits above AF-158's Future
 * Engine: where the Future Engine predicts likely outcomes, the
 * Possibility Engine imagines opportunities nobody has considered yet.
 *
 * "Player Inspiration" (6 kinds: Interesting expedition routes/Museum
 * collections nearing completion/Commander synergies/Historic
 * mysteries/Potential megaprojects/Rare species migration) mirrors the
 * SHAPE of AF-155's real `DiscoverySuggestionLog` and AF-158's real
 * `OpportunityLog` (both append-only, surface-by-kind) but never their
 * TYPE — both classes are hand-typed to their own closed unions, not
 * reusable generics, the same missed-generalisation precedent AF-149/
 * 153/158 already recorded. `PlayerInspirationKind` shares zero
 * members with either of those real unions, confirmed the SIXTH "kind
 * of notable moment" list in this codebase, after AF-136/153/154/155/
 * 158's real lists.
 *
 * "Innovation Memory" (6 outputs: Academic disciplines/Museum exhibits/
 * Commander teachings/Historic milestones/Educational curriculum/
 * Future foundations) mirrors the SHAPE of AF-157's real
 * `PlanMemoryArchive` and AF-158's real `FutureMemoryArchive` for the
 * same missed-generalisation reason — the THIRD mirrored "completed
 * work becomes a named output" archive in this codebase, again typed
 * to its own separate union.
 *
 * "Serendipity" ("two scientists independently solve related
 * problems... a Commander remembers an old conversation") is exactly
 * the shape of question AF-151's real `KnowledgeGraph.suggestConnections`
 * already answers (shared-neighbour convergence) — composing it
 * directly at the call site is the intended way to surface a
 * serendipity moment, never a second convergence algorithm. Unlike
 * every other list in this module, the four Serendipity examples are
 * full scenario descriptions rather than short category names, so
 * `SerendipityLog` records free-text descriptions rather than a closed
 * union.
 *
 * "Possibility Sources" (12 systems) is confirmed the TENTH parallel
 * "which systems does this touch" list in this codebase, after AF-142/
 * 144/145/149/152/153/154/155/158's real lists — kept separate.
 */

export const POSSIBILITY_SOURCES = ["Knowledge Graph", "World Model", "Future Engine", "Chronicle", "Museum", "Research", "Commander Bonds", "Civilisation", "Wildlife", "Exploration", "Player creativity", "History"] as const;
export type PossibilitySource = (typeof POSSIBILITY_SOURCES)[number];

export const DISCOVERY_CATEGORIES = ["Scientific", "Engineering", "Medical", "Architectural", "Ecological", "Educational", "Cultural", "Diplomatic", "Exploration", "Historical", "Artistic", "Social"] as const;
export type DiscoveryCategory = (typeof DISCOVERY_CATEGORIES)[number];

export const SCIENTIFIC_BREAKTHROUGH_EXAMPLES = ["Unexpected material combinations", "Cross-disciplinary research", "Ancient technology reinterpretation", "Biological adaptations", "Energy innovations", "Quantum discoveries"] as const;

export const ENGINEERING_INNOVATION_EXAMPLES = ["Improved infrastructure", "Novel construction methods", "Safer reactors", "Adaptive habitats", "New transportation", "Efficient manufacturing"] as const;

export const COMMANDER_INSPIRATION_KINDS = ["New theories", "Creative strategies", "Unexpected collaborations", "Teaching breakthroughs", "Personal insights", "Leadership evolution"] as const;
export type CommanderInspirationKind = (typeof COMMANDER_INSPIRATION_KINDS)[number];

export const COMMANDER_INSPIRATION_TRIGGERS = ["Experience", "Failure", "Friendship", "Discovery"] as const;
export type CommanderInspirationTrigger = (typeof COMMANDER_INSPIRATION_TRIGGERS)[number];

export const COLONY_INNOVATION_EXAMPLES = ["New festivals", "Architectural styles", "Educational programmes", "Community traditions", "Ecological solutions", "Public art"] as const;

/** The SIXTH "kind of notable moment" list in this codebase (see
 * module doc comment) — kept separate from AF-136/153/154/155/158's
 * real lists. */
export const PLAYER_INSPIRATION_KINDS = ["Interesting expedition routes", "Museum collections nearing completion", "Commander synergies", "Historic mysteries", "Potential megaprojects", "Rare species migration"] as const;
export type PlayerInspirationKind = (typeof PLAYER_INSPIRATION_KINDS)[number];

export const CROSS_DISCIPLINARY_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["Medicine", "Engineering"],
  ["Ecology", "Architecture"],
  ["Education", "Exploration"],
  ["History", "AI"],
  ["Astronomy", "Navigation"],
  ["Biology", "Robotics"],
];

export const CULTURAL_EVOLUTION_EXAMPLES = ["Music styles", "Art movements", "Education reforms", "Scientific philosophy", "Architectural movements", "Historic preservation"] as const;

export const MYSTERY_KINDS = ["Ancient questions", "Unknown signals", "Lost expeditions", "Incomplete research", "Missing artifacts", "Forgotten languages"] as const;
export type MysteryKind = (typeof MYSTERY_KINDS)[number];

export interface Possibility {
  id: string;
  discoveryCategory: DiscoveryCategory;
  requiredKnowledge: readonly string[];
  requiredPeople: readonly string[];
  requiredLocations: readonly string[];
  potentialRisks: readonly string[];
  potentialRewards: readonly string[];
  historicalSignificance: number;
  futureImplications: readonly string[];
}

/** The THIRD mirrored "completed work becomes a named output" archive
 * in this codebase (see module doc comment) — typed to its own
 * separate union rather than AF-157/158's real ones. */
export const INNOVATION_MEMORY_OUTCOMES = ["Academic disciplines", "Museum exhibits", "Commander teachings", "Historic milestones", "Educational curriculum", "Future foundations"] as const;
export type InnovationMemoryOutcome = (typeof INNOVATION_MEMORY_OUTCOMES)[number];

export const POSSIBILITY_VISUALISATION_TOOLS = ["Innovation graph", "Opportunity map", "Discovery network", "Research convergence viewer", "Creative dependency graph", "Possibility explorer"] as const;

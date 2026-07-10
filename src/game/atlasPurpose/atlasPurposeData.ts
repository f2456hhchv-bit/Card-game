/**
 * The Atlas Purpose Engine (AF-162). Sits above AF-161's Philosophy
 * Engine: philosophy asks why, purpose answers "what are we building
 * toward?"
 *
 * "Purpose Domains" (12) is confirmed the HEAVIEST vocabulary overlap
 * yet recorded in this codebase: EIGHT of its 12 members are exact
 * string matches with AF-161's real `PHILOSOPHICAL_DOMAINS`
 * (Engineering/Leadership/History/Education/Ecology/Art/Culture/
 * Exploration — verified by a dedicated test), surpassing even AF-161's
 * own 3-exact-match overlap with AF-160's `WISDOM_DIMENSIONS`. Kept as
 * its own separate union anyway: three lists now ask three different
 * questions over largely the same vocabulary — `WISDOM_DIMENSIONS`
 * (what kind of judgement applies), `PHILOSOPHICAL_DOMAINS` (what kind
 * of debate topic applies), `PURPOSE_DOMAINS` (what kind of meaningful
 * goal or vocation applies). Never merged, always documented.
 *
 * "Cultural Purpose" (6 values) is itself almost entirely a SUBSET of
 * this module's own `PURPOSE_DOMAINS` — five of its six members
 * (Art/Engineering/Ecology/Exploration/Education) already appear
 * verbatim there; only "Knowledge" is new. Kept as its own separate
 * `CulturalPurposeValue` union anyway, since it tags which values a
 * WORLD prioritises rather than which domain an individual/civilisation
 * goal belongs to — but this is the module's own internal near-
 * duplicate, flagged rather than silently repeated.
 *
 * "Shared Purpose" ("large collaborative goals unite civilisation...
 * every colony contributes") is confirmed the FOURTH instance of the
 * identical mechanic in this codebase, after AF-155's own Collaborative
 * Intelligence, AF-156's Group Decisions, and AF-157's Collaborative
 * Planning (all `CollaborativeProblemLog`). Reused directly again here.
 *
 * "Purpose Network" ("purposes connect through people, history,
 * knowledge, institutions... civilisation becomes increasingly
 * interconnected") is exactly the shape AF-151's real `KnowledgeGraph`
 * already provides — composing edges into the existing graph at the
 * call site is the intended way to build it, never a second graph
 * structure.
 *
 * "Legacy of Purpose" (6 outputs) mirrors the SHAPE of AF-157/158/159/
 * 160's real `PlanMemoryArchive`/`FutureMemoryArchive`/
 * `InnovationMemoryArchive`/`WisdomMemoryArchive` — the FIFTH mirrored
 * "completed work becomes a named output" archive in this codebase,
 * again typed to its own separate union.
 *
 * "Player Purpose" (8 kinds, "the player's actions reveal purpose") is
 * deliberately LESS strict than AF-161's real `PlayerPhilosophyObserver`
 * ("the game observes, it never labels" — no combined verdict at all).
 * Here the spec's own wording ("reveal purpose") licenses a
 * `dominantPurpose()` argmax over real tallies — an emergent reading of
 * accumulated actions, never a destiny assigned in advance (returns
 * null until at least one action has been observed).
 */

export const PURPOSE_DOMAINS = ["Exploration", "Education", "Scientific Discovery", "Engineering", "Ecology", "Culture", "Community", "Art", "Medicine", "Leadership", "History", "Future Generations"] as const;
export type PurposeDomain = (typeof PURPOSE_DOMAINS)[number];

export const INDIVIDUAL_PURPOSE_KINDS = ["Teacher", "Scientist", "Explorer", "Engineer", "Artist", "Doctor", "Historian", "Caretaker", "Mentor", "Builder"] as const;
export type IndividualPurposeKind = (typeof INDIVIDUAL_PURPOSE_KINDS)[number];

export const COMMANDER_PURPOSE_FACETS = ["Professional mission", "Personal aspiration", "Legacy ambition", "Teaching objective", "Historical contribution"] as const;
export type CommanderPurposeFacet = (typeof COMMANDER_PURPOSE_FACETS)[number];

export const CIVILISATION_PURPOSE_QUESTIONS = ["What should we preserve?", "What should we discover?", "Who still needs help?", "Which worlds remain forgotten?", "What can we leave behind?"] as const;

export const PLAYER_PURPOSE_KINDS = ["Explorer", "Builder", "Teacher", "Conservationist", "Engineer", "Historian", "Diplomat", "Founder"] as const;
export type PlayerPurposeKind = (typeof PLAYER_PURPOSE_KINDS)[number];

export interface InstitutionalPurpose {
  institution: string;
  mission: string;
}

export const INSTITUTIONAL_PURPOSES: readonly InstitutionalPurpose[] = [
  { institution: "Universities", mission: "educate" },
  { institution: "Museums", mission: "remember" },
  { institution: "Hospitals", mission: "heal" },
  { institution: "Observatories", mission: "inspire" },
  { institution: "Gardens", mission: "restore" },
  { institution: "Libraries", mission: "preserve" },
];

export const LONG_TERM_MISSION_EXAMPLES = ["Restore every ecosystem", "Archive every language", "Map every constellation", "Preserve every species", "Educate every colony", "Reconnect lost civilizations"] as const;

export const PURPOSE_EVOLUTION_STAGES = ["Survive", "Expand", "Understand", "Inspire", "Guide others"] as const;
export type PurposeEvolutionStage = (typeof PURPOSE_EVOLUTION_STAGES)[number];

/** Mirrors AF-148/154/157/160's real indexOf-rank pattern — a linear
 * escalation, not a cycle. */
export function purposeEvolutionRank(stage: PurposeEvolutionStage): number {
  return PURPOSE_EVOLUTION_STAGES.indexOf(stage);
}

/** Almost entirely a subset of this module's own `PURPOSE_DOMAINS`
 * (see module doc comment) — kept separate since it tags a world's
 * prioritised values, not a goal's domain. */
export const CULTURAL_PURPOSE_VALUES = ["Knowledge", "Art", "Engineering", "Ecology", "Exploration", "Education"] as const;
export type CulturalPurposeValue = (typeof CULTURAL_PURPOSE_VALUES)[number];

export const CRISIS_OF_PURPOSE_QUESTIONS = ["What lies beyond known space?", "What knowledge remains missing?", "What responsibilities accompany peace?"] as const;

export const SHARED_PURPOSE_PROJECTS = ["Galactic Observatory Network", "Universal Medical Archive", "Interstellar Education Initiative", "Atlas Memory Project", "Living Planet Restoration"] as const;

/** The FIFTH mirrored "completed work becomes a named output" archive
 * in this codebase (see module doc comment) — typed to its own
 * separate union rather than AF-157/158/159/160's real ones. */
export const PURPOSE_MEMORY_OUTCOMES = ["Traditions", "Institutions", "Educational curriculum", "Commander teachings", "Museum exhibits", "Historic inspiration"] as const;
export type PurposeMemoryOutcome = (typeof PURPOSE_MEMORY_OUTCOMES)[number];

export const PURPOSE_NETWORK_LINKS = ["People", "History", "Knowledge", "Institutions", "Future projects", "Shared dreams"] as const;

export const PURPOSE_DEVELOPER_TOOLS = ["Purpose graph", "Institution browser", "Legacy influence viewer", "Motivation explorer", "Civilisation aspiration map", "Shared-goal dashboard"] as const;

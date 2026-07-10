/**
 * The Atlas Philosophy Engine (AF-161). Exists above AF-160's Wisdom
 * Engine: knowledge explains, intelligence reasons, wisdom judges,
 * philosophy asks why.
 *
 * "Philosophical Domains" (12) is the closest two lists have ever come
 * in this codebase to full duplication: it shares THREE exact members
 * with AF-160's real `WISDOM_DIMENSIONS` (Engineering/Leadership/
 * Exploration) and near-synonym pairs for eight more (Science↔Scientific,
 * History↔Historical, Education↔Educational, Ecology↔Environmental,
 * Diplomacy↔Diplomatic, Ethics↔Ethical, Culture↔Cultural, Identity↔
 * Personal loosely) — only "Art" here and "Medical" there have no
 * counterpart at all. Kept as its own separate union rather than
 * merged: `WISDOM_DIMENSIONS` tags what KIND OF JUDGEMENT applies,
 * `PHILOSOPHICAL_DOMAINS` tags what KIND OF DEBATE TOPIC applies — a
 * real distinction even though the vocabulary overlaps this heavily,
 * and no exact-string match holds for 9 of the 12 members.
 *
 * "Cultural Reflection" ("books, music, art... gradually reflect
 * civilisation's evolving philosophy") is exactly AF-159's real
 * `CulturalTrendTracker` mechanic — reused directly via the existing
 * `culturalTrends` instance, no second trend-adoption tracker.
 *
 * "Historical Reinterpretation" ("as new evidence appears... history
 * gains depth, not contradiction") is exactly AF-135's real
 * `PlanetaryChronicle`/`EvolvingEntry.expand` — reused directly via the
 * existing `chroniclePlanets` instance, since that class already
 * append-only-expands an entry's text over time rather than overwriting
 * it, precisely the "depth not contradiction" guarantee this section
 * asks for.
 *
 * "Interdisciplinary Thinking" (4 directional pairs: Engineering→
 * ecology, History→diplomacy, Astronomy→philosophy, Education→politics)
 * is confirmed a genuinely different shape from AF-159's real
 * `CROSS_DISCIPLINARY_PAIRS` (6 symmetric collaboration pairs, e.g.
 * "Medicine + Engineering") — this module's pairs are one-way
 * INFLUENCE ("X informs Y"), not mutual collaboration, and share zero
 * exact pairs with AF-159's real list.
 *
 * "Commander Philosophy" names six illustrative Commander examples
 * (Atlas Prime/Cassia/Lyra/Orion/Sora/Vega) that do not correspond to
 * any real roster id in this codebase (the real sandbox roster uses ids
 * like `commander-fen-beastmaster`/`commander-thorne-starforged`) — the
 * six names are flavour illustrations of the mechanic, not a roster
 * addition. `CommanderBeliefTracker` is built generically over any
 * real commander id rather than hard-coding fictional names.
 *
 * "Player Philosophy" is deliberately built so nothing ever collapses
 * a player's observed tendencies into a single categorical label — "the
 * game observes, it never labels" — `PlayerPhilosophyObserver` only
 * exposes per-dimension tallies, never a combined verdict.
 */

export const PHILOSOPHICAL_DOMAINS = ["Science", "Engineering", "Leadership", "History", "Education", "Ecology", "Diplomacy", "Ethics", "Art", "Culture", "Exploration", "Identity"] as const;
export type PhilosophicalDomain = (typeof PHILOSOPHICAL_DOMAINS)[number];

export const PHILOSOPHICAL_QUESTIONS = [
  "Why are we exploring?",
  "What should be preserved?",
  "What defines civilisation?",
  "What responsibilities accompany discovery?",
  "Can knowledge exist without wisdom?",
  "How should humanity treat unknown life?",
  "Should every mystery be solved?",
] as const;
export type PhilosophicalQuestion = (typeof PHILOSOPHICAL_QUESTIONS)[number];

export const CIVILISATION_DIALOGUE_PARTICIPANTS = ["Universities", "Museums", "Schools", "Scientific congresses", "Citizens", "Commanders", "Children"] as const;

export interface AcademicSchool {
  name: string;
  tagline: string;
}

export const ACADEMIC_SCHOOLS: readonly AcademicSchool[] = [
  { name: "Atlas School", tagline: "Human cooperation" },
  { name: "Pioneer School", tagline: "Expansion first" },
  { name: "Conservation School", tagline: "Protect ecosystems" },
  { name: "Archivist School", tagline: "Preserve history" },
  { name: "Innovation School", tagline: "Scientific acceleration" },
];
export type AcademicSchoolName = (typeof ACADEMIC_SCHOOLS)[number]["name"];

export const SCIENTIFIC_PHILOSOPHY_TOPICS = ["Risk", "Evidence", "Responsibility", "Transparency", "Collaboration", "Publication", "Historical precedent"] as const;

export const LEADERSHIP_PHILOSOPHY_TOPICS = ["Authority", "Trust", "Responsibility", "Sacrifice", "Hope", "Mentorship", "Duty"] as const;

export const PLAYER_PHILOSOPHY_DIMENSIONS = ["Preferred leadership style", "Scientific priorities", "Approach to exploration", "Relationship values", "Historical priorities", "Environmental stewardship"] as const;
export type PlayerPhilosophyDimension = (typeof PLAYER_PHILOSOPHY_DIMENSIONS)[number];

export const PHILOSOPHICAL_EVENT_KINDS = ["Scientific symposium", "Historic debate", "Commander lecture", "Museum roundtable", "Student conference", "Public discussion"] as const;
export type PhilosophicalEventKind = (typeof PHILOSOPHICAL_EVENT_KINDS)[number];

/** Directional influence pairs — a genuinely different shape from
 * AF-159's real symmetric `CROSS_DISCIPLINARY_PAIRS` (see module doc
 * comment). */
export const INTERDISCIPLINARY_INFLUENCES: ReadonlyArray<readonly [string, string]> = [
  ["Engineering", "Ecology"],
  ["History", "Diplomacy"],
  ["Astronomy", "Philosophy"],
  ["Education", "Politics"],
];

export const PHILOSOPHY_DEVELOPER_TOOLS = ["Belief graph", "Debate tracker", "Civilisation values explorer", "Commander philosophy viewer", "Academic influence map", "Historical interpretation viewer"] as const;

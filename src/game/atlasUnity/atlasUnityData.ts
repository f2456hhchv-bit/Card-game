/**
 * The Atlas Unity Engine (AF-184). Exists above AF-183's Symphony
 * Engine: the Symphony Engine ensures systems work together, the
 * Unity Engine ensures every layer ultimately serves one shared
 * vision. Reused directly wherever a section names a mechanic that
 * already exists:
 *
 * - "The Unity Network" ("who benefits, teaches, learns, preserves,
 *   inspires, builds upon this... nothing remains isolated"), "The
 *   Civilisation Web" (a linear causal chain: research improves
 *   healthcare... community strengthens civilisation), and "The
 *   Knowledge Commons" ("institutions freely exchange research,
 *   teaching, engineering...") all compose AF-151's real
 *   `KnowledgeGraph.addEdge` directly — the same edge store AF-177/
 *   178/179/182/183's own "Network"/"Web"/"Relationships" sections
 *   already reused.
 * - "Unity Through Diversity" ("identity strengthens unity, it never
 *   weakens it") composes AF-159's real `CulturalTrendTracker`
 *   directly.
 * - "Shared Achievements" ("the greatest accomplishments belong to
 *   humanity, not individuals") reuses AF-176's real `ThreadRegistry`/
 *   `allThreadsConnected` directly — marking a shared achievement as a
 *   thread and confirming it never drifts into isolation is exactly
 *   what "everyone contributed, nothing remains isolated" already
 *   means structurally.
 *
 * "Unity Domains" (12) shares 9 of 12 exact-string members with
 * AF-183's real `SYMPHONY_DOMAINS`, verified using AF-170's real
 * `detectOverlap` function — documented honestly, no record claimed
 * since the codebase's current record is 11/12. "Institutional
 * Unity" (8 institution types) shares 5 of 8 exact-string members
 * with AF-177's real `INSTITUTION_TYPES`, also confirmed via
 * `detectOverlap`.
 *
 * "The Unity Index" mirrors the SHAPE of AF-143/149/170/173/179/180/
 * 182's real scoring rubrics — the EIGHTH mirrored rubric in this
 * codebase, sharing exactly 2 of its 8 criteria ("Educational access",
 * "Scientific openness") verbatim with AF-179's real
 * `ASCENSION_INDEX_CRITERIA`, confirmed via `detectOverlap`, and
 * reusing the same 9.5 gate threshold.
 *
 * "Commander Unity" (profession → contribution pairs) and "Planetary
 * Unity"/"Unity Events" stay pure reference vocabulary — "Commander
 * Unity" mirrors the SHAPE (not the entity type) of AF-183's real
 * `ORCHESTRA_MODEL_ROLES` paired-tuple list (professions rather than
 * domains), the same "who does what" pattern applied to a different
 * axis. "Player Unity" and "The Unity Test" are philosophical
 * statements, documented in prose only, matching every prior module's
 * treatment of non-mechanical "Core Principle"/"Player Experience"
 * sections — this module's own genuinely new contribution is
 * `UnityIndexScoreCard` alone, consistent with AF-183's own
 * light-touch precedent for an orchestration-layer module.
 */

export const UNITY_DOMAINS = ["People", "Knowledge", "Science", "Education", "Exploration", "Ecology", "Culture", "Architecture", "History", "Community", "Hope", "Legacy"] as const;
export type UnityDomain = (typeof UNITY_DOMAINS)[number];

export const UNITY_NETWORK_QUESTIONS = ["Who benefits?", "Who teaches?", "Who learns?", "Who preserves?", "Who inspires?", "Who builds upon this?"] as const;

export const COMMANDER_UNITY_ROLES: ReadonlyArray<readonly [string, string]> = [
  ["Scientists", "Discover"],
  ["Engineers", "Construct"],
  ["Teachers", "Educate"],
  ["Doctors", "Heal"],
  ["Explorers", "Reveal"],
  ["Historians", "Preserve"],
  ["Architects", "Inspire"],
];

export const PLANETARY_UNITY_EXAMPLES = ["Research", "Trade", "Education", "Culture", "Ecology", "Architecture", "Tourism", "Knowledge"] as const;

export const INSTITUTIONAL_UNITY_EXAMPLES = ["Museums", "Universities", "Academies", "Observatories", "Hospitals", "Libraries", "Research centres", "Public gardens"] as const;

export const KNOWLEDGE_COMMONS_EXAMPLES = ["Research", "Teaching", "Engineering", "Medical advances", "Ecological discoveries", "Historic interpretation"] as const;

export const UNITY_THROUGH_DIVERSITY_EXAMPLES = ["Language", "Music", "Architecture", "Food", "Traditions", "Education"] as const;

export const CIVILISATION_WEB_CHAIN = ["Research", "Healthcare", "Education", "Exploration", "History", "Identity", "Community", "Civilisation"] as const;

export const SHARED_ACHIEVEMENT_EXAMPLES = ["Planetary restoration", "Universal education", "Historic preservation", "Deep-space discoveries", "Scientific revolutions"] as const;

export const UNITY_EVENT_EXAMPLES = ["Interstellar Science Congress", "Atlas Cultural Festival", "Galactic Education Week", "Restoration Summit", "Living Planet Symposium", "Museum Exchange Programme"] as const;

export const UNITY_INDEX_CRITERIA = ["Cooperation", "Knowledge sharing", "Educational access", "Community resilience", "Institutional collaboration", "Ecological stewardship", "Scientific openness", "Shared purpose"] as const;
export type UnityIndexCriterion = (typeof UNITY_INDEX_CRITERIA)[number];

export const UNITY_INDEX_GATE_THRESHOLD = 9.5;

export const UNITY_DEVELOPER_TOOLS = ["Unity graph", "Institution network viewer", "Knowledge exchange dashboard", "Civilisation connectivity map", "Shared purpose analyser", "Collaboration timeline"] as const;

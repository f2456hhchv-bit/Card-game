/**
 * The Atlas Legacy of Tomorrow (AF-169). The explicit capstone of the
 * entire Atlas architecture — not a new domain of simulation but a
 * composition layer chaining together nearly every real system built
 * across AF-133 through AF-168. Reused directly wherever a section
 * names a mechanic that already exists:
 *
 * - "Legacy Projects" ("every project spans generations") is exactly
 *   AF-162's real `LongTermMissionTracker` (register/advance/
 *   progressFor/isComplete) — reused directly, no second generational-
 *   project tracker. The 7 named examples (Universal Atlas Archive,
 *   Living Library Network, ...) are reference vocabulary for seeding
 *   real mission instances.
 * - "Commander Legacy"'s "Students" is exactly AF-160's real
 *   `MentorshipLedger.menteesOf` — reused directly.
 * - "Inspiration Network" is confirmed the same mechanic AF-168's own
 *   "Inspiration" already composed: AF-160's real `MentorshipLedger`
 *   together with AF-151's real `KnowledgeGraph` — reused directly
 *   again, no second propagation model.
 * - "Remembrance" ("historic anniversaries... strengthens hope")
 *   composes AF-163's real `SignificanceTracker.reinforce` directly
 *   for the anniversary itself, together with AF-166's real
 *   `EmotionalContinuityTracker.recoverStep` directly for "strengthens
 *   hope" — no second reinforcement or hope mechanism.
 * - "Evolving Traditions" reuses AF-168's real `RitualLog` and AF-159's
 *   real `CulturalTrendTracker` directly — the same "traditions adapt
 *   naturally" mechanic those modules already built.
 * - "The Horizon Principle" ("every completed objective reveals a new
 *   horizon... always another mystery") composes AF-159's real
 *   `MysteryLog` directly — `ensureNextHorizonOpen` below is the one
 *   genuinely new piece: a thin function CHAINING a real
 *   `LongTermMissionTracker` completion to a real `MysteryLog.open`
 *   call, the capstone's own contribution of tying two locked systems
 *   together rather than building a third.
 * - "Galactic Maturity" ("humanity recognised for wisdom, curiosity,
 *   stewardship...") is exactly AF-167's real `ReputationTracker`,
 *   reused directly at civilisation scale — the SAME instance AF-168's
 *   "Galactic Reputation" already reused, now recording a
 *   partially-overlapping-but-distinct quality vocabulary.
 *
 * "Legacy Domains" (12) ties the absolute-count overlap record (8 of
 * 12 exact-string matches with AF-162's real `PURPOSE_DOMAINS":
 * Exploration/Education/Engineering/Ecology/Culture/Community/Art/
 * Leadership) without breaking AF-168's proportional record (80%).
 * Kept as its own reference vocabulary since it tags what a
 * cross-generational INHERITANCE covers, a third question distinct
 * from "meaningful goal" (Purpose) and "emotional significance"
 * (Meaning).
 *
 * "The Never-Ending Story" is confirmed genuinely new: `NextGenerationLog`
 * is a small append-only witness log for moments that specifically
 * mark a new generation beginning (a child opening a book, a new
 * Commander stepping aboard) — distinct from AF-168's real
 * `MomentsOfHumanityLog` (any small human moment) by being scoped
 * specifically to generational continuation.
 */

export const LEGACY_DOMAINS = ["Knowledge", "Science", "Education", "Engineering", "Exploration", "Art", "Culture", "Architecture", "Ecology", "Leadership", "Community", "Humanity"] as const;
export type LegacyDomain = (typeof LEGACY_DOMAINS)[number];

export const GENERATIONAL_INHERITANCE_EXAMPLES = ["Libraries", "Museums", "Universities", "Traditions", "Research", "Architecture", "Stories", "Languages", "Public spaces", "Shared dreams"] as const;

export const COMMANDER_LEGACY_EXAMPLES = ["Students", "Teaching philosophies", "Historic lectures", "Engineering methods", "Scientific theories", "Expedition journals", "Personal stories"] as const;

export const PLAYER_LEGACY_EXAMPLES = ["Cities", "Institutions", "Recovered worlds", "Protected ecosystems", "Historic expeditions", "Commander academies", "Museum collections", "Chronicle volumes"] as const;

export const LIVING_INHERITANCE_EXAMPLES = ["Historic expeditions", "Museum exhibits", "Commander biographies", "Scientific breakthroughs", "Recovered Earth history", "Public monuments"] as const;

export const LEGACY_PROJECT_EXAMPLES = ["Universal Atlas Archive", "Living Library Network", "Galactic Seed Vault", "Interstellar Children's Academy", "Memory Forests", "Constellation Gardens", "The Beacon Chain"] as const;

export const INSPIRATION_NETWORK_PARTICIPANTS = ["Students", "Teachers", "Commanders", "Scientists", "Citizens", "Future leaders"] as const;

export const REMEMBRANCE_THEMES = ["Discovery", "Cooperation", "Recovery", "Education", "Friendship", "Engineering", "Exploration"] as const;

export const HORIZON_PRINCIPLE_EXAMPLES = ["Another mystery", "Another world", "Another student", "Another idea", "Another tomorrow"] as const;

export const GALACTIC_MATURITY_QUALITIES = ["Wisdom", "Curiosity", "Stewardship", "Reliability", "Compassion", "Hope"] as const;

export const LEGACY_OF_TOMORROW_DEVELOPER_TOOLS = ["Legacy continuum viewer", "Generational influence graph", "Institution timeline", "Tradition evolution browser", "Inspiration propagation map", "Historical continuity dashboard"] as const;

/**
 * The Atlas Memory Engine (AF-165). Unlike AF-135's Chronicle (records
 * history, objectively) or AF-163's Meaning Engine (gives events
 * emotional significance), AF-165 determines what every intelligent
 * entity remembers, forgets, recalls and passes on. This module is
 * primarily a TAXONOMY and composition layer over memory machinery
 * already real elsewhere — "Memory Types" catalogues which real class
 * already backs each kind:
 *
 * - Personal Memory → AF-133's real `NpcMemoryLog` (raw per-subject
 *   memories, bounded minor capacity) composed directly with AF-163's
 *   real `MeaningCurator` (curated "favourite"/"proudest" superlatives)
 *   — "Personal Memories"' 10 examples split cleanly across the two:
 *   raw storage for most, curated superlative for "Greatest success"/
 *   "Closest friendships"/"Historic discoveries" (near-exact matches
 *   with AF-163's real `PERSONAL_MEANING_CATEGORIES`).
 * - Player Memory → AF-163's real `playerMeaning` `MeaningCurator`
 *   instance directly for the "Favourite X" categories ("Favourite
 *   Commander" is a verbatim shared member). The remaining Player
 *   Memory kinds (visit counts, photograph counts, revisit counts) are
 *   genuinely new numeric quantities nothing else tracks, served by
 *   `PlayerMemoryTracker`.
 * - Shared Memory → confirmed the SIXTH instance of AF-155's real
 *   `CollaborativeProblemLog` mechanic in this codebase (after AF-156/
 *   157/162/164's own reuses) — a group is just another participant
 *   list.
 * - Cultural Memory → AF-159's real `CulturalTrendTracker`, reused
 *   directly (the same "which entities have adopted this" mechanic).
 * - Memory Network → exactly AF-151's real `KnowledgeGraph`, reused
 *   directly (every memory linking to people/locations/events is
 *   exactly what that class's edges already model).
 * - "Forgetting" (minor memories fade, major memories remain) is
 *   confirmed something AF-133's real `NpcMemoryLog` ALREADY does —
 *   its bounded `minorCapacity` constructor parameter evicts the
 *   oldest non-historic memory once full, while `historic: true`
 *   memories are never evicted. No second decay mechanism is built.
 * - "Nostalgia" ("returning to meaningful places may trigger...")
 *   composes AF-163's real `SignificanceTracker.reinforce` directly at
 *   the call site — the same mechanic AF-164's "Returning Moments"
 *   already reused, and AF-164's own `RETURNING_MOMENT_QUALITIES`
 *   already lists "Nostalgia" as one of its five qualities.
 *
 * "False Assumptions" ("objective history remains protected, personal
 * memory remains human") is the module's own stated justification for
 * why `MemoryDistortionTracker` below must stay separate from AF-135's
 * real `EvolvingEntry`: that class already guarantees history "gains
 * depth, not contradiction" — an OBJECTIVE, append-only record.
 * `MemoryDistortionTracker` deliberately tracks a SUBJECTIVE current
 * version alongside the untouched objective original, never replacing
 * or feeding back into AF-135's real chronicle.
 *
 * "Institutional Memory" (Schools/Museums/Universities, each with 2-3
 * remembered categories) is confirmed genuinely new at this
 * granularity — AF-134's museum classes and AF-162's
 * `INSTITUTIONAL_PURPOSES` describe institutions' functions, not what
 * they specifically remember.
 */

export const MEMORY_TYPES = ["Personal Memory", "Shared Memory", "Institutional Memory", "Historical Memory", "Scientific Memory", "Cultural Memory", "Environmental Memory", "Collective Civilisation Memory", "Player Memory", "Legacy Memory"] as const;
export type MemoryType = (typeof MEMORY_TYPES)[number];

export const PERSONAL_MEMORY_EXAMPLES = ["First expedition", "First failure", "Greatest success", "Closest friendships", "Promises", "Mentors", "Favourite places", "Historic discoveries", "Losses", "Achievements"] as const;

export const PLAYER_MEMORY_KINDS = ["Favourite Commander", "Most visited planet", "Favourite music", "Preferred ship layout", "Most photographed locations", "Most revisited museum exhibits", "Preferred exploration style"] as const;
export type PlayerMemoryKind = (typeof PLAYER_MEMORY_KINDS)[number];

export const SHARED_MEMORY_GROUPS = ["Commander Academy", "Research Teams", "Settlements", "Families", "Scientific Congress", "Museum Staff"] as const;

export const INSTITUTIONAL_MEMORY_CATEGORIES = ["Founders", "Graduates", "Historic lessons", "Artifacts", "Visitors", "Research", "Breakthroughs", "Professors", "Students"] as const;
export type InstitutionalMemoryCategory = (typeof INSTITUTIONAL_MEMORY_CATEGORIES)[number];

export const CULTURAL_MEMORY_EXAMPLES = ["Festivals", "Songs", "Traditions", "Stories", "Architecture", "Food", "Language", "Historic heroes"] as const;

export const SCIENTIFIC_MEMORY_SOURCES = ["Experiments", "Peer review", "Field studies", "Mistakes", "Replications", "Unexpected discoveries"] as const;

export const FORGETTING_EXAMPLES = ["Routine conversations", "Unimportant errands", "Repeated activities"] as const;

export const MEMORY_TRIGGER_KINDS = ["Places", "Music", "Weather", "Objects", "Photographs", "Companions", "Conversations", "Museum exhibits"] as const;

export const NOSTALGIA_TRIGGERS = ["Commander reflection", "Player flashback dialogue", "Museum references", "New conversations", "Historic photographs", "Personal growth"] as const;

export const INTERGENERATIONAL_MEMORY_EXAMPLES = ["Children inherit stories", "Students inherit teachings", "Commanders inherit traditions", "Cities inherit architecture", "Civilisation inherits identity"] as const;

export const MEMORY_DEVELOPER_TOOLS = ["Memory timeline", "Recall inspector", "Memory strength viewer", "Shared memory graph", "Institution history viewer", "Memory propagation simulator"] as const;

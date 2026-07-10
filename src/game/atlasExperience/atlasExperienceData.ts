/**
 * The Atlas Experience Engine (AF-164). Exists above AF-163's Meaning
 * Engine: meaning explains why something matters, experience
 * determines how the player actually lives through it. Reused
 * directly wherever a section names a mechanic that already exists —
 * this module leans heavily on direct reuse since "experience" mostly
 * COMPOSES the emotional/pacing machinery already built:
 *
 * - "Experience Rhythm" (Action→Discovery→Conversation→Construction→
 *   Exploration→Celebration→Reflection→New Mystery) shares SEVEN of
 *   its 8 stages verbatim with AF-154's real `PACING_CYCLE_STAGES`
 *   (Combat→Discovery→Conversation→Construction→Exploration→
 *   Celebration→Reflection→New Mystery) — only "Action" vs "Combat"
 *   differs, confirmed a synonym. Reused directly via AF-154's real
 *   `PacingCycleTracker`, never a second 8-stage cycle.
 * - "Player Expression" (8 playstyles: Explorer/Scientist/Engineer/
 *   Builder/Conservationist/Diplomat/Teacher/Historian) shares SEVEN of
 *   its 8 members verbatim with AF-162's real `PLAYER_PURPOSE_KINDS`
 *   (Explorer/Builder/Teacher/Conservationist/Engineer/Historian/
 *   Diplomat/Founder) — only "Scientist" vs "Founder" differs. Unlike
 *   this codebase's recurring "domain" list family (which keeps
 *   near-duplicate vocabulary separate because each list tags a
 *   different downstream structure), this is the SAME mechanism asked
 *   twice: which playstyle is the player currently expressing. Reused
 *   directly via AF-162's real `PlayerPurposeObserver`, no second
 *   observer.
 * - "Surprise Management" (6 examples: rare wildlife behaviour/
 *   Commander reunion/hidden observatory/unexpected insight/historic
 *   callback/planetary celebration) is confirmed the same shape as
 *   AF-153's real `EmergenceOpportunityLog`/`EMERGENCE_OPPORTUNITY_KINDS`
 *   (4 of 6 near-exact matches: Commander reunions/Wildlife encounters/
 *   Historic callbacks/Planet celebrations). Reused directly, no second
 *   emergence log.
 * - "Emotional Memory" (6 categories: most memorable discoveries/most
 *   meaningful friendships/favourite locations/personal milestones/
 *   historic achievements/quiet reflections) overlaps directly with
 *   AF-163's real `PERSONAL_MEANING_CATEGORIES`/`MeaningCurator` and
 *   `QuietMomentLog` — "Most meaningful discovery" is a verbatim shared
 *   member. Reused directly, no second curator.
 * - "Micro Experiences" ("each contributes to long-term emotional
 *   memory") and "Returning Moments" ("players see how the universe
 *   has changed") both compose AF-163's real `SignificanceTracker`
 *   directly at the call site — reinforcing a place/object/event's
 *   accumulated significance is exactly what that class already does.
 * - "Shared Experiences" ("civilisation collectively experiences...
 *   shared experiences build identity") is confirmed the FIFTH instance
 *   of AF-155's real `CollaborativeProblemLog` mechanic in this
 *   codebase (after AF-156/157/162's own reuses). Reused directly.
 *
 * "Experience Pillars" (10) is another entry in this codebase's
 * recurring abstract-value/virtue-list family — 3 exact-string matches
 * with AF-160's real `CIVILISATION_VALUES` (Responsibility/Hope/
 * Legacy), kept separate since it tags experiential design pillars
 * rather than civilisation-wide values.
 *
 * "Experience States" (10: Curiosity/Confidence/Stress/Comfort/
 * Achievement/Fatigue/Connection/Immersion/Focus/Emotional momentum,
 * "influence pacing only, never player control") mirrors the SHAPE of
 * AF-154's real `PlayerExperienceFactors`/`PlayerExperienceTracker`
 * (9 differently-named fields) but never its TYPE, since that
 * interface is hand-typed to its own closed field set rather than a
 * reusable generic — the same missed-generalisation precedent recorded
 * throughout this codebase.
 *
 * "First-Time Moments" and "Atmospheric Design" are confirmed
 * genuinely new: nothing in the codebase already protects a moment
 * from being diminished by repetition, or coordinates the 7 named
 * atmospheric dimensions together.
 */

export const EXPERIENCE_PILLARS = ["Wonder", "Discovery", "Challenge", "Growth", "Reflection", "Belonging", "Responsibility", "Hope", "Celebration", "Legacy"] as const;
export type ExperiencePillar = (typeof EXPERIENCE_PILLARS)[number];

/** Mirrors the SHAPE of AF-154's real `PlayerExperienceFactors` — its
 * own separate 10-field set, never that interface's type (see module
 * doc comment). "These values influence pacing only. Never player
 * control." */
export interface ExperienceStateSnapshot {
  curiosity: number;
  confidence: number;
  stress: number;
  comfort: number;
  achievement: number;
  fatigue: number;
  connection: number;
  immersion: number;
  focus: number;
  emotionalMomentum: number;
}

export const MICRO_EXPERIENCE_EXAMPLES = ["Commander greeting", "Sunrise over a restored city", "Wildlife interaction", "Museum conversation", "Research completion", "Companion animation", "Quiet music transition", "A child waving"] as const;

export const MACRO_EXPERIENCE_EXAMPLES = ["Saving a civilisation", "Completing a megaproject", "Recruiting Atlas Prime", "Restoring Earth", "Discovering a new galaxy", "Graduating an academy", "Opening a new museum wing", "Historic celebrations"] as const;

export const FIRST_TIME_MOMENT_KINDS = ["First Commander recruited", "First colony restored", "First museum artifact", "First alien alliance", "First megaproject", "First planetary sunrise"] as const;
export type FirstTimeMomentKind = (typeof FIRST_TIME_MOMENT_KINDS)[number];

export const RETURNING_MOMENT_QUALITIES = ["Recognition", "Growth", "Pride", "Nostalgia", "Perspective"] as const;

export const LONG_TERM_EXPERIENCE_STAGES = ["Wonder", "Mastery", "Stewardship", "Legacy"] as const;
export type LongTermExperienceStage = (typeof LONG_TERM_EXPERIENCE_STAGES)[number];

/** Mirrors AF-148/154/157/160/162's real indexOf-rank pattern — a
 * linear escalation, not a cycle. */
export function longTermExperienceRank(stage: LongTermExperienceStage): number {
  return LONG_TERM_EXPERIENCE_STAGES.indexOf(stage);
}

export const ATMOSPHERIC_DESIGN_DIMENSIONS = ["Lighting", "Music", "Weather", "Ambient audio", "Dialogue density", "Population activity", "Environmental storytelling"] as const;
export type AtmosphericDesignDimension = (typeof ATMOSPHERIC_DESIGN_DIMENSIONS)[number];

export const SHARED_EXPERIENCE_EXAMPLES = ["Festivals", "Scientific announcements", "Commander ceremonies", "Historic anniversaries", "Museum openings", "Planetary recoveries"] as const;

export const EXPERIENCE_DEVELOPER_TOOLS = ["Experience timeline", "Emotional pacing graph", "Wonder frequency tracker", "Discovery density viewer", "Atmosphere debugger", "Player journey replay", "Moment significance analyser"] as const;

/**
 * The Atlas Orchestrator (AF-154). The experience-management layer above
 * the Atlas Simulation Director (AF-153) — where AF-153 manages the
 * simulation, AF-154 manages the player's *experience* of it. Reused
 * directly wherever a section names a mechanic that already exists:
 *
 * - "System Negotiation" ("when multiple systems compete... resolve
 *   without contradiction") is exactly AF-144's real `DecisionRouter`,
 *   reused directly via the existing `aosDecisionRouter` instance — the
 *   same reuse AF-153 already made for its own "System Synchronisation".
 * - "Expansion Readiness" (future modules declare Gameplay/Narrative/
 *   Simulation/Performance/Accessibility impact, auto-integrated) is
 *   exactly AF-149's real `systemImpactReportFor`/`SYSTEM_IMPACT_CATEGORIES`
 *   (11 categories — a superset already covering Gameplay/Narrative/
 *   Technical/Accessibility/Performance, with "Technical" standing in
 *   for "Simulation impact"). Reused directly; no new 5-category list.
 * - "Surprise Engine" ("surprises emerge naturally from simulation") is
 *   confirmed the same mechanic as AF-153's real `EmergenceOpportunityLog`
 *   — "Historic callback"/"Commander reunions"/"Wildlife behaviour"
 *   appear near-verbatim in both modules' example lists. Reused directly
 *   via the existing `emergenceLog` instance rather than a second log.
 *
 * Everything below is genuinely new: this module estimates the
 * *player's* state (excitement, fatigue, engagement), not any system's.
 *
 * "Pacing Model" (8 stages: Combat/Discovery/Conversation/Construction/
 * Exploration/Celebration/Reflection/New Mystery) looks at a glance like
 * AF-153's real `EMOTIONAL_PACING_CATEGORIES` (also 8 values) but the
 * membership genuinely differs (Combat/Exploration/New Mystery here vs.
 * Danger/Recovery/Wonder there), and this list is explicitly a fixed
 * *cycle* ("no activity dominates for too long", drawn with arrows)
 * rather than a free-form imbalance tracker — kept as its own separate
 * `PacingCycleStage` union with a `next*Stage` cyclic-advance function,
 * mirroring AF-095/097/149's real `next*PipelineStage` pattern instead of
 * AF-153's imbalance-only shape.
 *
 * "Discovery Curve" (8 kinds: new species/mechanic/Commander
 * interaction/museum artifact/rare weather/ancient structure/scientific
 * breakthrough/unknown signal) overlaps in spirit with AF-136's real
 * `EMERGENT_MOMENT_KINDS` (9 values: unexpected rescues/equipment
 * failures/lucky discoveries/ancient signals/lost survivors/friendly
 * encounters/natural disasters/celebrations/quiet personal moments) and
 * AF-153's `EMERGENCE_OPPORTUNITY_KINDS` — confirmed the THIRD "kind of
 * notable moment" list in this codebase. Kept separate because this one
 * measures *time since the last one of each kind*, a genuinely different
 * question ("prevent dry periods") than either surfacing or logging.
 *
 * "Player Journey Model" (New Explorer/Experienced Pathfinder/Commander/
 * Fleet Leader/Civilisation Builder/Founder/Living Legend) is the FOURTH
 * player-rank-title list in this codebase, after AF-139's real
 * `PLAYER_EVOLUTION_RANKS` (Rookie/Explorer/Commander/Leader/Founder/
 * Legend), AF-139's `COMMANDER_MATURITY_STAGES` (.../Living Legend), and
 * AF-136's real `PLAYER_REPUTATION_TITLES` (The Explorer/.../The
 * Pathfinder/...). No exact membership match with any of the three —
 * kept separate and documented rather than silently duplicated.
 *
 * "Content Rotation", "Long-term Memory", the "Player Experience Model",
 * the "Emotional Balancer" and the "Engagement Map" are confirmed
 * genuinely absent anywhere in the codebase: nothing tracks per-content-
 * category usage counts, nothing logs "last time X happened" at the
 * player-journey level (AF-133's `NpcMemoryLog` is per-NPC, not
 * player-journey), nothing estimates continuous player-experience
 * factors, nothing tracks positive/negative emotional-tone *signals* as
 * distinct from AF-153's pacing-category imbalance, and nothing ranks
 * systems by curiosity/satisfaction/exposure.
 */

export const ORCHESTRATOR_RESPONSIBILITIES = [
  "Atlas Operating System",
  "Simulation Director",
  "Living Galaxy",
  "Living Ship",
  "Commander Bond Network",
  "Chronicle",
  "Museum",
  "Civilisation",
  "Evolution",
  "Economy",
  "Weather",
  "Research",
  "Expeditions",
  "Events",
  "Story Engine",
  "Accessibility Systems",
  "Future Expansions",
] as const;
export type OrchestratorResponsibility = (typeof ORCHESTRATOR_RESPONSIBILITIES)[number];

// ── Pacing Model: a fixed cycle, not a free-form imbalance tracker. ──
export const PACING_CYCLE_STAGES = ["Combat", "Discovery", "Conversation", "Construction", "Exploration", "Celebration", "Reflection", "New Mystery"] as const;
export type PacingCycleStage = (typeof PACING_CYCLE_STAGES)[number];

/** Mirrors AF-095/097/149's real `next*PipelineStage` cyclic pattern —
 * wraps back to the first stage rather than returning null at the end,
 * since the spec draws this as a closed loop ("New Mystery" → "Combat"). */
export function nextPacingStage(stage: PacingCycleStage): PacingCycleStage {
  const index = PACING_CYCLE_STAGES.indexOf(stage);
  return PACING_CYCLE_STAGES[(index + 1) % PACING_CYCLE_STAGES.length]!;
}

// ── Player Experience Model: 9 continuously-estimated factors. ──
export interface PlayerExperienceFactors {
  excitement: number;
  mentalWorkload: number;
  explorationFatigue: number;
  combatFatigue: number;
  narrativeEngagement: number;
  curiosity: number;
  senseOfProgress: number;
  emotionalInvestment: number;
  wonderFrequency: number;
}

// ── Discovery Curve: prevent long dry periods per discovery kind. ──
export const DISCOVERY_KINDS = ["New species", "New mechanic", "Commander interaction", "Museum artifact", "Rare weather", "Ancient structure", "Scientific breakthrough", "Unknown signal"] as const;
export type DiscoveryKind = (typeof DISCOVERY_KINDS)[number];

// ── Emotional Balancer: tone signals, distinct from AF-153's category imbalance. ──
export const EMOTIONAL_TONE_STRAIN_SIGNALS = ["Fatigue", "Stress", "Monotony", "Information overload"] as const;
export type EmotionalToneStrainSignal = (typeof EMOTIONAL_TONE_STRAIN_SIGNALS)[number];

export const EMOTIONAL_TONE_RELIEF_SIGNALS = ["Hope", "Achievement", "Humour", "Wonder", "Quiet reflection", "Friendship"] as const;
export type EmotionalToneReliefSignal = (typeof EMOTIONAL_TONE_RELIEF_SIGNALS)[number];

/** "Continuously monitor emotional tone... avoid [strain]." Two or more
 * strain signals active at once, with no relief signal present, is
 * treated as needing rebalancing — a decoupled pure function over plain
 * signal sets, never importing the systems that report them. */
export function emotionalToneNeedsRebalancing(activeStrain: ReadonlySet<EmotionalToneStrainSignal>, activeRelief: ReadonlySet<EmotionalToneReliefSignal>): boolean {
  return activeStrain.size >= 2 && activeRelief.size === 0;
}

// ── Content Rotation: prioritise underused content. ──
export const CONTENT_ROTATION_CATEGORIES = ["Rare wildlife", "Forgotten planets", "Commander conversations", "Historic events", "Museum dialogue", "Weather events", "Music"] as const;
export type ContentRotationCategory = (typeof CONTENT_ROTATION_CATEGORIES)[number];

// ── Long-term Memory: last time X happened, at the player-journey level. ──
export const MILESTONE_KINDS = ["Major discovery", "Commander interaction", "Celebration", "Scientific breakthrough", "Emergency", "Peaceful moment"] as const;
export type MilestoneKind = (typeof MILESTONE_KINDS)[number];

// ── Player Journey Model: the FOURTH player-rank-title list (see module doc comment). ──
export const PLAYER_JOURNEY_TIERS = ["New Explorer", "Experienced Pathfinder", "Commander", "Fleet Leader", "Civilisation Builder", "Founder", "Living Legend"] as const;
export type PlayerJourneyTier = (typeof PLAYER_JOURNEY_TIERS)[number];

/** Mirrors AF-148's real `canonPyramidRank` indexOf pattern. */
export function playerJourneyTierRank(tier: PlayerJourneyTier): number {
  return PLAYER_JOURNEY_TIERS.indexOf(tier);
}

// ── Failsafe Rules: a strict priority order, not an all-must-pass gate. ──
export const FAILSAFE_PRIORITY_ORDER = ["Player progress", "Save integrity", "Historical consistency", "Accessibility", "Performance", "Narrative coherence"] as const;
export type FailsafeConcern = (typeof FAILSAFE_PRIORITY_ORDER)[number];

/** Resolves competing failsafe concerns to the single highest-priority
 * one present, per "always prioritise" — never averages or merges. */
export function resolveByFailsafePriority(active: ReadonlySet<FailsafeConcern>): FailsafeConcern | null {
  return FAILSAFE_PRIORITY_ORDER.find((concern) => active.has(concern)) ?? null;
}

export const ORCHESTRATION_DIAGNOSTIC_TOOLS = ["Experience Timeline", "Discovery Heatmap", "Pacing Graph", "Wonder Frequency", "Commander Exposure", "Narrative Balance", "Simulation Coordination", "Player Journey Viewer"] as const;

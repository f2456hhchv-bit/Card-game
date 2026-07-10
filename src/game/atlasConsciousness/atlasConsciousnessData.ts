/**
 * The Atlas Consciousness Engine (AF-166). Not artificial
 * consciousness — a simulation framework giving intelligent entities
 * continuity of self across years of gameplay. Reused directly
 * wherever a section names a mechanic that already exists:
 *
 * - "Self Reflection" ("characters occasionally reflect upon past
 *   decisions... reflections influence future behaviour") is exactly
 *   AF-160's real Reflection Loop (`CyclicStageTracker` over
 *   `REFLECTION_LOOP_STAGES`), reused directly via the existing
 *   `reflectionLoop` instance, composed with AF-163's real
 *   `personalMeaning` `MeaningCurator` instance for what specifically
 *   gets reflected upon (a "Quiet regret"/"Proudest achievement" entry
 *   IS a past mistake/great success). No second reflection cycle.
 * - "Moral Reasoning" ("characters weigh evidence, responsibility,
 *   relationships, consequences... without simplistic morality
 *   systems") is exactly AF-155's real `rankOptions` — weigh several
 *   named factors, pick the best, know the confidence — reused
 *   directly, never a single good/evil meter.
 *
 * "Values" (9 examples) is confirmed another entry in this codebase's
 * recurring domain-vocabulary family — SEVEN of its 9 members are
 * exact-string matches with AF-162's real `PURPOSE_DOMAINS`
 * (Exploration/Education/Engineering/Community/Art/Medicine/
 * Leadership). Kept as its own reference vocabulary since the real new
 * mechanic here is `ValuePriorityTracker`'s hard constraint — "values
 * change gradually, never abruptly" — a capped per-update delta, not
 * another domain list to catalogue.
 *
 * "Life Stages" (Early Career/Mid Career/Senior Career/Legacy Years/
 * Retirement, 5 stages) describes the SAME underlying quantity as
 * AF-139's real `COMMANDER_MATURITY_STAGES` (Rookie Officer/Seasoned
 * Leader/Trusted Mentor/Living Legend, 4 stages) — a Commander's
 * career progression — but AF-139's union is locked to its own 4-value
 * closed type and cannot be re-segmented into 5 without modifying it.
 * Kept as its own separate `LifeStage` union with an indexOf-rank
 * function, mirroring AF-148/154/157/160/162/164's real rank-ladder
 * pattern, rather than widening the locked class.
 *
 * "Personal Growth" (8 areas) shares THREE exact members (Humility/
 * Emotional maturity/Patience) with AF-160's real
 * `COMMANDER_WISDOM_TRAITS`/`CommanderWisdomTracker`. That tracker is
 * hand-typed to its own closed 6-value union, not a reusable generic —
 * the same missed-generalisation precedent recorded throughout this
 * codebase — so `PersonalGrowthTracker` mirrors its shape over this
 * module's own 8-value `PersonalGrowthArea` union instead.
 */

export const CONSCIOUSNESS_COMPONENTS = ["Identity", "Values", "Personality", "Goals", "Confidence", "Curiosity", "Empathy", "Resilience", "Leadership", "Creativity", "Self Reflection", "Purpose"] as const;

export interface Identity {
  personalHistory: string;
  currentSelfImage: string;
  professionalIdentity: string;
  privateAspirations: string;
  publicReputation: string;
  relationships: readonly string[];
  lifeMilestones: readonly string[];
  personalGrowth: string;
}

/** "How others see them vs how they see themselves... differences
 * create believable behaviour." A gap exists whenever the self-image
 * and the public reputation diverge — never a numeric score, just the
 * plain structural check the spec asks for. */
export function hasIdentityGap(identity: Identity): boolean {
  return identity.currentSelfImage !== identity.publicReputation;
}

export const SELF_REFLECTION_TOPICS = ["Past decisions", "Great successes", "Mistakes", "Mentors", "Lost opportunities", "Future ambitions"] as const;

export const VALUE_EXAMPLES = ["Discovery", "Education", "Family", "Engineering", "Art", "Medicine", "Exploration", "Community", "Leadership"] as const;
export type ValueExample = (typeof VALUE_EXAMPLES)[number];

export const PERSONAL_GROWTH_AREAS = ["Confidence", "Humility", "Patience", "Teaching ability", "Decision quality", "Scientific judgement", "Emotional maturity", "Leadership"] as const;
export type PersonalGrowthArea = (typeof PERSONAL_GROWTH_AREAS)[number];

export const COMMANDER_EVOLUTION_EXAMPLES = ["Distinct habits", "Favourite routines", "Preferred colleagues", "Teaching style", "Research interests", "Leadership philosophy", "Public legacy"] as const;

export const PRIVATE_LIFE_CATEGORIES = ["Personal hobbies", "Favourite music", "Reading interests", "Creative projects", "Volunteer work", "Family traditions"] as const;

export const LIFE_STAGES = ["Early Career", "Mid Career", "Senior Career", "Legacy Years", "Retirement"] as const;
export type LifeStage = (typeof LIFE_STAGES)[number];

/** Mirrors AF-148/154/157/160/162/164's real indexOf-rank pattern — a
 * linear career progression, distinct from AF-139's real locked
 * 4-stage `COMMANDER_MATURITY_STAGES` (see module doc comment). */
export function lifeStageRank(stage: LifeStage): number {
  return LIFE_STAGES.indexOf(stage);
}

export const MORAL_REASONING_FACTORS = ["Evidence", "Responsibility", "Relationships", "Consequences", "Professional ethics", "Long-term impact"] as const;

export const SELF_IMPROVEMENT_PURSUITS = ["Education", "Training", "Health", "Relationships", "Research", "Leadership", "Reflection"] as const;

export const EMOTIONAL_CONTINUITY_DOMAINS = ["Dialogue", "Decision making", "Relationships", "Teaching", "Leadership", "Recovery"] as const;

export const CULTURAL_IDENTITY_LAYERS = ["Home world", "Profession", "Community", "Scientific tradition", "Family", "Civilisation"] as const;

export const COLLECTIVE_IDENTITY_EXAMPLES = ["Shared values", "Shared ambitions", "Shared traditions", "Shared aspirations", "Shared responsibility"] as const;

export const CONSCIOUSNESS_DEVELOPER_TOOLS = ["Identity timeline", "Growth visualiser", "Reflection browser", "Values tracker", "Leadership evolution viewer", "Consciousness debugger"] as const;

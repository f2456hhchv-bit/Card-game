/**
 * The Atlas Prime Directive (AF-170). Not a gameplay system — the
 * permanent governing intelligence that every future mechanic,
 * feature, expansion, story, asset and line of dialogue must pass
 * through before joining the universe.
 *
 * CRITICAL SCOPE NOTE: "System Priority" (below) places "Atlas Prime
 * Directive" above "Design Constitution", "Atlas Core", "Operating
 * System" and "Simulation Director" — but every one of those names
 * refers to IN-FICTION AF-XXX modules (AF-146's Design Constitution,
 * AF-145's Atlas Core, AF-000's Operating System, AF-153's Simulation
 * Director), never to the REAL `docs/CONSTITUTION.md`. Per this
 * project's standing rule (established repeatedly since AF-145/146/
 * 147), the real Constitution is the actual supreme design authority
 * for the whole codebase and sits categorically OUTSIDE this in-
 * fiction governance ladder — AF-170 does not modify it, does not rank
 * above it, and does not claim any authority over it. `SYSTEM_PRIORITY_LADDER`
 * below is exclusively an ordering AMONG in-fiction AF-XXX modules.
 *
 * "Design Arbiter" (10 evaluation criteria: Purpose/Novelty/
 * Integration/Accessibility/Replayability/Performance/Narrative value/
 * Technical sustainability/Educational value/Emotional impact) mirrors
 * the SHAPE of AF-143's real `DesignScoreCard` and AF-149's real
 * `AtlasScoreCard` (score/scoreFor/isComplete/overallScore/passesGate
 * at a 9.5 threshold) — the THIRD such mirrored scoring rubric in this
 * codebase, again typed to its own separate union rather than either
 * real class (both are hand-typed, not reusable generics).
 *
 * "The Prime Directives" (a strict priority order, "no lower system
 * overrides a higher principle") and "Conflict Resolution" (a second,
 * separate priority order for competing concerns) both mirror AF-156's
 * real `resolveByFailsafePriority` pattern — a `.find()` over a fixed
 * priority-ordered array — rather than AF-156's own hand-typed
 * `FailsafeConcern` union.
 *
 * "Future Compatibility", "Quality Lock" and "Final Test" are three
 * more instances of this codebase's established all-must-pass
 * checklist-gate mechanic (the same shape as the real Constitution's
 * own "THE AFTERLIGHT TEST", AF-145's Design Validation, AF-146's
 * Expansion Test, AF-147's Franchise Test, AF-149's Final Validation,
 * AF-160's Scientific Wisdom/Ethical Deliberation, and others) — kept
 * as their own separate question sets rather than merged into any of
 * them. "Final Test" in particular echoes the real Constitution's own
 * "THE AFTERLIGHT TEST" gate almost exactly in spirit (hope/curiosity/
 * civilisation/humanity/tomorrow) — confirmed a deliberate structural
 * callback, not a duplicate, since the exact five questions differ.
 *
 * "Redundancy Detector" ("automatically identify duplicate systems,
 * feature overlap... recommend simplification") is the one genuinely
 * new, and pointedly self-referential, mechanic in this module:
 * `detectOverlap` FORMALISES the exact manual overlap-checking
 * discipline this session's own module-implementation process has
 * performed by hand in nearly every module since AF-145/146 (e.g.
 * "PURPOSE_DOMAINS shares 8 of 12 exact-string members with
 * PHILOSOPHICAL_DOMAINS") into one real, reusable function.
 */

export interface PrimeDirective {
  numeral: string;
  name: string;
  rule: string;
}

/** Order IS authority — "no lower system overrides a higher
 * principle." */
export const PRIME_DIRECTIVES: readonly PrimeDirective[] = [
  { numeral: "I", name: "Protect Hope", rule: "No system should undermine the optimistic identity of Afterlight." },
  { numeral: "II", name: "Protect Discovery", rule: "Curiosity should always remain more rewarding than repetition." },
  { numeral: "III", name: "Protect Humanity", rule: "Technology exists to support people. Never replace them." },
  { numeral: "IV", name: "Protect Civilisation", rule: "Building should remain more meaningful than destruction." },
  { numeral: "V", name: "Protect Memory", rule: "History should remain permanent. Nothing meaningful is forgotten." },
  { numeral: "VI", name: "Protect Accessibility", rule: "Every improvement should increase accessibility wherever possible." },
  { numeral: "VII", name: "Protect Wonder", rule: "Every expansion should inspire awe." },
  { numeral: "VIII", name: "Protect Legacy", rule: "Every action should leave something worthwhile behind." },
  { numeral: "IX", name: "Protect Simplicity", rule: "Complexity must always justify itself. Elegant systems outperform complicated systems." },
  { numeral: "X", name: "Protect Tomorrow", rule: "Every decision should improve the future of the universe." },
];
export type PrimeDirectiveName = (typeof PRIME_DIRECTIVES)[number]["name"];

/** Mirrors AF-156's real `resolveByFailsafePriority` pattern (see
 * module doc comment) — the highest-priority active directive wins,
 * never averaged or merged. */
export function resolvePrimeDirectivePriority(active: ReadonlySet<PrimeDirectiveName>): PrimeDirectiveName | null {
  for (const directive of PRIME_DIRECTIVES) if (active.has(directive.name)) return directive.name;
  return null;
}

export const DESIGN_ARBITER_CRITERIA = ["Purpose", "Novelty", "Integration", "Accessibility", "Replayability", "Performance", "Narrative value", "Technical sustainability", "Educational value", "Emotional impact"] as const;
export type DesignArbiterCriterion = (typeof DESIGN_ARBITER_CRITERIA)[number];

export const DESIGN_ARBITER_GATE_THRESHOLD = 9.5;

export const CONFLICT_RESOLUTION_PRIORITIES = ["Player agency", "Hope", "History", "Accessibility", "Civilisation", "Legacy", "Performance", "Future expansion"] as const;
export type ConflictResolutionPriority = (typeof CONFLICT_RESOLUTION_PRIORITIES)[number];

/** A second, separate priority order from `resolvePrimeDirectivePriority`
 * (see module doc comment) — competing gameplay-system concerns, not
 * the ten permanent directives. */
export function resolveConflictPriority(active: ReadonlySet<ConflictResolutionPriority>): ConflictResolutionPriority | null {
  for (const priority of CONFLICT_RESOLUTION_PRIORITIES) if (active.has(priority)) return priority;
  return null;
}

/** In-fiction AF-XXX governance ordering ONLY — see the module doc
 * comment's CRITICAL SCOPE NOTE. Never ranks above, modifies, or
 * claims authority over the real `docs/CONSTITUTION.md`. */
export const SYSTEM_PRIORITY_LADDER = ["Atlas Prime Directive", "Design Constitution", "Atlas Core", "Operating System", "Simulation Director", "Gameplay Systems"] as const;
export type SystemPriorityLevel = (typeof SYSTEM_PRIORITY_LADDER)[number];

export function systemPriorityRank(level: SystemPriorityLevel): number {
  return SYSTEM_PRIORITY_LADDER.indexOf(level);
}

export const FUTURE_COMPATIBILITY_TARGETS = ["Canon", "Performance", "Accessibility", "Narrative", "Simulation", "Civilisation", "Identity", "Meaning", "Purpose", "Soul"] as const;
export type FutureCompatibilityTarget = (typeof FUTURE_COMPATIBILITY_TARGETS)[number];

export function futureCompatibilityValidated(validated: ReadonlySet<FutureCompatibilityTarget>): boolean {
  return FUTURE_COMPATIBILITY_TARGETS.every((target) => validated.has(target));
}

export const QUALITY_LOCK_CRITERIA = ["Improves gameplay", "Improves immersion", "Improves maintainability", "Improves accessibility", "Improves long-term replayability", "Improves emotional depth", "Improves player respect"] as const;
export type QualityLockCriterion = (typeof QUALITY_LOCK_CRITERIA)[number];

export function qualityLockPassed(satisfied: ReadonlySet<QualityLockCriterion>): boolean {
  return QUALITY_LOCK_CRITERIA.every((criterion) => satisfied.has(criterion));
}

export const FINAL_TEST_QUESTIONS = ["Does it create hope?", "Does it reward curiosity?", "Does it strengthen civilisation?", "Does it deepen humanity?", "Does it improve tomorrow?"] as const;
export type FinalTestQuestion = (typeof FINAL_TEST_QUESTIONS)[number];

export function finalTestPassed(answers: ReadonlySet<FinalTestQuestion>): boolean {
  return FINAL_TEST_QUESTIONS.every((question) => answers.has(question));
}

export const REDUNDANCY_DETECTOR_TARGETS = ["Duplicate systems", "Feature overlap", "UI clutter", "Narrative repetition", "Mechanical redundancy", "Unnecessary complexity"] as const;

export const PLAYER_PROMISE = ["Their time is respected", "Their history matters", "Their creativity matters", "Their discoveries matter", "Their civilisation matters"] as const;

export const DEVELOPER_PROMISE = ["Build with purpose", "Build with care", "Build for decades", "Build for future generations", "Leave the universe stronger than you found it"] as const;

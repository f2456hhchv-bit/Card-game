/**
 * The Atlas Core (AF-145). Sent as a follow-up after AF-146 (which had
 * already been implemented in this session's numbering gap) — this
 * module retroactively fills that gap, and turns out to describe
 * itself in nearly the same terms as BOTH the project's real supreme
 * governing document AND AF-146's own new charter:
 * - `docs/CONSTITUTION.md` ("None may contradict it," the same
 *   "rebuilding civilisation... hope" mission).
 * - AF-146's real `TEN_PILLARS`/`CONTENT_TEST_QUESTIONS`/
 *   `EXPANSION_TEST_REQUIREMENTS`/`PillarReinforcementLedger`
 *   (`src/game/designConstitution/`), built one module number "after"
 *   this one but implemented first due to the numbering gap.
 *
 * Per the same standing rule already applied to AF-146 — nothing may
 * contradict the real Constitution absent explicit Project Owner
 * authorisation, and locked modules (AF-146 included) are only
 * extended, never redesigned — this module is its own third, separate,
 * new in-universe charter. It does not modify `docs/CONSTITUTION.md`
 * or AF-146's real data/classes.
 *
 * Direct mechanical overlaps, documented rather than merged:
 * - "Design Validation" (8 questions, ALL must be "Yes" — "if not...
 *   redesign it") is the same checklist-gate mechanic as the real
 *   Constitution's "THE AFTERLIGHT TEST"/"DESIGN DECISION MATRIX" (both
 *   all-must-pass) and AF-146's `EXPANSION_TEST_REQUIREMENTS` (also
 *   all-must-pass) — kept as its own separate question list.
 * - "The Twelve Atlas Principles" ("X over Y" framing) overlaps in
 *   *spirit* with AF-146's `TEN_PILLARS` (Hope/Discovery/Civilisation/
 *   History/... single-word virtues) but uses a structurally different
 *   paired-contrast shape and a different count (12 vs 10) — kept as
 *   its own type, `AtlasPrincipleDef`, never merged into `Pillar`.
 * - "System Hierarchy" (10 items) is the THIRD parallel "which real
 *   systems does this govern" list in the codebase, after AF-142's
 *   `SYSTEM_COMPATIBILITY_TARGETS` (12: AF-130→AF-141) and AF-144's
 *   `AOS_RESPONSIBILITIES` (17, AF-090-era systems through Future
 *   Modules) — none identical, all real, kept separate rather than
 *   force-unified.
 * - "Quality Bar" (8 adjectives, no numeric score) overlaps in spirit
 *   with AF-143's real `DESIGN_SCORE_CATEGORIES` (9, numeric, gated at
 *   9.5) and the real Constitution's own "QUALITY STANDARD"/
 *   `docs/FOUNDATION_LOCK.md`'s real ten-category 9.5/10 gate — kept as
 *   its own plain adjective list with no numeric gate of its own,
 *   since the spec never assigns it one.
 *
 * "Atlas" naming note: this module and AF-143 ("Atlas Development
 * Framework") share the "Atlas" name, as does the real founder
 * commander "Atlas Prime" (`prime-founder`) and AF-139/140's "Atlas
 * Gateway Network" megaproject example. None are identity collisions —
 * "Atlas" is a recurring franchise motif across a person, two
 * frameworks, and a megaproject, not a single canonical individual
 * whose name is being reused, so (unlike AF-126's Orion rename) no
 * Project Owner decision is required.
 */
export interface AtlasPrincipleDef {
  id: string;
  order: number;
  virtue: string;
  vice: string;
  articulation: string;
}

export const ATLAS_PRINCIPLES: readonly AtlasPrincipleDef[] = [
  { id: "curiosity-over-fear", order: 1, virtue: "Curiosity", vice: "Fear", articulation: "Unknown space should invite exploration, not discourage it." },
  { id: "construction-over-destruction", order: 2, virtue: "Construction", vice: "Destruction", articulation: "Building should always create more long-term value." },
  { id: "hope-over-despair", order: 3, virtue: "Hope", vice: "Despair", articulation: "Even tragedy should inspire rebuilding." },
  { id: "knowledge-over-ignorance", order: 4, virtue: "Knowledge", vice: "Ignorance", articulation: "Every expedition teaches something." },
  { id: "unity-over-isolation", order: 5, virtue: "Unity", vice: "Isolation", articulation: "Civilisation advances through cooperation." },
  { id: "stewardship-over-exploitation", order: 6, virtue: "Stewardship", vice: "Exploitation", articulation: "Protect worlds. Do not consume them." },
  { id: "history-over-forgetting", order: 7, virtue: "History", vice: "Forgetting", articulation: "Everything meaningful deserves remembrance." },
  { id: "progress-over-perfection", order: 8, virtue: "Progress", vice: "Perfection", articulation: "Humanity continually improves." },
  { id: "people-over-power", order: 9, virtue: "People", vice: "Power", articulation: "Commanders matter because of their humanity." },
  { id: "discovery-over-grinding", order: 10, virtue: "Discovery", vice: "Grinding", articulation: "Players seek wonder, not repetitive rewards." },
  { id: "legacy-over-possession", order: 11, virtue: "Legacy", vice: "Possession", articulation: "What players leave behind matters more than what they collect." },
  { id: "tomorrow-over-today", order: 12, virtue: "Tomorrow", vice: "Today", articulation: "Every action should improve the future." },
];
export type AtlasPrincipleId = (typeof ATLAS_PRINCIPLES)[number]["id"];

/** "If not... redesign it" — unlike AF-146's 8-of-10 partial-pass
 * Content Test, every question here is required. */
export const DESIGN_VALIDATION_QUESTIONS = [
  "Does it encourage exploration?",
  "Does it strengthen civilisation?",
  "Does it teach something?",
  "Does it create meaningful stories?",
  "Does it increase hope?",
  "Does it reward curiosity?",
  "Does it create memorable moments?",
  "Does it respect player time?",
] as const;
export type DesignValidationQuestion = (typeof DESIGN_VALIDATION_QUESTIONS)[number];

export function designValidationPassed(answers: ReadonlySet<DesignValidationQuestion>): boolean {
  return DESIGN_VALIDATION_QUESTIONS.every((question) => answers.has(question));
}

export const EMOTIONAL_COMPASS_TARGET = ["Wonder", "Discovery", "Belonging", "Achievement", "Responsibility", "Friendship", "Curiosity", "Optimism", "Reflection"] as const;
export type EmotionalCompassTarget = (typeof EMOTIONAL_COMPASS_TARGET)[number];

export const EMOTIONAL_COMPASS_AVOID = ["Hopelessness", "Shock", "Cruelty", "Misery"] as const;
export type EmotionalCompassAvoid = (typeof EMOTIONAL_COMPASS_AVOID)[number];

export const PLAYER_EXPERIENCE_PILLARS = ["I've never seen this before.", "I helped build this.", "They remembered me.", "We discovered something incredible.", "I can't wait to see what's next."] as const;

/** The THIRD parallel "which systems does this govern" list in the
 * codebase (see module doc comment) — kept separate from AF-142's real
 * `SYSTEM_COMPATIBILITY_TARGETS` and AF-144's real `AOS_RESPONSIBILITIES`. */
export const ATLAS_SYSTEM_HIERARCHY = ["Operating System", "Story Engine", "Living Galaxy", "Commanders", "Museum", "Chronicle", "Civilisation", "Evolution", "Creator Engine", "Future expansions"] as const;

export const QUALITY_BAR = ["Readable", "Elegant", "Expandable", "Accessible", "Replayable", "Meaningful", "Technically sustainable", "Emotionally resonant"] as const;
export type QualityBarCriterion = (typeof QUALITY_BAR)[number];

export const ACCESSIBILITY_PHILOSOPHY_STATEMENT = "Accessibility is foundational. Never optional. Every feature should be enjoyable by the widest possible audience without compromising design integrity.";

export const LONG_TERM_PHILOSOPHY_STATEMENTS = ["The universe should improve every year.", "Developers should improve every year.", "Players should discover something new every year.", "The game ages alongside its community."] as const;

export const FINAL_QUESTION = "Does this make humanity's future brighter?";

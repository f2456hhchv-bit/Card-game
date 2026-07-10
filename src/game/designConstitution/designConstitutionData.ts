/**
 * The Afterlight Design Constitution (AF-146). This module's own text
 * describes itself in almost the same terms the project's REAL supreme
 * governing document already uses — `docs/CONSTITUTION.md` ("AFTERLIGHT
 * MASTER CONSTITUTION v1.0") is already "the highest governing
 * specification for the Afterlight project," already states "None may
 * contradict it," and already frames the project's identity as
 * "rebuilding civilisation... transforms a dying galaxy into one filled
 * with hope again" — the same mission AF-146 restates.
 *
 * This module does NOT modify, supersede, or duplicate that real
 * document (nothing may contradict it "unless the Project Owner
 * explicitly authorises it," and no such authorisation was given here).
 * It is implemented as its own new, clearly-separate in-universe design
 * charter — the same honest-precedent treatment AF-143 gave discovering
 * its own "Design Score >9.5/10" was really this project's real
 * standing self-review process.
 *
 * Direct mechanical overlap, documented rather than merged: the real
 * Constitution already has two checklist-based feature gates — "THE
 * AFTERLIGHT TEST" (8 yes/no questions, ALL must be "Yes") and the
 * "DESIGN DECISION MATRIX" (10 yes/no questions, ALL must be "Yes").
 * AF-146's own "Content Test" (10 questions, only 8-of-10 required) and
 * "Expansion Test" (6 requirements) are the same MECHANIC — a
 * checklist-based feature/expansion gate — with different exact
 * wording and a partial-pass threshold rather than all-must-pass. Kept
 * as its own separate, new rubric (`CONTENT_TEST_QUESTIONS`,
 * `EXPANSION_TEST_REQUIREMENTS`) rather than force-merged into the
 * real Constitution's two real gates.
 *
 * A module-numbering note: this spec (sent as "146") declares "AF-000
 * → AF-145 are LOCKED," but no AF-145 catalogue, doc, or STATUS.md row
 * exists anywhere in this repository — AF-144 is the last real, locked
 * module. Implemented as AF-146 exactly as specified; the gap is
 * documented in `docs/modules/STATUS.md` for the Project Owner rather
 * than silently renumbered or silently ignored.
 *
 * Naming-adjacency note: AF-136's real `STORY_PILLARS` (Hope/Curiosity/
 * Sacrifice/Leadership/Discovery/...) shares "Hope" and "Discovery"
 * verbatim with this module's `TEN_PILLARS`, but the two are different
 * axes — AF-136's are per-playthrough narrative themes tracked by
 * `StoryPillarTracker`; this module's are meta-design-philosophy
 * pillars governing the whole project. Kept as its own separate type,
 * never merged with or read by `StoryPillarTracker`, per the AF-137/
 * 138/139/140 precedent for documented, low-stakes vocabulary overlap.
 */
export const TEN_PILLARS = ["Hope", "Discovery", "Humanity", "Civilisation", "History", "Mastery", "Beauty", "Accessibility", "Longevity", "Wonder"] as const;
export type Pillar = (typeof TEN_PILLARS)[number];

/** One-line articulation per pillar, from the spec's own text. */
export const PILLAR_DESCRIPTIONS: Readonly<Record<Pillar, string>> = {
  Hope: "Players leave every session believing tomorrow can be better.",
  Discovery: "Every expedition teaches something. Curiosity is always rewarded.",
  Humanity: "People always matter more than technology. Characters drive the universe.",
  Civilisation: "Building should feel more rewarding than destroying.",
  History: "Nothing meaningful is forgotten. The galaxy remembers.",
  Mastery: "Players improve through knowledge, not repetitive grinding.",
  Beauty: "The universe should inspire awe — architecture, nature, music, art, lighting.",
  Accessibility: "Everyone deserves the opportunity to experience hope.",
  Longevity: "The universe is built for decades — never trends, never short-term gimmicks.",
  Wonder: "Every major update should contain at least one moment where players simply stop and admire what they have discovered.",
};

export const PROHIBITED_DESIGN_PATTERNS = ["Artificial frustration", "Excessive grinding", "Fear of missing out", "Meaningless collectibles", "Power creep", "Disposable content", "Predatory monetisation", "Repetitive busywork", "Hopeless storytelling", "Player disrespect"] as const;
export type ProhibitedDesignPattern = (typeof PROHIBITED_DESIGN_PATTERNS)[number];

export const REQUIRED_DESIGN_PATTERNS = ["Meaningful progression", "Player creativity", "Emergent stories", "Persistent history", "Long-term consequences", "Replayability", "Community", "Education", "Discovery", "Optimism"] as const;
export type RequiredDesignPattern = (typeof REQUIRED_DESIGN_PATTERNS)[number];

/** The spec's own 10 questions — kept separate from the real
 * Constitution's "DESIGN DECISION MATRIX"/"THE AFTERLIGHT TEST" (see
 * module doc comment). */
export const CONTENT_TEST_QUESTIONS = [
  "Does it create wonder?",
  "Does it reward curiosity?",
  "Does it deepen civilisation?",
  "Does it create memories?",
  "Does it strengthen relationships?",
  "Does it teach something?",
  "Does it improve accessibility?",
  "Does it expand the Living Galaxy?",
  "Does it respect player time?",
  "Will players remember it years later?",
] as const;
export type ContentTestQuestion = (typeof CONTENT_TEST_QUESTIONS)[number];

export const CONTENT_TEST_PASS_THRESHOLD = 8;

export interface ContentTestResult {
  yesCount: number;
  totalQuestions: number;
  passed: boolean;
}

/** "Every feature must answer YES to at least eight of these." */
export function contentTestScore(answers: Readonly<Partial<Record<ContentTestQuestion, boolean>>>): ContentTestResult {
  let yesCount = 0;
  for (const question of CONTENT_TEST_QUESTIONS) if (answers[question]) yesCount += 1;
  return { yesCount, totalQuestions: CONTENT_TEST_QUESTIONS.length, passed: yesCount >= CONTENT_TEST_PASS_THRESHOLD };
}

export const EXPANSION_TEST_REQUIREMENTS = ["Introduce discovery", "Expand history", "Advance civilisation", "Respect previous canon", "Integrate with every major system", "Leave the universe better than before"] as const;
export type ExpansionTestRequirement = (typeof EXPANSION_TEST_REQUIREMENTS)[number];

/** "Every future expansion MUST" — unlike the Content Test, every
 * requirement is mandatory (no partial-pass threshold). */
export function expansionTestPassed(satisfied: ReadonlySet<ExpansionTestRequirement>): boolean {
  return EXPANSION_TEST_REQUIREMENTS.every((requirement) => satisfied.has(requirement));
}

export const TECHNICAL_PRINCIPLES = ["Modular", "Maintainable", "Scalable", "Observable", "Documented", "Accessible", "Performant", "Stable"] as const;

export const ARTISTIC_PRINCIPLES = ["Hope", "Clean technology", "Living worlds", "Natural beauty", "Scientific optimism", "Architectural elegance", "Future possibility"] as const;

export const AUDIO_PRINCIPLES = ["Exploration", "Belonging", "Discovery", "Achievement", "Reflection"] as const;

export const NARRATIVE_PRINCIPLES = ["Recovery", "Forgiveness", "Curiosity", "Friendship", "Scientific progress", "Intergenerational legacy", "Shared achievement"] as const;

export const PLAYER_PROMISE = ["Respected", "Valued", "Curious", "Inspired", "Rewarded", "Connected"] as const;

export const DEVELOPER_PROMISE = ["Quality", "Consistency", "Accessibility", "Optimism", "Technical excellence", "Respect for players", "Long-term thinking"] as const;

export const FINAL_PROMISE_QUESTION = "What future can we build together?";
export const FINAL_PROMISE_REJECTED_QUESTION = "What can we make players do?";

import type { CoherenceStandardQuestion } from "./atlasCoherenceData";
import { COHERENCE_STANDARD_QUESTIONS } from "./atlasCoherenceData";

/** "Every addition asks... if uncertainty exists, refine further."
 * Every question must be resolved with confidence before an addition
 * is considered coherent — another instance of this codebase's
 * established all-must-pass checklist-function family. */
export function coherenceStandardMet(resolvedWithConfidence: ReadonlySet<CoherenceStandardQuestion>): boolean {
  return COHERENCE_STANDARD_QUESTIONS.every((question) => resolvedWithConfidence.has(question));
}

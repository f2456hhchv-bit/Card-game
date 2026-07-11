import type { TruthStandardQuestion } from "./atlasVerificationData";
import { TRUTH_STANDARD_QUESTIONS } from "./atlasVerificationData";

/** "Every new addition asks... if yes, canon strengthens." Mirrors
 * AF-195's real `coherenceStandardMet` shape — every question must be
 * affirmed before canon is considered strengthened. */
export function truthStandardMet(affirmed: ReadonlySet<TruthStandardQuestion>): boolean {
  return TRUTH_STANDARD_QUESTIONS.every((question) => affirmed.has(question));
}

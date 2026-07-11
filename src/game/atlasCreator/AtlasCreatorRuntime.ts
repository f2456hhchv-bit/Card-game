import type { PurposefulBeautyCriterion } from "./atlasCreatorData";
import { PURPOSEFUL_BEAUTY_CRITERIA } from "./atlasCreatorData";

/** "A beautiful object also teaches, serves, inspires, endures."
 * Another instance of this codebase's established all-must-pass
 * checklist-function family, distinct from AF-168's real
 * `BeautyIndexTracker` (a continuous settlement-scale level, never a
 * per-object completeness question). */
export function purposefulBeautyMet(satisfied: ReadonlySet<PurposefulBeautyCriterion>): boolean {
  return PURPOSEFUL_BEAUTY_CRITERIA.every((criterion) => satisfied.has(criterion));
}

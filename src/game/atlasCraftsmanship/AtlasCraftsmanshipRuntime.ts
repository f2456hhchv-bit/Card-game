import type { StandardOfExcellenceQuestion } from "./atlasCraftsmanshipData";

export interface StandardOfExcellenceAssessment {
  shouldContinueRefining: boolean;
  affirmedCount: number;
}

/** "Every important creation asks... if yes, continue refining." A
 * single affirmed question is sufficient — an ANY-of-N shape, but
 * gating ONGOING INVESTMENT rather than rejection or completion, unlike
 * every existing ANY-of-N instance in this codebase (see
 * atlasCraftsmanshipData.ts module doc comment). */
export function standardOfExcellenceAssessment(affirmed: ReadonlySet<StandardOfExcellenceQuestion>): StandardOfExcellenceAssessment {
  return { shouldContinueRefining: affirmed.size > 0, affirmedCount: affirmed.size };
}

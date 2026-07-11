import type { ConstitutionalArticleName } from "./atlasConstitutionData";
import { CONSTITUTIONAL_ARTICLES } from "./atlasConstitutionData";

/** "Every future feature validates against every Article... no
 * Article may be ignored." Another instance of this codebase's
 * established all-must-pass checklist-gate mechanic, gating over all
 * fifteen Articles — the broadest such gate in this codebase. */
export function constitutionalReviewPassed(validated: ReadonlySet<ConstitutionalArticleName>): boolean {
  return CONSTITUTIONAL_ARTICLES.every((article) => validated.has(article.name));
}

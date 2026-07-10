/**
 * DesignConstitutionRuntime pieces (AF-146). Composes `contentTestScore`/
 * `expansionTestPassed` (pure functions in `designConstitutionData.ts`)
 * into real, inspectable records — never a second copy of the real
 * Constitution's own gates.
 */
import { contentTestScore, expansionTestPassed, type ContentTestQuestion, type ContentTestResult, type ExpansionTestRequirement, type Pillar } from "./designConstitutionData";

export interface ComplianceRecord {
  featureId: string;
  contentTest: ContentTestResult;
  expansionTestPassed: boolean;
  sequence: number;
}

/**
 * "Every feature created after AF-146 must comply with it." Append-only
 * — a feature's compliance history is never overwritten, only added to,
 * so a later re-evaluation is always visible alongside the original.
 */
export class FeatureComplianceRegistry {
  private readonly records: ComplianceRecord[] = [];

  evaluate(featureId: string, contentTestAnswers: Readonly<Partial<Record<ContentTestQuestion, boolean>>>, expansionRequirementsSatisfied: ReadonlySet<ExpansionTestRequirement>): ComplianceRecord {
    const record: ComplianceRecord = {
      featureId,
      contentTest: contentTestScore(contentTestAnswers),
      expansionTestPassed: expansionTestPassed(expansionRequirementsSatisfied),
      sequence: this.records.length,
    };
    this.records.push(record);
    return record;
  }

  all(): readonly ComplianceRecord[] {
    return this.records;
  }

  historyFor(featureId: string): readonly ComplianceRecord[] {
    return this.records.filter((r) => r.featureId === featureId);
  }

  passedCount(): number {
    return this.records.filter((r) => r.contentTest.passed).length;
  }
}

export interface PillarReinforcement {
  pillar: Pillar;
  featureId: string;
  sequence: number;
}

/**
 * "Every major update should contain at least one moment where players
 * simply stop and admire what they have discovered" — and every pillar
 * needs a real, inspectable record of what actually reinforced it,
 * rather than a design promise with no evidence behind it. Kept
 * deliberately separate from AF-136's real `StoryPillarTracker` (see
 * module doc comment's naming-adjacency note).
 */
export class PillarReinforcementLedger {
  private readonly records: PillarReinforcement[] = [];

  reinforce(pillar: Pillar, featureId: string): PillarReinforcement {
    const record: PillarReinforcement = { pillar, featureId, sequence: this.records.length };
    this.records.push(record);
    return record;
  }

  countFor(pillar: Pillar): number {
    return this.records.filter((r) => r.pillar === pillar).length;
  }

  dominantPillar(): Pillar | null {
    let best: Pillar | null = null;
    let bestCount = 0;
    const counts = new Map<Pillar, number>();
    for (const record of this.records) counts.set(record.pillar, (counts.get(record.pillar) ?? 0) + 1);
    for (const [pillar, count] of counts) {
      if (count > bestCount) {
        best = pillar;
        bestCount = count;
      }
    }
    return best;
  }

  all(): readonly PillarReinforcement[] {
    return this.records;
  }
}

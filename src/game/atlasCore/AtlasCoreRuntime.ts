/**
 * AtlasCoreRuntime pieces (AF-145). Mirrors the shape AF-146's
 * `FeatureComplianceRegistry`/`PillarReinforcementLedger` established
 * one module number "later" but implemented first in this session —
 * both are real, separate classes; neither imports or extends the
 * other, since AF-146 typed its ledger to its own closed `Pillar`
 * union rather than a reusable generic.
 */
import { designValidationPassed, type AtlasPrincipleId, type DesignValidationQuestion } from "./atlasCoreData";

export interface AtlasComplianceRecord {
  featureId: string;
  validationPassed: boolean;
  principlesReinforcedCount: number;
  sequence: number;
}

/** "If a feature weakens the Atlas Core... it is rejected." Append-only
 * — a feature's evaluation history is never overwritten. */
export class AtlasCoreComplianceRegistry {
  private readonly records: AtlasComplianceRecord[] = [];

  evaluate(featureId: string, validationAnswers: ReadonlySet<DesignValidationQuestion>, principlesReinforced: ReadonlySet<AtlasPrincipleId>): AtlasComplianceRecord {
    const record: AtlasComplianceRecord = {
      featureId,
      validationPassed: designValidationPassed(validationAnswers),
      principlesReinforcedCount: principlesReinforced.size,
      sequence: this.records.length,
    };
    this.records.push(record);
    return record;
  }

  all(): readonly AtlasComplianceRecord[] {
    return this.records;
  }

  passedCount(): number {
    return this.records.filter((r) => r.validationPassed).length;
  }
}

export interface PrincipleReinforcement {
  principleId: AtlasPrincipleId;
  featureId: string;
  sequence: number;
}

/** A real, inspectable record of which Atlas Principle each feature
 * actually reinforced, rather than a design promise with no evidence
 * behind it. */
export class AtlasPrincipleReinforcementLedger {
  private readonly records: PrincipleReinforcement[] = [];

  reinforce(principleId: AtlasPrincipleId, featureId: string): PrincipleReinforcement {
    const record: PrincipleReinforcement = { principleId, featureId, sequence: this.records.length };
    this.records.push(record);
    return record;
  }

  countFor(principleId: AtlasPrincipleId): number {
    return this.records.filter((r) => r.principleId === principleId).length;
  }

  dominantPrinciple(): AtlasPrincipleId | null {
    const counts = new Map<AtlasPrincipleId, number>();
    for (const record of this.records) counts.set(record.principleId, (counts.get(record.principleId) ?? 0) + 1);
    let best: AtlasPrincipleId | null = null;
    let bestCount = 0;
    for (const [principleId, count] of counts) {
      if (count > bestCount) {
        best = principleId;
        bestCount = count;
      }
    }
    return best;
  }

  all(): readonly PrincipleReinforcement[] {
    return this.records;
  }
}

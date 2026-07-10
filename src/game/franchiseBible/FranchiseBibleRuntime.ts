/**
 * FranchiseBibleRuntime pieces (AF-147). `CanonAuthorityResolver` mirrors
 * AF-144's real `DecisionRouter` tier-comparison shape, but arbitrates
 * conflicting LORE statements by canon tier rather than gameplay change
 * requests by priority tier — a distinct domain, not a duplicate.
 */
import { canonTierRank, franchiseTestPassed, themeCoverageMet, type CanonTier, type CoreTheme, type FranchiseTestQuestion } from "./franchiseBibleData";

export interface CanonStatement {
  sourceId: string;
  tier: CanonTier;
  subject: string;
  claim: string;
}

/** "Conflicts always resolve in favour of the highest canon tier." Real
 * arbitration over real statements — never a silent pick. */
export class CanonAuthorityResolver {
  resolve(statements: readonly CanonStatement[]): CanonStatement | null {
    if (statements.length === 0) return null;
    return statements.reduce((authoritative, candidate) => (canonTierRank(candidate.tier) < canonTierRank(authoritative.tier) ? candidate : authoritative));
  }
}

export interface CanonRecord extends CanonStatement {
  sequence: number;
}

/** "The Bible defines... all future content references this
 * chronology." Append-only record of every canon statement ever made
 * about a subject, so a later `CanonAuthorityResolver.resolve` call can
 * always see the full history, not just the winner. */
export class CanonRecordLedger {
  private readonly records: CanonRecord[] = [];

  record(statement: CanonStatement): CanonRecord {
    const entry: CanonRecord = { ...statement, sequence: this.records.length };
    this.records.push(entry);
    return entry;
  }

  statementsFor(subject: string): readonly CanonRecord[] {
    return this.records.filter((r) => r.subject === subject);
  }

  all(): readonly CanonRecord[] {
    return this.records;
  }
}

export interface FranchiseComplianceRecord {
  projectId: string;
  franchiseTestPassed: boolean;
  themeCoverageMet: boolean;
  sequence: number;
}

/** "Every new project answers [the Franchise Test]... if not, it is
 * redesigned." Append-only per-project evaluation history. */
export class FranchiseComplianceRegistry {
  private readonly records: FranchiseComplianceRecord[] = [];

  evaluate(projectId: string, franchiseTestAnswers: ReadonlySet<FranchiseTestQuestion>, themesReinforced: ReadonlySet<CoreTheme>): FranchiseComplianceRecord {
    const record: FranchiseComplianceRecord = {
      projectId,
      franchiseTestPassed: franchiseTestPassed(franchiseTestAnswers),
      themeCoverageMet: themeCoverageMet(themesReinforced),
      sequence: this.records.length,
    };
    this.records.push(record);
    return record;
  }

  all(): readonly FranchiseComplianceRecord[] {
    return this.records;
  }

  passedCount(): number {
    return this.records.filter((r) => r.franchiseTestPassed && r.themeCoverageMet).length;
  }
}

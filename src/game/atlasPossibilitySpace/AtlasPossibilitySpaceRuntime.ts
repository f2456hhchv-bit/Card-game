import type { InnovationFilterCriterion, SandboxDomain } from "./atlasPossibilitySpaceData";
import { INNOVATION_FILTER_CRITERIA, INNOVATION_FILTER_GATE_THRESHOLD } from "./atlasPossibilitySpaceData";

interface SandboxScenarioRecord {
  domain: SandboxDomain;
  description: string;
  proposedEpoch: number;
  committedEpoch: number | null;
}

/** "No real-world consequences occur until decisions are made." The
 * commitment-gate counterpart to AF-172's real evidence-gate
 * `HypothesisTracker` — a scenario starts proposed-only and never
 * affects reality until explicitly committed (see
 * atlasPossibilitySpaceData.ts module doc comment). */
export class SandboxScenarioRegistry {
  private readonly records = new Map<string, SandboxScenarioRecord>();

  propose(id: string, domain: SandboxDomain, description: string, epoch: number): void {
    this.records.set(id, { domain, description, proposedEpoch: epoch, committedEpoch: null });
  }

  commit(id: string, epoch: number): void {
    const record = this.records.get(id);
    if (record) record.committedEpoch = epoch;
  }

  isCommitted(id: string): boolean {
    const record = this.records.get(id);
    return record !== undefined && record.committedEpoch !== null;
  }

  all(): ReadonlyMap<string, SandboxScenarioRecord> {
    return this.records;
  }
}

/** The FOURTH mirrored scoring-rubric shape in this codebase, after
 * AF-143's real `DesignScoreCard`, AF-149's real `AtlasScoreCard`, and
 * AF-170's real `PrimeDirectiveScoreCard` — same shape, same 9.5 gate,
 * typed to its own `InnovationFilterCriterion` union (see
 * atlasPossibilitySpaceData.ts module doc comment). */
export class InnovationFilterScoreCard {
  private readonly scores = new Map<InnovationFilterCriterion, number>();

  score(criterion: InnovationFilterCriterion, value: number): void {
    this.scores.set(criterion, Math.max(0, Math.min(10, value)));
  }

  scoreFor(criterion: InnovationFilterCriterion): number | null {
    return this.scores.get(criterion) ?? null;
  }

  isComplete(): boolean {
    return INNOVATION_FILTER_CRITERIA.every((criterion) => this.scores.has(criterion));
  }

  overallScore(): number {
    if (this.scores.size === 0) return 0;
    let total = 0;
    for (const criterion of INNOVATION_FILTER_CRITERIA) total += this.scores.get(criterion) ?? 0;
    return total / INNOVATION_FILTER_CRITERIA.length;
  }

  passesGate(): boolean {
    return this.isComplete() && this.overallScore() >= INNOVATION_FILTER_GATE_THRESHOLD;
  }
}

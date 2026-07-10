import type { GenerationalHandoffCategory } from "./atlasInfinityData";

interface HandoffRecord {
  generation: number;
  contributions: readonly GenerationalHandoffCategory[];
  epoch: number;
}

/** "The next generation begins further ahead. Never from zero."
 * Confirmed genuinely new (see atlasInfinityData.ts module doc
 * comment): `startingBaselineFor` sums every EARLIER generation's
 * contribution count, guaranteeing a generation's inherited baseline
 * is monotonically non-decreasing and never resets to zero once at
 * least one earlier generation has contributed. */
export class GenerationalHandoffLedger {
  private readonly records: HandoffRecord[] = [];

  handoff(generation: number, contributions: readonly GenerationalHandoffCategory[], epoch: number): void {
    this.records.push({ generation, contributions, epoch });
  }

  startingBaselineFor(generation: number): number {
    return this.records.filter((r) => r.generation < generation).reduce((total, r) => total + r.contributions.length, 0);
  }

  cumulativeContributionCount(): number {
    return this.records.reduce((total, r) => total + r.contributions.length, 0);
  }

  contributionsFor(generation: number): readonly GenerationalHandoffCategory[] {
    return this.records.find((r) => r.generation === generation)?.contributions ?? [];
  }
}
